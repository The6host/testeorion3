import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Trash2, Calendar, Zap, Plus, X, Check, Target } from 'lucide-react'
import BottomNav from './BottomNav'
import { useUserDataContext } from '../context/UserDataContext'
import { completeTask, uncompleteTask, deleteTask, createTask } from '../lib/userData'
import { getTodayKey, getLocalDateKey } from '../lib/dailySuggestions'
import { TASK_CATEGORIES, CATEGORY_COLORS } from '../lib/categories'

/* ── Design tokens ── */
const PUR      = '#7C3AED'
const MUTED    = '#888888'
const DIM      = '#444444'
const DAILY_XP = 500
const XP_OPTIONS = [50, 75, 100, 150]

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const LABEL = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: MUTED, textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 8,
}

function isCompletedToday(task) {
  if (!task.completed || !task.completed_at) return false
  return getLocalDateKey(task.completed_at) === getTodayKey()
}

function TaskItem({ task, onToggle, onDelete, isProcessing }) {
  const color    = CATEGORY_COLORS[task.category] || PUR
  const isLocked = task.completed && !isCompletedToday(task)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: task.completed || isProcessing ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', marginBottom: 8,
        background: task.completed ? '#0d1a14' : '#0f0f0f',
        border: `1px solid ${task.completed ? '#1a3325' : '#1e1e1e'}`,
        borderRadius: 10,
      }}
    >
      <button
        onClick={() => onToggle(task)}
        disabled={isProcessing}
        style={{
          width: 24, height: 24, borderRadius: 7, flexShrink: 0,
          border: `2px solid ${task.completed ? '#10B981' : DIM}`,
          background: task.completed ? '#10B981' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isProcessing ? 'not-allowed' : isLocked ? 'not-allowed' : 'pointer',
          opacity: isLocked ? 0.6 : 1,
          transition: 'all 0.2s', padding: 0,
        }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Check size={13} color="#fff" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2,
          textDecoration: task.completed ? 'line-through' : 'none',
          textDecorationColor: DIM,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {task.name}
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{
            display: 'inline-block',
            background: `${color}18`,
            border: `1px solid ${color}38`,
            borderRadius: 6, padding: '1px 8px',
            fontSize: 11, fontWeight: 600, color,
          }}>
            {task.category}
          </span>
        </div>
      </div>

      <div style={{
        fontSize: 12, fontWeight: 800, flexShrink: 0,
        color:      task.completed ? DIM : PUR,
        background: task.completed ? '#1a1a1a' : '#1a1a2e',
        border:     `1px solid ${task.completed ? '#2a2a2a' : PUR + '33'}`,
        borderRadius: 6, padding: '3px 9px',
        textDecoration: task.completed ? 'line-through' : 'none',
      }}>
        +{task.xp_value} XP
      </div>

      <button
        onClick={() => onDelete(task.id)}
        disabled={isProcessing}
        style={{
          background: 'none', border: 'none',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          padding: 4, flexShrink: 0,
          color: '#2a2a2a', display: 'flex', transition: 'color 0.2s',
        }}
        onMouseEnter={e => { if (!isProcessing) e.currentTarget.style.color = 'rgba(239,68,68,0.65)' }}
        onMouseLeave={e => e.currentTarget.style.color = '#2a2a2a'}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  )
}

function NewTaskModal({ onCancel, onSuccess }) {
  const [name,     setName]     = useState('')
  const [xp,       setXp]       = useState(50)
  const [cat,      setCat]      = useState(null)
  const [focused,  setFocused]  = useState(false)
  const [creating, setCreating] = useState(false)

  const canSubmit = name.trim() !== '' && cat !== null && !creating

  async function handleCreate() {
    if (!canSubmit) return
    setCreating(true)
    try {
      const created = await createTask({ name: name.trim(), category: cat, xp_value: xp })
      if (created) {
        onSuccess()
      } else {
        alert('Não foi possível criar a task. Tenta de novo.')
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
        }}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        style={{
          position: 'fixed', bottom: 0, zIndex: 101,
          left: 'max(0px, calc(50% - 195px))',
          right: 'max(0px, calc(50% - 195px))',
          background: '#111111',
          border: '1px solid #222222',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          padding: '0 20px 40px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 22px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#2a2a2a' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Nova Task</div>
          <button
            onClick={onCancel}
            style={{
              background: '#1a1a1a', border: '1px solid #222222',
              borderRadius: 10, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: MUTED,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>Nome da task</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ex: Treinar 45 minutos…"
            maxLength={60}
            autoFocus
            style={{
              width: '100%', padding: '13px 16px', boxSizing: 'border-box',
              background: '#0f0f0f',
              border: `1px solid ${focused || name ? PUR + '66' : '#222222'}`,
              boxShadow: focused ? `0 0 0 3px ${PUR}18` : 'none',
              borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>XP da task</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {XP_OPTIONS.map(val => (
              <button
                key={val}
                onClick={() => setXp(val)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                  background: xp === val ? '#1a1a2e' : '#1a1a1a',
                  border: `1px solid ${xp === val ? PUR + '55' : '#222222'}`,
                  color: xp === val ? PUR : MUTED,
                }}
              >
                {val} XP
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={LABEL}>Categoria</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {TASK_CATEGORIES.map(c => {
              const active = cat === c
              const color  = CATEGORY_COLORS[c]
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: '9px 6px', borderRadius: 8,
                    fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? `${color}18` : '#1a1a1a',
                    border: `1px solid ${active ? `${color}42` : '#222222'}`,
                    color: active ? color : MUTED,
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: '#1a1a1a', border: '1px solid #222222',
              color: MUTED, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            disabled={!canSubmit}
            onClick={handleCreate}
            style={{
              flex: 2, padding: '14px 0', borderRadius: 10, fontWeight: 900, fontSize: 14,
              background: canSubmit ? PUR : '#1a1a2e',
              border: 'none',
              color: canSubmit ? '#fff' : PUR + '66',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: creating ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {creating ? 'Criando…' : 'Criar Task'}
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default function Tasks() {
  const {
    tasks, routineCompletions, exerciseCompletions, dayCompletions,
    reload, debouncedReload,
    optimisticCompleteTask, optimisticUncompleteTask, revertOptimisticTaskChange,
  } = useUserDataContext()
  const [showModal, setShowModal]              = useState(false)
  const [processingIds, setProcessingIds]      = useState(new Set())

  const today    = getTodayKey()
  const pending  = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)
  const xpFromTasks        = tasks
    .filter(t => t.completed && t.completed_at && getLocalDateKey(t.completed_at) === today)
    .reduce((s, t) => s + (t.xp_value || 0), 0)
  const xpFromRoutines     = routineCompletions
    .filter(rc => rc.completed_at && getLocalDateKey(rc.completed_at) === today)
    .reduce((s, rc) => s + (rc.routine?.xp_value || 0), 0)
  const xpFromExercises    = exerciseCompletions.reduce((s, ec) => s + (ec.exercise?.day?.plan?.xp_per_exercise || 0), 0)
  const xpFromWorkoutDays  = dayCompletions.reduce((s, dc) => s + (dc.day?.plan?.xp_bonus_per_day || 0), 0)
  const earnedXP           = xpFromTasks + xpFromRoutines + xpFromExercises + xpFromWorkoutDays
  const xpPct  = Math.min((earnedXP / DAILY_XP) * 100, 100)
  const allDone = tasks.length > 0 && pending.length === 0

  const subtitle = tasks.length === 0
    ? 'Nenhuma task ainda'
    : `${completed.length}/${tasks.length} completas`

  function addProcessing(id) {
    setProcessingIds(prev => new Set(prev).add(id))
  }
  function removeProcessing(id) {
    setProcessingIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  async function handleToggle(task) {
    if (processingIds.has(task.id)) return

    if (task.completed && !isCompletedToday(task)) {
      alert('Tasks completadas em dias anteriores não podem ser desmarcadas.')
      return
    }

    const previousState = { completed: task.completed, completed_at: task.completed_at }

    if (task.completed) {
      optimisticUncompleteTask(task.id)
    } else {
      optimisticCompleteTask(task.id)
    }

    addProcessing(task.id)
    try {
      if (task.completed) {
        const result = await uncompleteTask(task.id)
        if (result?.locked) {
          revertOptimisticTaskChange(task.id, previousState)
          reload()
          alert('Tasks completadas em dias anteriores não podem ser desmarcadas.')
          return
        }
        if (!result) {
          revertOptimisticTaskChange(task.id, previousState)
          reload()
          return
        }
      } else {
        const result = await completeTask(task.id)
        if (!result) {
          revertOptimisticTaskChange(task.id, previousState)
          reload()
          return
        }
      }
      debouncedReload()
    } catch (err) {
      console.error('Erro ao toggle task:', err)
      revertOptimisticTaskChange(task.id, previousState)
      reload()
    } finally {
      removeProcessing(task.id)
    }
  }

  async function handleDelete(taskId) {
    if (!confirm('Tem certeza que deseja deletar essa task?')) return
    if (processingIds.has(taskId)) return
    addProcessing(taskId)
    try {
      await deleteTask(taskId)
      reload()
    } finally {
      removeProcessing(taskId)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 88px' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
              Tasks
            </h1>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 5, marginBottom: 0 }}>
              {subtitle}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: PUR, border: 'none', borderRadius: 10,
              padding: '10px 16px', cursor: 'pointer',
              color: '#fff', fontWeight: 700, fontSize: 13,
              flexShrink: 0,
            }}
          >
            <Plus size={15} /> Nova Task
          </button>
        </motion.div>

        {/* XP Diário */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
          style={{ ...CARD, marginBottom: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: '#1a1a2e', border: `1px solid ${PUR}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color={PUR} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>XP Diário</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Meta: {DAILY_XP} XP/dia</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{earnedXP}</span>
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>/{DAILY_XP}</span>
            </div>
          </div>
          <div style={{ height: 4, background: '#222222', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%', borderRadius: 99,
                background: PUR,
                minWidth: xpPct > 0 ? 8 : 0,
              }}
            />
          </div>
        </motion.div>

        {/* Planner de Hábitos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.13 }}
          style={{
            ...CARD, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: '#1a1a2e', border: `1px solid ${PUR}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={18} color={PUR} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Planner de Hábitos</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
              Rotinas diárias com +500 XP separado
            </div>
          </div>
          <ChevronRight size={18} color={MUTED} />
        </motion.div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', padding: '48px 20px' }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: '#1a1a2e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Target size={24} color={PUR} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              Nenhuma missão ainda
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 28, lineHeight: 1.6 }}>
              Crie sua primeira task e comece a acumular XP
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '13px 32px',
                background: PUR, border: 'none', borderRadius: 10,
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              }}
            >
              Criar minha primeira task
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {tasks.length > 0 && (
            allDone ? (
              <motion.div
                key="all-done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{
                  textAlign: 'center', padding: '32px 20px',
                  background: '#0d1a14',
                  border: '1px solid #1a3325',
                  borderRadius: 12, marginBottom: 20,
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    width: 52, height: 52, borderRadius: 14, background: 'rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Check size={24} color="#10B981" strokeWidth={2.5} />
                </motion.div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                  Tudo completo!
                </div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>
                  Missão cumprida.<br />Você completou todas as tasks de hoje!
                </div>
              </motion.div>
            ) : (
              <motion.div key="pending">
                <div style={{
                  fontSize: 10, fontWeight: 700, color: MUTED,
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
                }}>
                  Pendentes ({pending.length})
                </div>
                <AnimatePresence mode="popLayout">
                  {pending.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      isProcessing={processingIds.has(task.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </AnimatePresence>

        <AnimatePresence>
          {completed.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: allDone ? 0 : 20 }}
            >
              <div style={{
                fontSize: 10, fontWeight: 700, color: MUTED,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Concluídas ({completed.length})
              </div>
              <AnimatePresence mode="popLayout">
                {completed.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    isProcessing={processingIds.has(task.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <BottomNav />

      <AnimatePresence>
        {showModal && (
          <NewTaskModal
            key="modal"
            onCancel={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); reload() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
