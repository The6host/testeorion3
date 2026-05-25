import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Star, Clock, ChevronRight } from 'lucide-react'
import BottomNav from '../BottomNav'
import { fetchRoutinesByModule, fetchRoutineStepsCount } from '../../lib/userData'

const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 14,
  padding: 16,
}

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

const ROUTINE_PATHS = {
  'Tratamento Anti-Acne':            '/modulos/aparencia/tratamentos/anti-acne',
  'Tratamento Anti-Manchas':         '/modulos/aparencia/tratamentos/anti-manchas',
  'Tratamento Anti-Idade Intensivo': '/modulos/aparencia/tratamentos/anti-idade',
}

function RoutineCard({ routine, index, onStart }) {
  const lvl      = LEVEL_COLORS[routine.difficulty] || LEVEL_COLORS['Iniciante']
  const benefits = routine.benefits || []
  const shown    = benefits.slice(0, 3)
  const extra    = benefits.length - shown.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.09 }}
      style={{ ...CARD, marginBottom: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
          {routine.name}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 900, color: PUR, flexShrink: 0,
          background: '#0d0814', border: `1px solid ${PUR}33`,
          borderRadius: 8, padding: '3px 10px',
        }}>
          +{routine.xp_value} pts
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: 20, padding: '4px 10px',
        }}>
          <Clock size={11} color={MUTED} />
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>{routine.duration_minutes} min</span>
        </div>
        <div style={{
          background: lvl.bg, border: `1px solid ${lvl.border}`,
          borderRadius: 20, padding: '4px 10px',
          fontSize: 11, fontWeight: 700, color: lvl.color,
        }}>
          {routine.difficulty}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Benefícios:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {shown.map(b => (
            <span key={b} style={{
              fontSize: 11, fontWeight: 700, color: GREEN,
              background: '#052e16', border: '1px solid #10B98133',
              borderRadius: 20, padding: '3px 10px',
            }}>
              {b}
            </span>
          ))}
          {extra > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: MUTED,
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 20, padding: '3px 10px',
            }}>
              +{extra}
            </span>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{routine.stepsCount} passos</span>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onStart(routine)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: '#0d0814', color: PUR,
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          Iniciar <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function TratamentosList() {
  const navigate = useNavigate()
  const [isFav,    setIsFav]    = useState(false)
  const [routines, setRoutines] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetchRoutinesByModule('tratamentos').then(async data => {
      const counts = await Promise.all(data.map(r => fetchRoutineStepsCount(r.id)))
      setRoutines(data.map((r, i) => ({ ...r, stepsCount: counts[i] })))
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}
        >
          <button onClick={() => navigate('/modulos/aparencia')} style={BTN_ICON}>
            <ArrowLeft size={18} color={MUTED} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#0d0814', border: `1px solid ${PUR}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Target size={18} color={PUR} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Tratamentos Direcionados</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Tratamentos específicos para diferentes necessidades
            </div>
          </div>
          <button
            onClick={() => setIsFav(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}
          >
            <Star size={22} color={isFav ? '#F59E0B' : MUTED} fill={isFav ? '#F59E0B' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{ fontSize: 13, color: MUTED, marginBottom: 24, paddingLeft: 2 }}
        >
          {loading ? '...' : `${routines.length} rotinas disponíveis`}
        </motion.div>

        {routines.map((r, i) => (
          <RoutineCard
            key={r.id}
            routine={r}
            index={i}
            onStart={r => {
              const path = ROUTINE_PATHS[r.name]
              if (path) navigate(path)
            }}
          />
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
