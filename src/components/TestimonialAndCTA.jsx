import { useState } from 'react'
import { motion } from 'framer-motion'
import { ButtonNeon } from './UI/Button'

const NEON = '#ccff00'

// CTA card glass (coluna direita — inalterada)
const GLASS = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

// Testimonial card glass — blur mais pesado para visual premium
const CARD_GLASS = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
}

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    text: 'Trabalho **10h+ no código** e sempre esqueci de comer e treinar. As tasks chegam de manhã e eu só sigo. Tô em **rank C com 3 meses**, perdi 6kg sem nem perceber.',
    name: 'Pedro S.',
    role: 'Programador',
    avatar: 'https://i.ibb.co/ksj42C28/Whats-App-Image-2026-06-27-at-10-08-25.jpg',
  },
  {
    id: 2,
    text: 'Fiz vestibular usando o Orion como cronograma. Acordava, abria o app, sabia o que estudar e quando descansar. **Passei em Direito na federal**.',
    name: 'Vitória M.',
    role: 'Estudante',
    avatar: 'https://i.ibb.co/cSSgXPRV/Whats-App-Image-2026-06-27-at-10-08-25-1.jpg',
  },
  {
    id: 3,
    text: 'Trabalho com criativo o dia todo e minha cabeça vivia bagunçada. **O sistema de XP é viciante**. Hoje treino 5x na semana e durmo melhor desde que comecei.',
    name: 'Luiz K.',
    role: 'Marketing',
    avatar: 'https://i.ibb.co/fzCqRNvm/Whats-App-Image-2026-06-27-at-10-08-25-2.jpg',
  },
  {
    id: 4,
    text: 'Sou CEO de duas empresas, não tenho tempo pra app que não entrega. Esse aqui me forçou a **criar rotina sem terapia, sem coach**. Já indiquei pra 12 sócios meus.',
    name: 'Fernando V.',
    role: 'Empreendedor',
    avatar: 'https://i.ibb.co/4ZNzxk7B/Whats-App-Image-2026-06-27-at-10-08-26.jpg',
  },
]

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="font-bold text-white">{part}</span>
      : <span key={i}>{part}</span>
  )
}

// Posição visual de cada card na pilha
const STACK_POS = [
  { scale: 1,    y: 0,  opacity: 1,   zIndex: 10 },
  { scale: 0.95, y: 16, opacity: 0.8, zIndex: 9  },
  { scale: 0.90, y: 32, opacity: 0.4, zIndex: 8  },
  { scale: 0.85, y: 48, opacity: 0,   zIndex: 7  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function QuoteIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0L16 3.2C11.2 4.8 8.8 7.2 8.8 10.4H14.4V24H0ZM17.6 24V14.4C17.6 6.4 22.4 1.6 32 0L33.6 3.2C28.8 4.8 26.4 7.2 26.4 10.4H32V24H17.6Z" fill={NEON} />
    </svg>
  )
}

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={NEON}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t, index, exitDir, onExitComplete, onDragEnd }) {
  const isTop = index === 0
  const isExiting = isTop && exitDir !== null
  const pos = STACK_POS[index] ?? STACK_POS[3]

  // initial = posição final exata → sem flash ao montar
  const initialState = { scale: pos.scale, y: pos.y, opacity: pos.opacity, x: 0, rotate: 0 }

  const animateTarget = isExiting
    ? { x: exitDir * 650, opacity: 0, rotate: exitDir * 22, scale: 0.95, y: 0 }
    : isTop
      ? { scale: 1, y: 0, opacity: 1, rotate: [-0.5, 0.5, -0.5], x: 0 }
      : { scale: pos.scale, y: pos.y, opacity: pos.opacity, rotate: 0, x: 0 }

  const transitionTarget = isExiting
    ? { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
    : isTop
      ? {
          scale:   { type: 'spring', stiffness: 300, damping: 28 },
          y:       { type: 'spring', stiffness: 300, damping: 28 },
          opacity: { type: 'spring', stiffness: 300, damping: 28 },
          x:       { type: 'spring', stiffness: 300, damping: 28 },
          rotate:  { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        }
      : { type: 'spring', stiffness: 300, damping: 28 }

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: pos.zIndex,
        cursor: isTop && !isExiting ? 'grab' : 'default',
        pointerEvents: isExiting || index > 2 ? 'none' : 'auto',
        ...CARD_GLASS,
      }}
      initial={initialState}
      animate={animateTarget}
      transition={transitionTarget}
      onAnimationComplete={isExiting ? onExitComplete : undefined}
      drag={isTop && !isExiting ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={isTop && !isExiting ? onDragEnd : undefined}
      className="rounded-3xl p-7 flex flex-col gap-5"
    >
      <QuoteIcon />

      <p className="text-white/80 text-sm md:text-base leading-relaxed">
        {renderBold(t.text)}
      </p>

      <Stars />

      <div className="flex items-center gap-3 pt-1">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
          style={{ border: '2px solid rgba(255,255,255,0.12)' }}
        />
        <div>
          <p className="text-white font-bold text-sm">{t.name}</p>
          <p className="text-white/40 text-xs">{t.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialAndCTA({ onStartQuiz }) {
  const [cards, setCards] = useState(INITIAL_TESTIMONIALS)
  const [exitDir, setExitDir] = useState(null)

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > 80) {
      setExitDir(info.offset.x > 0 ? 1 : -1)
    }
  }

  function handleExitComplete() {
    setCards(prev => {
      const [first, ...rest] = prev
      return [...rest, first]
    })
    setExitDir(null)
  }

  return (
    <section className="relative py-24 overflow-hidden">

      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* ── Coluna esquerda — Depoimentos ── */}
          <motion.div
            className="lg:w-[44%] flex flex-col gap-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '250px' }}
          >
            {/* Título */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                QUEM USA,
              </h2>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: NEON }}>
                RECOMENDA.
              </h2>
            </div>

            {/* Stack de cards */}
            <div className="relative w-full" style={{ height: 280, minHeight: 280 }}>
              {cards.map((t, index) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  index={index}
                  exitDir={exitDir}
                  onExitComplete={handleExitComplete}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>

            {/* Dica de swipe */}
            <p className="text-white/25 text-xs text-center -mt-2 select-none">
              ← arraste para ver mais →
            </p>
          </motion.div>

          {/* ── Coluna direita — CTA + Planeta ── */}
          <motion.div
            className="lg:w-[56%]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="relative rounded-3xl p-8 md:p-10 h-full flex flex-col justify-center gap-6 pb-36 md:pb-10"
              style={GLASS}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  PRONTO PARA INICIAR
                </h2>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: NEON }}>
                  SUA MISSÃO?
                </h2>
              </div>

              <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xs">
                Junte-se a milhares de pessoas que estão evoluindo todos os dias com o ORION.
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <ButtonNeon onClick={onStartQuiz}>Começar Agora</ButtonNeon>
                </div>
                <p className="text-white/35 text-xs">
                  7 dias grátis • Cancele quando quiser
                </p>
              </div>

              <motion.img
                src="https://i.ibb.co/mrMwmG8v/file-000000005b8871f58b4d2354ed6b0d6e.png"
                alt="Planeta 3D"
                className="pointer-events-none select-none absolute
                           bottom-4 right-4 w-40
                           md:bottom-auto md:right-0 md:translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:w-80
                           lg:w-96"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 40px rgba(109,40,217,0.45))', zIndex: 10 }}
                draggable={false}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
