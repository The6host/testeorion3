import { motion } from 'framer-motion'

const ORBS = [
  {
    style: { width: 600, height: 600, background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)' },
    initial: { x: '-20%', y: '10%' },
    animate: { x: ['−20%', '15%', '-10%', '-20%'], y: ['10%', '-15%', '30%', '10%'] },
    duration: 22,
  },
  {
    style: { width: 500, height: 500, background: 'radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)' },
    initial: { x: '60%', y: '50%' },
    animate: { x: ['60%', '40%', '70%', '60%'], y: ['50%', '20%', '60%', '50%'] },
    duration: 18,
  },
  {
    style: { width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' },
    initial: { x: '30%', y: '70%' },
    animate: { x: ['30%', '50%', '20%', '30%'], y: ['70%', '55%', '80%', '70%'] },
    duration: 26,
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
            filter: 'blur(90px)',
            top: 0,
            left: 0,
          }}
          initial={orb.initial}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
