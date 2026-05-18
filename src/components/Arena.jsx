import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Trophy, Shield, Zap, Target,
  Swords, Skull, Heart, Brain, Eye, Dumbbell, Droplets, MessageCircle,
} from 'lucide-react'
import BottomNav from './BottomNav'
import { ATTRIBUTE_KEYS, ATTRIBUTE_META, getEmptyAttributes } from '../lib/userStats'
import { useUserData } from '../hooks/useUserData'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'
const RED   = '#EF4444'
const GOLD  = '#F59E0B'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const STAT_ICONS = {
  forca:        Dumbbell,
  vitalidade:   Heart,
  inteligencia: Brain,
  disciplina:   Target,
  agilidade:    Zap,
  foco:         Eye,
  carisma:      MessageCircle,
  hidratacao:   Droplets,
}

const OPPONENT = { name: 'DarkWolf', level: 3 }
const MAX_HP   = 100

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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
          position: 'absolute', inset: 22, borderRadius: '50%',
          background: `radial-gradient(circle, ${PUR}44 0%, transparent 70%)`,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Swords size={24} color={PUR} />
      </div>
    </div>
  )
}

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

function HPBar({ hp, color }) {
  const pct = Math.max(0, (hp / MAX_HP) * 100)
  return (
    <div style={{ height: 5, background: '#222222', borderRadius: 99, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: color }}
      />
    </div>
  )
}

function Fighter({ name, level, hp, isMe }) {
  const color = isMe ? GREEN : RED

  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <motion.div
        animate={hp < MAX_HP * 0.3 ? { x: [0, -3, 3, -3, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          width: 52, height: 52, borderRadius: '50%', margin: '0 auto 8px',
          background: isMe ? '#0d1a14' : '#1a0d0d',
          border: `2px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isMe
          ? <Swords size={22} color={GREEN} />
          : <Skull  size={22} color={RED} />
        }
      </motion.div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 1 }}>{name}</div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>Lv. {level}</div>
      <HPBar hp={hp} color={color} />
      <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{hp}/{MAX_HP} HP</div>
    </div>
  )
}

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
        background: '#0a0a0a',
        border: '1px solid #1e1e1e',
        borderRadius: 10, padding: '10px 14px',
        scrollbarWidth: 'none',
      }}
    >
      {entries.length === 0 && (
        <div style={{ fontSize: 12, color: MUTED, textAlign: 'center', padding: '8px 0' }}>
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

export default function Arena() {
  const navigate   = useNavigate()
  const { stats }  = useUserData()
  const userAttrs  = stats || getEmptyAttributes()

  const [phase,     setPhase]     = useState('initial')
  const [myHP,      setMyHP]      = useState(MAX_HP)
  const [oppHP,     setOppHP]     = useState(MAX_HP)
  const [combatLog, setCombatLog] = useState([])
  const [winner,    setWinner]    = useState(null)
  const [xpDelta,   setXpDelta]   = useState(0)

  const myHPRef  = useRef(MAX_HP)
  const oppHPRef = useRef(MAX_HP)

  useEffect(() => {
    if (phase !== 'searching') return
    const t = setTimeout(() => setPhase('battle'), 3000)
    return () => clearTimeout(t)
  }, [phase])

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
          id: Date.now() + Math.random(), type: 'me',
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
          id: Date.now() + Math.random(), type: 'opponent',
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
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>
        <AnimatePresence mode="wait">

          {/* STATE 1 — INITIAL */}
          {phase === 'initial' && (
            <PhaseWrap k="initial">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: '#1a1a1a', border: '1px solid #222222',
                    borderRadius: 10, width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <ArrowLeft size={18} color={MUTED} />
                </button>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
                    Arena PvP
                  </h1>
                  <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>
                    Batalha 1v1
                  </p>
                </div>
              </div>

              {/* Main card */}
              <div style={{
                ...CARD,
                background: '#131025',
                border: `1px solid ${PUR}33`,
                marginBottom: 10, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', right: -40, top: -40,
                  width: 180, height: 180,
                  background: `radial-gradient(circle, ${PUR}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: '#1a1a2e', border: `1px solid ${PUR}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Swords size={22} color={PUR} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Combate PvP</div>
                    <div style={{ fontSize: 12, color: PUR, fontWeight: 600, marginTop: 2 }}>
                      Modo classificatório ativo
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }}>
                  Use seus 8 stats para batalhar contra outros jogadores e subir no ranking.
                </p>
              </div>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { icon: <Trophy size={16} color={GOLD} />,   label: 'Matchmaking por Rank',  bg: '#1a160a', border: `${GOLD}22` },
                  { icon: <Zap    size={16} color={PUR} />,    label: 'Combate Estratégico',    bg: '#1a1a2e', border: `${PUR}22` },
                  { icon: <Target size={16} color={RED} />,    label: 'Apostas de XP',          bg: '#1a0d0d', border: `${RED}22` },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: f.bg, border: `1px solid ${f.border}`,
                    borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                  }}>
                    <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, lineHeight: 1.4 }}>
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
                  width: '100%', padding: '15px 0', borderRadius: 12,
                  background: PUR,
                  border: 'none', color: '#fff', fontWeight: 900,
                  fontSize: 15, letterSpacing: '0.04em', cursor: 'pointer',
                  marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Swords size={18} /> Procurar Adversário
              </motion.button>

              {/* Stats card */}
              <div style={CARD}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#fff',
                  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Zap size={15} color={PUR} /> Seus Stats de Combate
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {ATTRIBUTE_KEYS.map(key => {
                    const { label, color } = ATTRIBUTE_META[key]
                    const Icon  = STAT_ICONS[key]
                    const value = userAttrs[key]
                    return (
                      <div key={key} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#0f0f0f', border: '1px solid #1e1e1e',
                        borderRadius: 8, padding: '8px 10px',
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7, background: `${color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon size={14} color={color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {label}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                            {value}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </PhaseWrap>
          )}

          {/* STATE 2 — SEARCHING */}
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
                <div style={{ fontSize: 13, color: MUTED }}>
                  Analisando jogadores do seu rank
                </div>

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

          {/* STATE 3 — BATTLE */}
          {phase === 'battle' && (
            <PhaseWrap k="battle">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: PUR, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Batalha em andamento
                </div>
              </div>

              <div style={{
                ...CARD,
                display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
              }}>
                <Fighter name="Você" level={1} hp={myHP} isMe />
                <div style={{
                  flexShrink: 0, width: 34, height: 34,
                  borderRadius: '50%', marginTop: 20,
                  background: '#1a1a1a', border: '1px solid #222',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: MUTED,
                }}>VS</div>
                <Fighter name={OPPONENT.name} level={OPPONENT.level} hp={oppHP} isMe={false} />
              </div>

              <div style={{ marginBottom: 4 }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: MUTED,
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
                }}>
                  Log de Combate
                </div>
                <CombatLog entries={combatLog} />
              </div>
            </PhaseWrap>
          )}

          {/* STATE 4 — RESULT */}
          {phase === 'result' && (
            <PhaseWrap k="result">
              <div style={{
                minHeight: '70vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '0 20px',
              }}>
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                  style={{
                    width: 88, height: 88, borderRadius: '50%', marginBottom: 24,
                    background: winner === 'me' ? '#0d1a14' : '#1a0d0d',
                    border: `2px solid ${winner === 'me' ? GREEN + '44' : RED + '44'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {winner === 'me'
                    ? <Trophy size={38} color={GREEN} />
                    : <Shield size={38} color={RED} />
                  }
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div style={{
                    fontSize: 34, fontWeight: 900, letterSpacing: '-0.01em',
                    color: winner === 'me' ? GREEN : RED, marginBottom: 8,
                  }}>
                    {winner === 'me' ? 'VITÓRIA!' : 'DERROTA'}
                  </div>
                  <div style={{ fontSize: 16, color: '#fff', marginBottom: 6, fontWeight: 700 }}>
                    {winner === 'me'
                      ? `Você ganhou ${xpDelta} XP!`
                      : `Você perdeu ${xpDelta} XP`
                    }
                  </div>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 40 }}>
                    {winner === 'me'
                      ? `${OPPONENT.name} foi derrotado em batalha.`
                      : `${OPPONENT.name} venceu este combate.`
                    }
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: winner === 'me' ? '#1a1a2e' : '#1a0d0d',
                    border: `1px solid ${winner === 'me' ? PUR + '44' : RED + '44'}`,
                    borderRadius: 20, padding: '6px 16px',
                    fontSize: 13, fontWeight: 800,
                    color: winner === 'me' ? PUR : RED,
                    marginBottom: 40,
                  }}
                >
                  {winner === 'me' ? `+${xpDelta} XP` : `-${xpDelta} XP`}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <button
                    onClick={restart}
                    style={{
                      width: '100%', padding: '15px 0', borderRadius: 12,
                      background: PUR, border: 'none', color: '#fff', fontWeight: 900,
                      fontSize: 15, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <Swords size={17} /> Jogar Novamente
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      width: '100%', padding: '14px 0', borderRadius: 12,
                      background: '#1a1a1a', border: '1px solid #222222',
                      color: MUTED, fontWeight: 700, fontSize: 14, cursor: 'pointer',
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
