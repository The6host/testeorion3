import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronRight, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR        = '#A855F7'
const NEON       = '#ccff00'
const CARD_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
}
const CHIP_STYLE = {
  padding: '8px 10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  fontSize: 11, fontWeight: 600,
  color: 'rgba(255,255,255,0.55)',
  whiteSpace: 'nowrap', cursor: 'pointer',
}
const ICON_BTN = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}

/* ── Mock data ── */
const MOCK = {
  username:  'Kauê Vinícius',
  tier:      'Iniciante II',
  tierCode:  'T2',
  level:     2,
  xp:        435,
  xpNext:    500,
  streak:    7,
  dailyPts:  120,
}

const STATS = [
  { label: 'Tasks Hoje',    value: '7/9',   delta: '+2 vs ontem',  color: PUR       },
  { label: 'Pontos Totais', value: '2.840', delta: '+120 hoje',    color: NEON      },
  { label: 'KM Corridos',   value: '12,4',  delta: '+3,2 hoje',    color: '#3B82F6' },
  { label: 'Tempo Ativo',   value: '3h 20m',delta: '+45min hoje',  color: '#10B981' },
]

const TASKS = [
  { id: 1, name: 'Treino de Força',  category: 'Físico',        xp: 80,  emoji: '💪', done: false },
  { id: 2, name: 'Leitura 30min',    category: 'Mental',        xp: 50,  emoji: '📚', done: true  },
  { id: 3, name: 'Meditação',        category: 'Saúde',         xp: 40,  emoji: '🧘', done: false },
  { id: 4, name: 'Revisão de Metas', category: 'Produtividade', xp: 60,  emoji: '🎯', done: false },
  { id: 5, name: 'Corrida 5km',      category: 'Físico',        xp: 100, emoji: '🏃', done: true  },
]

/* ── Helpers ── */
function getInitials(email) {
  if (!email) return 'U'
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
})

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
function AppHeader({ email, onLogout }) {
  const initials = getInitials(email)
  const xpPct    = (MOCK.xp / MOCK.xpNext) * 100

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(1,2,8,0.94)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 20px 10px',
    }}>
      {/* Row 1 — avatar + name + icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${PUR}, #6D28D9)`,
          border: '2px solid rgba(168,85,247,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900, color: '#fff',
        }}>
          {initials}
        </div>

        {/* Name + tier */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {MOCK.username}
          </div>
          <div style={{ fontSize: 11, color: PUR, fontWeight: 600, marginTop: 1 }}>
            {MOCK.tier} · {MOCK.tierCode}
          </div>
        </div>

        {/* Notification + settings */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={ICON_BTN}><Bell size={16} color="rgba(255,255,255,0.5)" /></button>
          <button style={ICON_BTN} onClick={onLogout} title="Sair">
            <LogOut size={16} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
      </div>

      {/* Row 2 — XP bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.38)', marginBottom: 5 }}>
          <span>Nível {MOCK.level} — XP</span>
          <span>{MOCK.xp} / {MOCK.xpNext} XP</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{
              height: '100%', borderRadius: 99,
              background: `linear-gradient(90deg, ${PUR}, #C084FC)`,
              boxShadow: '0 0 8px rgba(168,85,247,0.55)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STREAK CARD
══════════════════════════════════════ */
function StreakCard() {
  return (
    <motion.div {...fadeUp(0.08)} style={CARD_STYLE}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left — streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32, lineHeight: 1 }}>🔥</span>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Streak Atual</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {MOCK.streak} <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>dias</span>
            </div>
          </div>
        </div>

        {/* Right — daily points + badge */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Pontos hoje</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: NEON, lineHeight: 1, marginBottom: 6 }}>
            +{MOCK.dailyPts}
          </div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(168,85,247,0.14)',
            border: '1px solid rgba(168,85,247,0.28)',
            borderRadius: 20, padding: '3px 10px',
            fontSize: 11, fontWeight: 700, color: PUR,
          }}>
            {MOCK.tier}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   CHARACTER CARD
══════════════════════════════════════ */
function CharacterCard() {
  return (
    <motion.div {...fadeUp(0.15)} style={{ ...CARD_STYLE, position: 'relative', overflow: 'hidden' }}>
      {/* Purple halo */}
      <div style={{
        position: 'absolute', right: -50, top: -50,
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(109,40,217,0.15))',
          border: '1px solid rgba(168,85,247,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>⚔️</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Seu Personagem</div>
          <div style={{ fontSize: 12, color: PUR, fontWeight: 600 }}>
            Level {MOCK.level} · {MOCK.tierCode}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, marginBottom: 14 }}>
        Veja a evolução visual do seu avatar, seus atributos RPG e conquistas desbloqueadas.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{
          flex: 1, padding: '10px 0',
          background: 'rgba(168,85,247,0.12)',
          border: '1px solid rgba(168,85,247,0.25)',
          borderRadius: 10, color: PUR, fontWeight: 700, fontSize: 13,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          Ver Detalhes <ChevronRight size={14} />
        </button>
        <div style={CHIP_STYLE}>🏆 20 Evoluções</div>
        <div style={CHIP_STYLE}>🎮 Sistema RPG</div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   STATS 2×2
══════════════════════════════════════ */
function StatsGrid() {
  return (
    <motion.div {...fadeUp(0.22)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.24 + i * 0.06 }}
          style={{ ...CARD_STYLE, padding: '14px 16px' }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)' }}>{s.delta}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ══════════════════════════════════════
   FAVORITE MODULES
══════════════════════════════════════ */
function FavoriteModules() {
  return (
    <motion.div {...fadeUp(0.30)} style={CARD_STYLE}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
        Módulos Favoritos
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 4px' }}>
        <span style={{ fontSize: 30 }}>⭐</span>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, textAlign: 'center' }}>
          Nenhum módulo favorito ainda
        </p>
        <button style={{
          marginTop: 2, padding: '10px 28px',
          background: 'rgba(168,85,247,0.1)',
          border: '1px solid rgba(168,85,247,0.22)',
          borderRadius: 10, color: PUR,
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>
          Explorar Módulos
        </button>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   TASKS DE HOJE
══════════════════════════════════════ */
function TasksToday() {
  return (
    <motion.div {...fadeUp(0.36)} style={CARD_STYLE}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Tasks de Hoje</div>
        <button style={{ fontSize: 12, color: PUR, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Ver todas
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TASKS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.38 + i * 0.07 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: t.done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.done ? 'rgba(16,185,129,0.13)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12,
              opacity: t.done ? 0.58 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }}>{t.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2,
                textDecoration: t.done ? 'line-through' : 'none',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                {t.category}
              </div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 800, flexShrink: 0,
              color:      t.done ? 'rgba(255,255,255,0.25)' : NEON,
              background: t.done ? 'rgba(255,255,255,0.04)' : 'rgba(204,255,0,0.07)',
              border:     `1px solid ${t.done ? 'rgba(255,255,255,0.07)' : 'rgba(204,255,0,0.18)'}`,
              borderRadius: 8, padding: '4px 9px',
              textDecoration: t.done ? 'line-through' : 'none',
            }}>
              +{t.xp} XP
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const [user,  setUser]  = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { navigate('/login'); return }
      setUser(data.user)
      setReady(true)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100dvh', background: '#010208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="https://i.imgur.com/FwQdsn4.png" alt="Orion" style={{ height: 36, opacity: 0.6 }} />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '100dvh', background: '#010208', color: '#fff' }}
    >
      <AppHeader email={user?.email} onLogout={handleLogout} />

      {/* Scrollable content area */}
      <div style={{ paddingTop: 100, paddingBottom: 80, overflowY: 'auto' }}>
        <div style={{
          maxWidth: 520, margin: '0 auto',
          padding: '0 16px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <StreakCard />
          <CharacterCard />
          <StatsGrid />
          <FavoriteModules />
          <TasksToday />
          <div style={{ height: 4 }} />
        </div>
      </div>

      <BottomNav />
    </motion.div>
  )
}
