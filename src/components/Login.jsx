import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackgroundEffects from './BackgroundEffects'
import { supabase } from '../lib/supabase'

const PUR   = '#7C3AED'
const MUTED = '#888888'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
})

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [focused,  setFocused]  = useState(null)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      setError(getErrorMessage(authError.message))
      return
    }

    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#080808',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', padding: '24px', boxSizing: 'border-box',
    }}>
      <BackgroundEffects />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
          <img src="https://i.imgur.com/FwQdsn4.png" alt="Orion" style={{ height: 32, objectFit: 'contain' }} />
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>ORION</span>
        </motion.div>

        {/* Card */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            background: '#111111',
            border: '1px solid #222222',
            borderRadius: 20,
            padding: '36px 32px 32px',
          }}
        >
          <motion.div {...fadeUp(0.18)} style={{ marginBottom: 28, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Bem-vindo de volta
            </h1>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>
              Acesse sua conta e continue evoluindo
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <motion.div {...fadeUp(0.24)} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="seu@email.com"
                autoComplete="email"
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: '#0f0f0f',
                  border: `1px solid ${focused === 'email' ? PUR + '88' : '#222222'}`,
                  borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                  boxShadow: focused === 'email' ? `0 0 0 3px ${PUR}18` : 'none',
                }}
              />
            </motion.div>

            {/* Senha */}
            <motion.div {...fadeUp(0.30)} style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    background: '#0f0f0f',
                    border: `1px solid ${focused === 'pass' ? PUR + '88' : '#222222'}`,
                    borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    boxShadow: focused === 'pass' ? `0 0 0 3px ${PUR}18` : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: MUTED, display: 'flex', padding: 4, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Esqueci senha */}
            <motion.div {...fadeUp(0.35)} style={{ textAlign: 'right', marginBottom: 24 }}>
              <a
                href="#"
                style={{ fontSize: 13, color: PUR, textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Esqueci minha senha
              </a>
            </motion.div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  marginBottom: 16, padding: '12px 16px',
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 9, color: '#F87171', fontSize: 13, lineHeight: 1.5,
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div {...fadeUp(0.40)}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.97 }}
                style={{
                  width: '100%', padding: '15px 0',
                  background: loading ? `${PUR}88` : PUR,
                  color: '#fff', border: 'none', borderRadius: 10,
                  fontWeight: 900, fontSize: 15, letterSpacing: '0.04em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase', transition: 'background 0.2s',
                }}
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </motion.button>
            </motion.div>

          </form>
        </motion.div>

        {/* Rodapé */}
        <motion.p {...fadeUp(0.48)} style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#333333', lineHeight: 1.6 }}>
          Acesso exclusivo para membros.{' '}
          <a href="/" style={{ color: PUR, textDecoration: 'none', fontWeight: 600 }}>Adquira seu plano</a>.
        </motion.p>

      </div>
    </div>
  )
}

function getErrorMessage(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (msg.includes('Email not confirmed'))        return 'Confirme seu e-mail antes de entrar.'
  if (msg.includes('Too many requests'))          return 'Muitas tentativas. Aguarde alguns minutos.'
  return 'Erro ao entrar. Tente novamente.'
}
