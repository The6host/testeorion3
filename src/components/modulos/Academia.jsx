import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Dumbbell, Star, ChevronDown, ChevronRight,
  TrendingUp, Flame, Zap, Target, Sparkles, CheckCircle2, Circle,
} from 'lucide-react'
import BottomNav from '../BottomNav'

const ORANGE = '#F97316'
const MUTED  = '#888888'
const GREEN  = '#10B981'

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

const GOALS = [
  { id: 'muscle',   Icon: TrendingUp, iconColor: '#10B981', iconBg: '#052e16', name: 'Ganhar Massa Muscular',  desc: 'Hipertrofia com foco em volume e progressão de carga' },
  { id: 'fat',      Icon: Flame,      iconColor: '#EF4444', iconBg: '#1a0808', name: 'Perder Gordura',         desc: 'Treino metabólico com alta intensidade e circuitos' },
  { id: 'strength', Icon: Zap,        iconColor: '#F97316', iconBg: '#1a0a00', name: 'Ganhar Força',           desc: 'Powerlifting adaptado com foco nos grandes lifts' },
  { id: 'defined',  Icon: Target,     iconColor: '#3B82F6', iconBg: '#0a0f1e', name: 'Ficar Definido',         desc: 'Combinação de força e cardio para definição muscular' },
  { id: 'health',   Icon: Sparkles,   iconColor: '#EC4899', iconBg: '#1a0814', name: 'Saúde Geral',            desc: 'Treino completo e equilibrado para bem-estar' },
]

const WORKOUT_DAYS = [
  {
    day: 'Segunda', focus: 'Peito + Tríceps',
    exercises: [
      { id: 's1', name: 'Supino Reto',          sets: '4×10', rest: '90s' },
      { id: 's2', name: 'Supino Inclinado',      sets: '3×12', rest: '75s' },
      { id: 's3', name: 'Crucifixo',             sets: '3×15', rest: '60s' },
      { id: 's4', name: 'Tríceps Corda',         sets: '4×12', rest: '60s' },
      { id: 's5', name: 'Tríceps Francês',       sets: '3×12', rest: '60s' },
    ],
  },
  {
    day: 'Terça', focus: 'Costas + Bíceps',
    exercises: [
      { id: 't1', name: 'Puxada Alta',           sets: '4×10', rest: '90s' },
      { id: 't2', name: 'Remada Curvada',        sets: '4×10', rest: '90s' },
      { id: 't3', name: 'Remada Unilateral',     sets: '3×12', rest: '75s' },
      { id: 't4', name: 'Rosca Direta',          sets: '4×12', rest: '60s' },
      { id: 't5', name: 'Rosca Martelo',         sets: '3×15', rest: '60s' },
    ],
  },
  {
    day: 'Quarta', focus: 'Ombros + Trapézio',
    exercises: [
      { id: 'q1', name: 'Desenvolvimento Press', sets: '4×10', rest: '90s' },
      { id: 'q2', name: 'Elevação Lateral',      sets: '4×15', rest: '60s' },
      { id: 'q3', name: 'Elevação Frontal',      sets: '3×15', rest: '60s' },
      { id: 'q4', name: 'Encolhimento',          sets: '4×15', rest: '60s' },
      { id: 'q5', name: 'Face Pull',             sets: '3×15', rest: '60s' },
    ],
  },
  {
    day: 'Quinta', focus: 'Pernas',
    exercises: [
      { id: 'p1', name: 'Agachamento Livre',     sets: '4×10', rest: '120s' },
      { id: 'p2', name: 'Leg Press',             sets: '4×12', rest: '90s'  },
      { id: 'p3', name: 'Cadeira Extensora',     sets: '3×15', rest: '60s'  },
      { id: 'p4', name: 'Mesa Flexora',          sets: '3×15', rest: '60s'  },
      { id: 'p5', name: 'Panturrilha em Pé',     sets: '4×20', rest: '45s'  },
    ],
  },
  {
    day: 'Sexta', focus: 'Full Body + Core',
    exercises: [
      { id: 'f1', name: 'Levantamento Terra',    sets: '4×8',  rest: '120s' },
      { id: 'f2', name: 'Pull-Up',               sets: '3×8',  rest: '90s'  },
      { id: 'f3', name: 'Flexão de Braço',       sets: '3×15', rest: '60s'  },
      { id: 'f4', name: 'Prancha',               sets: '3×60s', rest: '45s' },
      { id: 'f5', name: 'Abdominal Crunch',      sets: '4×20', rest: '45s'  },
    ],
  },
]

/* ── Goal selection screen ── */
function GoalSelect({ onSelect }) {
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

      {GOALS.map((g, i) => (
        <motion.button
          key={g.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.14 + i * 0.07 }}
          onClick={() => onSelect(g.id)}
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
            background: g.iconBg, border: `1px solid ${g.iconColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <g.Icon size={24} color={g.iconColor} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{g.name}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{g.desc}</div>
          </div>
          <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0 }} />
        </motion.button>
      ))}
    </>
  )
}

/* ── Coming soon screen ── */
function ComingSoon({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ ...CARD, textAlign: 'center', padding: '40px 20px' }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 18, background: '#1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Sparkles size={30} color='#7C3AED' />
      </div>
      <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Em Breve</div>
      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
        Este plano está sendo elaborado pelos nossos especialistas. Em breve estará disponível!
      </div>
      <button
        onClick={onBack}
        style={{
          padding: '11px 28px', borderRadius: 10, border: 'none',
          background: '#1a1a2e', color: '#7C3AED',
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}
      >
        Escolher Outro Objetivo
      </button>
    </motion.div>
  )
}

/* ── Workout plan screen ── */
function WorkoutPlan({ onReset }) {
  const [openDay,  setOpenDay]  = useState(null)
  const [checked,  setChecked]  = useState(new Set())

  function toggleExercise(id) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalPts = checked.size * 15

  return (
    <>
      {/* Plan header card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.07 }}
        style={{
          borderRadius: 14, padding: '20px 18px', marginBottom: 14,
          background: 'linear-gradient(135deg, #052e16 0%, #0d1a14 100%)',
          border: '1px solid #10B98133',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', right: -30, top: -30, width: 130, height: 130,
          background: 'radial-gradient(circle, #10B98118 0%, transparent 70%)', pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: '#10B98122', border: '1px solid #10B98133',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={20} color={GREEN} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Ganhar Massa Muscular</div>
            <div style={{ fontSize: 11, color: GREEN, fontWeight: 600, marginTop: 2 }}>Plano 5 dias · Hipertrofia</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'DIAS/SEMANA', value: '5' },
            { label: 'EXERCÍCIOS', value: '25' },
            { label: 'PONTOS', value: `${totalPts}` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{s.value}</div>
              <div style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
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

      {/* Accordion days */}
      {WORKOUT_DAYS.map((d, i) => {
        const isOpen = openDay === d.day
        const dayChecked = d.exercises.filter(e => checked.has(e.id)).length
        const allDone = dayChecked === d.exercises.length

        return (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }}
            style={{ ...CARD, marginBottom: 8, padding: 0, overflow: 'hidden' }}
          >
            {/* Day header */}
            <button
              onClick={() => setOpenDay(isOpen ? null : d.day)}
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
                <span style={{ fontSize: 13, fontWeight: 900, color: allDone ? GREEN : MUTED }}>{d.day.slice(0, 3)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{d.day}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{d.focus} · {dayChecked}/{d.exercises.length} feitos</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {dayChecked > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>
                    +{dayChecked * 15} pts
                  </span>
                )}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={16} color={MUTED} />
                </motion.div>
              </div>
            </button>

            {/* Exercise list */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="exercises"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ borderTop: '1px solid #1e1e1e', padding: '8px 16px 14px' }}>
                    {d.exercises.map((ex) => {
                      const isDone = checked.has(ex.id)
                      return (
                        <button
                          key={ex.id}
                          onClick={() => toggleExercise(ex.id)}
                          style={{
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 0',
                            borderBottom: '1px solid #1a1a1a',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ flexShrink: 0, transition: 'all 0.2s' }}>
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
                              {ex.sets} · descanso {ex.rest}
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
                            +15 pts
                          </div>
                        </button>
                      )
                    })}
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

/* ── Root ── */
export default function Academia() {
  const navigate = useNavigate()
  const [isFav,        setIsFav]        = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

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
          <button onClick={() => selectedGoal ? setSelectedGoal(null) : navigate('/modulos/treino')} style={BTN_ICON}>
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
              {selectedGoal === 'muscle' ? 'Ganhar Massa Muscular · Plano 5 dias' : 'Exercícios com peso e máquinas'}
            </div>
          </div>
          <button onClick={() => setIsFav(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}>
            <Star size={22} color={isFav ? '#F59E0B' : MUTED} fill={isFav ? '#F59E0B' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {selectedGoal === null && (
            <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GoalSelect onSelect={setSelectedGoal} />
            </motion.div>
          )}
          {selectedGoal === 'muscle' && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <WorkoutPlan onReset={() => setSelectedGoal(null)} />
            </motion.div>
          )}
          {selectedGoal !== null && selectedGoal !== 'muscle' && (
            <motion.div key="soon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <ComingSoon onBack={() => setSelectedGoal(null)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
