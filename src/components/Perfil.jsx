import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Share2, Settings, Camera, Pencil, RefreshCw,
  ChevronRight, BarChart2, Calendar, Check,
} from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import { supabase } from '../lib/supabase'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const PUR  = '#A855F7'
const NEON = '#ccff00'

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
}
const SECTION_LABEL = {
  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.32)',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
}

/* ── Mock data ── */
const RADAR_DATA = [
  { subject: 'Foco',       value: 3.2, fullMark: 10 },
  { subject: 'Energia',    value: 3.8, fullMark: 10 },
  { subject: 'Motivação',  value: 3.4, fullMark: 10 },
  { subject: 'Produção',   value: 3.0, fullMark: 10 },
  { subject: 'Disciplina', value: 3.6, fullMark: 10 },
]

const THEMES = [
  { name: 'Padrão',     color: '#A855F7' },
  { name: 'Oceano',     color: '#3B82F6' },
  { name: 'Pôr do Sol', color: '#F97316' },
  { name: 'Floresta',   color: '#10B981' },
  { name: 'Royal',      color: '#EC4899' },
  { name: 'Ouro',       color: '#F59E0B' },
]

const STATS = [
  { emoji: '🔥', label: 'Dias de Streak', value: '2'   },
  { emoji: '🎯', label: 'Pontos Totais',  value: '875' },
  { emoji: '📍', label: 'Km Corridos',    value: '0.0' },
  { emoji: '⚔️', label: 'Vitórias Arena', value: '0'   },
]

const ACHIEVEMENTS = [
  { name: 'Primeiro Passo',  emoji: '✅', unlocked: true,  desc: 'Primeira task concluída'    },
  { name: 'Organizador',     emoji: '📋', unlocked: true,  desc: 'Criou 5 tasks em um dia'    },
  { name: 'Guerreiro',       emoji: '⚔️', unlocked: false, desc: 'Vença 10 batalhas na Arena' },
  { name: 'Maratonista',     emoji: '🏃', unlocked: false, desc: 'Corra 50km no total'        },
  { name: 'Mestre da Mente', emoji: '🧠', unlocked: false, desc: 'Complete 30 tasks de foco'  },
  { name: 'Lendário',        emoji: '🏆', unlocked: false, desc: 'Alcance o tier Lenda'       },
]

const ATTRS = [
  { emoji: '❤️', name: 'Vitalidade',   value: 12, color: '#EF4444' },
  { emoji: '💧', name: 'Hidratação',   value: 4,  color: '#3B82F6' },
  { emoji: '🔥', name: 'Força',        value: 2,  color: '#F97316' },
  { emoji: '🧠', name: 'Inteligência', value: 6,  color: '#8B5CF6' },
  { emoji: '🎯', name: 'Disciplina',   value: 9,  color: '#10B981' },
  { emoji: '⚡', name: 'Agilidade',    value: 1,  color: NEON      },
  { emoji: '👁️', name: 'Foco',         value: 5,  color: PUR       },
  { emoji: '👥', name: 'Carisma',      value: 7,  color: '#EC4899' },
]

/* ── Helpers ── */
function getInitials(email) {
  if (!email) return 'U'
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
})

/* ══════════════════════════════════════
   RADAR CHART CUSTOM TICK
══════════════════════════════════════ */
function RadarTick({ x, y, payload }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="rgba(255,255,255,0.62)"
      fontSize={11}
      fontWeight={600}
    >
      {payload.value}
    </text>
  )
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function Perfil() {
  const [email,       setEmail]       = useState('')
  const [activeTheme, setActiveTheme] = useState('Padrão')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setEmail(data.user.email)
    })
  }, [])

  const initials = getInitials(email)

  return (
    <div style={{ minHeight: '100dvh', background: '#010208', color: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 88px' }}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <h1 style={{ flex: 1, fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>
            Perfil
          </h1>
          <button style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Share2 size={16} color="rgba(255,255,255,0.55)" />
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Settings size={16} color="rgba(255,255,255,0.55)" />
          </button>
        </motion.div>

        {/* ── User Card ── */}
        <motion.div {...fadeUp(0.06)} style={{ ...CARD, marginBottom: 12 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{
                width: 76, height: 76, borderRadius: 20,
                background: `linear-gradient(135deg, ${PUR}, #6D28D9)`,
                border: `3px solid rgba(168,85,247,0.5)`,
                boxShadow: '0 0 24px rgba(168,85,247,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: '#fff',
              }}>
                {initials}
              </div>
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 24, height: 24, borderRadius: '50%',
                background: PUR, border: '2px solid #010208',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={11} color="#fff" />
              </div>
            </div>

            {/* Name + edit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Kauê Vinícius</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <Pencil size={13} color="rgba(255,255,255,0.38)" />
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              @{email.split('@')[0] || 'usuario'}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{
                background: 'rgba(168,85,247,0.14)', border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 700, color: PUR,
              }}>
                🌱 Iniciante II
              </div>
              <div style={{
                background: 'rgba(204,255,0,0.1)', border: '1px solid rgba(204,255,0,0.25)',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 700, color: NEON,
              }}>
                ⚡ Level 2
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Progresso para Level 3</span>
              <span style={{ color: PUR, fontWeight: 700 }}>435/500 XP</span>
            </div>
            <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${PUR}, #C084FC)`,
                  boxShadow: '0 0 10px rgba(168,85,247,0.55)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Skills Radar ── */}
        <motion.div {...fadeUp(0.12)} style={{ ...CARD, marginBottom: 12 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Seu Perfil de Habilidades</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)',
                borderRadius: 8, padding: '3px 10px',
                fontSize: 11, fontWeight: 700, color: PUR,
              }}>
                Total: 17.0/50
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <RefreshCw size={15} color="rgba(255,255,255,0.38)" />
              </button>
            </div>
          </div>

          {/* Chart + center label */}
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                <Radar
                  dataKey="value"
                  stroke={PUR}
                  fill={PUR}
                  fillOpacity={0.22}
                  strokeWidth={2}
                  dot={{ fill: PUR, r: 3, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            {/* Center overlay */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -46%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>3.4</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>média</div>
            </div>
          </div>

          {/* Meta info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              Tasks Completas: <strong style={{ color: '#fff' }}>0</strong>
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              Atualização: <strong style={{ color: '#fff' }}>Toda Sexta</strong>
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, margin: '0 0 10px' }}>
            Suas habilidades são atualizadas toda sexta-feira com base nas tasks completadas durante a semana.
          </p>
          <div style={{
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.22)',
            borderRadius: 10, padding: '8px 12px', textAlign: 'center',
            fontSize: 13, fontWeight: 700, color: PUR,
          }}>
            Pontuação Total: 17.0/50
          </div>
        </motion.div>

        {/* ── Theme selector ── */}
        <motion.div {...fadeUp(0.17)} style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🎨</span>
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
                    padding: '12px 8px', borderRadius: 12, cursor: 'pointer', border: 'none',
                    background: active ? `${theme.color}20` : 'rgba(255,255,255,0.04)',
                    outline: active ? `2px solid ${theme.color}` : '1px solid rgba(255,255,255,0.08)',
                    outlineOffset: active ? 0 : 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.18s',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: theme.color,
                    boxShadow: active ? `0 0 12px ${theme.color}88` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <Check size={14} color="#fff" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: active ? theme.color : 'rgba(255,255,255,0.45)' }}>
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Stats 2x2 ── */}
        <motion.div {...fadeUp(0.22)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...CARD, padding: '14px 16px' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div {...fadeUp(0.27)} style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🏅</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Conquistas</span>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: PUR, fontWeight: 600, padding: 0,
            }}>
              Ver todas (2/54) <ChevronRight size={13} />
            </button>
          </div>

          {/* Horizontal scroll */}
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            paddingBottom: 4, scrollbarWidth: 'none',
          }}>
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.28 + i * 0.06 }}
                style={{
                  flexShrink: 0, width: 88, textAlign: 'center',
                  background: a.unlocked ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${a.unlocked ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 14, padding: '12px 8px',
                  opacity: a.unlocked ? 1 : 0.55,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>
                  {a.unlocked ? a.emoji : '🔒'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: a.unlocked ? '#fff' : 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>
                  {a.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Character Status ── */}
        <motion.div {...fadeUp(0.32)} style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
              Status do Personagem
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              Seus atributos RPG são afetados pelas suas atividades diárias
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, marginTop: 10 }}>
            {ATTRS.map((attr, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{attr.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{attr.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: attr.color }}>
                    {attr.value}/100
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${attr.value}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.34 + i * 0.07 }}
                    style={{
                      height: '100%', borderRadius: 99,
                      background: `linear-gradient(90deg, ${attr.color}cc, ${attr.color})`,
                      boxShadow: `0 0 6px ${attr.color}66`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tip card */}
          <div style={{
            background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)',
            borderRadius: 12, padding: '12px 14px', marginTop: 4,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
              Complete tarefas regularmente para aumentar seus status. Exercícios aumentam Força e Agilidade,
              estudos aumentam Inteligência e Foco, beber água aumenta Hidratação, e manter sua rotina aumenta Disciplina!
            </p>
          </div>
        </motion.div>

        {/* ── Footer cards ── */}
        <motion.div {...fadeUp(0.38)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: <BarChart2 size={20} color={PUR} />, title: 'Estatísticas',  desc: 'Progresso detalhado' },
            { icon: <Calendar  size={20} color={PUR} />, title: 'Histórico',     desc: 'Ver atividades'      },
          ].map((card, i) => (
            <button key={i} style={{
              ...CARD, cursor: 'pointer', border: 'none',
              background: 'rgba(255,255,255,0.04)',
              outline: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column', gap: 8,
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                {card.icon}
                <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{card.desc}</div>
              </div>
            </button>
          ))}
        </motion.div>

      </div>
      <BottomNav />
    </div>
  )
}
