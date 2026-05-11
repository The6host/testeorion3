import { useState } from 'react'
import { motion } from 'framer-motion'

const PAINS = [
  {
    icon: 'https://i.ibb.co/Q3YMtGBb/Design-sem-nome-2026-04-29-T173544-383.png',
    title: 'PROCRASTINAÇÃO\nCRÔNICA',
    text: 'Você sabe o que precisa fazer, mas sempre deixa para depois.',
    floatDelay: 0,
  },
  {
    icon: 'https://i.ibb.co/s8DYrmv/Design-sem-nome-2026-04-29-T173558-736.png',
    title: 'FALTA DE\nFOCO',
    text: 'Sua mente está sempre dispersa e nada se conclui.',
    floatDelay: 0.4,
  },
  {
    icon: 'https://i.ibb.co/39g3pLRL/Design-sem-nome-2026-04-29-T173555-833.png',
    title: 'FALTA DE\nCONSTÂNCIA',
    text: 'Você começa, mas não consegue manter por muito tempo.',
    floatDelay: 0.8,
  },
  {
    icon: 'https://i.ibb.co/Q7b8JLzp/Design-sem-nome-2026-04-29-T173532-857.png',
    title: 'SEM CLAREZA\nDE DIREÇÃO',
    text: 'Você não sabe por onde começar e se sente perdido.',
    floatDelay: 1.2,
  },
]

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -8,
    scale: 1.02,
    borderColor: 'rgba(168,85,247,0.6)',
    boxShadow: '0 0 30px rgba(168,85,247,0.2)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  tap: {
    scale: 1.02,
    borderColor: 'rgba(168,85,247,0.6)',
    boxShadow: '0 0 30px rgba(168,85,247,0.2)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

const iconVariants = {
  visible: { filter: 'drop-shadow(0 0 0px rgba(168,85,247,0))' },
  hover:   { filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.55))' },
  tap:     { filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.55))' },
}

export default function PainPoints() {
  const [selected, setSelected] = useState(null)

  function handleCardClick(title) {
    setSelected(prev => prev === title ? null : title)
  }

  return (
    <section
      className="relative pt-20 pb-24 w-full"
      style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >

      {/* ── Glow de fundo ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.1) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-12">

        {/* ── Cabeçalho da seção ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-sm font-bold tracking-[0.25em] uppercase mb-3"
            style={{ color: '#ccff00' }}
          >
            Chega de viver no modo fácil.
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            VOCÊ SE IDENTIFICA?
          </h2>
        </motion.div>

        {/* ── Grade de 4 cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PAINS.map((pain) => (
            <motion.div
              key={pain.title}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              animate={selected === pain.title ? 'hover' : 'visible'}
              onClick={() => handleCardClick(pain.title)}
              onHoverStart={() => setSelected(null)}
              className="flex flex-col items-center text-center gap-5 rounded-2xl p-6 cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              {/* Ícone — herda "hover" e "tap" do pai via variants */}
              <motion.img
                src={pain.icon}
                alt={pain.title}
                variants={iconVariants}
                className="w-28 h-28 object-contain select-none"
                draggable={false}
              />

              {/* Título */}
              <h3 className="text-base font-black tracking-wider text-white leading-snug whitespace-pre-line">
                {pain.title}
              </h3>

              {/* Descrição */}
              <p className="text-[15px] text-white/50 leading-relaxed">
                {pain.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
