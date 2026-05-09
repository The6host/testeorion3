import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
import Quiz from './components/Quiz'

function Landing() {
  const navigate = useNavigate()
  const [isBooting,   setIsBooting]   = useState(true)
  const [showLanding, setShowLanding] = useState(false)

  function startQuiz() { navigate('/quiz') }

  return (
    <div className="relative w-full" style={{ backgroundColor: '#010208', overflowX: 'clip' }}>
      <BackgroundEffects />

      <AnimatePresence onExitComplete={() => setShowLanding(true)}>
        {isBooting && (
          <BootSequence key="boot" onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      {showLanding && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Header onStartQuiz={startQuiz} />
          <Hero onStartQuiz={startQuiz} />
          <SectionDivider />
          <PainPoints />
          <SectionDivider />
          <Gamification />
          <SectionDivider />
          <PlayerEvolution />
          <SectionDivider />
          <HowItWorks />
          <SectionDivider />
          <TestimonialAndCTA onStartQuiz={startQuiz} />
          <SectionDivider />
          <Footer />
        </motion.div>
      )}
    </div>
  )
}

function QuizPage() {
  const navigate = useNavigate()
  return (
    <Quiz onClose={() => navigate('/')} />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"     element={<Landing />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}
