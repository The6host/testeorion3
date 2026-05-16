import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Dumbbell, Activity, Star, ChevronRight } from 'lucide-react'
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

const TYPES = [
  {
    Icon: Dumbbell,
    iconColor: '#EF4444',
    iconBg: '#1a0808',
    name: 'Academia',
    desc: 'Exercícios com peso e máquinas',
    pts: 'Pontos = (peso × reps) / 10',
    path: '/modulos/academia',
  },
  {
    Icon: Activity,
    iconColor: ORANGE,
    iconBg: '#1a0a00',
    name: 'Calistenia',
    desc: 'Exercícios com peso corporal',
    pts: 'Pontos = reps × dificuldade',
    path: null,
  },
]

export default function Treino() {
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(false)

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}
        >
          <button onClick={() => navigate('/modulos')} style={BTN_ICON}>
            <ArrowLeft size={18} color={MUTED} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#1a0a00', border: `1px solid ${ORANGE}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={18} color={ORANGE} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Treino</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Academia ou Calistenia com planilha completa
            </div>
          </div>
          <button onClick={() => setIsFav(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}>
            <Star size={22} color={isFav ? '#F59E0B' : MUTED} fill={isFav ? '#F59E0B' : 'none'} style={{ transition: 'all 0.2s' }} />
          </button>
        </motion.div>

        {/* Center icon + title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.07 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}
        >
          <div style={{
            width: 84, height: 84, borderRadius: 22, flexShrink: 0,
            background: '#1a0a00', border: `1px solid ${ORANGE}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            <Dumbbell size={42} color={ORANGE} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textAlign: 'center' }}>
            Escolha o tipo de treino
          </div>
        </motion.div>

        {/* Type cards */}
        {TYPES.map((type, i) => (
          <motion.button
            key={type.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.14 + i * 0.09 }}
            onClick={() => type.path && navigate(type.path)}
            whileHover={type.path ? { scale: 1.015 } : {}}
            whileTap={type.path ? { scale: 0.98 } : {}}
            style={{
              ...CARD, width: '100%', border: 'none', outline: '1px solid #222222',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: type.path ? 'pointer' : 'default',
              textAlign: 'left', marginBottom: 10,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 13, flexShrink: 0,
              background: type.iconBg, border: `1px solid ${type.iconColor}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <type.Icon size={24} color={type.iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{type.name}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 5 }}>{type.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>{type.pts}</div>
            </div>
            <ChevronRight size={18} color={type.path ? MUTED : '#2a2a2a'} style={{ flexShrink: 0 }} />
          </motion.button>
        ))}

      </div>
      <BottomNav />
    </div>
  )
}
