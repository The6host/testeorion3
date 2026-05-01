import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'

const NEON = '#ccff00'

const STEPS = [
  {
    n: 1,
    title: 'DEFINA SUAS\nMISSÕES',
    desc: 'Escolha o que realmente importa e crie suas missões diárias.',
  },
  {
    n: 2,
    title: 'CUMPRA SUAS\nMISSÕES',
    desc: 'Execute suas tarefas, crie hábitos e mantenha sua sequência.',
  },
  {
    n: 3,
    title: 'GANHE XP E\nSUBA DE NÍVEL',
    desc: 'Cada ação te faz evoluir. Quanto mais consistente, maior seu nível.',
  },
  {
    n: 4,
    title: 'DESBLOQUEIE SUA\nMELHOR VERSÃO',
    desc: 'Veja sua transformação acontecer e viva seu máximo potencial.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
}

const stepVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function HowItWorks() {
  return (
    <section className="relative py-24 w-full" style={{ overflowX: 'clip' }}>

      {/* Glow central */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(109,40,217,0.1) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* Cabeçalho */}
        <motion.h2
          className="text-center text-3xl md:text-4xl font-black text-white tracking-tight mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          COMO FUNCIONA?
        </motion.h2>

        {/* Passos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex flex-col md:flex-row items-stretch">

              {/* Passo */}
              <motion.div
                variants={stepVariants}
                className="flex flex-col gap-4 px-4 py-2 flex-1"
              >
                {/* Círculo numerado */}
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-full font-black text-base shrink-0"
                  style={{
                    border: `1.5px solid ${NEON}`,
                    color: NEON,
                    boxShadow: `0 0 16px rgba(204,255,0,0.2), inset 0 0 12px rgba(204,255,0,0.08)`,
                    background: 'rgba(204,255,0,0.05)',
                  }}
                >
                  {step.n}
                </div>

                {/* Título */}
                <h3 className="text-sm font-black tracking-wide text-white leading-snug whitespace-pre-line">
                  {step.title}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>

              {/* Conector — seta direita no desktop, seta baixo no mobile */}
              {i < STEPS.length - 1 && (
                <motion.div
                  variants={stepVariants}
                  className="flex items-center justify-center text-white/20 py-2 md:py-0 md:px-1"
                >
                  {/* Desktop: seta direita */}
                  <ChevronRight
                    size={22}
                    className="hidden md:block"
                    strokeWidth={1.5}
                  />
                  {/* Mobile: seta baixo */}
                  <ChevronDown
                    size={22}
                    className="block md:hidden"
                    strokeWidth={1.5}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
