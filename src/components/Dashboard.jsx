import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell, LogOut, ChevronRight,
  Target, Trophy, Activity, Clock,
  Flame, Zap, BookOpen, Heart, Star,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import BottomNav from './BottomNav'
import RankBadge from './RankBadge'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const DIM   = '#444444'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}
const ICON_BTN = {
  background: '#1a1a1a', border: '1px solid #222',
  borderRadius: 8, width: 34, height: 34,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
}
const LABEL = { fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }

/* ── Mock ── */
const MOCK = {
  username: 'Kauê Vinícius',
  level: 1, xp: 0, xpNext: 500, streak: 0, dailyPts: 0,
}

const STATS = [
  { label: 'TASKS HOJE',    value: '0/0',   delta: '', Icon: Target   },
  { label: 'PONTOS TOTAIS', value: '0',     delta: '', Icon: Trophy   },
  { label: 'KM CORRIDOS',   value: '0,0',   delta: '', Icon: Activity },
  { label: 'TEMPO ATIVO',   value: '0h 0m', delta: '', Icon: Clock    },
]

const TASKS = []

function getInitials(email) {
  if (!email) return 'U'
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/)
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : local.slice(0, 2).toUpperCase()
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
})

/* ══ HEADER ══ */
function AppHeader({ email, onLogout }) {
  const xpPct = (MOCK.xp / MOCK.xpNext) * 100
  return (
    <div style={{
      position: 'fixed', top: 0, zIndex: 50,
      left: 'max(0px, calc(50% - 195px))',
      right: 'max(0px, calc(50% - 195px))',
      background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1a1a1a', padding: '12px 20px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: PUR, border: `2px solid ${PUR}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 900, color: '#fff',
        }}>
          {getInitials(email)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {MOCK.username}
          </div>
          <div style={{ marginTop: 3 }}>
            <RankBadge totalXP={0} size="sm" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button style={ICON_BTN}><Bell size={15} color={MUTED} /></button>
          <button style={ICON_BTN} onClick={onLogout}><LogOut size={15} color={MUTED} /></button>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={LABEL}>NÍVEL {MOCK.level}</span>
          <span style={{ ...LABEL, color: PUR }}>{MOCK.xp}/{MOCK.xpNext} XP</span>
        </div>
        <div style={{ height: 4, background: '#222', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ height: '100%', borderRadius: 99, background: PUR }}
          />
        </div>
      </div>
    </div>
  )
}

/* ══ STREAK CARD ══ */
function StreakCard() {
  return (
    <motion.div {...fadeUp(0.08)} style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Flame size={20} color={PUR} />
          </div>
          <div>
            <div style={LABEL}>STREAK ATUAL</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
              {MOCK.streak} <span style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>dias</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={LABEL}>PONTOS HOJE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>+{MOCK.dailyPts}</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ══ CHARACTER CARD ══ */
function CharacterCard() {
  const navigate = useNavigate()
  return (
    <motion.div {...fadeUp(0.14)} style={{ ...CARD, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: -40, top: -40, width: 160, height: 160,
        background: `radial-gradient(circle, ${PUR}18 0%, transparent 70%)`, pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#1a1a2e', border: `1px solid ${PUR}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Star size={20} color={PUR} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Seu Personagem</div>
          <div style={{ fontSize: 11, color: PUR, fontWeight: 600 }}>Level {MOCK.level}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 12 }}>
        Veja a evolução visual do seu avatar, seus atributos RPG e conquistas desbloqueadas.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => navigate('/character')}
          style={{
            flex: 1, padding: '9px 0', background: '#1a1a2e', border: `1px solid ${PUR}33`,
            borderRadius: 8, color: PUR, fontWeight: 700, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
        >
          Ver Detalhes <ChevronRight size={14} />
        </button>
        {['20 Evoluções', 'Sistema RPG'].map(t => (
          <div key={t} style={{
            padding: '8px 10px', background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: 8, fontSize: 11, fontWeight: 600, color: MUTED, whiteSpace: 'nowrap', cursor: 'pointer',
          }}>{t}</div>
        ))}
      </div>
    </motion.div>
  )
}

/* ══ STATS 2×2 ══ */
function StatsGrid() {
  return (
    <motion.div {...fadeUp(0.20)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {STATS.map((s, i) => (
        <div key={i} style={{ ...CARD, padding: '14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={LABEL}>{s.label}</div>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.Icon size={14} color={PUR} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 11, color: DIM }}>{s.delta}</div>
        </div>
      ))}
    </motion.div>
  )
}

/* ══ MODULES ══ */
function FavoriteModules() {
  const navigate = useNavigate()
  return (
    <motion.div {...fadeUp(0.26)} style={CARD}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Módulos Favoritos</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '4px 0' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={18} color={PUR} />
        </div>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Nenhum módulo favorito ainda</p>
        <button
          onClick={() => navigate('/modulos')}
          style={{
            marginTop: 2, padding: '9px 24px', background: '#1a1a2e',
            border: `1px solid ${PUR}33`, borderRadius: 8,
            color: PUR, fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >Explorar Módulos</button>
      </div>
    </motion.div>
  )
}

/* ══ TASKS TODAY ══ */
function TasksToday() {
  return (
    <motion.div {...fadeUp(0.32)} style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Tasks de Hoje</div>
        <button style={{ fontSize: 12, color: PUR, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Ver todas
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TASKS.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: MUTED }}>
            Nenhuma task ainda
          </div>
        )}
        {TASKS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.34 + i * 0.06 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 10,
              opacity: t.done ? 0.5 : 1,
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <t.Icon size={14} color={PUR} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, textDecoration: t.done ? 'line-through' : 'none', textDecorationColor: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{t.category}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700, flexShrink: 0,
              color: t.done ? DIM : PUR,
              background: t.done ? '#1a1a1a' : '#1a1a2e',
              border: `1px solid ${t.done ? '#2a2a2a' : PUR + '33'}`,
              borderRadius: 6, padding: '3px 8px',
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

/* ══ ROOT ══ */
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
      <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.img
          src="https://i.imgur.com/FwQdsn4.png"
          alt="Orion"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ height: 36, opacity: 0.5 }}
        />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}
    >
      <AppHeader email={user?.email} onLogout={handleLogout} />
      <div style={{ paddingTop: 96, paddingBottom: 80 }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <StreakCard />
          <CharacterCard />
          <StatsGrid />
          <FavoriteModules />
          <TasksToday />
        </div>
      </div>
      <BottomNav />
    </motion.div>
  )
}
