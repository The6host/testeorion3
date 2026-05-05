import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import PainPoints from './components/PainPoints'
import Gamification from './components/Gamification'
import HowItWorks from './components/HowItWorks'
import TestimonialAndCTA from './components/TestimonialAndCTA'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'

export default function App() {
  return (
    <div className="relative w-full" style={{ backgroundColor: '#030415', overflowX: 'clip' }}>
      <Header />
      <Hero />
      <SectionDivider />
      <PainPoints />
      <SectionDivider />
      <Gamification />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <TestimonialAndCTA />
      <SectionDivider />
      <Footer />
    </div>
  )
}
