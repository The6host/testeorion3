import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NEON = '#ccff00'
const BG   = '#010208'

export default function Obrigado() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100dvh',
      background: BG,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px',
    }}>

      {/* Logo */}
      <div style={{ paddingTop: 28, paddingBottom: 0, width: '100%', maxWidth: 520, display: 'flex', justifyContent: 'center' }}>
        <img
          src="https://i.imgur.com/FwQdsn4.png"
          alt="Orion"
          style={{ height: 32, objectFit: 'contain' }}
        />
      </div>

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 480,
          gap: 0,
          paddingTop: 24,
          paddingBottom: 48,
          textAlign: 'center',
        }}
      >

        {/* Ícone check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <CheckCircle2 size={72} color={NEON} strokeWidth={1.5} />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            fontSize: 'clamp(26px, 6vw, 36px)',
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          COMPRA CONFIRMADA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}
        >
          Bem-vindo ao Orion.
        </motion.p>

        {/* Divisor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }}
        />

        {/* Bloco "Como acessar" + botão */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
        >

          {/* Bloco de instruções */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 14,
            padding: '20px 22px',
            textAlign: 'left',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 16,
            }}>
              Como acessar
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: `${NEON}18`,
                  border: `1px solid ${NEON}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: NEON, marginTop: 1,
                }}>1</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  Use o email que você utilizou na compra
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: `${NEON}18`,
                  border: `1px solid ${NEON}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: NEON, marginTop: 1,
                }}>2</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  Senha inicial:{' '}
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: 15,
                    color: '#fff',
                    background: 'rgba(204,255,0,0.12)',
                    border: `1px solid ${NEON}55`,
                    borderRadius: 6,
                    padding: '2px 8px',
                    letterSpacing: '0.08em',
                  }}>
                    12345678
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginTop: 1,
                }}>3</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
                  Recomendamos trocar a senha nas configurações do perfil após entrar
                </p>
              </div>

            </div>
          </div>

          {/* Botão */}
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '16px 0',
              background: NEON,
              color: '#000',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(204,255,0,0.3)',
            }}
          >
            Entrar no Orion
          </button>

          {/* Divisor */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Suporte */}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            Precisa de ajuda?{' '}
            <a
              href="mailto:suporteorionapp@gmail.com"
              style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}
            >
              suporteorionapp@gmail.com
            </a>
          </p>

        </motion.div>
      </motion.div>
    </div>
  )
}
