import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Star,
  Navigation, Timer, Activity, Footprints, Flame,
  Play, Square, AlertCircle, AlertTriangle,
} from 'lucide-react'
import BottomNav from '../BottomNav'
import { useUserDataContext } from '../../context/UserDataContext'
import { saveRun } from '../../lib/userData'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'
const RED   = '#EF4444'

const CARD = {
  background: '#0f0f0f',
  border: '1px solid #1e1e1e',
  borderRadius: 14,
  padding: 20,
}

/* ── Helpers ── */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R    = 6371000
  const toRad = deg => deg * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
               Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function fmtTime(s) {
  const m   = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function formatDistance(meters) {
  return (meters / 1000).toFixed(2)
}

function formatPace(secondsPerKm) {
  if (!secondsPerKm || secondsPerKm <= 0) return '--:--'
  const min = Math.floor(secondsPerKm / 60)
  const sec = Math.round(secondsPerKm % 60)
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/* ── Stat cell ── */
function StatCell({ Icon, iconColor, iconBg, value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: iconBg, border: `1px solid ${iconColor}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 6px',
      }}>
        <Icon size={16} color={iconColor} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

/* ── Summary metric cell ── */
function SummaryCell({ label, value, color, spanFull }) {
  return (
    <div style={{
      background: '#111111', border: '1px solid #222222',
      borderRadius: 10, padding: '12px 14px',
      ...(spanFull ? { gridColumn: 'span 2' } : {}),
    }}>
      <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
    </div>
  )
}

export default function Corrida() {
  const navigate = useNavigate()
  const { runs, optimisticAddRun, revertOptimisticAddRun, debouncedReload } = useUserDataContext()

  const [running,       setRunning]       = useState(false)
  const [seconds,       setSeconds]       = useState(0)
  const [isFav,         setIsFav]         = useState(false)
  const [gpsStatus,     setGpsStatus]     = useState('idle')  // 'idle'|'requesting'|'active'|'denied'|'error'
  const [totalDistance, setTotalDistance] = useState(0)       // metros (float)
  const [summaryMode,   setSummaryMode]   = useState(null)    // null|'valid'|'too_short'
  const [runSummary,    setRunSummary]    = useState(null)
  const [saving,        setSaving]        = useState(false)

  const intervalRef  = useRef(null)
  const watchId      = useRef(null)
  const lastPosition = useRef(null)
  const wakeLock     = useRef(null)
  const startedAtRef = useRef(null)

  /* ── Timer engine ── */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  /* ── Cleanup no unmount ── */
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      }
      if (wakeLock.current) {
        wakeLock.current.release()
        wakeLock.current = null
      }
    }
  }, [])

  /* ── Wake Lock ── */
  async function acquireWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen')
      } catch (err) {
        console.error('Wake lock falhou:', err)
      }
    }
  }

  function releaseWakeLock() {
    if (wakeLock.current) {
      wakeLock.current.release()
      wakeLock.current = null
    }
  }

  /* ── GPS Tracking ── */
  function startTracking() {
    setGpsStatus('active')
    setRunning(true)
    startedAtRef.current = new Date()

    acquireWakeLock()

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (lastPosition.current) {
          const meters = haversineDistance(
            lastPosition.current.lat, lastPosition.current.lng,
            latitude, longitude
          )
          if (meters >= 2) {
            setTotalDistance(prev => prev + meters)
          }
        }
        lastPosition.current = { lat: latitude, lng: longitude }
      },
      (err) => {
        console.error('GPS error durante corrida:', err)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )

    watchId.current = id
  }

  async function handlePlayClick() {
    setGpsStatus('requesting')

    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
        })
      })
    } catch (err) {
      // Alguns browsers entregam PERMISSION_DENIED como constante do objeto (err.PERMISSION_DENIED === 1)
      // em vez de número literal — checamos os dois para garantir compatibilidade
      const isDenied = err.code === 1 || err.code === err.PERMISSION_DENIED
      if (isDenied) {
        setGpsStatus('denied')
        return
      }
      setGpsStatus('error')
      return
    }

    startTracking()
  }

  function stopTracking() {
    const finalSeconds  = seconds
    const finalDistance = totalDistance

    setRunning(false)
    setGpsStatus('idle')

    if (watchId.current != null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    clearInterval(intervalRef.current)
    releaseWakeLock()
    lastPosition.current = null

    const distanceMeters   = Math.round(finalDistance)
    const distanceKm       = distanceMeters / 1000
    const paceSecondsPerKm = distanceKm > 0 ? Math.round(finalSeconds / distanceKm) : 0
    const averageSpeedKmh  = finalSeconds > 0
      ? parseFloat((distanceKm / (finalSeconds / 3600)).toFixed(2))
      : 0
    const steps    = Math.round(distanceKm * 1300)
    const calories = Math.round(distanceKm * 70 * 1.036)

    setRunSummary({
      distanceMeters,
      durationSeconds:  finalSeconds,
      paceSecondsPerKm: paceSecondsPerKm || null,
      averageSpeedKmh:  averageSpeedKmh  || null,
      steps,
      calories,
      startedAt: startedAtRef.current?.toISOString() ?? new Date().toISOString(),
      endedAt:   new Date().toISOString(),
    })

    if (finalSeconds < 60 || distanceMeters < 100) {
      setSummaryMode('too_short')
    } else {
      setSummaryMode('valid')
    }
  }

  function resetToIdle() {
    setSummaryMode(null)
    setRunSummary(null)
    setRunning(false)
    setSeconds(0)
    setTotalDistance(0)
    setGpsStatus('idle')
    lastPosition.current = null
    startedAtRef.current = null
  }

  async function handleSaveRun() {
    if (!runSummary || saving) return
    setSaving(true)

    const previousRuns = [...runs]
    const tempRun      = { id: `temp-${Date.now()}`, ...runSummary }
    optimisticAddRun(tempRun)

    const result = await saveRun(runSummary)
    setSaving(false)

    if (!result) {
      revertOptimisticAddRun(previousRuns)
      alert('Erro ao salvar corrida. Tente novamente.')
      return
    }

    debouncedReload()
    resetToIdle()
  }

  function handleDiscardRun() {
    resetToIdle()
  }

  /* ── Live metrics (memoizadas) ── */
  const liveKm = totalDistance / 1000

  const livePace = useMemo(() => {
    if (liveKm === 0 || seconds === 0) return 0
    return Math.round(seconds / liveKm)
  }, [seconds, liveKm])

  const liveSteps = useMemo(() => Math.round(liveKm * 1300),        [liveKm])
  const liveKcal  = useMemo(() => Math.round(liveKm * 70 * 1.036),  [liveKm])

  /* ── GPS status display ── */
  const gpsLabelMap = {
    idle:       'GPS Inativo',
    requesting: 'Solicitando GPS...',
    active:     'GPS Ativo',
    denied:     'GPS Negado',
    error:      'Erro no GPS',
  }
  const gpsLabel = gpsLabelMap[gpsStatus] ?? 'GPS Inativo'
  const gpsColor = gpsStatus === 'active'
    ? GREEN
    : (gpsStatus === 'denied' || gpsStatus === 'error')
    ? RED
    : MUTED

  const showGpsError = gpsStatus === 'denied' || gpsStatus === 'error'

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
        >
          <button
            onClick={() => {
              if (running && !window.confirm('Corrida em andamento. Sair vai cancelar a sessão. Continuar?')) return
              navigate('/modulos')
            }}
            style={{
              background: '#1a1a1a', border: '1px solid #222222',
              borderRadius: 10, width: 38, height: 38, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} color={MUTED} />
          </button>

          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#052e16', border: '1px solid #10B98122',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={18} color={GREEN} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Corrida</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              GPS real, passos e distância em tempo real
            </div>
          </div>

          <button
            onClick={() => setIsFav(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Star
              size={22}
              color={isFav ? '#F59E0B' : MUTED}
              fill={isFav ? '#F59E0B' : 'none'}
              style={{ transition: 'all 0.2s' }}
            />
          </button>
        </motion.div>

        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07 }}
          style={CARD}
        >
          {/* GPS status row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <motion.div
              animate={gpsStatus === 'requesting' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
              transition={{ duration: 1, repeat: gpsStatus === 'requesting' ? Infinity : 0 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Navigation size={14} color={gpsColor} style={{ transition: 'color 0.3s', display: 'block' }} />
            </motion.div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: gpsColor,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              transition: 'color 0.3s',
            }}>
              {gpsLabel}
            </span>
            {gpsStatus === 'active' && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }}
              />
            )}
          </div>

          {/* Distance display */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <motion.div
              key={running ? 'running' : 'idle'}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 72, fontWeight: 900, color: '#fff',
                lineHeight: 1, letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatDistance(totalDistance)}
            </motion.div>
            <div style={{ fontSize: 14, color: MUTED, fontWeight: 600, marginTop: 6, textTransform: 'lowercase', letterSpacing: '0.04em' }}>
              quilômetros
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#1e1e1e', marginBottom: 20 }} />

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <StatCell Icon={Timer}     iconColor='#3B82F6' iconBg='#0a0f1e' value={fmtTime(seconds)}        label='Tempo'  />
            <StatCell Icon={Activity}  iconColor='#F59E0B' iconBg='#1a1200' value={formatPace(livePace)}    label='min/km' />
            <StatCell Icon={Footprints} iconColor={PUR}    iconBg='#1a1a2e' value={String(liveSteps)}       label='Passos' />
            <StatCell Icon={Flame}     iconColor='#F97316' iconBg='#1a0a00' value={String(liveKcal)}        label='kcal'   />
          </div>
        </motion.div>

        {/* ── Card de erro GPS ── */}
        <AnimatePresence>
          {showGpsError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: 16,
                background: '#1a0a0a',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12, padding: 14,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <AlertCircle size={18} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: '#fff', lineHeight: 1.55 }}>
                  {gpsStatus === 'denied'
                    ? 'Pra usar a corrida, ative o acesso à localização nas configurações do navegador. No Chrome, clique no cadeado da URL > Localização > Permitir.'
                    : 'Erro ao acessar GPS. Verifique se está em um local com sinal e tente novamente.'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Botão Play / Stop ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}
        >
          <motion.button
            onClick={running ? stopTracking : handlePlayClick}
            whileHover={{ scale: gpsStatus === 'requesting' ? 1 : 1.05 }}
            whileTap={{ scale: gpsStatus === 'requesting' ? 1 : 0.94 }}
            animate={running
              ? { boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 32px rgba(239,68,68,0.45)', '0 0 0px rgba(239,68,68,0)'] }
              : { boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 32px rgba(124,58,237,0.45)', '0 0 0px rgba(124,58,237,0)'] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            disabled={gpsStatus === 'requesting'}
            style={{
              width: 120, height: 120, borderRadius: '50%', border: 'none',
              background: running
                ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                : `linear-gradient(135deg, ${PUR}, #6D28D9)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: gpsStatus === 'requesting' ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              opacity: gpsStatus === 'requesting' ? 0.65 : 1,
            }}
          >
            <AnimatePresence mode="wait">
              {running ? (
                <motion.div key="stop" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  <Square size={40} color="#fff" fill="#fff" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  <Play size={40} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {gpsStatus === 'requesting'
              ? 'Aguardando GPS...'
              : running
              ? 'Toque para encerrar'
              : 'Toque para iniciar'}
          </span>
        </div>

        {/* ── Tela de resumo ── */}
        <AnimatePresence>
          {summaryMode !== null && runSummary && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 28,
                background: summaryMode === 'too_short' ? '#111000' : '#0d1a14',
                border: `1px solid ${summaryMode === 'too_short' ? '#2a2000' : '#1a3325'}`,
                borderRadius: 14, padding: 20,
              }}
            >
              {summaryMode === 'too_short' ? (

                /* ── Corrida muito curta ── */
                <>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <AlertTriangle size={32} color='#F59E0B' style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                      Corrida muito curta
                    </div>
                    <div style={{ fontSize: 12, color: MUTED }}>
                      Duração mínima: 1 minuto + 100 metros
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <SummaryCell label='DURAÇÃO'   value={fmtTime(runSummary.durationSeconds)}                      color='#F59E0B' />
                    <SummaryCell label='DISTÂNCIA' value={`${formatDistance(runSummary.distanceMeters)} km`}        color='#F59E0B' />
                  </div>

                  <button
                    onClick={handleDiscardRun}
                    style={{
                      width: '100%', padding: '13px 0', borderRadius: 10,
                      background: PUR, border: 'none',
                      color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    OK
                  </button>
                </>

              ) : (

                /* ── Sessão válida ── */
                <>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                      Sessão Encerrada
                    </div>
                    <div style={{ fontSize: 12, color: MUTED }}>Resumo da corrida</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <SummaryCell label='DURAÇÃO'   value={fmtTime(runSummary.durationSeconds)}                      color={GREEN} />
                    <SummaryCell label='DISTÂNCIA' value={`${formatDistance(runSummary.distanceMeters)} km`}        color={GREEN} />
                    <SummaryCell label='PACE'      value={formatPace(runSummary.paceSecondsPerKm)}                  color={GREEN} />
                    <SummaryCell label='PASSOS'    value={String(runSummary.steps)}                                 color={GREEN} />
                    <SummaryCell label='KCAL'      value={String(runSummary.calories)}                              color={GREEN} spanFull />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={handleSaveRun}
                      disabled={saving}
                      style={{
                        width: '100%', padding: '13px 0', borderRadius: 10,
                        background: saving ? '#0a2e1a' : GREEN, border: 'none',
                        color: saving ? MUTED : '#000', fontWeight: 800, fontSize: 14,
                        cursor: saving ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {saving ? 'Salvando...' : 'Salvar Corrida'}
                    </button>
                    <button
                      onClick={handleDiscardRun}
                      disabled={saving}
                      style={{
                        width: '100%', padding: '13px 0', borderRadius: 10,
                        background: 'transparent', border: '1px solid #222222',
                        color: MUTED, fontWeight: 700, fontSize: 14,
                        cursor: saving ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Descartar
                    </button>
                  </div>
                </>

              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
