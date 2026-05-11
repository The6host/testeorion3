import { useState, useRef, useCallback, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playClick } from './utils/clickSFX'
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
import ProfileAnalysis from './components/ProfileAnalysis'
import SystemVoiceReveal from './components/SystemVoiceReveal'
import PricingCarousel   from './components/PricingCarousel'

const AUDIO_URL = 'https://res.cloudinary.com/dctzllsly/video/upload/v1778378449/music-bg-orion_j3uur9.mp3'
const NEON = '#ccff00'

/* ── Botão de mute flutuante ── */
function MuteButton({ muted, onToggle, visible }) {
  if (!visible) return null
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onToggle}
      title={muted ? 'Ativar som' : 'Silenciar'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        width: 42, height: 42, borderRadius: '50%',
        background: 'rgba(10,10,20,0.85)',
        border: `1px solid ${muted ? 'rgba(255,255,255,0.15)' : 'rgba(204,255,0,0.35)'}`,
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: muted ? 'rgba(255,255,255,0.35)' : NEON,
        boxShadow: muted ? 'none' : '0 0 12px rgba(204,255,0,0.2)',
        transition: 'all 0.25s',
      }}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      )}
    </motion.button>
  )
}

/* ── Audio controller (singleton no topo) ── */
function useAudio() {
  const audioRef  = useRef(null)
  const [muted,   setMuted]   = useState(false)
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    if (audioRef.current) return
    const a = new Audio(AUDIO_URL)
    a.loop   = true
    a.volume = 0.18
    a.play().catch(() => {})
    audioRef.current = a
    setStarted(true)
  }, [])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioRef.current.muted
    setMuted(m => !m)
  }, [])

  return { start, toggle, muted, started, audioRef }
}

/* ── Pages ── */
function Landing({ onAudioStart }) {
  const navigate = useNavigate()
  const [isBooting,   setIsBooting]   = useState(true)
  const [showLanding, setShowLanding] = useState(false)

  function startQuiz() { navigate('/quiz') }

  return (
    <div className="relative w-full" style={{ backgroundColor: '#010208', overflowX: 'clip' }}>
      <BackgroundEffects />

      <AnimatePresence onExitComplete={() => setShowLanding(true)}>
        {isBooting && (
          <BootSequence
            key="boot"
            onComplete={() => setIsBooting(false)}
            onFirstClick={onAudioStart}
          />
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
          <PlayerEvolution onStartQuiz={startQuiz} />
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
  return <Quiz onClose={() => navigate('/')} onComplete={() => navigate('/analyzing')} />
}

function AnalyzingPage() {
  const navigate = useNavigate()
  return <ProfileAnalysis onComplete={() => navigate('/voice')} />
}

function VoicePage({ bgAudioRef }) {
  const navigate = useNavigate()
  return <SystemVoiceReveal onComplete={() => navigate('/pricing')} bgAudioRef={bgAudioRef} />
}

function PricingPage() {
  return <PricingCarousel />
}

/* ── Root ── */
export default function App() {
  const { start, toggle, muted, started, audioRef } = useAudio()

  /* Listener global de clique — dispara em fase de captura (mais cedo possível) */
  useEffect(() => {
    function onGlobalClick(e) {
      if (e.target.closest('button')) playClick()
    }
    document.addEventListener('click', onGlobalClick, true)
    return () => document.removeEventListener('click', onGlobalClick, true)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/"          element={<Landing onAudioStart={start} />} />
        <Route path="/quiz"      element={<QuizPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/voice"     element={<VoicePage bgAudioRef={audioRef} />} />
        <Route path="/pricing"   element={<PricingPage />} />
      </Routes>

      <MuteButton muted={muted} onToggle={toggle} visible={started} />
    </>
  )
}
