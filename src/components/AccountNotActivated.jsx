import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUserDataContext } from '../context/UserDataContext'

const PUR   = '#7C3AED'
const MUTED = '#888888'

export default function AccountNotActivated() {
  const navigate  = useNavigate()
  const { userEmail, reload } = useUserDataContext()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* Logo */}
        <img
          src="https://i.imgur.com/FwQdsn4.png"
          alt="Orion"
          style={{ height: 40, width: 'auto', marginBottom: 32 }}
        />

        {/* Ícone */}
        <Lock size={48} color={PUR} style={{ marginBottom: 24 }} />

        {/* Título */}
        <h1 style={{
          fontSize: 22,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: 1,
          textAlign: 'center',
          marginBottom: 16,
          margin: '0 0 16px',
        }}>
          CONTA NÃO ATIVADA
        </h1>

        {/* Mensagem */}
        <p style={{ fontSize: 14, color: MUTED, textAlign: 'center', marginBottom: 4 }}>
          Não encontramos uma compra ativa para o email:
        </p>
        <p style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          textAlign: 'center',
          marginBottom: 32,
          wordBreak: 'break-all',
        }}>
          {userEmail || '—'}
        </p>

        {/* Botão principal */}
        <button
          onClick={() => { window.location.href = '/' }}
          style={{
            width: '100%',
            height: 52,
            background: PUR,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 1,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          COMPRAR ORION
        </button>

        {/* Botão "Já paguei" */}
        <button
          onClick={reload}
          style={{
            width: '100%',
            height: 44,
            background: 'transparent',
            color: MUTED,
            border: '1px solid #222',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          JÁ PAGUEI, ATUALIZAR
        </button>

        {/* Botão logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            height: 44,
            background: 'transparent',
            color: MUTED,
            border: '1px solid #222',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            marginBottom: 32,
          }}
        >
          SAIR
        </button>

        {/* Rodapé suporte */}
        <p style={{ fontSize: 12, color: MUTED, opacity: 0.6, textAlign: 'center', marginBottom: 4 }}>
          Dúvidas?
        </p>
        <a
          href="mailto:suporteorion@gmail.com"
          style={{ fontSize: 12, color: PUR, textAlign: 'center', textDecoration: 'none' }}
        >
          suporteorion@gmail.com
        </a>

      </div>
    </motion.div>
  )
}
