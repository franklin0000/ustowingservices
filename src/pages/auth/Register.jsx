import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, Truck, User, Lock, ShieldCheck, CheckCircle2, Mail, Phone, Hash, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'

function FloatingInput({ label, type = "text", value, onChange, required, icon: Icon }) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-400 transition-colors z-10">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className={`block px-4 pb-2.5 pt-6 w-full text-white bg-white/5 border border-white/10 rounded-2xl appearance-none focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 peer transition-all shadow-inner ${Icon ? 'pl-11' : ''}`}
      />
      <label className={`absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-brand-400 font-medium pointer-events-none ${Icon ? 'left-11' : 'left-4'}`}>
        {label}
      </label>
    </div>
  )
}

export default function Register() {
  const { register, loginWithGoogle, loginWithCredentials } = useAuth()
  const [role, setRole] = useState('client')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    vehicle: '', licensePlate: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle(credentialResponse.credential, role)
    } catch (err) {
      setError(err.message || 'Signup failed')
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google authentication failed or was cancelled')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ ...formData, role })
      // Instantly login without requiring email verification
      await loginWithCredentials(formData.email, formData.password)
    } catch (err) {
      setError(err.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0A0A0B] py-12">
      
      {/* Ultra-Premium Animated Background Elements */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxVjF6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">100% Verified Network</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Join The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">
                Network
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-400 font-medium max-w-lg mb-10 leading-relaxed">
              Create an account in seconds to access rapid roadside assistance or become a verified partner driver today.
            </p>

            <div className="space-y-6">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-brand-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Bank-Grade Security</h3>
                  <p className="text-gray-400 text-sm mt-1">Your data is protected by 256-bit AES encryption.</p>
                </div>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Truck className="text-brand-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Instant Dispatch</h3>
                  <p className="text-gray-400 text-sm mt-1">Get matched with the closest available professionals instantly.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full lg:w-[500px] shrink-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-brand-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50" />
            
            <div className="relative bg-[#121214]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h2>
                <p className="text-sm font-medium text-gray-400">Join the premier roadside assistance network</p>
              </div>

              {/* Role Selection Tabs */}
              <div className="flex bg-[#0A0A0B] p-1.5 rounded-2xl mb-8 border border-white/5">
                <button 
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${role === 'client' ? 'bg-white/10 shadow-lg text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  <User className="w-4 h-4" /> Client
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${role === 'driver' ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 shadow-lg text-emerald-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                  <Truck className="w-4 h-4" /> Driver
                </button>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-start gap-3">
                  <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                  <p className="font-medium">{error}</p>
                </motion.div>
              )}

              {/* Google Auth Button */}
              <div className="mb-8 flex justify-center w-full">
                <div className="w-full relative rounded-2xl overflow-hidden [&>div]:w-full [&_iframe]:w-full [&_iframe]:h-[52px]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="signup_with"
                    useOneTap={false}
                  />
                </div>
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-t border-white/10"></div>
                <span className="relative bg-[#121214] px-4 text-xs text-gray-500 font-bold uppercase tracking-widest">Or sign up with email</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    icon={User}
                  />
                  <FloatingInput 
                    label="Mobile Phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    required 
                    icon={Phone}
                  />
                </div>
                
                <FloatingInput 
                  label="Email Address" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                  icon={Mail}
                />

                <FloatingInput 
                  label="Secure Password" 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                  icon={Lock}
                />

                <AnimatePresence>
                  {role === 'driver' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                    >
                      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-emerald-400">Background Check Required</h4>
                          <p className="text-xs text-emerald-500/80 mt-1 font-medium">All partner vehicles are vetted for safety and compliance before activation.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput 
                          label="Vehicle (e.g. Ford F-350)" 
                          value={formData.vehicle} 
                          onChange={e => setFormData({...formData, vehicle: e.target.value})} 
                          required={role === 'driver'} 
                          icon={Truck}
                        />
                        <FloatingInput 
                          label="License Plate" 
                          value={formData.licensePlate} 
                          onChange={e => setFormData({...formData, licensePlate: e.target.value})} 
                          required={role === 'driver'} 
                          icon={Hash}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <p className="text-xs text-gray-500 text-center leading-relaxed mt-6 font-medium">
                  By joining, you agree to our <Link to="/terms" className="text-brand-400 hover:text-brand-300 transition-colors">Terms</Link> and <Link to="/privacy" className="text-brand-400 hover:text-brand-300 transition-colors">Privacy Policy</Link>.
                </p>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:pointer-events-none shadow-lg active:scale-[0.98] ${
                    role === 'driver' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
                    : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_0_20px_rgba(var(--brand-600),0.3)] hover:shadow-[0_0_30px_rgba(var(--brand-500),0.5)]'
                  }`}
                >
                  {loading ? 'Processing...' : 'Create Account'} <ChevronRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-8 text-center bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-gray-400 text-sm font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white font-bold hover:text-brand-400 transition-colors">
                    Sign in securely
                  </Link>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
