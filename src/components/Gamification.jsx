import { motion } from 'framer-motion'
import { Sword, Flame, BarChart2, Trophy } from 'lucide-react'

const NEON = '#ccff00'

const FEATURES = [
  {
    icon: Sword,
    title: 'Missões Diárias',
    desc: 'Tarefas transformadas em missões épicas que te motivam a agir todos os dias.',
  },
  {
    icon: Flame,
    title: 'Hábitos Poderosos',
    desc: 'Construa sequências imbatíveis e nunca mais quebre sua corrente de progresso.',
  },
  {
    icon: BarChart2,
    title: 'Progresso Visual',
    desc: 'Acompanhe sua evolução em tempo real com dashboards dignos de um herói.',
  },
  {
    icon: Trophy,
    title: 'Recompensas Épicas',
    desc: 'Suba de nível, desbloqueie conquistas e celebre cada vitória no seu caminho.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function Gamification() {
  return (
    <section className="relative py-28 w-full" style={{ overflowX: 'clip' }}>

      {/* Glow de fundo */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.13) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── Coluna esquerda — Imagem 3D ── */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {/* Wrapper para entrada + flutuação separadas */}
            <motion.div
              className="w-full max-w-xs md:max-w-sm"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src="https://i.ibb.co/DHTyWHCX/73-Sem-T-tulo-20260430214912.png"
                alt="Gamificação 3D"
                className="w-full h-auto select-none"
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  filter: 'drop-shadow(0 20px 60px rgba(109,40,217,0.35)) drop-shadow(0 0 40px rgba(79,70,229,0.2))',
                }}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* ── Coluna direita — Textos e features ── */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Título */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-tight tracking-tight">
                <span className="text-white">E SE SUA VIDA FOSSE</span>
                <br />
                <span style={{ color: NEON }}>UM JOGO?</span>
              </h2>
            </motion.div>

            {/* Subtítulo */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/55 leading-relaxed max-w-md"
            >
              O ORION transforma sua rotina em uma jornada épica. Cada hábito vira uma missão,
              cada dia vencido te faz subir de nível. A evolução deixa de ser abstrata e
              passa a ser visual, tangível e viciante.
            </motion.p>

            {/* Grade de features — 4 colunas horizontais */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2"
            >
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col gap-2">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full mb-1"
                    style={{
                      background: 'rgba(204,255,0,0.1)',
                      border: '1px solid rgba(204,255,0,0.25)',
                    }}
                  >
                    <Icon size={18} color={NEON} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xs font-black tracking-wider text-white uppercase leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
