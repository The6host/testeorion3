import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Sparkles, Star, Zap, ChevronRight,
  Droplets, Target, Sun,
} from 'lucide-react'
import BottomNav from '../BottomNav'

const PINK  = '#EC4899'
const MUTED = '#888888'

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

const LABEL = {
  fontSize: 10, fontWeight: 700, color: MUTED,
  textTransform: 'uppercase', letterSpacing: '0.08em',
}

const CATEGORIES = [
  {
    id: 'massagens',
    Icon: Sparkles,
    iconColor: '#EC4899',
    iconBg: '#1a0814',
    name: 'Massagens Faciais',
    desc: 'Técnicas de massagem para tonificação e relaxamento facial',
    count: '3 rotinas disponíveis',
  },
  {
    id: 'skincare',
    Icon: Droplets,
    iconColor: '#3B82F6',
    iconBg: '#0a0f1e',
    name: 'Rotinas de Skincare',
    desc: 'Rotinas completas de cuidados com a pele',
    count: '3 rotinas disponíveis',
  },
  {
    id: 'tratamentos',
    Icon: Target,
    iconColor: '#7C3AED',
    iconBg: '#0d0814',
    name: 'Tratamentos Direcionados',
    desc: 'Tratamentos específicos para diferentes necessidades',
    count: '3 rotinas disponíveis',
  },
  {
    id: 'corporais',
    Icon: Sun,
    iconColor: '#F97316',
    iconBg: '#1a0a00',
    name: 'Cuidados Corporais',
    desc: 'Rotinas de cuidados para o corpo',
    count: '2 rotinas disponíveis',
  },
]

/* ── Coming soon placeholder ── */
function CategoryPlaceholder({ category, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: MUTED, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 20, padding: 0,
        }}
      >
        ← Voltar às categorias
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={{ ...CARD, textAlign: 'center', padding: '48px 24px' }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: category.iconBg,
          border: `1px solid ${category.iconColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <category.Icon size={34} color={category.iconColor} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 10 }}>
          {category.name}
        </div>
        <div style={{
          display: 'inline-block', marginBottom: 16,
          background: '#1a0814', border: `1px solid ${PINK}33`,
          borderRadius: 20, padding: '4px 14px',
          fontSize: 11, fontWeight: 700, color: PINK,
        }}>
          Em Breve
        </div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, maxWidth: 260, margin: '0 auto 28px' }}>
          Esta categoria está sendo elaborada pelos nossos especialistas. Em breve estará disponível!
        </div>
        <button
          onClick={onBack}
          style={{
            padding: '12px 32px', borderRadius: 10, border: 'none',
            background: '#1a0814', color: PINK,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
        >
          Voltar às Categorias
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ── Root ── */
export default function Aparencia() {
  const navigate = useNavigate()
  const [isFav,     setIsFav]     = useState(false)
  const [openCat,   setOpenCat]   = useState(null)

  const activeCategory = CATEGORIES.find(c => c.id === openCat)

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
            onClick={() => openCat ? setOpenCat(null) : navigate('/modulos')}
            style={BTN_ICON}
          >
            <ArrowLeft size={18} color={MUTED} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: '#1a0814', border: `1px solid ${PINK}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color={PINK} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Aparência</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeCategory ? activeCategory.name : 'Rotinas de beleza e cuidados'}
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
          {openCat === null ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Highlight card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.07 }}
                style={{
                  borderRadius: 14, padding: '18px 18px',
                  background: 'linear-gradient(135deg, #1a0814 0%, #0d050f 100%)',
                  border: `1px solid ${PINK}33`,
                  position: 'relative', overflow: 'hidden',
                  marginBottom: 24,
                }}
              >
                <div style={{
                  position: 'absolute', right: -30, top: -30, width: 130, height: 130,
                  background: `radial-gradient(circle, ${PINK}14 0%, transparent 70%)`, pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                    background: `${PINK}18`, border: `1px solid ${PINK}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Zap size={20} color={PINK} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
                    Ganhe pontos com rotinas de beleza!
                  </div>
                </div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.55, paddingLeft: 52 }}>
                  Todas as rotinas contam para o ranking e Arena
                </div>
              </motion.div>

              {/* Categories label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.13 }}
                style={{ ...LABEL, marginBottom: 12 }}
              >
                Categorias
              </motion.div>

              {/* Category cards */}
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.16 + i * 0.07 }}
                  onClick={() => {
                    if (cat.id === 'massagens') navigate('/modulos/aparencia/massagens')
                    else if (cat.id === 'skincare') navigate('/modulos/aparencia/skincare')
                    else setOpenCat(cat.id)
                  }}
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
                    background: cat.iconBg, border: `1px solid ${cat.iconColor}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <cat.Icon size={24} color={cat.iconColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 5, lineHeight: 1.4 }}>{cat.desc}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: cat.iconColor }}>{cat.count}</div>
                  </div>
                  <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0 }} />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={openCat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <CategoryPlaceholder
                category={activeCategory}
                onBack={() => setOpenCat(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <BottomNav />
    </div>
  )
}
