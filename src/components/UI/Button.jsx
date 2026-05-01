import { motion } from 'framer-motion'

export function ButtonNeon({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-md px-8 py-4 font-black text-sm tracking-widest text-black uppercase cursor-pointer ${className}`}
      style={{ backgroundColor: '#ccff00' }}
    >
      {/* Pulsing inner glow */}
      <motion.span
        className="absolute inset-0 rounded-md"
        style={{ backgroundColor: '#ccff00' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function ButtonGhost({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-4 font-semibold text-sm text-white backdrop-blur-sm cursor-pointer hover:border-white/40 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  )
}
