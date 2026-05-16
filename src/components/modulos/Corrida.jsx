import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Star,
  Navigation, Timer, Activity, Footprints, Flame,
  Play, Square,
} from 'lucide-react'
import BottomNav from '../BottomNav'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'

const CARD = {
  background: '#0f0f0f',
  border: '1px solid #1e1e1e',
  borderRadius: 14,
  padding: 20,
}

/* ── Helpers ── */
function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
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

export default function Corrida() {
  const navigate = useNavigate()

  const [running,     setRunning]     = useState(false)
  const [seconds,     setSeconds]     = useState(0)
  const [isFav,       setIsFav]       = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const intervalRef = useRef(null)
  const finalTime   = useRef(0)

  /* Timer engine */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function handleToggle() {
    if (!running) {
      setShowSummary(false)
      setSeconds(0)
      setRunning(true)
    } else {
      finalTime.current = seconds
      setRunning(false)
      setShowSummary(true)
    }
  }

  function handleNewSession() {
    setShowSummary(false)
    setSeconds(0)
  }

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
            onClick={() => navigate('/modulos')}
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
          {/* GPS status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Navigation
              size={14}
              color={running ? GREEN : MUTED}
              style={{ transition: 'color 0.3s' }}
            />
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: running ? GREEN : MUTED,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              transition: 'color 0.3s',
            }}>
              {running ? 'GPS Ativo' : 'GPS Inativo'}
            </span>
            {running && (
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
              0.00
            </motion.div>
            <div style={{ fontSize: 14, color: MUTED, fontWeight: 600, marginTop: 6, textTransform: 'lowercase', letterSpacing: '0.04em' }}>
              quilômetros
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#1e1e1e', marginBottom: 20 }} />

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            <StatCell
              Icon={Timer}
              iconColor='#3B82F6'
              iconBg='#0a0f1e'
              value={fmtTime(seconds)}
              label='Tempo'
            />
            <StatCell
              Icon={Activity}
              iconColor='#F59E0B'
              iconBg='#1a1200'
              value='--:--'
              label='min/km'
            />
            <StatCell
              Icon={Footprints}
              iconColor={PUR}
              iconBg='#1a1a2e'
              value='0'
              label='Passos'
            />
            <StatCell
              Icon={Flame}
              iconColor='#F97316'
              iconBg='#1a0a00'
              value='0'
              label='kcal'
            />
          </div>
        </motion.div>

        {/* ── Play / Stop button ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}
        >
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={running
              ? { boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 32px rgba(239,68,68,0.45)', '0 0 0px rgba(239,68,68,0)'] }
              : { boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 32px rgba(124,58,237,0.45)', '0 0 0px rgba(124,58,237,0)'] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 120, height: 120, borderRadius: '50%', border: 'none',
              background: running
                ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                : `linear-gradient(135deg, ${PUR}, #6D28D9)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.3s',
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
            {running ? 'Toque para encerrar' : 'Toque para iniciar'}
          </span>
        </div>

        {/* ── Session summary ── */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 28,
                background: '#0d1a14',
                border: '1px solid #1a3325',
                borderRadius: 14, padding: 20,
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                  Sessão Encerrada
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>Resumo da corrida</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'DURAÇÃO',   value: fmtTime(finalTime.current) },
                  { label: 'DISTÂNCIA', value: '0.00 km'                  },
                  { label: 'PASSOS',    value: '0'                        },
                  { label: 'KCAL',      value: '0'                        },
                ].map(s => (
                  <div key={s.label} style={{
                    background: '#111111', border: '1px solid #222222',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNewSession}
                style={{
                  width: '100%', padding: '13px 0', borderRadius: 10,
                  background: PUR, border: 'none',
                  color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                }}
              >
                Nova Sessão
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
