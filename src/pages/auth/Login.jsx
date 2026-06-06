import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, ShieldCheck, Mail, Lock, LogIn, Chrome, Car, HelpCircle, Navigation, ChevronRight } from 'lucide-react'
import { SERVICE_TYPES } from '../../data/mockData'
import { motion } from 'framer-motion'
import { useGoogleLogin } from '@react-oauth/google'
import InstallAppButton from '../../components/InstallAppButton'

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

export default function Login() {
  const { loginWithCredentials, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('')
      setLoading(true)
      try {
        await loginWithGoogle(tokenResponse.access_token, 'client', true)
        navigate('/')
      } catch (err) {
        setError(err.message || 'Google Login failed')
        setLoading(false)
      }
    },
    onError: () => setError('Google Login Failed')
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithCredentials(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0A0A0B]">
      
      {/* Ultra-Premium Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] mix-blend-screen" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxVjF6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">Secure Portal Access</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              US Towing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">
                Services
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-400 font-medium max-w-lg mb-8 leading-relaxed">
              Log in to request rapid roadside assistance, track your driver in real-time, and manage your payments effortlessly.
            </p>

            {/* Services List (Text Only) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-w-lg mb-10">
              {SERVICE_TYPES.map(service => (
                <div key={service.id} className="group border-l border-white/10 pl-4 hover:border-brand-400 transition-colors">
                  <h3 className="text-gray-300 font-semibold text-sm tracking-wide group-hover:text-white transition-colors">
                    {service.label}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/5 bg-gray-800/80 flex items-center justify-center text-xs font-bold text-white shadow-lg backdrop-blur-sm">24/7</div>
                <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 bg-brand-600/90 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 backdrop-blur-sm"><ShieldCheck className="w-5 h-5"/></div>
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 bg-blue-600/90 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm"><ArrowRight className="w-5 h-5"/></div>
              </div>
              <div className="text-sm font-medium text-gray-400">
                <span className="text-white font-bold">1,000+</span> providers ready <br/> to assist you.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full lg:w-[440px] shrink-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-brand-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50" />
            
            <div className="relative bg-[#121214]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                  <p className="text-sm font-medium text-gray-400">Enter your details to sign in</p>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-start gap-3">
                  <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                  <p className="font-medium">{error}</p>
                </motion.div>
              )}

              {/* Google Auth Button */}
              <div className="mb-8 flex justify-center w-full">
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  className="w-full bg-white text-gray-700 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-gray-50 active:scale-[0.98] shadow-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>

              <div className="relative flex items-center justify-center my-8">
                <div className="absolute inset-0 border-t border-white/10"></div>
                <span className="relative bg-[#121214] px-4 text-xs text-gray-500 font-bold uppercase tracking-widest">Or sign in with email</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  icon={Mail}
                />
                
                <div>
                  <FloatingInput 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    icon={Lock}
                  />
                  <div className="flex justify-end mt-3 px-1">
                    <Link to="/forgot-password" className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">Forgot Password?</Link>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_20px_rgba(var(--brand-600),0.3)] hover:shadow-[0_0_30px_rgba(var(--brand-500),0.5)]"
                >
                  {loading ? 'Authenticating...' : 'Sign In securely'} <ChevronRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-8 text-center bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-gray-400 text-sm font-medium">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-white font-bold hover:text-brand-400 transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>

            </div>
          </motion.div>

          <div className="mt-8">
            <InstallAppButton />
          </div>
        </div>
      </div>
    </div>
  )
}
