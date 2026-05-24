import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Share2, Settings, Camera, Pencil, RefreshCw,
  ChevronRight, BarChart2, Calendar, Check,
  Flame, Trophy, MapPin, Shield,
  Heart, Droplets, Dumbbell, Brain, Target, Zap, Eye, Users,
  Lightbulb, Palette, Medal,
} from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import BottomNav from './BottomNav'
import { getInitials } from '../lib/utils'
import RankBadge from './RankBadge'
import {
  ATTRIBUTE_KEYS, ATTRIBUTE_META, MAX_ATTRIBUTE_VALUE,
  getAttributesSum, getAttributesAverage, getEmptyAttributes,
} from '../lib/userStats'
import { useUserDataContext } from '../context/UserDataContext'

/* ── Design tokens ── */
const PUR   = '#7C3AED'
const MUTED = '#888888'
const DIM   = '#444444'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}
const SECTION_LABEL = {
  fontSize: 10, fontWeight: 700, color: MUTED,
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
}

const PERFIL_ATTR_ICONS = {
  forca:        Dumbbell,
  vitalidade:   Heart,
  inteligencia: Brain,
  disciplina:   Target,
  agilidade:    Zap,
  foco:         Eye,
  carisma:      Users,
  hidratacao:   Droplets,
}

const THEMES = [
  { name: 'Padrão',     color: '#7C3AED' },
  { name: 'Oceano',     color: '#3B82F6' },
  { name: 'Pôr do Sol', color: '#F97316' },
  { name: 'Floresta',   color: '#10B981' },
  { name: 'Royal',      color: '#EC4899' },
  { name: 'Ouro',       color: '#F59E0B' },
]

const STATS = [
  { Icon: Flame,  label: 'Dias de Streak', value: '0'   },
  { Icon: Trophy, label: 'Pontos Totais',  value: '0'   },
  { Icon: MapPin, label: 'Km Corridos',    value: '0.0' },
  { Icon: Shield, label: 'Vitórias Arena', value: '0'   },
]

const ACHIEVEMENTS = [
  { name: 'Primeiro Passo',  emoji: '✅', unlocked: false, desc: 'Primeira task concluída'    },
  { name: 'Organizador',     emoji: '📋', unlocked: false, desc: 'Criou 5 tasks em um dia'    },
  { name: 'Guerreiro',       emoji: '⚔️', unlocked: false, desc: 'Vença 10 batalhas na Arena' },
  { name: 'Maratonista',     emoji: '🏃', unlocked: false, desc: 'Corra 50km no total'        },
  { name: 'Mestre da Mente', emoji: '🧠', unlocked: false, desc: 'Complete 30 tasks de foco'  },
  { name: 'Lendário',        emoji: '🏆', unlocked: false, desc: 'Alcance o rank S'            },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
})

function RadarTick({ x, y, payload }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill={MUTED}
      fontSize={11}
      fontWeight={600}
    >
      {payload.value}
    </text>
  )
}

export default function Perfil() {
  const [activeTheme, setActiveTheme] = useState('Padrão')

  const { profile, stats } = useUserDataContext()
  const level    = profile?.level        || 1
  const totalXP  = profile?.total_xp     || 0
  const xpAtual  = totalXP % 500
  const xpPct    = (xpAtual / 500) * 100
  const streak   = profile?.streak_count || 0

  const attrs     = stats || getEmptyAttributes()
  const attrSum   = getAttributesSum(stats)
  const attrAvg   = getAttributesAverage(stats)
  const maxSum    = ATTRIBUTE_KEYS.length * MAX_ATTRIBUTE_VALUE
  const radarData = ATTRIBUTE_KEYS.map(key => ({
    subject:  ATTRIBUTE_META[key].label,
    value:    attrs[key],
    fullMark: MAX_ATTRIBUTE_VALUE,
  }))

  const displayStats = [
    { Icon: Flame,  label: 'Dias de Streak', value: streak  },
    { Icon: Trophy, label: 'Pontos Totais',  value: totalXP },
    { Icon: MapPin, label: 'Km Corridos',    value: '0.0'   },
    { Icon: Shield, label: 'Vitórias Arena', value: '0'     },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <h1 style={{ flex: 1, fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
            Perfil
          </h1>
          {[Share2, Settings].map((Icon, i) => (
            <button key={i} style={{
              background: '#1a1a1a', border: '1px solid #222222',
              borderRadius: 9, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Icon size={16} color={MUTED} />
            </button>
          ))}
        </motion.div>

        {/* User Card */}
        <motion.div {...fadeUp(0.06)} style={{ ...CARD, marginBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{
                width: 74, height: 74, borderRadius: 18,
                background: `linear-gradient(135deg, ${PUR}, #6D28D9)`,
                border: `3px solid ${PUR}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 900, color: '#fff',
              }}>
                {getInitials(profile?.display_name || '')}
              </div>
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 24, height: 24, borderRadius: '50%',
                background: PUR, border: '2px solid #080808',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={11} color="#fff" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{profile?.display_name || 'Usuário'}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <Pencil size={13} color={MUTED} />
              </button>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
              @{profile?.username || 'usuario'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <RankBadge totalXP={totalXP} size="sm" />
              <div style={{
                background: '#1a1a1a', border: '1px solid #222222',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>
                Level {level}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: MUTED, fontWeight: 600 }}>Progresso para Level {level + 1}</span>
              <span style={{ color: PUR, fontWeight: 700 }}>{xpAtual}/500 XP</span>
            </div>
            <div style={{ height: 4, background: '#222222', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                style={{ height: '100%', borderRadius: 99, background: PUR }}
              />
            </div>
          </div>
        </motion.div>

        {/* Skills Radar */}
        <motion.div {...fadeUp(0.12)} style={{ ...CARD, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Perfil de Habilidades</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#1a1a2e', border: `1px solid ${PUR}33`,
                borderRadius: 7, padding: '3px 10px',
                fontSize: 11, fontWeight: 700, color: PUR,
              }}>
                Total: {attrSum}/{maxSum}
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <RefreshCw size={15} color={MUTED} />
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#222222" />
                <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                <Radar
                  dataKey="value"
                  stroke={PUR}
                  fill={PUR}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: PUR, r: 3, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -46%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{attrAvg}</div>
              <div style={{ fontSize: 9, color: MUTED, fontWeight: 600 }}>média</div>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: MUTED }}>
              Tasks Completas: <strong style={{ color: '#fff' }}>0</strong>
            </span>
          </div>
          <div style={{
            background: '#1a1a2e', border: `1px solid ${PUR}33`,
            borderRadius: 9, padding: '8px 12px', textAlign: 'center',
            fontSize: 13, fontWeight: 700, color: PUR,
          }}>
            Pontuação Total: {attrSum}/{maxSum}
          </div>
        </motion.div>

        {/* Theme selector */}
        <motion.div {...fadeUp(0.17)} style={{ ...CARD, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Palette size={16} color={PUR} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Tema de Cores</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {THEMES.map(theme => {
              const active = activeTheme === theme.name
              return (
                <button
                  key={theme.name}
                  onClick={() => setActiveTheme(theme.name)}
                  style={{
                    padding: '12px 8px', borderRadius: 10, cursor: 'pointer', border: 'none',
                    background: active ? `${theme.color}18` : '#1a1a1a',
                    outline: active ? `1px solid ${theme.color}55` : '1px solid #222222',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: theme.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <Check size={13} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: active ? theme.color : MUTED }}>
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Stats 2x2 */}
        <motion.div {...fadeUp(0.22)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          {displayStats.map((s, i) => (
            <div key={i} style={{ ...CARD, padding: '14px 16px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: '#1a1a2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
              }}>
                <s.Icon size={15} color={PUR} />
              </div>
              <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div {...fadeUp(0.27)} style={{ ...CARD, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Medal size={16} color={PUR} />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Conquistas</span>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: PUR, fontWeight: 600, padding: 0,
            }}>
              Ver todas (0/54) <ChevronRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.28 + i * 0.06 }}
                style={{
                  flexShrink: 0, width: 86, textAlign: 'center',
                  background: a.unlocked ? '#0d1a14' : '#111111',
                  border: `1px solid ${a.unlocked ? '#1a3325' : '#1e1e1e'}`,
                  borderRadius: 12, padding: '12px 8px',
                  opacity: a.unlocked ? 1 : 0.5,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>
                  {a.unlocked ? a.emoji : '🔒'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: a.unlocked ? '#fff' : MUTED, lineHeight: 1.3 }}>
                  {a.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Character Status */}
        <motion.div {...fadeUp(0.32)} style={{ ...CARD, marginBottom: 10 }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
              Status do Personagem
            </div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
              Seus atributos RPG são afetados pelas suas atividades diárias
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 14, marginTop: 10 }}>
            {ATTRIBUTE_KEYS.map((key, i) => {
              const { label, color } = ATTRIBUTE_META[key]
              const Icon  = PERFIL_ATTR_ICONS[key]
              const value = attrs[key]
              return (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: `${color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={13} color={color} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color }}>
                      {value}/100
                    </span>
                  </div>
                  <div style={{ height: 4, background: '#222222', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.34 + i * 0.07 }}
                      style={{ height: '100%', borderRadius: 99, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{
            background: '#1a1a2e', border: `1px solid ${PUR}33`,
            borderRadius: 10, padding: '12px 14px', marginTop: 4,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Lightbulb size={16} color={PUR} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.65, margin: 0 }}>
              Complete tasks regularmente para aumentar seus atributos. Fitness fortalece Força e Agilidade,
              Foco desenvolve Inteligência, Nutrição melhora Hidratação e Vitalidade,
              Mindfulness e Social elevam Carisma, e Produtividade aumenta Disciplina.
            </p>
          </div>
        </motion.div>

        {/* Footer cards */}
        <motion.div {...fadeUp(0.38)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { Icon: BarChart2, title: 'Estatísticas', desc: 'Progresso detalhado' },
            { Icon: Calendar,  title: 'Histórico',    desc: 'Ver atividades'      },
          ].map((card, i) => (
            <button key={i} style={{
              ...CARD, cursor: 'pointer', border: 'none',
              background: '#111111',
              outline: '1px solid #222222',
              display: 'flex', flexDirection: 'column', gap: 8,
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: '#1a1a2e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <card.Icon size={16} color={PUR} />
                </div>
                <ChevronRight size={14} color={MUTED} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{card.desc}</div>
              </div>
            </button>
          ))}
        </motion.div>

      </div>
      <BottomNav />
    </div>
  )
}
