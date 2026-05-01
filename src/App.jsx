import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import PainPoints from './components/PainPoints'
import Gamification from './components/Gamification'
import HowItWorks from './components/HowItWorks'
import TestimonialAndCTA from './components/TestimonialAndCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative bg-black w-full">
      <Header />
      <Hero />
      <PainPoints />
      <Gamification />
      <HowItWorks />
      <TestimonialAndCTA />
      <Footer />
    </div>
  )
}
