import { motion } from 'framer-motion'

const ORBS = [
  {
    style: { width: 340, height: 340, background: 'radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%)' },
    pos:   { top: '5%',  left: '-8%'  },
    fadeDuration: 6,
    fadeDelay:    0,
  },
  {
    style: { width: 280, height: 280, background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' },
    pos:   { top: '15%', left: '65%'  },
    fadeDuration: 8,
    fadeDelay:    2.5,
  },
  {
    style: { width: 320, height: 320, background: 'radial-gradient(circle, rgba(79,70,229,0.20) 0%, transparent 70%)' },
    pos:   { top: '55%', left: '10%'  },
    fadeDuration: 7,
    fadeDelay:    1.2,
  },
  {
    style: { width: 260, height: 260, background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)' },
    pos:   { top: '60%', left: '72%'  },
    fadeDuration: 9,
    fadeDelay:    4,
  },
]

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            ...orb.style,
            ...orb.pos,
            filter: 'blur(80px)',
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: orb.fadeDuration,
            delay: orb.fadeDelay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
