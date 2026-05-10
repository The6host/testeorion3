import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NEON   = '#ccff00'
const PUR    = '#a855f7'
const BG     = '#010208'

/* ── Icons ── */
function IcoTrend() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}
function IcoBar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
}
function IcoTarget() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
}
function IcoStar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

const STEPS = [
  { label: 'Analisando',  Icon: IcoTrend,  from: 0  },
  { label: 'Calculando',  Icon: IcoBar,    from: 25 },
  { label: 'Otimizando',  Icon: IcoTarget, from: 50 },
  { label: 'Finalizando', Icon: IcoStar,   from: 75 },
]

const STATS = [
  { Icon: IcoTrend,  top: 'MISSÕES',     sub: 'personalizadas', target: 12 },
  { Icon: IcoTarget, top: 'HÁBITOS',     sub: 'configurados',   target: 8  },
  { Icon: IcoStar,   top: 'PROTOCOLOS',  sub: 'de evolução',    target: 3  },
]

export default function ProfileAnalysis({ onComplete }) {
  const [pct,    setPct]    = useState(0)
  const [counts, setCounts] = useState([0, 0, 0])

  useEffect(() => {
    const DURATION = 5600
    const TICK     = 50
    const N        = DURATION / TICK
    let   n        = 0

    const id = setInterval(() => {
      n++
      const t = Math.min(1, n / N)
      // ease-in-out
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const p = Math.round(e * 100)

      setPct(p)
      setCounts(STATS.map(s => Math.round(e * s.target)))

      if (p >= 100) {
        clearInterval(id)
        setTimeout(onComplete, 1200)
      }
    }, TICK)

    return () => clearInterval(id)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: BG,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Glows */}
      <div style={{ position: 'absolute', top: -120, left: -120, width: 500, height: 500, background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -120, right: -120, width: 500, height: 500, background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Subtle star dots */}
      {[
        [12, 8], [88, 14], [5, 55], [95, 42], [30, 92], [72, 88],
        [50, 5], [20, 70], [80, 30], [60, 78], [40, 22], [15, 40],
      ].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: Math.random() > 0.5 ? 2 : 1.5, height: Math.random() > 0.5 ? 2 : 1.5,
          borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 520, padding: '0 24px', boxSizing: 'border-box' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={NEON}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>ORION</span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, color: PUR, letterSpacing: '0.06em',
            background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
            padding: '2px 8px', borderRadius: 6,
          }}>IA</span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Analisando Perfil</h1>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 40 }}>Preparando sua jornada personalizada...</p>

        {/* Step icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 40 }}>
          {STEPS.map(({ label, Icon, from }, i) => {
            const active = pct >= from
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <motion.div
                  animate={active
                    ? { boxShadow: `0 0 22px rgba(168,85,247,0.45)`, borderColor: 'rgba(168,85,247,0.45)' }
                    : { boxShadow: 'none', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                  transition={{ duration: 0.5 }}
                  style={{
                    width: 58, height: 58, borderRadius: 16,
                    background: active ? 'rgba(168,85,247,0.16)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: active ? PUR : 'rgba(255,255,255,0.18)',
                    transition: 'background 0.4s, color 0.4s',
                  }}
                >
                  <Icon />
                </motion.div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: active ? PUR : 'rgba(255,255,255,0.2)',
                  transition: 'color 0.4s',
                }}>{label}</span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>PROCESSANDO</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: NEON, fontFamily: 'monospace' }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 6, background: NEON, boxShadow: `0 0 10px rgba(204,255,0,0.5)` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.12, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 10 }}>
          {STATS.map(({ Icon, top, sub, target }, i) => (
            <div key={i} style={{
              flex: 1, padding: '18px 10px 14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ color: PUR, display: 'flex', marginBottom: 4 }}><Icon /></span>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>
                {counts[i]}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginTop: 2 }}>{top}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{sub}</span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  )
}
