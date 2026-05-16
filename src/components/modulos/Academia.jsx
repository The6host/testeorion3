import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Dumbbell, Star, ChevronDown, ChevronRight,
  TrendingUp, Flame, Target, Sparkles, Zap,
  CheckCircle2, Circle, Plus, Trash2,
} from 'lucide-react'
import BottomNav from '../BottomNav'

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

/* ── Goal list ── */
const GOALS = [
  { id: 'muscle',  Icon: TrendingUp, iconColor: '#10B981', iconBg: '#052e16', name: 'Ganhar Massa Muscular', desc: 'Hipertrofia com foco em volume e progressão de carga' },
  { id: 'fat',     Icon: Flame,      iconColor: '#EF4444', iconBg: '#1a0808', name: 'Perder Gordura',         desc: 'Treino metabólico com alta intensidade e circuitos' },
  { id: 'defined', Icon: Target,     iconColor: '#3B82F6', iconBg: '#0a0f1e', name: 'Secar',                  desc: 'Combinação de força e cardio para definição muscular' },
  { id: 'health',  Icon: Zap,        iconColor: '#F59E0B', iconBg: '#1a1200', name: 'Manter Shape',           desc: 'Treino equilibrado para manutenção do condicionamento' },
  { id: 'custom',  Icon: Sparkles,   iconColor: '#EC4899', iconBg: '#1a0814', name: 'Personalizado',          desc: 'Monte seu próprio treino com os exercícios que preferir' },
]

/* ── Plan configs ── */
const PLANS = {
  muscle: {
    name: 'Ganhar Massa Muscular',
    subtitle: 'Academia • Hipertrofia · Plano 5 dias',
    color: GREEN,
    headerBg: 'linear-gradient(135deg, #052e16 0%, #0d1a14 100%)',
    headerBorder: '#10B98133',
    glowColor: '#10B98118',
    Icon: TrendingUp,
    pts: 15,
    days: [
      {
        day: 'Segunda', focus: 'Peito + Tríceps',
        exercises: [
          { id: 'm_s1', name: 'Supino Reto',          sets: '4×10', rest: '90s'  },
          { id: 'm_s2', name: 'Supino Inclinado',      sets: '3×12', rest: '75s'  },
          { id: 'm_s3', name: 'Crucifixo',             sets: '3×15', rest: '60s'  },
          { id: 'm_s4', name: 'Tríceps Corda',         sets: '4×12', rest: '60s'  },
          { id: 'm_s5', name: 'Tríceps Francês',       sets: '3×12', rest: '60s'  },
        ],
      },
      {
        day: 'Terça', focus: 'Costas + Bíceps',
        exercises: [
          { id: 'm_t1', name: 'Puxada Alta',           sets: '4×10', rest: '90s'  },
          { id: 'm_t2', name: 'Remada Curvada',        sets: '4×10', rest: '90s'  },
          { id: 'm_t3', name: 'Remada Unilateral',     sets: '3×12', rest: '75s'  },
          { id: 'm_t4', name: 'Rosca Direta',          sets: '4×12', rest: '60s'  },
          { id: 'm_t5', name: 'Rosca Martelo',         sets: '3×15', rest: '60s'  },
        ],
      },
      {
        day: 'Quarta', focus: 'Ombros + Trapézio',
        exercises: [
          { id: 'm_q1', name: 'Desenvolvimento Press', sets: '4×10', rest: '90s'  },
          { id: 'm_q2', name: 'Elevação Lateral',      sets: '4×15', rest: '60s'  },
          { id: 'm_q3', name: 'Elevação Frontal',      sets: '3×15', rest: '60s'  },
          { id: 'm_q4', name: 'Encolhimento',          sets: '4×15', rest: '60s'  },
          { id: 'm_q5', name: 'Face Pull',             sets: '3×15', rest: '60s'  },
        ],
      },
      {
        day: 'Quinta', focus: 'Pernas',
        exercises: [
          { id: 'm_p1', name: 'Agachamento Livre',     sets: '4×10', rest: '120s' },
          { id: 'm_p2', name: 'Leg Press',             sets: '4×12', rest: '90s'  },
          { id: 'm_p3', name: 'Cadeira Extensora',     sets: '3×15', rest: '60s'  },
          { id: 'm_p4', name: 'Mesa Flexora',          sets: '3×15', rest: '60s'  },
          { id: 'm_p5', name: 'Panturrilha em Pé',     sets: '4×20', rest: '45s'  },
        ],
      },
      {
        day: 'Sexta', focus: 'Full Body + Core',
        exercises: [
          { id: 'm_f1', name: 'Levantamento Terra',    sets: '4×8',  rest: '120s' },
          { id: 'm_f2', name: 'Pull-Up',               sets: '3×8',  rest: '90s'  },
          { id: 'm_f3', name: 'Flexão de Braço',       sets: '3×15', rest: '60s'  },
          { id: 'm_f4', name: 'Prancha',               sets: '3×60s', rest: '45s' },
          { id: 'm_f5', name: 'Abdominal Crunch',      sets: '4×20', rest: '45s'  },
        ],
      },
    ],
  },

  fat: {
    name: 'Perder Gordura',
    subtitle: 'Academia • Emagrecimento · Plano 5 dias',
    color: '#EF4444',
    headerBg: 'linear-gradient(135deg, #1a0808 0%, #0d0505 100%)',
    headerBorder: '#EF444433',
    glowColor: '#EF444418',
    Icon: Flame,
    pts: 20,
    days: [
      {
        day: 'Segunda', focus: 'HIIT + Peito',
        exercises: [
          { id: 'fa_s1', name: 'Burpees',              sets: '3×15',   rest: '45s' },
          { id: 'fa_s2', name: 'Supino',               sets: '3×15',   rest: '45s' },
          { id: 'fa_s3', name: 'Crucifixo',            sets: '3×15',   rest: '45s' },
          { id: 'fa_s4', name: 'Flexão de Braço',      sets: '3×15',   rest: '45s' },
          { id: 'fa_s5', name: 'Jump Rope',            sets: '1×5min', rest: '45s' },
        ],
      },
      {
        day: 'Terça', focus: 'Cardio + Costas',
        exercises: [
          { id: 'fa_t1', name: 'Esteira',              sets: '1×20min', rest: '45s' },
          { id: 'fa_t2', name: 'Remada',               sets: '3×15',    rest: '45s' },
          { id: 'fa_t3', name: 'Pulldown',             sets: '3×15',    rest: '45s' },
          { id: 'fa_t4', name: 'Remada Unilateral',    sets: '3×15',    rest: '45s' },
          { id: 'fa_t5', name: 'Bike',                 sets: '1×10min', rest: '45s' },
        ],
      },
      {
        day: 'Quarta', focus: 'Circuito Pernas',
        exercises: [
          { id: 'fa_q1', name: 'Agachamento Jump',     sets: '4×20', rest: '30s' },
          { id: 'fa_q2', name: 'Afundo',               sets: '4×20', rest: '30s' },
          { id: 'fa_q3', name: 'Cadeira Extensora',    sets: '4×20', rest: '30s' },
          { id: 'fa_q4', name: 'Stiff',                sets: '4×20', rest: '30s' },
          { id: 'fa_q5', name: 'Panturrilha',          sets: '4×20', rest: '30s' },
        ],
      },
      {
        day: 'Quinta', focus: 'HIIT + Ombros',
        exercises: [
          { id: 'fa_p1', name: 'Mountain Climbers',    sets: '3×15',   rest: '45s' },
          { id: 'fa_p2', name: 'Desenvolvimento',      sets: '3×15',   rest: '45s' },
          { id: 'fa_p3', name: 'Elevação Lateral',     sets: '3×15',   rest: '45s' },
          { id: 'fa_p4', name: 'Remada Alta',          sets: '3×15',   rest: '45s' },
          { id: 'fa_p5', name: 'Battle Ropes',         sets: '1×5min', rest: '45s' },
        ],
      },
      {
        day: 'Sexta', focus: 'Full Body Cardio',
        exercises: [
          { id: 'fa_x1', name: 'Burpee',               sets: '30s × 3 rounds', rest: '15s' },
          { id: 'fa_x2', name: 'Agachamento Jump',     sets: '30s × 3 rounds', rest: '15s' },
          { id: 'fa_x3', name: 'Mountain Climber',     sets: '30s × 3 rounds', rest: '15s' },
          { id: 'fa_x4', name: 'Flexão',               sets: '30s × 3 rounds', rest: '15s' },
          { id: 'fa_x5', name: 'Jump Rope',            sets: '30s × 3 rounds', rest: '15s' },
        ],
      },
    ],
  },

  defined: {
    name: 'Secar',
    subtitle: 'Academia • Definição · Plano 5 dias',
    color: '#3B82F6',
    headerBg: 'linear-gradient(135deg, #0a0f1e 0%, #050810 100%)',
    headerBorder: '#3B82F633',
    glowColor: '#3B82F618',
    Icon: Target,
    pts: 18,
    days: [
      {
        day: 'Segunda', focus: 'Peito + Tríceps',
        exercises: [
          { id: 'de_s1', name: 'Supino Reto',          sets: '4×15', rest: '60s' },
          { id: 'de_s2', name: 'Supino Inclinado',      sets: '4×15', rest: '60s' },
          { id: 'de_s3', name: 'Crossover',             sets: '4×15', rest: '60s' },
          { id: 'de_s4', name: 'Tríceps Corda',         sets: '4×15', rest: '60s' },
          { id: 'de_s5', name: 'Tríceps Francês',       sets: '4×15', rest: '60s' },
        ],
      },
      {
        day: 'Terça', focus: 'Costas + Bíceps',
        exercises: [
          { id: 'de_t1', name: 'Pulldown',              sets: '4×15', rest: '60s' },
          { id: 'de_t2', name: 'Remada Máquina',        sets: '4×15', rest: '60s' },
          { id: 'de_t3', name: 'Remada Unilateral',     sets: '4×15', rest: '60s' },
          { id: 'de_t4', name: 'Rosca Direta',          sets: '4×15', rest: '60s' },
          { id: 'de_t5', name: 'Rosca Scott',           sets: '4×15', rest: '60s' },
        ],
      },
      {
        day: 'Quarta', focus: 'Pernas',
        exercises: [
          { id: 'de_q1', name: 'Leg Press',             sets: '4×20', rest: '45s' },
          { id: 'de_q2', name: 'Hack Squat',            sets: '4×20', rest: '45s' },
          { id: 'de_q3', name: 'Cadeira Extensora',     sets: '4×20', rest: '45s' },
          { id: 'de_q4', name: 'Cadeira Flexora',       sets: '4×20', rest: '45s' },
          { id: 'de_q5', name: 'Panturrilha',           sets: '4×20', rest: '45s' },
        ],
      },
      {
        day: 'Quinta', focus: 'Ombros',
        exercises: [
          { id: 'de_p1', name: 'Desenvolvimento Máquina', sets: '4×15', rest: '60s' },
          { id: 'de_p2', name: 'Elevação Lateral',        sets: '4×15', rest: '60s' },
          { id: 'de_p3', name: 'Elevação Frontal',        sets: '4×15', rest: '60s' },
          { id: 'de_p4', name: 'Encolhimento',            sets: '4×15', rest: '60s' },
          { id: 'de_p5', name: 'Remada Alta',             sets: '4×15', rest: '60s' },
        ],
      },
      {
        day: 'Sexta', focus: 'Full Body',
        exercises: [
          { id: 'de_x1', name: 'Supino',                sets: '3×15', rest: '60s' },
          { id: 'de_x2', name: 'Remada',                sets: '3×15', rest: '60s' },
          { id: 'de_x3', name: 'Leg Press',             sets: '3×15', rest: '60s' },
          { id: 'de_x4', name: 'Desenvolvimento',       sets: '3×15', rest: '60s' },
          { id: 'de_x5', name: 'Abs',                   sets: '3×15', rest: '60s' },
        ],
      },
    ],
  },

  health: {
    name: 'Manter Shape',
    subtitle: 'Academia • Manutenção · Plano 3 dias',
    color: '#F59E0B',
    headerBg: 'linear-gradient(135deg, #1a1200 0%, #0d0a00 100%)',
    headerBorder: '#F59E0B33',
    glowColor: '#F59E0B18',
    Icon: Zap,
    pts: 12,
    days: [
      {
        day: 'Segunda', focus: 'Superior A',
        exercises: [
          { id: 'he_s1', name: 'Supino',               sets: '3×12', rest: '75s' },
          { id: 'he_s2', name: 'Remada',               sets: '3×12', rest: '75s' },
          { id: 'he_s3', name: 'Desenvolvimento',      sets: '3×12', rest: '75s' },
          { id: 'he_s4', name: 'Rosca Direta',         sets: '3×12', rest: '75s' },
          { id: 'he_s5', name: 'Tríceps Corda',        sets: '3×12', rest: '75s' },
        ],
      },
      {
        day: 'Terça', focus: 'Inferior',
        exercises: [
          { id: 'he_t1', name: 'Agachamento Livre',    sets: '3×12', rest: '90s' },
          { id: 'he_t2', name: 'Stiff',                sets: '3×12', rest: '90s' },
          { id: 'he_t3', name: 'Leg Press',            sets: '3×12', rest: '90s' },
          { id: 'he_t4', name: 'Panturrilha',          sets: '3×12', rest: '90s' },
          { id: 'he_t5', name: 'Abs',                  sets: '3×12', rest: '90s' },
        ],
      },
      {
        day: 'Quinta', focus: 'Superior B',
        exercises: [
          { id: 'he_p1', name: 'Supino Inclinado',     sets: '3×12', rest: '75s' },
          { id: 'he_p2', name: 'Pulldown',             sets: '3×12', rest: '75s' },
          { id: 'he_p3', name: 'Elevação Lateral',     sets: '3×12', rest: '75s' },
          { id: 'he_p4', name: 'Rosca Martelo',        sets: '3×12', rest: '75s' },
          { id: 'he_p5', name: 'Tríceps Corda',        sets: '3×12', rest: '75s' },
        ],
      },
    ],
  },
}

/* ── Goal selection ── */
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

/* ── Generic workout plan (all plan types share this) ── */
function WorkoutPlan({ plan, onReset }) {
  const [openDay, setOpenDay] = useState(null)
  const [checked, setChecked] = useState(new Set())

  function toggleExercise(id) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalPts       = checked.size * plan.pts
  const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0)

  return (
    <>
      {/* Plan header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.07 }}
        style={{
          borderRadius: 14, padding: '20px 18px', marginBottom: 14,
          background: plan.headerBg, border: `1px solid ${plan.headerBorder}`,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', right: -30, top: -30, width: 130, height: 130,
          background: `radial-gradient(circle, ${plan.glowColor} 0%, transparent 70%)`, pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: plan.glowColor, border: `1px solid ${plan.headerBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <plan.Icon size={20} color={plan.color} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{plan.name}</div>
            <div style={{ fontSize: 11, color: plan.color, fontWeight: 600, marginTop: 2 }}>{plan.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'DIAS/SEMANA', value: String(plan.days.length) },
            { label: 'EXERCÍCIOS',  value: String(totalExercises)   },
            { label: 'PONTOS',      value: String(totalPts)          },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: plan.color }}>{s.value}</div>
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

      {/* Day accordion */}
      {plan.days.map((d, i) => {
        const isOpen     = openDay === d.day
        const dayChecked = d.exercises.filter(e => checked.has(e.id)).length
        const allDone    = dayChecked === d.exercises.length

        return (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }}
            style={{ ...CARD, marginBottom: 8, padding: 0, overflow: 'hidden' }}
          >
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
                <span style={{ fontSize: 13, fontWeight: 900, color: allDone ? GREEN : MUTED }}>
                  {d.day.slice(0, 3)}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{d.day}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{d.focus} · {dayChecked}/{d.exercises.length} feitos</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {dayChecked > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: plan.color }}>
                    +{dayChecked * plan.pts} pts
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
                    {d.exercises.map(ex => {
                      const isDone = checked.has(ex.id)
                      return (
                        <button
                          key={ex.id}
                          onClick={() => toggleExercise(ex.id)}
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
                            +{plan.pts} pts
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

/* ── Custom plan builder ── */
function CustomPlan({ onReset }) {
  const [name,        setName]        = useState('')
  const [exercises,   setExercises]   = useState([])
  const [newEx,       setNewEx]       = useState('')
  const [showInput,   setShowInput]   = useState(false)
  const [saved,       setSaved]       = useState(false)

  function addExercise() {
    if (!newEx.trim()) return
    setExercises(prev => [...prev, { id: Date.now(), text: newEx.trim() }])
    setNewEx('')
    setShowInput(false)
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle = {
    width: '100%', background: '#0f0f0f', border: '1px solid #2a2a2a',
    borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const canSave = name.trim().length > 0 && exercises.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
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

      {/* Name */}
      <div style={{ ...CARD, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Nome do Treino</div>
        <input
          style={inputStyle}
          placeholder="Ex: Push Day, Leg Day, Treino A…"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* Exercise list */}
      <div style={{ ...CARD, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: exercises.length > 0 ? 12 : 0 }}>
          Exercícios
        </div>

        {exercises.map((ex, i) => (
          <div
            key={ex.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: '1px solid #1a1a1a',
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: '#1a1a2e', border: `1px solid ${PUR}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: PUR,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#fff' }}>{ex.text}</div>
            <button
              onClick={() => removeExercise(ex.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
            >
              <Trash2 size={14} color='#3a3a3a' />
            </button>
          </div>
        ))}

        {/* Add exercise */}
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
                <button
                  onClick={addExercise}
                  style={{
                    flexShrink: 0, padding: '0 14px', borderRadius: 10, border: 'none',
                    background: PUR, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
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

      {/* Save */}
      <button
        onClick={handleSave}
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
  const [isFav,        setIsFav]        = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  const currentGoal = GOALS.find(g => g.id === selectedGoal)
  const currentPlan = selectedGoal ? PLANS[selectedGoal] : null

  const subtitle = selectedGoal === null
    ? 'Exercícios com peso e máquinas'
    : selectedGoal === 'custom'
      ? 'Monte seu próprio treino'
      : currentPlan?.subtitle ?? ''

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
            onClick={() => selectedGoal ? setSelectedGoal(null) : navigate('/modulos/treino')}
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
          {selectedGoal === null && (
            <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GoalSelect onSelect={setSelectedGoal} />
            </motion.div>
          )}

          {selectedGoal !== null && selectedGoal !== 'custom' && currentPlan && (
            <motion.div key={selectedGoal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <WorkoutPlan plan={currentPlan} onReset={() => setSelectedGoal(null)} />
            </motion.div>
          )}

          {selectedGoal === 'custom' && (
            <motion.div key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <CustomPlan onReset={() => setSelectedGoal(null)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
