import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Dumbbell, Star, ChevronDown, ChevronRight,
  CheckCircle2, Circle, Plus, Trash2,
} from 'lucide-react'
import BottomNav from '../BottomNav'
import { useUserData } from '../../hooks/useUserData'
import { getPlanMeta } from '../../lib/workoutPlansMeta'
import {
  fetchWorkoutPlans,
  fetchWorkoutPlanFull,
  fetchTodayExerciseCompletions,
  fetchTodayCompletedDayIds,
  selectWorkoutPlan,
  completeExercise,
  uncompleteExercise,
  completeWorkoutDay,
} from '../../lib/userData'

const MUTED = '#888888'
const GREEN = '#10B981'
const PUR   = '#7C3AED'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const BTN_ICON = {
  background: '#1a1a1a', border: '1px solid #222222',
  borderRadius: 10, width: 38, height: 38, flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
}

/* ── Goal selection (Estado 1) ── */
function GoalSelect({ plans, onSelect }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.07 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}
      >
        <div style={{
          width: 84, height: 84, borderRadius: 22, flexShrink: 0,
          background: '#1a0808', border: '1px solid #EF444433',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <Dumbbell size={42} color='#EF4444' />
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textAlign: 'center' }}>
          Qual é o seu objetivo?
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 6, textAlign: 'center' }}>
          Escolha para receber seu plano personalizado
        </div>
      </motion.div>

      {plans.map((plan, i) => {
        const meta = getPlanMeta(plan.name)
        return (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.14 + i * 0.07 }}
            onClick={() => onSelect(plan)}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            style={{
              ...CARD, width: '100%', border: 'none', outline: '1px solid #222222',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', textAlign: 'left', marginBottom: 10,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 13, flexShrink: 0,
              background: meta.iconBg, border: `1px solid ${meta.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <meta.Icon size={24} color={meta.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{meta.longDescription || plan.description}</div>
            </div>
            <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0 }} />
          </motion.button>
        )
      })}
    </>
  )
}

/* ── Plan header (shared between skeleton and full view) ── */
function PlanHeader({ plan, totalExercises, totalPts }) {
  const meta = getPlanMeta(plan.name)
  return (
    <div style={{
      borderRadius: 14, padding: '20px 18px', marginBottom: 14,
      background: meta.headerBg, border: `1px solid ${meta.headerBorder}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -30, top: -30, width: 130, height: 130,
        background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`, pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, flexShrink: 0,
          background: meta.glowColor, border: `1px solid ${meta.headerBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <meta.Icon size={20} color={meta.color} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{plan.name}</div>
          <div style={{ fontSize: 11, color: meta.color, fontWeight: 600, marginTop: 2 }}>
            Academia · {plan.days_per_week} dias/semana
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'DIAS/SEMANA', value: String(plan.days_per_week) },
          { label: 'EXERCÍCIOS',  value: totalExercises != null ? String(totalExercises) : '...' },
          { label: 'PONTOS',      value: totalPts != null ? String(totalPts) : '...'            },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: meta.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Loading skeleton while fetchWorkoutPlanFull is in-flight ── */
function PlanSkeleton({ basicPlan, onReset }) {
  const dayCount = basicPlan?.days_per_week || 4
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.07 }}
      >
        <PlanHeader plan={basicPlan} totalExercises={null} totalPts={null} />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        onClick={onReset}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: MUTED, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 16, padding: 0,
        }}
      >
        ↺ Escolher Outro Plano
      </motion.button>

      {Array.from({ length: dayCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.45 - i * 0.05, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
          style={{ ...CARD, marginBottom: 8, height: 68 }}
        />
      ))}
    </>
  )
}

/* ── Workout plan view (Estado 2) ── */
function WorkoutPlan({ plan, completedExerciseIds, onToggleExercise, onCompleteDay, onReset }) {
  const [openDay,       setOpenDay]       = useState(null)
  const [completingDay, setCompletingDay] = useState(null)
  const [completedDays, setCompletedDays] = useState(new Set())

  const meta          = getPlanMeta(plan.name)
  const days          = plan.workout_days || []
  const totalExercises = days.reduce((sum, d) => sum + (d.workout_exercises || []).length, 0)
  const completedCount = completedExerciseIds.size
  const totalPts       = completedCount * plan.xp_per_exercise

  useEffect(() => {
    if (days.length === 0) return
    fetchTodayCompletedDayIds(days.map(d => d.id)).then(ids => {
      setCompletedDays(new Set(ids))
    })
  }, [days.length])

  async function handleCompleteDay(day) {
    if (completingDay === day.id) return
    setCompletingDay(day.id)
    await onCompleteDay(day)
    setCompletedDays(prev => new Set([...prev, day.id]))
    setCompletingDay(null)
  }

  return (
    <>
      {/* Plan header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.07 }}
      >
        <PlanHeader plan={plan} totalExercises={totalExercises} totalPts={totalPts} />
      </motion.div>

      {/* Reset link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        onClick={onReset}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: MUTED, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 16, padding: 0,
        }}
      >
        ↺ Escolher Outro Plano
      </motion.button>

      {/* Day accordion */}
      {days.map((d, i) => {
        const exercises  = d.workout_exercises || []
        const isOpen     = openDay === d.id
        const dayChecked = exercises.filter(e => completedExerciseIds.has(e.id)).length
        const allDone    = exercises.length > 0 && dayChecked === exercises.length
        const alreadyDone = completedDays.has(d.id)

        return (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }}
            style={{ ...CARD, marginBottom: 8, padding: 0, overflow: 'hidden' }}
          >
            <button
              onClick={() => setOpenDay(isOpen ? null : d.id)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: allDone ? '#052e16' : '#1a1a1a',
                border: `1px solid ${allDone ? '#10B98144' : '#2a2a2a'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: allDone ? GREEN : MUTED }}>
                  {d.day_label.slice(0, 3)}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{d.day_label}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{d.focus} · {dayChecked}/{exercises.length} feitos</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {dayChecked > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>
                    +{dayChecked * plan.xp_per_exercise} pts
                  </span>
                )}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={16} color={MUTED} />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ borderTop: '1px solid #1e1e1e', padding: '8px 16px 14px' }}>
                    {exercises.map(ex => {
                      const isDone = completedExerciseIds.has(ex.id)
                      return (
                        <button
                          key={ex.id}
                          onClick={() => onToggleExercise(ex, isDone)}
                          style={{
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 0', borderBottom: '1px solid #1a1a1a', textAlign: 'left',
                          }}
                        >
                          <div style={{ flexShrink: 0 }}>
                            {isDone
                              ? <CheckCircle2 size={20} color={GREEN} />
                              : <Circle size={20} color='#333333' />
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 13, fontWeight: 700, lineHeight: 1.2,
                              color: isDone ? MUTED : '#fff',
                              textDecoration: isDone ? 'line-through' : 'none',
                              textDecorationColor: '#444',
                              transition: 'all 0.2s',
                            }}>
                              {ex.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#444444', marginTop: 2 }}>
                              {ex.config_text}
                            </div>
                          </div>
                          <div style={{
                            fontSize: 11, fontWeight: 700, flexShrink: 0,
                            color: isDone ? GREEN : '#333',
                            background: isDone ? '#052e16' : '#1a1a1a',
                            border: `1px solid ${isDone ? '#10B98133' : '#2a2a2a'}`,
                            borderRadius: 6, padding: '3px 8px',
                            transition: 'all 0.25s',
                          }}>
                            +{plan.xp_per_exercise} pts
                          </div>
                        </button>
                      )
                    })}

                    {/* Complete day button */}
                    <div style={{ marginTop: 12 }}>
                      {alreadyDone ? (
                        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, color: GREEN, padding: '10px 0' }}>
                          ✓ Treino concluído hoje
                        </div>
                      ) : allDone ? (
                        <motion.button
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleCompleteDay(d)}
                          disabled={completingDay === d.id}
                          style={{
                            width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                            background: GREEN, color: '#fff',
                            fontWeight: 800, fontSize: 14,
                            cursor: completingDay === d.id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                          }}
                        >
                          {completingDay === d.id ? 'Salvando...' : `✓ Concluir Treino do Dia (+${plan.xp_bonus_per_day} XP bônus)`}
                        </motion.button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </>
  )
}

/* ── Custom plan (fora do MVP — mantido como stub) ── */
function CustomPlan({ onReset }) {
  const [name,      setName]      = useState('')
  const [exercises, setExercises] = useState([])
  const [newEx,     setNewEx]     = useState('')
  const [showInput, setShowInput] = useState(false)
  const [saved,     setSaved]     = useState(false)

  function addExercise() {
    if (!newEx.trim()) return
    setExercises(prev => [...prev, { id: Date.now(), text: newEx.trim() }])
    setNewEx('')
    setShowInput(false)
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a',
    borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const canSave = name.trim().length > 0 && exercises.length > 0

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onReset}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: MUTED, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 16, padding: 0,
        }}
      >
        ↺ Escolher Outro Plano
      </motion.button>

      <div style={{ ...CARD, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Nome do Treino</div>
        <input
          style={inputStyle}
          placeholder="Ex: Push Day, Leg Day, Treino A…"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div style={{ ...CARD, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: exercises.length > 0 ? 12 : 0 }}>
          Exercícios
        </div>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: '#1a1a2e', border: `1px solid ${PUR}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: PUR,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#fff' }}>{ex.text}</div>
            <button onClick={() => removeExercise(ex.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
              <Trash2 size={14} color='#3a3a3a' />
            </button>
          </div>
        ))}

        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', marginTop: exercises.length > 0 ? 12 : 0 }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  autoFocus
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Nome do exercício…"
                  value={newEx}
                  onChange={e => setNewEx(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addExercise()
                    if (e.key === 'Escape') setShowInput(false)
                  }}
                />
                <button onClick={addExercise} style={{ flexShrink: 0, padding: '0 14px', borderRadius: 10, border: 'none', background: PUR, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  OK
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowInput(v => !v)}
          style={{
            marginTop: 12, width: '100%', padding: '10px 0', borderRadius: 9, border: 'none',
            background: '#1a1a1a', color: MUTED, fontWeight: 700, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Plus size={14} /> Adicionar Exercício
        </button>
      </div>

      <button
        onClick={() => { if (canSave) { setSaved(true); setTimeout(() => setSaved(false), 2500) } }}
        disabled={!canSave}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 10,
          border: saved ? '1px solid #10B98133' : 'none',
          background: saved ? '#052e16' : canSave ? PUR : '#1a1a1a',
          color: saved ? GREEN : canSave ? '#fff' : '#333',
          fontWeight: 800, fontSize: 14,
          cursor: canSave ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
        }}
      >
        {saved ? '✓ Treino Salvo!' : 'Salvar Treino'}
      </button>
    </motion.div>
  )
}

/* ── Root ── */
export default function Academia() {
  const navigate = useNavigate()
  const { profile, reload } = useUserData()

  const [isFav,            setIsFav]            = useState(false)
  const [plans,            setPlans]            = useState([])
  const [currentPlan,      setCurrentPlan]      = useState(null)
  const [todayCompletions, setTodayCompletions] = useState([])
  const [loadingPlan,      setLoadingPlan]      = useState(false)
  const [selectingPlan,    setSelectingPlan]    = useState(false)

  useEffect(() => {
    fetchWorkoutPlans().then(setPlans)
  }, [])

  useEffect(() => {
    if (!profile) return
    if (profile.current_workout_plan_id) {
      setLoadingPlan(true)
      Promise.all([
        fetchWorkoutPlanFull(profile.current_workout_plan_id),
        fetchTodayExerciseCompletions(),
      ]).then(([plan, completions]) => {
        setCurrentPlan(plan)
        setTodayCompletions(completions)
        setLoadingPlan(false)
      })
    } else {
      setCurrentPlan(null)
      setTodayCompletions([])
      setLoadingPlan(false)
    }
  }, [profile?.current_workout_plan_id])

  const completedExerciseIds = new Set(todayCompletions.map(c => c.exercise_id))
  const showGoalSelect       = !profile?.current_workout_plan_id || selectingPlan
  const basicPlan            = plans.find(p => p.id === profile?.current_workout_plan_id) || null

  async function handleSelectPlan(plan) {
    const ok = await selectWorkoutPlan(plan.id)
    if (ok) {
      setSelectingPlan(false)
      await reload()
    }
  }

  function handleReset() {
    setSelectingPlan(true)
  }

  async function handleToggleExercise(exercise, isDone) {
    if (isDone) {
      const result = await uncompleteExercise(exercise.id, currentPlan.xp_per_exercise)
      if (result) {
        setTodayCompletions(prev => prev.filter(c => c.exercise_id !== exercise.id))
      }
    } else {
      const completion = await completeExercise(exercise, currentPlan.xp_per_exercise)
      if (completion) {
        setTodayCompletions(prev => [...prev, completion])
      }
    }
  }

  async function handleCompleteDay(day) {
    await completeWorkoutDay(day.id, currentPlan.xp_bonus_per_day)
    await reload()
  }

  const subtitle = showGoalSelect
    ? 'Exercícios com peso e máquinas'
    : currentPlan
      ? `Academia · ${currentPlan.days_per_week} dias/semana`
      : basicPlan
        ? `Academia · ${basicPlan.days_per_week} dias/semana`
        : 'Exercícios com peso e máquinas'

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}
        >
          <button
            onClick={() => selectingPlan ? setSelectingPlan(false) : navigate('/modulos/treino')}
            style={BTN_ICON}
          >
            <ArrowLeft size={18} color={MUTED} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#1a0808', border: '1px solid #EF444422',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={18} color='#EF4444' />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Academia</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {subtitle}
            </div>
          </div>
          <button
            onClick={() => setIsFav(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}
          >
            <Star size={22} color={isFav ? '#F59E0B' : MUTED} fill={isFav ? '#F59E0B' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {showGoalSelect && (
            <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GoalSelect plans={plans} onSelect={handleSelectPlan} />
            </motion.div>
          )}

          {!showGoalSelect && currentPlan && (
            <motion.div key={currentPlan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <WorkoutPlan
                plan={currentPlan}
                completedExerciseIds={completedExerciseIds}
                onToggleExercise={handleToggleExercise}
                onCompleteDay={handleCompleteDay}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {!showGoalSelect && loadingPlan && !currentPlan && basicPlan && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <PlanSkeleton basicPlan={basicPlan} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
