import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Star, ChevronRight, Info,
  MapPin, Dumbbell, Brain, Apple, Wallet, Sparkles,
} from 'lucide-react'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const GREEN = '#10B981'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const LABEL = {
  fontSize: 10, fontWeight: 700, color: MUTED,
  textTransform: 'uppercase', letterSpacing: '0.08em',
}

/* ── Module definitions ── */
const MODULES = [
  {
    id: 1, Icon: MapPin,   iconColor: '#10B981', iconBg: '#052e16',
    name: 'Corrida',
    desc: 'GPS real, passos e distância em tempo real',
    current: 0.0, total: 50, unit: 'km',
    givesPts: true,
  },
  {
    id: 2, Icon: Dumbbell, iconColor: '#F97316', iconBg: '#1a0a00',
    name: 'Treino',
    desc: 'Academia ou Calistenia com planilha completa',
    current: 0, total: 80, unit: 'exercício',
    givesPts: true,
  },
  {
    id: 3, Icon: Brain,    iconColor: '#3B82F6', iconBg: '#0a0f1e',
    name: 'Estudos',
    desc: 'Assistente de IA com flashcards e simulados',
    current: 0, total: 30, unit: 'sessão',
    givesPts: false,
  },
  {
    id: 4, Icon: Apple,    iconColor: '#10B981', iconBg: '#052e16',
    name: 'Nutrição',
    desc: 'IA analisa suas refeições por foto',
    current: 0, total: 90, unit: 'refeição',
    givesPts: false,
  },
  {
    id: 5, Icon: Wallet,   iconColor: '#F59E0B', iconBg: '#1a1200',
    name: 'Finanças',
    desc: 'Educação financeira com IA e controle de gastos',
    current: 0, total: 60, unit: 'ação',
    givesPts: false,
  },
  {
    id: 6, Icon: Sparkles, iconColor: '#EC4899', iconBg: '#1a0814',
    name: 'Aparência',
    desc: 'Massagens faciais, skincare e rotinas de beleza',
    current: 0, total: 60, unit: 'rotina',
    givesPts: true,
  },
]

function pct(current, total) {
  return Math.round((current / total) * 100)
}

function fmtValue(current, unit) {
  if (unit === 'km') return current.toFixed(1)
  return String(current)
}

export default function Modulos() {
  const navigate   = useNavigate()
  const [favorites, setFavorites] = useState(new Set())

  function toggleFavorite(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 88px' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
              Módulos
            </h1>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 5, marginBottom: 0 }}>
              6 módulos principais
            </p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: PUR, border: 'none', borderRadius: 10,
            padding: '10px 16px', cursor: 'pointer',
            color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            <Plus size={15} /> Criar
          </button>
        </motion.div>

        {/* ── Warning card ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          style={{
            background: '#0f172a',
            border: '1px solid #1e40af',
            borderRadius: 12, padding: '12px 14px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            marginBottom: 20,
          }}
        >
          <Info size={16} color='#3B82F6' style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: '#93c5fd', lineHeight: 1.6, margin: 0 }}>
            Os módulos de <strong style={{ color: '#fff' }}>Estudos</strong>, <strong style={{ color: '#fff' }}>Nutrição</strong> e <strong style={{ color: '#fff' }}>Finanças</strong> não geram pontos. Foque nas tasks diárias para ganhar pontos!
          </p>
        </motion.div>

        {/* ── Module list ── */}
        {MODULES.map((mod, i) => {
          const isFav = favorites.has(mod.id)
          const progress = pct(mod.current, mod.total)

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.10 + i * 0.07 }}
              style={{ ...CARD, marginBottom: 10 }}
            >
              {/* Top row: icon + name + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                  background: mod.iconBg,
                  border: `1px solid ${mod.iconColor}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <mod.Icon size={20} color={mod.iconColor} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{mod.name}</span>
                    {!mod.givesPts && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: MUTED,
                        background: '#1a1a1a', border: '1px solid #2a2a2a',
                        borderRadius: 20, padding: '2px 8px',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        Sem pontos
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>
                    {mod.desc}
                  </div>
                </div>
              </div>

              {/* Progress row */}
              <div style={{ marginBottom: mod.givesPts ? 8 : 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>
                    {fmtValue(mod.current, mod.unit)}/{mod.total} {mod.unit}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>
                    {progress}%
                  </span>
                </div>
                <div style={{ height: 4, background: '#1e1e1e', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.06 }}
                    style={{
                      height: '100%', borderRadius: 99, background: GREEN,
                      minWidth: progress > 0 ? 4 : 0,
                    }}
                  />
                </div>
              </div>

              {/* Points row (only for modules that give pts) */}
              {mod.givesPts && (
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>
                  0 pts este mês • 0 sessões
                </div>
              )}

              {/* Divider + action buttons */}
              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleFavorite(mod.id)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontSize: 12, fontWeight: 700,
                    background: isFav ? '#1a1200' : '#1a1a1a',
                    color: isFav ? '#F59E0B' : MUTED,
                    transition: 'all 0.2s',
                  }}
                >
                  <Star
                    size={13}
                    color={isFav ? '#F59E0B' : MUTED}
                    fill={isFav ? '#F59E0B' : 'none'}
                    style={{ transition: 'all 0.2s' }}
                  />
                  {isFav ? 'Favoritado' : 'Favoritar'}
                </button>

                <button
                  onClick={() => {
                    if (mod.id === 1) navigate('/modulos/corrida')
                    else if (mod.id === 2) navigate('/modulos/treino')
                    else if (mod.id === 6) navigate('/modulos/aparencia')
                  }}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                    cursor: (mod.id === 1 || mod.id === 2 || mod.id === 6) ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    fontSize: 12, fontWeight: 700,
                    background: '#1a1a2e',
                    color: (mod.id === 1 || mod.id === 2 || mod.id === 6) ? '#fff' : MUTED,
                  }}
                >
                  Abrir <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}

      </div>
      <BottomNav />
    </div>
  )
}
