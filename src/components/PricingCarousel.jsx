import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NEON   = '#ccff00'
const BG     = '#010208'
const CARD_W = 264

/* ── Countdown hook ── */
function useCountdown(init = 877) {
  const [s, setS] = useState(init)
  useEffect(() => {
    const id = setInterval(() => setS(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/* ── Avatar images (reuse from hero) ── */
const AVATARS = [
  'https://i.ibb.co/WN8bGb5y/Pfp5.jpg',
  'https://i.ibb.co/VWs1Qd5f/Pfp4.jpg',
  'https://i.ibb.co/20J1Bbtt/Pfp3.jpg',
  'https://i.ibb.co/VcJt7CpQ/Pfp2.jpg',
]

/* ── Plans data ── */
const PLANS = [
  {
    id:      'primary',
    icon:    '⚡',
    name:    'ORION Primary',
    tagline: 'O primeiro passo',
    desc:    'Pra quem quer sair do zero',
    color:   '#60A5FA',
    features: [
      '5 hábitos simultâneos',
      'Lembretes que não te deixam esquecer',
      'Dashboard com seu progresso real',
      'Histórico de 30 dias',
    ],
    bars:     [2, 2, 1],
    original: 'R$39,80',
    price:    'R$19,90',
    cta:      'Começar agora',
  },
  {
    id:      'focuz',
    icon:    '🔥',
    badge:   '✦ 94% ESCOLHEM ESSE',
    name:    'ORION Focuz',
    tagline: 'Escolha de 94% dos usuários',
    desc:    'O plano que transforma de verdade',
    color:   NEON,
    features: [
      'Hábitos ILIMITADOS',
      'IA que monta sua rotina por você',
      'Relatórios semanais em PDF',
      'Histórico completo pra sempre',
      'Desafios que te forçam a evoluir',
    ],
    bars:     [3, 3, 3],
    original: 'R$59,80',
    price:    'R$29,90',
    cta:      'Desbloquear meu acesso',
  },
  {
    id:      'intensive',
    icon:    '💎',
    name:    'ORION Intensive',
    tagline: 'Sem limites',
    desc:    'Pra quem quer resultado MÁXIMO',
    color:   '#F87171',
    features: [
      'Tudo do Focuz + extras exclusivos',
      'IA 24h que te cobra pelo resultado',
      'Análise comportamental avançada',
      'Hábitos que se adaptam ao seu momento',
      'Suporte humano prioritário',
      'Acesso antecipado a tudo',
    ],
    bars:     [3, 3, 3],
    original: 'R$79,80',
    price:    'R$39,90',
    cta:      'Quero o máximo',
  },
]

/* ── Metric bars ── */
function BarGroup({ count, color, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 9,
              height: 10 + i * 4,
              borderRadius: 3,
              background: i <= count ? color : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

/* ── Individual plan card ── */
function PlanCard({ plan, isActive }) {
  const { color, icon, name, tagline, desc, features, bars, original, price, cta } = plan

  return (
    <div
      style={{
        width: CARD_W,
        background: BG,
        border: `1.5px solid ${color}`,
        borderRadius: 22,
        padding: '22px 18px 20px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Icon + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13, flexShrink: 0,
          background: `${color}22`, border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{name}</p>
          <p style={{ fontSize: 11, color, marginTop: 3, lineHeight: 1 }}>{tagline}</p>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14, lineHeight: 1.4 }}>{desc}</p>

      {/* Metric bars */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        {['Velocidade', 'Resultados', 'Suporte'].map((label, i) => (
          <BarGroup key={label} count={bars[i]} color={color} label={label} />
        ))}
      </div>

      {/* Features */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
        {features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
              background: `${color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5L8 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 1.45 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'line-through', marginBottom: 2 }}>
          {original}
        </p>
        <p style={{ fontSize: 38, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{price}</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>pague uma vez, use pra sempre</p>
      </div>

      {/* CTA — only visible on active card */}
      <AnimatePresence>
        {isActive && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', padding: '15px 0',
              background: color,
              color: color === NEON ? '#000' : '#fff',
              border: 'none', borderRadius: 12,
              fontWeight: 900, fontSize: 15,
              cursor: 'pointer', letterSpacing: '0.01em',
            }}
          >
            {cta}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Carousel position calculator ── */
function getVariants(index, active) {
  const rel = (index - active + 3) % 3
  // rel 0 → center | rel 1 → right | rel 2 → left
  if (rel === 0) return { x: 0,              scale: 1.06, opacity: 1,    zIndex: 10 }
  if (rel === 1) return { x: CARD_W * 0.82,  scale: 0.85, opacity: 0.60, zIndex: 5  }
  return              { x: -(CARD_W * 0.82), scale: 0.85, opacity: 0.60, zIndex: 5  }
}

const SPRING = { type: 'spring', stiffness: 310, damping: 30, mass: 0.85 }

/* ── Main component ── */
export default function PricingCarousel() {
  const [active, setActive] = useState(1)   // Focuz default
  const timer  = useCountdown(877)          // 14:37
  const dragStartX = useRef(0)

  const prev = () => setActive(a => (a - 1 + 3) % 3)
  const next = () => setActive(a => (a + 1) % 3)

  /* Swipe support */
  function onTouchStart(e) { dragStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    const delta = dragStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
  }

  return (
    <div
      style={{ minHeight: '100dvh', background: BG, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Top urgency bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28,
        padding: '10px 20px',
        background: 'rgba(0,0,0,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {timer}
        </div>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', fontSize: 13, fontWeight: 600 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 7px #4ade80', animation: 'pulse 2s ease-in-out infinite' }} />
          38 vendo agora
        </div>
      </div>

      {/* ── Header ── */}
      <div style={{ padding: '28px 24px 0', maxWidth: 520, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 10 }}>
          Seu plano está pronto.<br />Só falta você.
        </h1>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.48)', marginBottom: 18 }}>
          Pague{' '}
          <span style={{ color: '#f97316', fontWeight: 700 }}>uma vez</span>. Use{' '}
          <span style={{ color: NEON, fontWeight: 700 }}>pra sempre</span>.
        </p>

        {/* Urgency chip */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 20, padding: '7px 18px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>
              Preço de lançamento acaba em {timer}
            </span>
          </div>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 26 }}>
          <div style={{ display: 'flex' }}>
            {AVATARS.map((src, i) => (
              <img
                key={src} src={src} alt=""
                style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid #010208', objectFit: 'cover', marginLeft: i === 0 ? 0 : -9 }}
              />
            ))}
          </div>
          <span style={{ color: '#facc15', fontSize: 13, letterSpacing: 1 }}>★★★★★</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>20.000+ usuários</span>
        </div>

        {/* Plan tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
          {PLANS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              style={{
                padding: '8px 18px', borderRadius: 20,
                background: active === i ? p.color : 'rgba(255,255,255,0.05)',
                color: active === i ? (p.color === NEON ? '#000' : '#fff') : 'rgba(255,255,255,0.5)',
                border: active === i ? 'none' : '1px solid rgba(255,255,255,0.1)',
                fontWeight: active === i ? 700 : 500,
                fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {['Primary', 'Focuz', 'Intensive'][i]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D Carousel ── */}
      <div style={{ position: 'relative', flex: 1, minHeight: 600 }}>

        {/* Badge above active card */}
        <AnimatePresence mode="wait">
          {PLANS[active].badge && (
            <motion.div
              key={`badge-${active}`}
              initial={{ opacity: 0, y: -6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0,  scale: 1   }}
              exit={   { opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'absolute', top: 12, left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                background: NEON, color: '#000',
                fontSize: 10, fontWeight: 900,
                padding: '5px 14px', borderRadius: 20,
                letterSpacing: '0.07em', whiteSpace: 'nowrap',
                boxShadow: `0 0 22px ${NEON}99`,
              }}
            >
              {PLANS[active].badge}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards */}
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            animate={getVariants(i, active)}
            transition={SPRING}
            onClick={() => i !== active && setActive(i)}
            style={{
              position: 'absolute',
              top: 44,                          // room for badge
              left: '50%',
              marginLeft: -(CARD_W / 2),
              cursor: i !== active ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            <PlanCard plan={plan} isActive={i === active} />
          </motion.div>
        ))}
      </div>

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '16px 0 24px' }}>
        <button
          onClick={prev}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.65)', fontSize: 22, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >‹</button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {PLANS.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              animate={{ width: i === active ? 26 : 8, background: i === active ? p.color : 'rgba(255,255,255,0.2)' }}
              transition={{ duration: 0.25 }}
              style={{ height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        <button
          onClick={next}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.65)', fontSize: 22, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >›</button>
      </div>

      {/* ── Guarantee ── */}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.28)', padding: '0 20px 36px' }}>
        🔒 Garantia de 7 dias. Se não gostar, devolvemos 100%.
      </p>
    </div>
  )
}
