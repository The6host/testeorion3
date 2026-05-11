import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const navLinks = ['Funcionalidades', 'Como Funciona', 'Preços', 'Comunidade']

const NEON = '#ccff00'

export default function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleEntrar() {
    setOpen(false)
    navigate('/login')
  }

  return (
    <>
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 z-10"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }}
            transition={{ duration: 0.22 }}
            className="block h-0.5 w-6 bg-white origin-center"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
            transition={{ duration: 0.18 }}
            className="block h-0.5 w-6 bg-white"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0, width: open ? 24 : 16 }}
            transition={{ duration: 0.22 }}
            className="block h-0.5 bg-white origin-center"
            style={{ width: open ? 24 : 16 }}
          />
        </button>
      </motion.header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[64px] left-0 right-0 z-40 md:hidden"
            style={{
              background: 'rgba(1,2,8,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors py-3 border-b border-white/5"
                >
                  {link}
                </motion.a>
              ))}

              {/* Mobile CTA */}
              <motion.button
                onClick={handleEntrar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: navLinks.length * 0.05 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 mb-2 w-full rounded-md py-3 text-sm font-black tracking-wider text-black uppercase"
                style={{ backgroundColor: NEON, boxShadow: '0 0 20px #ccff0055' }}
              >
                Entrar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
