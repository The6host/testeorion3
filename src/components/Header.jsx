import { motion } from 'framer-motion'

const navLinks = ['Funcionalidades', 'Como Funciona', 'Preços', 'Comunidade']

export default function Header() {
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

      {/* CTA */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="hidden md:block rounded-md px-5 py-2.5 text-sm font-black tracking-wider text-black uppercase"
        style={{ backgroundColor: '#ccff00', boxShadow: '0 0 20px #ccff0055' }}
      >
        Entrar
      </motion.a>

      {/* Mobile hamburger */}
      <button className="md:hidden flex flex-col gap-1.5 p-2">
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-4 bg-white" />
      </button>
    </motion.header>
  )
}
