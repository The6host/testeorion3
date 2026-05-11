import { motion } from 'framer-motion'
import { ButtonNeon } from './UI/Button'

const NEON = '#ccff00'

const RADAR_ATTRS = ['Foco', 'Energia', 'Disciplina', 'Motivação', 'Produção']
const BEFORE_RADAR = [0.24, 0.30, 0.20, 0.35, 0.26]
const AFTER_RADAR  = [0.93, 0.89, 0.96, 0.91, 0.87]

const BEFORE_BULLETS = [
  'Procrastinação constante',
  'Falta de motivação diária',
  'Objetivos nunca alcançados',
]
const AFTER_BULLETS = [
  'Foco inabalável todos os dias',
  'Motivação em nível máximo',
  'Metas superadas constantemente',
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const slideLeft = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
const slideRight = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

function RadarChart({ values, color, size = 154 }) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 26
  const n = RADAR_ATTRS.length

  const pt = (v, i) => {
    const a = (i * 360 / n - 90) * (Math.PI / 180)
    return [cx + v * maxR * Math.cos(a), cy + v * maxR * Math.sin(a)]
  }

  const data = values.map((v, i) => pt(v, i))
  const poly = data.map(p => p.join(',')).join(' ')

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Background grid */}
      {[0.25, 0.5, 0.75, 1].map(l => (
        <polygon key={l}
          points={values.map((_, i) => pt(l, i).join(',')).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.75"
        />
      ))}
      {/* Axis spokes */}
      {values.map((_, i) => {
        const [x2, y2] = pt(1, i)
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.07)" strokeWidth="0.75" />
      })}
      {/* Glow layer */}
      <polygon points={poly} fill="none" stroke={color}
        strokeWidth="6" strokeLinejoin="round"
        style={{ filter: 'blur(8px)', opacity: 0.4 }} />
      {/* Main polygon */}
      <polygon points={poly}
        fill={color + '20'} stroke={color}
        strokeWidth="1.5" strokeLinejoin="round" />
      {/* Vertex dots */}
      {data.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      ))}
      {/* Axis labels */}
      {RADAR_ATTRS.map((label, i) => {
        const [x, y] = pt(1.42, i)
        return (
          <text key={i} x={x} y={y} textAnchor="middle"
            dominantBaseline="middle" fill="rgba(255,255,255,0.4)"
            fontSize="8" fontFamily="system-ui, sans-serif">
            {label}
          </text>
        )
      })}
    </svg>
  )
}

function PlayerCard({ side, imageSrc, imageAlt, radarValues, radarColor, badgeBg, badgeBorder, dotColor, badgeLabel, score, scoreColor, bullets, bulletVariant, cardBg, cardBorder, cardShadow }) {
  return (
    <motion.div className="flex flex-col gap-5"
      initial={{ opacity: 0, x: side === 'before' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: side === 'after' ? 0.1 : 0 }}
    >
      {/* Card */}
      <div className="rounded-3xl flex flex-col items-center pb-7"
        style={{ background: cardBg, border: cardBorder, boxShadow: cardShadow }}>

        {/* Character + radar */}
        <div className="relative w-full flex justify-center" style={{ height: 380 }}>
          {/* Radar positioned at torso (60% down from top) */}
          <div style={{
            position: 'absolute',
            top: '58%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}>
            <RadarChart values={radarValues} color={radarColor} size={154} />
          </div>
          {/* Character */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute bottom-0 h-full object-contain select-none"
            style={{ zIndex: 2 }}
            draggable={false}
          />
        </div>

        {/* Label badge */}
        <div className="flex items-center gap-2 rounded-full px-4 py-1.5 mt-1"
          style={{ background: badgeBg, border: badgeBorder }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="text-xs font-bold text-white/65">{badgeLabel}</span>
        </div>

        {/* Score */}
        <div className="text-center mt-4">
          <p className="text-5xl font-black leading-none"
            style={{ color: scoreColor, textShadow: side === 'after' ? '0 0 30px rgba(204,255,0,0.4)' : 'none' }}>
            {score}
          </p>
          <p className="text-xs text-white/30 mt-2 tracking-widest uppercase">Performance Geral</p>
        </div>
      </div>

      {/* Bullet points */}
      <motion.ul className="flex flex-col gap-3 px-1"
        variants={stagger} initial="hidden"
        whileInView="visible" viewport={{ once: true, margin: '-40px' }}
      >
        {bullets.map(b => (
          <motion.li key={b} variants={bulletVariant}
            className="flex items-center gap-3 text-sm text-white/50">
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: side === 'before' ? 'rgba(248,113,113,0.7)' : NEON }} />
            {b}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default function PlayerEvolution({ onStartQuiz }) {
  return (
    <section className="relative py-24 w-full" style={{ overflowX: 'clip' }}>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div style={{
          position: 'absolute', left: '0%', top: '15%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }} />
        <div style={{
          position: 'absolute', right: '0%', top: '15%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,255,0,0.11) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{ background: 'rgba(204,255,0,0.07)', border: '1px solid rgba(204,255,0,0.22)' }}>
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: NEON }}>
              ↗ Transformação Real
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Sua Evolução em{' '}
            <span style={{ color: NEON }}>66 Dias</span>
          </h2>
          <p className="mt-4 text-white/45 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Baseado na ciência dos hábitos, veja como seus indicadores de
            performance evoluem com o ORION.
          </p>
        </motion.div>

        {/* 3-col grid: before | divider | after */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_68px_1fr] items-start">

          {/* Before */}
          <PlayerCard
            side="before"
            imageSrc="https://foffuc4nrdhxctbm.public.blob.vercel-storage.com/personagem-fraco.png"
            imageAlt="Você antes do ORION"
            radarValues={BEFORE_RADAR}
            radarColor="#a855f7"
            badgeBg="rgba(168,85,247,0.1)"
            badgeBorder="1px solid rgba(168,85,247,0.3)"
            dotColor="rgba(248,113,113,0.9)"
            badgeLabel="Você sem o ORION"
            score="3.4"
            scoreColor="#c084fc"
            bullets={BEFORE_BULLETS}
            bulletVariant={slideLeft}
            cardBg="linear-gradient(160deg, rgba(109,40,217,0.14) 0%, rgba(1,2,8,0.55) 70%)"
            cardBorder="1px solid rgba(139,92,246,0.28)"
            cardShadow="0 0 60px rgba(109,40,217,0.16)"
          />

          {/* Center divider — desktop */}
          <div className="hidden lg:flex flex-col items-center self-stretch py-6">
            <motion.div className="w-px flex-1"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(204,255,0,0.65) 50%, transparent)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="my-3 shrink-0 rounded-full px-3 py-2"
              style={{
                background: '#010208',
                border: `1.5px solid ${NEON}`,
                boxShadow: `0 0 18px rgba(204,255,0,0.22)`,
              }}>
              <span className="block text-center text-[9px] font-black tracking-[0.18em] uppercase"
                style={{ color: NEON, lineHeight: '1.5' }}>
                EVOLUÇÃO
              </span>
            </div>
            <motion.div className="w-px flex-1"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(204,255,0,0.65) 50%, transparent)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Center divider — mobile */}
          <div className="lg:hidden flex items-center gap-3 my-7">
            <div className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(204,255,0,0.4))' }} />
            <div className="rounded-full px-3 py-1.5"
              style={{ border: `1px solid ${NEON}`, background: '#010208', boxShadow: `0 0 12px rgba(204,255,0,0.2)` }}>
              <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: NEON }}>
                EVOLUÇÃO
              </span>
            </div>
            <div className="flex-1 h-px"
              style={{ background: 'linear-gradient(to left, transparent, rgba(204,255,0,0.4))' }} />
          </div>

          {/* After */}
          <PlayerCard
            side="after"
            imageSrc="https://foffuc4nrdhxctbm.public.blob.vercel-storage.com/personagem-forte.png"
            imageAlt="Você depois do ORION"
            radarValues={AFTER_RADAR}
            radarColor={NEON}
            badgeBg="rgba(204,255,0,0.08)"
            badgeBorder="1px solid rgba(204,255,0,0.3)"
            dotColor={NEON}
            badgeLabel="Você com o ORION"
            score="8.1"
            scoreColor={NEON}
            bullets={AFTER_BULLETS}
            bulletVariant={slideRight}
            cardBg="linear-gradient(160deg, rgba(204,255,0,0.09) 0%, rgba(1,2,8,0.55) 70%)"
            cardBorder="1px solid rgba(204,255,0,0.28)"
            cardShadow="0 0 80px rgba(204,255,0,0.13)"
          />

        </div>

        {/* CTA */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ButtonNeon onClick={onStartQuiz}>Começar Agora</ButtonNeon>
        </motion.div>

      </div>
    </section>
  )
}
