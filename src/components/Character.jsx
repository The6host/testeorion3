import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Swords, Heart, Brain, Shield, Zap, Eye, User, MessageCircle, Droplets } from 'lucide-react'
import { getRankByXP } from '../lib/rank'
import { getUserAttributes, ATTRIBUTE_KEYS, ATTRIBUTE_META } from '../lib/userStats'
import { supabase } from '../lib/supabase'
import BottomNav from './BottomNav'

/* ── Design tokens ── */
const ORANGE = '#F97316'
const MUTED  = '#888888'

const CARD = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: 12,
  padding: 16,
}

const LABEL = {
  fontSize: 10, fontWeight: 700, color: MUTED,
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
}

const CHAR_ATTR_CONFIG = {
  forca:        { Icon: Swords,        bg: '#1a0900' },
  vitalidade:   { Icon: Heart,         bg: '#1a0808' },
  inteligencia: { Icon: Brain,         bg: '#0d0820' },
  disciplina:   { Icon: Shield,        bg: '#081a11' },
  agilidade:    { Icon: Zap,           bg: '#0d0814' },
  foco:         { Icon: Eye,           bg: '#081418' },
  carisma:      { Icon: MessageCircle, bg: '#1a0814' },
  hidratacao:   { Icon: Droplets,      bg: '#080d1a' },
}

const CHAR_IMG = 'https://i.imgur.com/8LFQX5M.png'

function CharacterSilhouette() {
  return (
    <svg width="160" height="300" viewBox="0 0 160 300" fill="none">
      <ellipse cx="80" cy="44" rx="30" ry="34" fill="#2a2a2a" />
      <rect x="68" y="75" width="24" height="16" rx="4" fill="#2a2a2a" />
      <path d="M36 100 Q80 88 124 100 L128 218 Q80 230 32 218 Z" fill="#2a2a2a" />
      <path d="M36 108 Q16 155 20 200" stroke="#2a2a2a" strokeWidth="22" strokeLinecap="round" />
      <path d="M124 108 Q144 155 140 200" stroke="#2a2a2a" strokeWidth="22" strokeLinecap="round" />
      <path d="M58 216 Q54 256 52 295" stroke="#2a2a2a" strokeWidth="24" strokeLinecap="round" />
      <path d="M102 216 Q106 256 108 295" stroke="#2a2a2a" strokeWidth="24" strokeLinecap="round" />
    </svg>
  )
}

export default function Character() {
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setEmail(data.user.email)
    })
  }, [])

  const username  = email ? email.split('@')[0] : 'usuario'
  const rank      = getRankByXP(0)
  const userAttrs = getUserAttributes()

  return (
    <div style={{ minHeight: '100dvh', background: '#000000', color: '#fff' }}>

      {/* ══ HERO ══ */}
      <div style={{
        background: 'radial-gradient(ellipse at 50% 0%, #3b0764 0%, #000000 72%)',
        position: 'relative',
        paddingBottom: 28,
        overflow: 'hidden',
      }}>
        {/* Soft inner glow */}
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 320, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
        }} />

        {/* Back arrow */}
        <div style={{ padding: '16px 16px 0', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => navigate('/perfil')}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
          </button>
        </div>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginTop: 10, position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,0,0,0.55)', border: `1px solid ${ORANGE}55`,
            borderRadius: 20, padding: '5px 18px',
            fontSize: 13, fontWeight: 800, color: ORANGE,
            backdropFilter: 'blur(10px)',
          }}>
            {rank.code} • Level 1
          </div>
        </div>

        {/* Character image */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          minHeight: 300, marginTop: 12, position: 'relative', zIndex: 2,
        }}>
          {!imgError ? (
            <motion.img
              src={CHAR_IMG}
              alt="Personagem"
              onError={() => setImgError(true)}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 300, objectFit: 'contain',
                filter: 'drop-shadow(0 0 36px rgba(124,58,237,0.55))',
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ filter: 'drop-shadow(0 0 24px rgba(124,58,237,0.35))' }}
            >
              <CharacterSilhouette />
            </motion.div>
          )}
        </div>

        {/* Username + rank + XP */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', padding: '16px 24px 0', position: 'relative', zIndex: 2 }}
        >
          <div style={{ fontSize: 13, color: MUTED, fontWeight: 600, marginBottom: 4 }}>
            @{username}
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 14 }}>
            Caçador Fraco
          </div>

          {/* XP bar */}
          <div style={{ maxWidth: 240, margin: '0 auto' }}>
            <div style={{ height: 5, background: '#1e1e1e', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '0%' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                style={{ height: '100%', borderRadius: 99, background: ORANGE }}
              />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ORANGE }}>
              0/500 XP para Level 2
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ background: '#080808', padding: '28px 16px 88px' }}>

        {/* Atributos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div style={{ ...LABEL, textAlign: 'center', marginBottom: 16 }}>
            Atributos
          </div>

          {ATTRIBUTE_KEYS.map((key, i) => {
            const { label, color } = ATTRIBUTE_META[key]
            const { Icon, bg }    = CHAR_ATTR_CONFIG[key]
            const value           = userAttrs[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.06 }}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #1e1e1e',
                  borderRadius: 10, padding: '12px 14px', marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: bg, border: `1px solid ${color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 900, color }}>
                    {value}
                  </span>
                </div>
                <div style={{ height: 4, background: '#222222', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.07 }}
                    style={{ height: '100%', borderRadius: 99, background: color }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20, marginBottom: 10 }}
        >
          {[
            { label: 'NÍVEL ATUAL', value: '1' },
            { label: 'XP TOTAL',    value: '0' },
          ].map((s, i) => (
            <div key={i} style={{ ...CARD }}>
              <div style={LABEL}>{s.label}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: ORANGE, lineHeight: 1.1 }}>{s.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Rank card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          style={{
            background: '#0f0f0f',
            border: `1px solid ${ORANGE}22`,
            borderRadius: 12, padding: 16,
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: '#1a0e00', border: `1px solid ${ORANGE}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={22} color={ORANGE} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: ORANGE }}>{rank.code} — {rank.title}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
              {rank.description}
            </div>
          </div>
        </motion.div>

      </div>

      <BottomNav />
    </div>
  )
}
