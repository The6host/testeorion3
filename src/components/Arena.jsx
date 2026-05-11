import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Shield, Zap, Target } from 'lucide-react'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR  = '#A855F7'
const NEON = '#ccff00'
const GREEN = '#10B981'
const RED   = '#EF4444'

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
}

/* ── Mock data ── */
const MY_STATS = [
  { emoji: '💪', name: 'Força',        value: 2  },
  { emoji: '❤️', name: 'Vitalidade',   value: 12 },
  { emoji: '🧠', name: 'Inteligência', value: 6  },
  { emoji: '🎯', name: 'Disciplina',   value: 9  },
  { emoji: '⚡', name: 'Agilidade',    value: 1  },
  { emoji: '👁️', name: 'Foco',         value: 5  },
  { emoji: '💬', name: 'Carisma',      value: 7  },
  { emoji: '💧', name: 'Hidratação',   value: 4  },
]

const OPPONENT = { name: 'DarkWolf', level: 3, tier: 'T3' }
const MAX_HP   = 100

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/* ══════════════════════════════════════
   SEARCH SPINNER
══════════════════════════════════════ */
function SearchSpinner() {
  return (
    <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 28px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `3px solid transparent`,
          borderTopColor: PUR,
          borderRightColor: `${PUR}55`,
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 10, borderRadius: '50%',
          border: `2px solid transparent`,
          borderBottomColor: `${PUR}88`,
          borderLeftColor: `${PUR}33`,
        }}
      />
      <motion.div
        animate={{ scale: [0.85, 1.08, 0.85], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 22,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${PUR}44 0%, transparent 70%)`,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
      }}>⚔️</div>
    </div>
  )
}

/* ══════════════════════════════════════
   DOTS ANIMATION
══════════════════════════════════════ */
function Dots() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        >.</motion.span>
      ))}
    </>
  )
}

/* ══════════════════════════════════════
   HP BAR
══════════════════════════════════════ */
function HPBar({ hp, color }) {
  const pct = Math.max(0, (hp / MAX_HP) * 100)
  return (
    <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: 99,
          background: color,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  )
}

/* ══════════════════════════════════════
   FIGHTER CARD
══════════════════════════════════════ */
function Fighter({ name, level, hp, isMe }) {
  const color = isMe ? GREEN : RED

  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <motion.div
        animate={hp < MAX_HP * 0.3 ? { x: [0, -3, 3, -3, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 8px',
          background: isMe
            ? 'linear-gradient(135deg, #059669, #047857)'
            : 'linear-gradient(135deg, #DC2626, #991B1B)',
          border: `2px solid ${color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}
      >
        {isMe ? '⚔️' : '💀'}
      </motion.div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 1 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>Lv. {level}</div>
      <HPBar hp={hp} color={color} />
      <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{hp}/{MAX_HP} HP</div>
    </div>
  )
}

/* ══════════════════════════════════════
   COMBAT LOG
══════════════════════════════════════ */
function CombatLog({ entries }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [entries.length])

  return (
    <div
      ref={ref}
      style={{
        maxHeight: 180, overflowY: 'auto',
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '10px 14px',
        scrollbarWidth: 'none',
      }}
    >
      {entries.length === 0 && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '8px 0' }}>
          A batalha começa agora…
        </div>
      )}
      <AnimatePresence>
        {entries.map(e => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: e.type === 'me' ? -14 : 14, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 12, lineHeight: 1.65,
              color: e.type === 'me' ? '#34D399' : '#F87171',
              paddingBottom: 2,
            }}
          >
            <span style={{ opacity: 0.5 }}>›</span> {e.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════
   PHASE WRAPPER (fade transition)
══════════════════════════════════════ */
function PhaseWrap({ children, k }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function Arena() {
  const navigate = useNavigate()

  const [phase,      setPhase]      = useState('initial')
  const [myHP,       setMyHP]       = useState(MAX_HP)
  const [oppHP,      setOppHP]      = useState(MAX_HP)
  const [combatLog,  setCombatLog]  = useState([])
  const [winner,     setWinner]     = useState(null) // 'me' | 'opponent'
  const [xpDelta,    setXpDelta]    = useState(0)

  const myHPRef  = useRef(MAX_HP)
  const oppHPRef = useRef(MAX_HP)

  /* ── Searching → Battle after 3s ── */
  useEffect(() => {
    if (phase !== 'searching') return
    const t = setTimeout(() => setPhase('battle'), 3000)
    return () => clearTimeout(t)
  }, [phase])

  /* ── Battle engine ── */
  useEffect(() => {
    if (phase !== 'battle') return

    let myTurn = true

    const id = setInterval(() => {
      const dmg = rnd(8, 20)

      if (myTurn) {
        const next = Math.max(0, oppHPRef.current - dmg)
        oppHPRef.current = next
        setOppHP(next)
        setCombatLog(log => [...log, {
          id: Date.now() + Math.random(),
          type: 'me',
          text: `Você atacou ${OPPONENT.name} causando ${dmg} de dano!`,
        }])
        if (next <= 0) {
          clearInterval(id)
          setWinner('me')
          setXpDelta(rnd(50, 150))
          setTimeout(() => setPhase('result'), 700)
          return
        }
      } else {
        const next = Math.max(0, myHPRef.current - dmg)
        myHPRef.current = next
        setMyHP(next)
        setCombatLog(log => [...log, {
          id: Date.now() + Math.random(),
          type: 'opponent',
          text: `${OPPONENT.name} atacou você causando ${dmg} de dano!`,
        }])
        if (next <= 0) {
          clearInterval(id)
          setWinner('opponent')
          setXpDelta(rnd(50, 150))
          setTimeout(() => setPhase('result'), 700)
          return
        }
      }
      myTurn = !myTurn
    }, 1500)

    return () => clearInterval(id)
  }, [phase])

  /* ── Reset ── */
  function restart() {
    myHPRef.current  = MAX_HP
    oppHPRef.current = MAX_HP
    setMyHP(MAX_HP)
    setOppHP(MAX_HP)
    setCombatLog([])
    setWinner(null)
    setXpDelta(0)
    setPhase('initial')
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#010208', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>
        <AnimatePresence mode="wait">

          {/* ════════════ STATE 1 — INITIAL ════════════ */}
          {phase === 'initial' && (
            <PhaseWrap k="initial">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 10, width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <ArrowLeft size={18} color="rgba(255,255,255,0.7)" />
                </button>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
                    Arena PvP
                  </h1>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: '4px 0 0' }}>
                    Batalha 1v1
                  </p>
                </div>
              </div>

              {/* Main card */}
              <div style={{
                ...CARD,
                background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(109,40,217,0.06) 100%)',
                border: '1px solid rgba(168,85,247,0.22)',
                marginBottom: 12, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', right: -40, top: -40,
                  width: 180, height: 180,
                  background: `radial-gradient(circle, ${PUR}22 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                    background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                  }}>⚔️</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Combate PvP</div>
                    <div style={{ fontSize: 12, color: PUR, fontWeight: 600, marginTop: 2 }}>
                      Modo classificatório ativo
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                  Use seus 8 stats para batalhar contra outros jogadores e subir no ranking.
                </p>
              </div>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
                {[
                  { icon: <Trophy size={16} color={NEON} />, label: 'Matchmaking por Rank',    bg: 'rgba(204,255,0,0.08)',   border: 'rgba(204,255,0,0.18)'    },
                  { icon: <Zap size={16} color={PUR} />,    label: 'Combate Estratégico',      bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.18)'   },
                  { icon: <Target size={16} color={RED} />, label: 'Apostas de XP',            bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)'    },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: f.bg, border: `1px solid ${f.border}`,
                    borderRadius: 12, padding: '12px 8px', textAlign: 'center',
                  }}>
                    <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('searching')}
                style={{
                  width: '100%', padding: '15px 0', borderRadius: 14,
                  background: `linear-gradient(135deg, ${PUR}, #7C3AED)`,
                  border: 'none', color: '#fff', fontWeight: 900,
                  fontSize: 15, letterSpacing: '0.04em', cursor: 'pointer',
                  boxShadow: '0 0 28px rgba(168,85,247,0.4)',
                  marginBottom: 16,
                }}
              >
                ⚔️ Procurar Adversário
              </motion.button>

              {/* Stats card */}
              <div style={CARD}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#fff',
                  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>🧬</span> Seus Stats de Combate
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {MY_STATS.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: '8px 10px',
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: PUR, lineHeight: 1.2 }}>
                          {s.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PhaseWrap>
          )}

          {/* ════════════ STATE 2 — SEARCHING ════════════ */}
          {phase === 'searching' && (
            <PhaseWrap k="searching">
              <div style={{
                minHeight: '70vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '0 20px',
              }}>
                <SearchSpinner />
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 10 }}
                >
                  Procurando Adversário<Dots />
                </motion.div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
                  Analisando jogadores do seu rank
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: PUR }}
                    />
                  ))}
                </div>
              </div>
            </PhaseWrap>
          )}

          {/* ════════════ STATE 3 — BATTLE ════════════ */}
          {phase === 'battle' && (
            <PhaseWrap k="battle">
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: PUR, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Batalha em andamento
                </div>
              </div>

              {/* Fighters */}
              <div style={{
                ...CARD,
                display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
                position: 'relative',
              }}>
                <Fighter name="Você" level={2} hp={myHP} isMe />

                {/* VS badge */}
                <div style={{
                  flexShrink: 0, width: 36, height: 36,
                  borderRadius: '50%', marginTop: 20,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.45)',
                }}>VS</div>

                <Fighter name={OPPONENT.name} level={OPPONENT.level} hp={oppHP} isMe={false} />
              </div>

              {/* Combat log */}
              <div style={{ marginBottom: 4 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.32)',
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
                }}>
                  Log de Combate
                </div>
                <CombatLog entries={combatLog} />
              </div>
            </PhaseWrap>
          )}

          {/* ════════════ STATE 4 — RESULT ════════════ */}
          {phase === 'result' && (
            <PhaseWrap k="result">
              <div style={{
                minHeight: '70vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '0 20px',
              }}>
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                  style={{
                    width: 90, height: 90, borderRadius: '50%', marginBottom: 24,
                    background: winner === 'me'
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(239,68,68,0.15)',
                    border: `2px solid ${winner === 'me' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                    boxShadow: winner === 'me'
                      ? '0 0 40px rgba(16,185,129,0.3)'
                      : '0 0 40px rgba(239,68,68,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {winner === 'me'
                    ? <Trophy size={38} color={GREEN} />
                    : <Shield size={38} color={RED} />
                  }
                </motion.div>

                {/* Result text */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div style={{
                    fontSize: 34, fontWeight: 900, letterSpacing: '-0.01em',
                    color: winner === 'me' ? GREEN : RED,
                    marginBottom: 8,
                  }}>
                    {winner === 'me' ? 'VITÓRIA!' : 'DERROTA'}
                  </div>
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 600 }}>
                    {winner === 'me'
                      ? `Você ganhou ${xpDelta} XP!`
                      : `Você perdeu ${xpDelta} XP`
                    }
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 40 }}>
                    {winner === 'me'
                      ? `${OPPONENT.name} foi derrotado em batalha.`
                      : `${OPPONENT.name} venceu este combate.`
                    }
                  </div>
                </motion.div>

                {/* XP badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: winner === 'me' ? 'rgba(204,255,0,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${winner === 'me' ? 'rgba(204,255,0,0.22)' : 'rgba(239,68,68,0.22)'}`,
                    borderRadius: 20, padding: '6px 16px',
                    fontSize: 13, fontWeight: 800,
                    color: winner === 'me' ? NEON : RED,
                    marginBottom: 40,
                  }}
                >
                  {winner === 'me' ? `+${xpDelta} XP` : `-${xpDelta} XP`}
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <button
                    onClick={restart}
                    style={{
                      width: '100%', padding: '15px 0', borderRadius: 14,
                      background: `linear-gradient(135deg, ${PUR}, #7C3AED)`,
                      border: 'none', color: '#fff', fontWeight: 900,
                      fontSize: 15, cursor: 'pointer',
                      boxShadow: '0 0 24px rgba(168,85,247,0.38)',
                    }}
                  >
                    ⚔️ Jogar Novamente
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      width: '100%', padding: '14px 0', borderRadius: 14,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)', fontWeight: 700,
                      fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    Voltar ao Dashboard
                  </button>
                </motion.div>
              </div>
            </PhaseWrap>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}
