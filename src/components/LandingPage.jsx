import Navbar from './landing/Navbar'
import Hero from './landing/Hero'
import Features from './landing/Features'
import HowItWorks from './landing/HowItWorks'
import ClosingCTA from './landing/ClosingCTA'
import Footer from './landing/Footer'

export default function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1A1A1A]">
      <Navbar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Features />
      <HowItWorks />
      <ClosingCTA onLogin={onLogin} />
      <Footer />
    </div>
  )
}