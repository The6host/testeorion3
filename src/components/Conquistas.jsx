import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useUserDataContext } from '../context/UserDataContext'
import { ACHIEVEMENTS, formatAchievementTitle } from '../lib/achievements'
import { ATTRIBUTE_KEYS, getEmptyAttributes } from '../lib/userStats'

const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'

const GRUPOS = [
  { label: 'STREAK',               filtro: a => a.category === 'streak'                               },
  { label: 'TASKS',                filtro: a => a.category === 'tasks'                                },
  { label: 'ATRIBUTOS',            filtro: a => a.category === 'atributos'                            },
  { label: 'ROTINAS / EXERCÍCIOS', filtro: a => ['rotinas', 'exercicios'].includes(a.category)        },
  { label: 'ESPECIAIS',            filtro: a => a.category === 'especial'                             },
]

function formatUnlockDate(isoString) {
  const d = new Date(isoString)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getProgress(achievement, { lifetimeCounts, profile, stats }) {
  const attrs = stats || getEmptyAttributes()

  switch (achievement.id) {
    case 'streak_3':
    case 'streak_14':
    case 'streak_60':
      return { current: profile?.streak_count || 0, target: achievement.target }

    case 'tasks_10':
    case 'tasks_100':
    case 'tasks_500':
      return { current: lifetimeCounts?.tasksCompleted || 0, target: achievement.target }

    case 'routines_10':
      return { current: lifetimeCounts?.routines || 0, target: achievement.target }

    case 'exercises_50':
    case 'exercises_200':
      return { current: lifetimeCounts?.exercises || 0, target: achievement.target }

    case 'all_attributes_50':
      return { current: ATTRIBUTE_KEYS.filter(k => attrs[k] >= 50).length, target: 8 }

    default:
      return null
  }
}

function AchievementCard({ achievement, userAchievements, userState }) {
  const isRepeatable = achievement.repeatable === true

  const variantsDesbloqueadas = isRepeatable
    ? userAchievements.filter(ua => ua.achievement_id === achievement.id).length
    : 0
  const isPartiallyUnlocked = isRepeatable && variantsDesbloqueadas > 0 && variantsDesbloqueadas < 8
  const isFullyUnlocked     = isRepeatable && variantsDesbloqueadas >= 8
  const isUnlocked          = isRepeatable
    ? variantsDesbloqueadas > 0
    : userAchievements.some(ua => ua.achievement_id === achievement.id)

  const unlockedEntry = !isRepeatable && isUnlocked
    ? userAchievements.find(ua => ua.achievement_id === achievement.id)
    : null

  const progress = !isRepeatable && !isUnlocked
    ? getProgress(achievement, userState)
    : null

  const pct = progress?.target
    ? Math.min(100, Math.round((progress.current / progress.target) * 100))
    : null

  return (
    <div style={{
      background: isUnlocked ? '#0f0f0f' : '#0a0a0a',
      border: `1px solid ${isUnlocked ? PUR + '66' : '#1a1a1a'}`,
      borderRadius: 14, padding: 14,
      display: 'flex', gap: 14,
      opacity: isUnlocked ? 1 : 0.55,
    }}>
      {/* Ícone */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: isUnlocked ? PUR + '22' : '#1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
        filter: isUnlocked ? 'none' : 'grayscale(100%)',
      }}>
        {achievement.icon}
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: isUnlocked ? '#fff' : '#999' }}>
          {achievement.title}
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 1.4 }}>
          {achievement.description}
        </div>
        <div style={{ fontSize: 10, marginTop: 6 }}>
          {!isRepeatable && isUnlocked && unlockedEntry && (
            <span style={{ color: GREEN }}>✓ Desbloqueada em {formatUnlockDate(unlockedEntry.unlocked_at)}</span>
          )}
          {isRepeatable && isFullyUnlocked && (
            <span style={{ color: GREEN }}>✓ Todos 8 atributos</span>
          )}
          {isRepeatable && isPartiallyUnlocked && (
            <span style={{ color: PUR }}>{variantsDesbloqueadas}/8 atributos</span>
          )}
          {isRepeatable && !isUnlocked && (
            <span style={{ color: MUTED }}>0/8 atributos</span>
          )}
          {!isRepeatable && !isUnlocked && progress !== null && (
            <span style={{ color: MUTED }}>{progress.current}/{progress.target}</span>
          )}
          {!isRepeatable && !isUnlocked && progress === null && (
            <span style={{ color: MUTED }}>Bloqueada</span>
          )}
        </div>
      </div>

      {/* Porcentagem (bloqueada não-repeatable com progresso) */}
      {!isRepeatable && !isUnlocked && pct !== null && (
        <div style={{
          width: 40, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: MUTED, opacity: 0.7 }}>
            {pct}%
          </span>
        </div>
      )}
    </div>
  )
}

export default function Conquistas() {
  const navigate = useNavigate()
  const { profile, stats, userAchievements, lifetimeCounts } = useUserDataContext()

  const conquistasDesbloqueadas = new Set(userAchievements.map(ua => ua.achievement_id)).size
  const pctTotal = Math.round((conquistasDesbloqueadas / 15) * 100)

  const userState = {
    lifetimeCounts: lifetimeCounts || { tasksCompleted: 0, routines: 0, exercises: 0 },
    profile,
    stats,
    userAchievements,
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#1a1a1a', border: '1px solid #222',
              borderRadius: 8, width: 34, height: 34, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} color={MUTED} />
          </button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>Conquistas</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Marcos da sua jornada</div>
          </div>
        </div>

        {/* Card de resumo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#0f0f0f', borderRadius: 14, padding: 20,
            border: '1px solid #1a1a1a', marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: PUR, lineHeight: 1 }}>
              {conquistasDesbloqueadas}/15
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Desbloqueadas</div>
              <div style={{ fontSize: 11, color: PUR, fontWeight: 800, marginTop: 2 }}>{pctTotal}%</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 4, borderRadius: 99, background: '#1e1e1e', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctTotal}%` }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ height: '100%', borderRadius: 99, background: PUR }}
            />
          </div>
        </motion.div>

        {/* Lista por grupo */}
        {GRUPOS.map((grupo, gi) => {
          const lista = ACHIEVEMENTS.filter(grupo.filtro)
          return (
            <div key={grupo.label}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: MUTED,
                textTransform: 'uppercase', letterSpacing: 1.5,
                marginTop: gi === 0 ? 16 : 24, marginBottom: 12,
              }}>
                {grupo.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lista.map(a => (
                  <AchievementCard
                    key={a.id}
                    achievement={a}
                    userAchievements={userAchievements}
                    userState={userState}
                  />
                ))}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
