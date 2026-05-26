import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, Truck, User, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BackgroundSlider from '../../components/BackgroundSlider'

function FloatingInput({ label, type = "text", value, onChange, required, icon: Icon }) {
  return (
    <div className="relative">
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="block px-4 pb-2.5 pt-6 w-full text-gray-900 bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent peer transition-all shadow-sm"
      />
      <label className="absolute text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600 font-medium pointer-events-none">
        {label}
      </label>
      {Icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
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
  const [registered, setRegistered] = useState(false)

  const handleMockGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle('mock-credential', role)
    } catch (err) {
      setError(err.message || 'Signup failed')
      setLoading(false)
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* LEFT SIDE - IMMERSIVE BACKGROUND & BRANDING */}
      <div className="relative flex flex-col justify-between p-6 lg:p-12 overflow-hidden z-0 h-[35vh] min-h-[250px] lg:h-auto lg:min-h-screen lg:w-[45%] xl:w-[50%] lg:shadow-2xl">
        <BackgroundSlider />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 lg:gap-4 lg:mb-0">
          <div className="bg-white p-2 lg:p-2.5 rounded-xl lg:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            <img src="/logo.jpg" alt="US Towing Services" className="h-8 lg:h-10 object-contain rounded-lg" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg lg:text-xl drop-shadow-md">US Towing Services</h2>
            <p className="text-gray-200 text-xs lg:text-sm font-medium drop-shadow-md">Professional Roadside Assistance</p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 hidden lg:block max-w-lg mb-12">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            Reliable help,<br />exactly when you need it.
          </motion.h1>
          
          <div className="space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mt-1">
                <CheckCircle2 className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg drop-shadow-md">100% Verified Network</h3>
                <p className="text-gray-200 text-sm drop-shadow-md">Every driver passes strict background and vehicle checks.</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mt-1">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg drop-shadow-md">Bank-Grade Security</h3>
                <p className="text-gray-200 text-sm drop-shadow-md">Your personal data is protected by 256-bit AES encryption.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - PROFESSIONAL FORM */}
      <div className="relative z-20 w-full lg:w-[55%] xl:w-[50%] flex items-start lg:items-center justify-center p-0 lg:p-12 xl:p-24 bg-transparent lg:bg-gray-50 overflow-y-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-t-[32px] lg:rounded-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t border-x border-gray-100 lg:border min-h-[65vh] lg:min-h-0 -mt-6 lg:mt-0 pb-12"
        >

          <>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create an account</h2>
              <p className="text-gray-500 mb-8 font-medium">Join the premier roadside assistance network.</p>

              {/* Role Selection Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                <button 
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'client' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <User className="w-4 h-4" /> Client
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${role === 'driver' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Truck className="w-4 h-4" /> Driver
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100">
                  <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Premium Google Button */}
              <div className="mb-8">
                <button 
                  type="button"
                  onClick={handleMockGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm flex justify-center items-center gap-3 hover:bg-gray-50 hover:shadow transition focus:ring-4 focus:ring-gray-100"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-t border-gray-200"></div>
                <span className="relative bg-white px-4 text-sm text-gray-400 font-bold uppercase tracking-wider">or sign up with email</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput 
                  label="Full Legal Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                <FloatingInput 
                  label="Email Address" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
                
                <div>
                  <FloatingInput 
                    label="Mobile Phone Number" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                    Required for 2FA security and dispatch updates.
                  </p>
                </div>

                <FloatingInput 
                  label="Create a secure password" 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                />

                {role === 'driver' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-emerald-900">Background Check Required</h4>
                        <p className="text-xs text-emerald-700 mt-1 font-medium">All partner vehicles are vetted for safety and compliance before activation.</p>
                      </div>
                    </div>
                    
                    <FloatingInput 
                      label="Vehicle Make & Model (e.g. Ford F-350)" 
                      value={formData.vehicle} 
                      onChange={e => setFormData({...formData, vehicle: e.target.value})} 
                      required 
                    />
                    <FloatingInput 
                      label="Commercial License Plate" 
                      value={formData.licensePlate} 
                      onChange={e => setFormData({...formData, licensePlate: e.target.value})} 
                      required 
                    />
                  </motion.div>
                )}
                
                <p className="text-xs text-gray-500 leading-relaxed mt-4 font-medium">
                  By creating an account, you agree to our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </p>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-2 disabled:opacity-70 shadow-lg ${role === 'driver' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                >
                  {loading ? 'Processing...' : 'Create Account'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <p className="text-center mt-8 text-gray-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Sign in securely
                </Link>
              </p>
            </>
        </motion.div>
      </div>
    </div>
  )
}
