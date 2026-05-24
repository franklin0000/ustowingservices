import { Truck, User, Shield, Navigation, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const roles = [
  { id: 'client', label: 'Client', description: 'Request towing services', icon: User, color: 'from-blue-500 to-blue-700' },
  { id: 'driver', label: 'Tow Driver', description: 'Accept and manage jobs', icon: Navigation, color: 'from-emerald-500 to-emerald-700' },
  { id: 'admin', label: 'Administrator', description: 'Manage the platform', icon: Shield, color: 'from-purple-500 to-purple-700' },
]

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-brand-950 font-sans">
      {/* Sticky Header with Logo */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="US Towing Services Logo" className="h-12 w-auto object-contain drop-shadow-lg" />
            <span className="text-xl font-bold text-white hidden sm:block tracking-wide">US Towing Services</span>
          </div>
          <a href="#login-section" className="text-white font-medium hover:text-brand-300 transition-colors">
            Access Platform
          </a>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.15 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 2, ease: 'easeOut' }}
            src="/hero_bg.png" 
            alt="Towing Hero" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-900/60 to-brand-950"></div>
        </div>
        
        {/* Hero Content */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            Reliability. <span className="text-brand-400">Speed.</span> Professionalism.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            The premium towing service platform trusted nationwide. Request a tow or manage your fleet effortlessly.
          </p>
          <a 
            href="#login-section" 
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1 animate-bounce"
          >
            <ChevronDown className="w-8 h-8" />
          </a>
        </motion.div>
      </section>

      {/* Login Section */}
      <section id="login-section" className="min-h-screen bg-brand-950 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.8 }} 
          className="max-w-lg w-full"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-brand-200 text-lg">Select your role to explore the platform</p>
          </div>

          <div className="space-y-4">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => login(role.id)}
                className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">{role.label}</p>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{role.description}</p>
                </div>
                <svg className="w-5 h-5 text-white/30 ml-auto group-hover:translate-x-1 group-hover:text-white/70 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          <p className="text-center text-brand-400 text-sm mt-12 opacity-80">
            &copy; {new Date().getFullYear()} US Towing Services. All rights reserved.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
