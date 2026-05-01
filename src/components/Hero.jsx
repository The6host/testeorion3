import { motion } from 'framer-motion'
import { ButtonNeon, ButtonGhost } from './UI/Button'

const AVATARS = [
  'https://i.pravatar.cc/48?img=1',
  'https://i.pravatar.cc/48?img=5',
  'https://i.pravatar.cc/48?img=9',
  'https://i.pravatar.cc/48?img=12',
  'https://i.pravatar.cc/48?img=17',
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

export default function Hero() {
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
      {/* Ambient glow behind mockup on the right */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[800px] w-[700px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.16) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Mockup — right side, invades section below ── */}
      <motion.div
        className="absolute right-0 top-0 hidden lg:block pointer-events-none"
        style={{ width: '58%', height: '120vh' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 z-10 h-28"
          style={{
            background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          }}
        />

        <motion.img
          src="https://i.ibb.co/8gSXG1mV/mockup-orion-1.png"
          alt="Orion App Mockup"
          className="w-full h-auto select-none object-contain object-top"
          style={{
            paddingTop: '72px',
            filter: 'drop-shadow(0 32px 80px rgba(109,40,217,0.28))',
          }}
          draggable={false}
        />
      </motion.div>

      {/* ── Text content + mobile mockup wrapper ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 flex flex-col lg:block">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-7 w-full max-w-xl"
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
            <ButtonNeon>Começar Agora</ButtonNeon>
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
              <span className="font-bold text-white">+5.230</span> pessoas em missão
            </p>
          </motion.div>
        </motion.div>

        {/* Mobile mockup — aparece abaixo do texto em telas pequenas */}
        <motion.img
          src="https://i.ibb.co/8gSXG1mV/mockup-orion-1.png"
          alt="Orion App Mockup"
          className="lg:hidden mt-10 w-full max-w-sm mx-auto select-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ filter: 'drop-shadow(0 16px 40px rgba(109,40,217,0.2))' }}
          draggable={false}
        />
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
