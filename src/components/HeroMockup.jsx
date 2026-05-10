import { motion } from 'framer-motion'

const NEON      = '#ccff00'
const BEZEL     = '#191b23'
const SCREEN_BG = '#07080e'
const CARD_BG   = '#0d0f17'
const CARD_BDR  = '#161824'
const TOPBAR    = '#0f1016'

const FLOAT_GLASS = {
  background: 'rgba(15,16,24,0.94)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 14,
}

/* ── Check icon ── */
function CheckIcon({ done }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: done ? NEON : 'transparent',
      border: done ? 'none' : `1.5px solid ${CARD_BDR}`,
    }}>
      {done && (
        <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

/* ── Micro-ícones checklist ── */
function IconGear() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}
function IconZap() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}
function IconMoon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

/* ── Conteúdo da tela ── */
function PhoneScreen() {
  const tasks = [
    { label: 'Focar 2h',     done: true,  Icon: IconGear },
    { label: 'Treino manhã', done: true,  Icon: IconZap  },
    { label: 'Meditação',    done: false, Icon: IconMoon },
  ]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: SCREEN_BG, overflow: 'hidden' }}>

      {/* Notch bar */}
      <div style={{
        height: 26, background: TOPBAR, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#08090e' }} />
      </div>

      {/* Dashboard */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '18px 14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>Bem-vindo de volta</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Player_One</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.3)',
            borderRadius: 16, padding: '4px 10px',
          }}>
            <span style={{ fontSize: 10 }}>🔥</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: NEON }}>127</span>
          </div>
        </div>

        {/* Progresso Diário */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BDR}`, borderRadius: 10, padding: '13px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)' }}>Progresso Diário</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: NEON }}>78%</span>
          </div>
          <div style={{ width: '100%', height: 5, borderRadius: 6, background: '#252833' }}>
            <div style={{ height: '100%', width: '78%', borderRadius: 6, background: NEON }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 9 }}>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>7/9 tasks</span>
            <span style={{ color: NEON }}>+450 pts</span>
          </div>
        </div>

        {/* Arena Ativa */}
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BDR}`, borderRadius: 10, padding: '13px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(204,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1 }}>Arena Ativa</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>vs Lucas M.</p>
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: NEON }}>↗ +15%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>450</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Você</p>
            </div>
            <div style={{
              fontSize: 8, fontWeight: 900, letterSpacing: '0.08em',
              background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.22)',
              color: NEON, padding: '4px 9px', borderRadius: 16,
            }}>VENCENDO</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>380</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Lucas</p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(({ label, done, Icon }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: CARD_BG, border: `1px solid ${CARD_BDR}`,
              borderRadius: 8, padding: '10px 12px',
            }}>
              <CheckIcon done={done} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                <span style={{ color: done ? 'rgba(204,255,0,0.28)' : NEON, display: 'flex' }}>
                  <Icon />
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  color: done ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)',
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ── Card flutuante ── */
function FloatCard({ children, duration = 4, delay = 0, style = {} }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...FLOAT_GLASS,
        ...style,
        animation: `heroFloat ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${delay}s infinite`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

/* ── Componente principal ── */
export default function HeroMockup({ simplified = false }) {
  if (simplified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative' }}
      >
        <div style={{
          position: 'absolute', inset: -40, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(109,40,217,0.28) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{ width: 234, height: 408, borderRadius: 36, background: BEZEL, padding: 7, boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden' }}>
            <PhoneScreen />
          </div>
        </div>
      </motion.div>
    )
  }

  // Container: 560 × 570. Phone (300 × 520) centrado: left:130, top:25.
  return (
    <div style={{ position: 'relative', width: 560, height: 570 }}>

      {/* Glow roxo pulsante */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(109,40,217,0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Wrapper phone + cards */}
      <div style={{ position: 'absolute', left: 130, top: 25 }}>

        {/* Bezel externo */}
        <div style={{
          width: 300, height: 520,
          borderRadius: 42, background: BEZEL,
          padding: 8,
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
        }}>
          {/* Tela interna */}
          <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden' }}>
            <PhoneScreen />
          </div>
        </div>

        {/* ── Card 1: Ranking ── */}
        <FloatCard duration={3.4} delay={0} style={{ top: 30, left: -68, padding: '10px 14px', minWidth: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(204,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NEON} strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                <path d="M4 22h16" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1, marginBottom: 3 }}>Ranking Global</p>
              <p style={{ fontSize: 13, fontWeight: 900, color: NEON, lineHeight: 1 }}>#3 no Ranking</p>
            </div>
          </div>
        </FloatCard>

        {/* ── Card 2: Streak ── */}
        <FloatCard duration={4.8} delay={0.9} style={{ top: 255, left: -65, padding: '10px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>🔥</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1 }}>127 dias</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>sequência!</p>
            </div>
          </div>
        </FloatCard>

        {/* ── Card 3: XP ── */}
        <FloatCard duration={5.2} delay={0.4} style={{ top: 90, left: 238, padding: '12px 14px', minWidth: 126 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 4 }}>XP esta semana</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: NEON, lineHeight: 1, marginBottom: 8 }}>+2.450 XP</p>
          <div style={{ width: '100%', height: 4, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: '72%', borderRadius: 6, background: NEON }} />
          </div>
        </FloatCard>

        {/* ── Card 4: Missão ── */}
        <FloatCard duration={3.9} delay={1.3} style={{ top: 405, left: 212, padding: '10px 14px', minWidth: 148 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 3 }}>Missão Épica</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 7 }}>Conquistar o Ápice</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', width: '60%', borderRadius: 6, background: NEON }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: NEON }}>60%</span>
          </div>
        </FloatCard>

      </div>
    </div>
  )
}
