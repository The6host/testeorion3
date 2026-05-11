import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NEON = '#ccff00'

/* ── SFX URLs ── */
const SFX = {
  click:     'https://res.cloudinary.com/dctzllsly/video/upload/v1778455021/click_mjhzu9.mp3',
  check:     'https://res.cloudinary.com/dctzllsly/video/upload/v1778456791/check_qtq69b.mp3',
  alerta:    'https://res.cloudinary.com/dctzllsly/video/upload/v1778455238/alerta_tfuydp.mp3',
  digita:    'https://res.cloudinary.com/dctzllsly/video/upload/v1778456106/digita_qfxzek.mp3',
  bemvindo:  'https://res.cloudinary.com/dctzllsly/video/upload/v1778456432/bemvindo_ryrr2t.mp3',
  segunda:   'https://res.cloudinary.com/dctzllsly/video/upload/v1778456521/segunda_fjzgzz.wav',
  despertar: 'https://res.cloudinary.com/dctzllsly/video/upload/v1778456599/despertar_cjgy8b.mp3',
}

/* One-shot SFX — nova instância a cada chamada, podem sobrepor */
function playSFX(url, volume = 0.75) {
  const a = new Audio(url)
  a.volume = volume
  a.play().catch(() => {})
}

export default function BootSequence({ onComplete, onFirstClick }) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [termLines, setTermLines] = useState([])
  const [twLines, setTwLines] = useState([])
  const [twCurrent, setTwCurrent] = useState('')
  const [showCompat, setShowCompat] = useState(false)
  const [compatPct, setCompatPct] = useState(0)

  /* Ref para o som de máquina de escrever (loop play/pause) */
  const digitaRef = useRef(null)

  function getDigita() {
    if (!digitaRef.current) {
      const a = new Audio(SFX.digita)
      a.loop   = true
      a.volume = 0.5
      digitaRef.current = a
    }
    return digitaRef.current
  }
  const playDigita  = () => getDigita().play().catch(() => {})
  const pauseDigita = () => { if (digitaRef.current) digitaRef.current.pause() }

  /* Lock scroll + cleanup do digita no unmount */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      if (digitaRef.current) {
        digitaRef.current.pause()
        digitaRef.current.src = ''
        digitaRef.current = null
      }
    }
  }, [])

  function handleClick() {
    if (phase === 0) {
      onFirstClick?.()
      setTimeout(() => {
        playSFX(SFX.click)
        setPhase(1)
      }, 500)
    } else if (phase > 0 && phase < 7) {
      onComplete()
    }
  }

  /* Phase 1: terminal lines + progress bar */
  useEffect(() => {
    if (phase !== 1) return
    const LINES = [
      '> CHECKING_BIOMETRICS...',
      '> SYNCING_WITH_DATABASE...',
      '> ESTABLISHING_SECURE_CONNECTION...',
    ]
    /* Check SFX sincronizado com cada linha */
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        playSFX(SFX.check)
        setTermLines(p => [...p, line])
      }, 500 + i * 1000)
    )
    let prog = 0
    let finishTimer = null
    const iv = setInterval(() => {
      prog = Math.min(prog + Math.random() * 3 + 0.8, 98)
      setProgress(parseFloat(prog.toFixed(1)))
      if (prog >= 98) {
        clearInterval(iv)
        setProgress(100)
        finishTimer = setTimeout(() => setPhase(2), 500)
      }
    }, 120)
    return () => { timers.forEach(clearTimeout); clearInterval(iv); if (finishTimer) clearTimeout(finishTimer) }
  }, [phase])

  /* Phase 2: alert */
  useEffect(() => {
    if (phase !== 2) return
    const tSfx2 = setTimeout(() => playSFX(SFX.alerta), 500)
    const t = setTimeout(() => setPhase(3), 1800)
    return () => { clearTimeout(tSfx2); clearTimeout(t) }
  }, [phase])

  /* Phase 3: typewriter sequencial + contador */
  useEffect(() => {
    if (phase !== 3) return
    let cancelled = false
    let compatIv = null

    const FULL_LINES   = ['Jogador encontrado.', 'Nível atual: Iniciante.']
    const COMPAT_PREFIX = 'Compatibilidade: '
    const CHAR_DELAY   = 38
    const LINE_PAUSE   = 320

    function startCompatCounter() {
      let pct = 0
      compatIv = setInterval(() => {
        if (cancelled) { clearInterval(compatIv); return }
        pct = Math.min(pct + Math.random() * 4 + 1.5, 99)
        setCompatPct(parseFloat(pct.toFixed(1)))
        if (pct >= 99) {
          clearInterval(compatIv)
          setTimeout(() => { if (!cancelled) setPhase(4) }, 1400)
        }
      }, 30)
    }

    function typeString(str, onDone) {
      let i = 0
      playDigita()   // inicia som de digitação
      function next() {
        if (cancelled) { pauseDigita(); return }
        if (i <= str.length) {
          setTwCurrent(str.slice(0, i))
          i++
          setTimeout(next, CHAR_DELAY)
        } else {
          pauseDigita()   // pausa ao terminar a linha
          onDone()
        }
      }
      next()
    }

    function typeLine(lineIdx) {
      if (cancelled) return
      if (lineIdx >= FULL_LINES.length) {
        setTwCurrent('')
        setTimeout(() => {
          typeString(COMPAT_PREFIX, () => {
            if (!cancelled) {
              setShowCompat(true)
              startCompatCounter()
            }
          })
        }, LINE_PAUSE)
        return
      }
      typeString(FULL_LINES[lineIdx], () => {
        if (cancelled) return
        setTwLines(p => [...p, FULL_LINES[lineIdx]])
        setTwCurrent('')
        setTimeout(() => typeLine(lineIdx + 1), LINE_PAUSE)
      })
    }

    const start = setTimeout(() => typeLine(0), 400)

    return () => {
      cancelled = true
      clearTimeout(start)
      if (compatIv) clearInterval(compatIv)
      pauseDigita()
    }
  }, [phase])

  /* Phase 4: Bem-vindo */
  useEffect(() => {
    if (phase !== 4) return
    const tSfx4 = setTimeout(() => playSFX(SFX.bemvindo, 0.35), 500)
    const t = setTimeout(() => setPhase(5), 2200)
    return () => { clearTimeout(tSfx4); clearTimeout(t) }
  }, [phase])

  /* Phase 5: Segunda Chance */
  useEffect(() => {
    if (phase !== 5) return
    const tSfx5 = setTimeout(() => playSFX(SFX.segunda, 0.35), 500)
    const t = setTimeout(() => setPhase(6), 2200)
    return () => { clearTimeout(tSfx5); clearTimeout(t) }
  }, [phase])

  /* Phase 6: Despertar */
  useEffect(() => {
    if (phase !== 6) return
    const tSfx6 = setTimeout(() => playSFX(SFX.despertar, 0.35), 500)
    const t = setTimeout(() => {
      setPhase(7)
      setTimeout(onComplete, 750)
    }, 2800)
    return () => { clearTimeout(tSfx6); clearTimeout(t) }
  }, [phase])

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-[9999] overflow-hidden"
      style={{
        height: '100svh',
        backgroundColor: '#00000a',
        cursor: phase < 7 ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3, ease: 'easeInOut' }}
      onClick={handleClick}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)',
        }}
      />

      {/* Structural lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.18) 20%, rgba(124,58,237,0.18) 80%, transparent)' }} />
        <div className="absolute bottom-1/4 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.18) 20%, rgba(124,58,237,0.18) 80%, transparent)' }} />
        <div className="absolute left-1/4 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.18) 20%, rgba(124,58,237,0.18) 80%, transparent)' }} />
        <div className="absolute right-1/4 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.18) 20%, rgba(124,58,237,0.18) 80%, transparent)' }} />
      </div>

      {/* Hint de skip */}
      {phase > 0 && phase < 7 && (
        <p
          className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest pointer-events-none select-none"
          style={{ color: 'rgba(204,255,0,0.22)' }}
        >
          [ Clique em qualquer lugar para pular ]
        </p>
      )}

      {/* Phase content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
          <AnimatePresence mode="wait">

            {/* ── Estado 0: Idle ── */}
            {phase === 0 && (
              <motion.div
                key="p0"
                className="flex flex-col items-center gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: 200, height: 200, border: '1px solid rgba(204,255,0,0.1)' }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="w-32 h-32 rounded-full"
                    style={{ border: `1.5px solid ${NEON}` }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(204,255,0,0.2), 0 0 50px rgba(204,255,0,0.08), inset 0 0 20px rgba(204,255,0,0.04)',
                        '0 0 50px rgba(204,255,0,0.55), 0 0 100px rgba(204,255,0,0.2), inset 0 0 40px rgba(204,255,0,0.1)',
                        '0 0 20px rgba(204,255,0,0.2), 0 0 50px rgba(204,255,0,0.08), inset 0 0 20px rgba(204,255,0,0.04)',
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                <div className="flex flex-col items-center gap-5 px-6 text-center">
                  <p
                    className="font-mono text-2xl md:text-4xl tracking-[0.2em] md:tracking-[0.35em] font-bold"
                    style={{ color: NEON, textShadow: '0 0 25px rgba(204,255,0,0.5)' }}
                  >
                    INICIAR SISTEMA
                  </p>
                  <motion.p
                    className="font-mono text-xs md:text-sm tracking-[0.15em] md:tracking-[0.22em]"
                    style={{ color: 'rgba(204,255,0,0.75)' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    (Toque Para Conectar)
                  </motion.p>
                  <p className="font-mono text-[9px] md:text-xs tracking-wider md:tracking-widest mt-4" style={{ color: 'rgba(204,255,0,0.5)' }}>
                    PARA UMA MELHOR EXPERIÊNCIA, AUMENTE O VOLUME.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Estado 1: Carregamento ── */}
            {phase === 1 && (
              <motion.div
                key="p1"
                className="flex flex-col gap-8 w-full max-w-md px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col gap-3 min-h-[84px]">
                  <AnimatePresence>
                    {termLines.map((line, i) => (
                      <motion.p
                        key={i}
                        className="font-mono text-sm md:text-base tracking-wider"
                        style={{ color: 'rgba(204,255,0,0.9)' }}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between font-mono text-xs tracking-[0.25em]" style={{ color: NEON }}>
                    <span>CARREGANDO SISTEMA</span>
                    <span>{progress}%</span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(204,255,0,0.2)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, rgba(180,230,0,0.9), ${NEON})`,
                        boxShadow: `0 0 18px ${NEON}, 0 0 35px rgba(204,255,0,0.55), 0 0 60px rgba(204,255,0,0.25)`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Estado 2: Alerta ── */}
            {phase === 2 && (
              <motion.div
                key="p2"
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -10, 10, -6, 6, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.3 },
                  x: { duration: 0.5, delay: 0.1, times: [0, 0.1, 0.3, 0.5, 0.65, 0.8, 0.9, 1] },
                }}
              >
                <motion.p
                  className="font-mono text-6xl font-black"
                  style={{ color: '#ff1a1a' }}
                  animate={{ opacity: [1, 0.1, 1, 0.1, 1, 0.1, 1] }}
                  transition={{ duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] }}
                >
                  !
                </motion.p>
                <div
                  className="px-8 py-4 font-mono text-sm md:text-base tracking-[0.3em] font-bold"
                  style={{
                    color: '#ff1a1a',
                    border: '1.5px solid #ff1a1a',
                    boxShadow: '0 0 20px rgba(255,26,26,0.35), inset 0 0 15px rgba(255,26,26,0.06)',
                  }}
                >
                  [ ALERTA DO SISTEMA ]
                </div>
              </motion.div>
            )}

            {/* ── Estado 3: Compatibilidade (typewriter) ── */}
            {phase === 3 && (
              <motion.div
                key="p3"
                className="flex flex-col gap-4 font-mono px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {twLines.map((line, i) => (
                  <p key={i} className="text-lg md:text-xl tracking-normal" style={{ color: NEON }}>
                    {line}
                  </p>
                ))}

                {(twCurrent || showCompat) && (
                  <p className="text-lg md:text-xl tracking-normal" style={{ color: NEON }}>
                    {twCurrent}
                    {showCompat && (
                      <span className="font-bold text-xl md:text-2xl" style={{ color: '#fff' }}>
                        {compatPct.toFixed(1)}%
                      </span>
                    )}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  </p>
                )}
              </motion.div>
            )}

            {/* ── Estado 4: Bem-vindo ── */}
            {phase === 4 && (
              <motion.div
                key="p4"
                className="text-center"
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p
                  className="font-mono text-3xl md:text-4xl font-bold tracking-widest"
                  style={{
                    color: NEON,
                    textShadow: '0 0 30px rgba(204,255,0,0.7), 0 0 70px rgba(204,255,0,0.3), 0 0 120px rgba(204,255,0,0.15)',
                  }}
                >
                  Bem-vindo, Jogador.
                </p>
              </motion.div>
            )}

            {/* ── Estado 5: Segunda Chance ── */}
            {phase === 5 && (
              <motion.div
                key="p5"
                className="text-center px-8"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
              >
                <p
                  className="font-mono text-xl md:text-3xl font-black tracking-[0.2em] uppercase"
                  style={{
                    color: '#fff',
                    textShadow: '-2px 0 2px rgba(255,80,255,0.85), 2px 0 2px rgba(0,230,255,0.85), 0 0 50px rgba(255,255,255,0.3)',
                  }}
                >
                  SEGUNDA CHANCE CONCEDIDA.
                </p>
              </motion.div>
            )}

            {/* ── Estado 6: O Despertar ── */}
            {phase === 6 && (
              <motion.div
                key="p6"
                className="flex flex-col items-center gap-4 w-full max-w-3xl px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div
                  className="w-full h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${NEON}, transparent)`,
                    boxShadow: '0 0 8px rgba(204,255,0,0.6), 0 0 18px rgba(204,255,0,0.3)',
                  }}
                />
                <p
                  className="font-mono text-lg md:text-2xl font-black tracking-[0.3em] uppercase text-center py-3"
                  style={{
                    color: NEON,
                    textShadow: '0 0 20px rgba(204,255,0,0.7), 0 0 50px rgba(204,255,0,0.3)',
                  }}
                >
                  O DESPERTAR FOI LIBERADO
                </p>
                <div
                  className="w-full h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${NEON}, transparent)`,
                    boxShadow: '0 0 8px rgba(204,255,0,0.6), 0 0 18px rgba(204,255,0,0.3)',
                  }}
                />
              </motion.div>
            )}

          </AnimatePresence>
      </div>
    </motion.div>
  )
}
