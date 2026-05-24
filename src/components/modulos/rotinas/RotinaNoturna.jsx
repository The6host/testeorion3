import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Droplets, Star, Clock, CheckCircle2 } from 'lucide-react'
import BottomNav from '../../BottomNav'
import { fetchRoutinesByModule, fetchRoutineSteps, completeRoutine } from '../../../lib/userData'
import { useUserDataContext } from '../../../context/UserDataContext'

const ROUTINE_NAME = 'Rotina Noturna de Regeneração'

const BLUE  = '#3B82F6'
const MUTED = '#888888'
const GREEN = '#10B981'

const BTN_ICON = {
  background: '#1a1a1a', border: '1px solid #222222',
  borderRadius: 10, width: 38, height: 38, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
}

const LEVEL_COLORS = {
  Iniciante:     { color: '#10B981', bg: '#052e16', border: '#10B98133' },
  Intermediário: { color: '#F59E0B', bg: '#1a1200', border: '#F59E0B33' },
  Avançado:      { color: '#EF4444', bg: '#1a0808', border: '#EF444433' },
}

export default function RotinaNoturna() {
  const navigate = useNavigate()
  const { reload } = useUserDataContext()

  const [isFav,      setIsFav]      = useState(false)
  const [routine,    setRoutine]    = useState(null)
  const [steps,      setSteps]      = useState([])
  const [checked,    setChecked]    = useState(new Set())
  const [done,       setDone]       = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetchRoutinesByModule('skincare').then(routines => {
      const found = routines.find(r => r.name === ROUTINE_NAME)
      if (!found) return
      setRoutine(found)
      fetchRoutineSteps(found.id).then(setSteps)
    })
  }, [])

  function toggleStep(id) {
    if (done) return
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleComplete() {
    if (!allDone || completing || done || !routine) return
    setCompleting(true)
    await completeRoutine(routine)
    await reload()
    setDone(true)
    setCompleting(false)
  }

  const allDone  = steps.length > 0 && checked.size === steps.length
  const progress = steps.length > 0 ? Math.round((checked.size / steps.length) * 100) : 0
  const lvl      = routine ? (LEVEL_COLORS[routine.difficulty] || LEVEL_COLORS['Iniciante']) : LEVEL_COLORS['Iniciante']

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
        >
          <button onClick={() => navigate('/modulos/aparencia/skincare')} style={BTN_ICON}>
            <ArrowLeft size={18} color={MUTED} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#0a0f1e', border: `1px solid ${BLUE}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Droplets size={18} color={BLUE} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{routine?.name ?? ROUTINE_NAME}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{routine ? `${routine.duration_minutes} min` : '...'}</div>
          </div>
          <button onClick={() => setIsFav(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}>
            <Star size={22} color={isFav ? '#F59E0B' : MUTED} fill={isFav ? '#F59E0B' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.07 }}
          style={{ background: '#111111', border: '1px solid #222222', borderRadius: 14, padding: 16, marginBottom: 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: lvl.color,
              background: lvl.bg, border: `1px solid ${lvl.border}`,
              borderRadius: 20, padding: '4px 12px',
            }}>
              {routine?.difficulty ?? '...'}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 700, color: MUTED,
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 20, padding: '4px 10px',
            }}>
              <Clock size={11} color={MUTED} />{routine ? `${routine.duration_minutes} min` : '...'}
            </span>
            <span style={{
              fontSize: 13, fontWeight: 900, color: BLUE,
              background: '#0a0f1e', border: `1px solid ${BLUE}33`,
              borderRadius: 20, padding: '4px 12px', marginLeft: 'auto',
            }}>
              +{routine?.xp_value ?? '...'} pontos
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{checked.size}/{steps.length} passos</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>{progress}%</span>
          </div>
          <div style={{ height: 5, background: '#1e1e1e', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 99, background: GREEN, minWidth: progress > 0 ? 4 : 0 }}
            />
          </div>
        </motion.div>

        {/* Benefits */}
        {routine?.benefits?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            style={{ background: '#111111', border: '1px solid #222222', borderRadius: 14, padding: 16, marginBottom: 14 }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Benefícios
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {routine.benefits.map(b => (
                <span key={b} style={{
                  fontSize: 11, fontWeight: 700, color: GREEN,
                  background: '#052e16', border: '1px solid #10B98133',
                  borderRadius: 20, padding: '4px 12px',
                }}>
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.17 }}
            style={{ background: '#111111', border: '1px solid #222222', borderRadius: 14, padding: 16, marginBottom: 16 }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Passos
            </div>
            {steps.map((step, i) => {
              const isChecked = checked.has(step.id)
              return (
                <motion.button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  whileHover={!done ? { scale: 1.01 } : {}}
                  whileTap={!done ? { scale: 0.99 } : {}}
                  style={{
                    width: '100%', background: isChecked ? '#052e16' : '#0f0f0f',
                    border: `1px solid ${isChecked ? '#10B98133' : '#1e1e1e'}`,
                    borderRadius: 10, padding: '12px 14px',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    cursor: done ? 'default' : 'pointer', textAlign: 'left',
                    marginBottom: 8, transition: 'all 0.25s',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: isChecked ? '#10B98122' : '#1a1a1a',
                    border: `1px solid ${isChecked ? '#10B98133' : '#2a2a2a'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                  }}>
                    {isChecked
                      ? <CheckCircle2 size={16} color={GREEN} />
                      : <span style={{ fontSize: 11, fontWeight: 800, color: MUTED }}>{i + 1}</span>
                    }
                  </div>
                  <div style={{
                    flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.5,
                    color: isChecked ? MUTED : '#fff',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    textDecorationColor: '#444',
                    marginTop: 4, transition: 'all 0.2s',
                  }}>
                    {step.description}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {/* Complete button */}
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#052e16', border: '1px solid #10B98133', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 15, fontWeight: 900, color: GREEN, marginBottom: 4 }}>Rotina Concluída!</div>
              <div style={{ fontSize: 12, color: MUTED }}>+{routine?.xp_value} pontos adicionados ao seu perfil</div>
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              onClick={handleComplete}
              whileHover={allDone ? { scale: 1.02 } : {}}
              whileTap={allDone ? { scale: 0.97 } : {}}
              style={{
                width: '100%', padding: '15px 0', borderRadius: 12, border: 'none',
                background: allDone ? GREEN : '#1a1a1a',
                color: allDone ? '#fff' : '#333',
                fontWeight: 800, fontSize: 15,
                cursor: allDone && !completing ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
              }}
            >
              {completing ? 'Salvando...' : `✓ Concluir Rotina (+${routine?.xp_value ?? '...'} pts)`}
            </motion.button>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
