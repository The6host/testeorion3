import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Trash2, Calendar, Zap, Plus, X, Check } from 'lucide-react'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR          = '#A855F7'
const NEON         = '#ccff00'
const DAILY_XP     = 500
const XP_OPTIONS   = [50, 75, 100, 150]
const CATEGORIES   = ['Saúde', 'Foco', 'Fitness', 'Mindfulness', 'Nutrição', 'Produtividade']

const CAT_COLOR = {
  Saúde:         '#10B981',
  Foco:          '#3B82F6',
  Fitness:       '#F59E0B',
  Mindfulness:   PUR,
  Nutrição:      '#EC4899',
  Produtividade: NEON,
}

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
}

const LABEL = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 8,
}

/* ── Initial mock tasks ── */
const INIT_TASKS = [
  { id: 1, name: 'Treino de Força',   category: 'Fitness',       xp: 100, done: false },
  { id: 2, name: 'Leitura 30min',     category: 'Foco',          xp: 50,  done: true  },
  { id: 3, name: 'Meditação',         category: 'Mindfulness',   xp: 75,  done: false },
  { id: 4, name: 'Revisão de Metas',  category: 'Produtividade', xp: 75,  done: false },
  { id: 5, name: 'Corrida 5km',       category: 'Fitness',       xp: 150, done: true  },
]

/* ══════════════════════════════════════
   TASK ITEM
══════════════════════════════════════ */
function TaskItem({ task, onToggle, onDelete }) {
  const color = CAT_COLOR[task.category] || PUR

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: task.done ? 0.58 : 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', marginBottom: 8,
        background: task.done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${task.done ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: 24, height: 24, borderRadius: 8, flexShrink: 0,
          border: `2px solid ${task.done ? '#10B981' : 'rgba(255,255,255,0.22)'}`,
          background: task.done ? '#10B981' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s', padding: 0,
        }}
      >
        <AnimatePresence>
          {task.done && (
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

      {/* Name + category */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2,
          textDecoration: task.done ? 'line-through' : 'none',
          textDecorationColor: 'rgba(255,255,255,0.35)',
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

      {/* XP badge */}
      <div style={{
        fontSize: 12, fontWeight: 800, flexShrink: 0,
        color:      task.done ? 'rgba(255,255,255,0.22)' : NEON,
        background: task.done ? 'rgba(255,255,255,0.04)' : 'rgba(204,255,0,0.07)',
        border:     `1px solid ${task.done ? 'rgba(255,255,255,0.07)' : 'rgba(204,255,0,0.2)'}`,
        borderRadius: 8, padding: '4px 9px',
        textDecoration: task.done ? 'line-through' : 'none',
      }}>
        +{task.xp} XP
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0,
          color: 'rgba(255,255,255,0.18)', display: 'flex', transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.65)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  )
}

/* ══════════════════════════════════════
   NEW TASK MODAL (bottom sheet)
══════════════════════════════════════ */
function NewTaskModal({ onConfirm, onCancel }) {
  const [name,    setName]    = useState('')
  const [xp,      setXp]      = useState(50)
  const [cat,     setCat]     = useState('Saúde')
  const [focused, setFocused] = useState(false)

  function handleConfirm() {
    if (!name.trim()) return
    onConfirm({ name: name.trim(), xp, category: cat })
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101,
          background: '#0C0C14',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          borderRadius: '24px 24px 0 0',
          padding: '0 20px 40px',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 22px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.14)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Nova Task</div>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Name input */}
        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>Nome da task</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            placeholder="Ex: Treinar 45 minutos…"
            autoFocus
            style={{
              width: '100%', padding: '13px 16px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${focused || name ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'none',
              borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        </div>

        {/* XP selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>XP da task</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {XP_OPTIONS.map(val => (
              <button
                key={val}
                onClick={() => setXp(val)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                  background: xp === val ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${xp === val ? 'rgba(204,255,0,0.38)' : 'rgba(255,255,255,0.08)'}`,
                  color: xp === val ? NEON : 'rgba(255,255,255,0.45)',
                }}
              >
                {val} XP
              </button>
            ))}
          </div>
        </div>

        {/* Category selector */}
        <div style={{ marginBottom: 28 }}>
          <label style={LABEL}>Categoria</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(c => {
              const active = cat === c
              const color  = CAT_COLOR[c]
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: '9px 6px', borderRadius: 10,
                    fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? `${color}42` : 'rgba(255,255,255,0.08)'}`,
                    color: active ? color : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 12, fontWeight: 700, fontSize: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            style={{
              flex: 2, padding: '14px 0', borderRadius: 12, fontWeight: 900, fontSize: 14,
              background: name.trim() ? PUR : 'rgba(168,85,247,0.18)',
              border: 'none',
              color: name.trim() ? '#fff' : 'rgba(168,85,247,0.4)',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              boxShadow: name.trim() ? '0 0 22px rgba(168,85,247,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Criar Task
          </button>
        </div>
      </motion.div>
    </>
  )
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function Tasks() {
  const [tasks,     setTasks]     = useState(INIT_TASKS)
  const [showModal, setShowModal] = useState(false)
  const nextId = useRef(INIT_TASKS.length + 1)

  const pending   = tasks.filter(t => !t.done)
  const completed = tasks.filter(t => t.done)
  const earnedXP  = completed.reduce((s, t) => s + t.xp, 0)
  const xpPct     = Math.min((earnedXP / DAILY_XP) * 100, 100)
  const allDone   = tasks.length > 0 && pending.length === 0

  const subtitle = tasks.length === 0
    ? 'Nenhuma task ainda'
    : `${completed.length}/${tasks.length} completas`

  function toggleTask(id) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  function createTask({ name, xp, category }) {
    setTasks(ts => [...ts, { id: nextId.current++, name, xp, category, done: false }])
    setShowModal(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#010208', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 88px' }}>

        {/* ── Top row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}
        >
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
              Tasks
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginTop: 5, marginBottom: 0 }}>
              {subtitle}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: PUR, border: 'none', borderRadius: 12,
              padding: '10px 16px', cursor: 'pointer',
              color: '#fff', fontWeight: 700, fontSize: 13,
              boxShadow: '0 0 22px rgba(168,85,247,0.38)',
              flexShrink: 0,
            }}
          >
            <Plus size={15} /> Nova Task
          </button>
        </motion.div>

        {/* ── XP Diário ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
          style={{ ...CARD, marginBottom: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: 'rgba(204,255,0,0.09)', border: '1px solid rgba(204,255,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color={NEON} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>XP Diário</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>Meta: {DAILY_XP} XP/dia</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: NEON }}>{earnedXP}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>/{DAILY_XP}</span>
            </div>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${NEON}bb, ${NEON})`,
                boxShadow: `0 0 10px rgba(204,255,0,0.45)`,
                minWidth: xpPct > 0 ? 8 : 0,
              }}
            />
          </div>
        </motion.div>

        {/* ── Planner de Hábitos ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.13 }}
          style={{
            ...CARD, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}
          whileHover={{ borderColor: 'rgba(168,85,247,0.22)' }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 13, flexShrink: 0,
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={18} color={PUR} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Planner de Hábitos</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>
              Rotinas diárias com +500 XP separado
            </div>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
        </motion.div>

        {/* ── Empty state ── */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', padding: '48px 20px' }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              Nenhuma missão ainda
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 28, lineHeight: 1.6 }}>
              Crie sua primeira task e comece a acumular XP
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '13px 32px',
                background: PUR, border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 0 22px rgba(168,85,247,0.35)',
              }}
            >
              Criar minha primeira task
            </button>
          </motion.div>
        )}

        {/* ── Pending tasks or all-done state ── */}
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 && (
            allDone ? (
              /* All done celebration */
              <motion.div
                key="all-done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{
                  textAlign: 'center', padding: '32px 20px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: 20, marginBottom: 20,
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ fontSize: 48, marginBottom: 12 }}
                >
                  ✅
                </motion.div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                  Tudo completo!
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                  Missão cumprida, guerreiro.<br />Você completou todas as tasks de hoje!
                </div>
              </motion.div>
            ) : (
              /* Pending list */
              <motion.div key="pending">
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.32)',
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
                }}>
                  Pendentes ({pending.length})
                </div>
                <AnimatePresence mode="popLayout">
                  {pending.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* ── Completed tasks ── */}
        <AnimatePresence>
          {completed.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: allDone ? 0 : 20 }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.32)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Concluídas ({completed.length})
              </div>
              <AnimatePresence mode="popLayout">
                {completed.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <BottomNav />

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewTaskModal
            key="modal"
            onConfirm={createTask}
            onCancel={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
