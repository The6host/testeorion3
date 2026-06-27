import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const navLinks = ['Funcionalidades', 'Como Funciona', 'Preços', 'Comunidade']

const NEON = '#ccff00'

export default function Header() {
  const navigate = useNavigate()

  function handleEntrar() {
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2">
        <img
          src="https://i.imgur.com/FwQdsn4.png"
          alt="Orion"
          className="h-8 w-auto object-contain"
        />
      </a>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Desktop CTA */}
      <motion.button
        onClick={handleEntrar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="hidden md:block rounded-md px-5 py-2.5 text-sm font-black tracking-wider text-black uppercase"
        style={{ backgroundColor: NEON, boxShadow: '0 0 20px #ccff0055' }}
      >
        Entrar
      </motion.button>

      {/* Mobile CTA */}
      <motion.button
        onClick={handleEntrar}
        whileTap={{ scale: 0.97 }}
        className="md:hidden rounded-md font-black tracking-wider text-black uppercase"
        style={{ backgroundColor: NEON, fontSize: 13, padding: '8px 16px' }}
      >
        ENTRAR
      </motion.button>
    </motion.header>
  )
}
