import { motion } from 'framer-motion'
import { ButtonNeon } from './UI/Button'

const NEON = '#ccff00'

const GLASS = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function TestimonialAndCTA() {
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

          {/* ── Coluna esquerda — Depoimento ── */}
          <motion.div
            className="lg:w-[44%] flex flex-col gap-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
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

            {/* Card glassmorphism */}
            <div className="rounded-3xl p-7 flex flex-col gap-5 flex-1" style={GLASS}>

              {/* Aspas */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0L16 3.2C11.2 4.8 8.8 7.2 8.8 10.4H14.4V24H0ZM17.6 24V14.4C17.6 6.4 22.4 1.6 32 0L33.6 3.2C28.8 4.8 26.4 7.2 26.4 10.4H32V24H17.6Z" fill={NEON} />
              </svg>

              {/* Texto */}
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                O ORION mudou{' '}
                <span className="font-bold text-white">completamente minha vida</span>.
                Finalmente consegui ter disciplina e foco para conquistar meus objetivos!
              </p>

              {/* Estrelas */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < 4 ? NEON : 'rgba(255,255,255,0.2)'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Perfil */}
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.6), rgba(79,70,229,0.4))' }}
                >
                  L
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Lucas R.</p>
                  <p className="text-white/40 text-xs">Empreendedor</p>
                </div>
              </div>
            </div>
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
            {/* Card CTA — sem overflow-hidden para o planeta vazar */}
            <div
              className="relative rounded-3xl p-8 md:p-10 h-full flex flex-col justify-center gap-6 pb-36 md:pb-10"
              style={GLASS}
            >
              {/* Título CTA */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  PRONTO PARA INICIAR
                </h2>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: NEON }}>
                  SUA MISSÃO?
                </h2>
              </div>

              {/* Subtítulo */}
              <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xs">
                Junte-se a milhares de pessoas que estão evoluindo todos os dias com o ORION.
              </p>

              {/* Botão */}
              <div className="flex flex-col gap-3">
                <div>
                  <ButtonNeon>Começar Agora</ButtonNeon>
                </div>
                <p className="text-white/35 text-xs">
                  7 dias grátis • Cancele quando quiser
                </p>
              </div>

              {/* Planeta — vaza pela direita no desktop, centralizado no mobile */}
              <motion.img
                src="https://i.ibb.co/mrMwmG8v/file-000000005b8871f58b4d2354ed6b0d6e.png"
                alt="Planeta 3D"
                className="pointer-events-none select-none absolute
                           bottom-4 right-4 w-40
                           md:bottom-auto md:right-0 md:translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:w-80
                           lg:w-96"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(109,40,217,0.45))',
                  zIndex: 10,
                }}
                draggable={false}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
