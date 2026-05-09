import { motion } from 'framer-motion'
import { ButtonNeon, ButtonGhost } from './UI/Button'
import HeroMockup from './HeroMockup'

const AVATARS = [
  'https://i.ibb.co/WN8bGb5y/Pfp5.jpg',
  'https://i.ibb.co/VWs1Qd5f/Pfp4.jpg',
  'https://i.ibb.co/20J1Bbtt/Pfp3.jpg',
  'https://i.ibb.co/VcJt7CpQ/Pfp2.jpg',
  'https://i.ibb.co/wZ5qXWnL/Pfp1.jpg',
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.35 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

const avatarVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 1.2 + i * 0.08, type: 'spring', stiffness: 300, damping: 18 },
  }),
}

export default function Hero({ onStartQuiz }) {
  return (
    <section className="relative min-h-screen w-full">

      {/* ── Radial background glows ── */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-[500px] w-[800px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* ── Layout: texto (esquerda) + mockup (direita) ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">

          {/* Coluna esquerda — texto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7 w-full lg:w-1/2 max-w-xl"
          >
            {/* Eyebrow */}
            <motion.p
              variants={itemVariants}
              className="text-sm font-bold tracking-[0.28em] uppercase"
              style={{ color: '#ccff00' }}
            >
              Rotina&nbsp;•&nbsp;Foco&nbsp;•&nbsp;Evolução
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[0.95] tracking-tight text-white"
            >
              TRANSFORME<br />
              SUA VIDA EM<br />
              UMA&nbsp;<span style={{ color: '#ccff00' }}>MISSÃO.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/55 leading-relaxed max-w-sm"
            >
              O ORION é o sistema que te ajuda a criar uma rotina épica, vencer a
              procrastinação e se tornar sua melhor versão todos os dias.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
              <ButtonNeon onClick={onStartQuiz}>Começar Agora</ButtonNeon>
              <ButtonGhost>
                <PlayIcon />
                Ver Demo
              </ButtonGhost>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {AVATARS.map((src, i) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt="avatar"
                    custom={i}
                    variants={avatarVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-10 w-10 rounded-full border-2 object-cover"
                    style={{ borderColor: '#000' }}
                  />
                ))}
              </div>
              <p className="text-sm text-white/55">
                <span className="font-bold text-white">+20.000</span> pessoas em missão
              </p>
            </motion.div>
          </motion.div>

          {/* Mockup mobile — versão completa escalada */}
        <div className="lg:hidden mt-10 flex justify-center" style={{ height: 371 }}>
          <div style={{
            transform: 'scale(0.65)',
            transformOrigin: 'top center',
            width: 560,
            height: 570,
            flexShrink: 0,
          }}>
            <HeroMockup />
          </div>
        </div>

        {/* Coluna direita — mockup desktop */}
          <motion.div
            className="hidden lg:flex lg:w-1/2 justify-center items-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'visible', pointerEvents: 'none' }}
          >
            <HeroMockup />
          </motion.div>

        </div>


      </div>
    </section>
  )
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}
