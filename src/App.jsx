import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import PainPoints from './components/PainPoints'
import Gamification from './components/Gamification'
import PlayerEvolution from './components/PlayerEvolution'
import HowItWorks from './components/HowItWorks'
import TestimonialAndCTA from './components/TestimonialAndCTA'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'
import BootSequence from './components/BootSequence'
import BackgroundEffects from './components/BackgroundEffects'

export default function App() {
  const [isBooting, setIsBooting] = useState(true)   // controla se o overlay existe no DOM
  const [showLanding, setShowLanding] = useState(false) // só true após overlay sumir do DOM

  return (
    <div className="relative w-full" style={{ backgroundColor: '#010208', overflowX: 'clip' }}>
      <BackgroundEffects />

      {/* Boot overlay — AnimatePresence executa o exit={{ opacity: 0 }} do motion.div interno */}
      {/* onExitComplete dispara APÓS o fade-out terminar completamente */}
      <AnimatePresence onExitComplete={() => setShowLanding(true)}>
        {isBooting && (
          <BootSequence key="boot" onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      {/* Landing page — só monta depois que o overlay foi removido do DOM */}
      {showLanding && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Header />
          <Hero />
          <SectionDivider />
          <PainPoints />
          <SectionDivider />
          <Gamification />
          <SectionDivider />
          <PlayerEvolution />
          <SectionDivider />
          <HowItWorks />
          <SectionDivider />
          <TestimonialAndCTA />
          <SectionDivider />
          <Footer />
        </motion.div>
      )}

    </div>
  )
}
