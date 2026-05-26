import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth as authApi } from '../../services/api'
import { ArrowRight, Lock, CheckCircle2, KeyRound, Mail, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
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

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1) // 1: Email, 2: Code & New Password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [maskedPhone, setMaskedPhone] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.forgotPassword(email)
      if (res.success) {
        setMaskedPhone(res.maskedPhone)
        setStep(2)
      }
    } catch (err) {
      setError(err.message || 'Failed to send recovery code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword(email, code, newPassword)
      setSuccessMsg('Your password has been reset successfully.')
    } catch (err) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* LEFT SIDE - IMMERSIVE BACKGROUND */}
      <div className="relative flex flex-col justify-between p-6 lg:p-12 overflow-hidden z-0 h-[35vh] min-h-[250px] lg:h-auto lg:min-h-screen lg:w-[45%] xl:w-[50%] lg:shadow-2xl">
        <BackgroundSlider />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 lg:gap-4 lg:mb-0">
          <div className="bg-white p-2 lg:p-2.5 rounded-xl lg:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            <img src="/logo.jpg" alt="US Towing Services" className="h-8 lg:h-10 object-contain rounded-lg" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg lg:text-xl drop-shadow-md">US Towing Services</h2>
            <p className="text-gray-200 text-xs lg:text-sm font-medium drop-shadow-md">Secure Account Recovery</p>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block max-w-lg mb-12">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            Bank-Grade<br />Security.
          </motion.h1>
          <p className="text-gray-200 text-lg font-medium drop-shadow-md mb-8">
            We use 256-bit encryption and secure SMS verification to protect your account.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="relative z-20 w-full lg:w-[55%] xl:w-[50%] flex items-start lg:items-center justify-center p-0 lg:p-12 xl:p-24 bg-transparent lg:bg-gray-50 overflow-y-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-t-[32px] lg:rounded-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t border-x border-gray-100 lg:border min-h-[65vh] lg:min-h-0 -mt-6 lg:mt-0 pb-12"
        >

          {successMsg ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-500 mb-8 font-medium">{successMsg}</p>
              <Link to="/login" className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                <KeyRound className="w-7 h-7 text-blue-600" />
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Recover Password</h2>
              <p className="text-gray-500 mb-8 font-medium">
                {step === 1 ? "Enter your email to receive a secure SMS code." : `We sent a code to ${maskedPhone}.`}
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100">
                  <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <FloatingInput 
                    label="Email Address" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    icon={Mail}
                  />

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                  >
                    {loading ? 'Sending Code...' : 'Send SMS Code'} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative mb-6">
                    <input 
                      type="text" 
                      maxLength="6"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      className="block px-4 py-4 w-full text-center text-3xl tracking-[0.5em] font-black text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                      placeholder="000000"
                      autoFocus
                      required
                    />
                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                        <Smartphone className="w-3 h-3" /> 6-Digit SMS Code
                      </span>
                    </div>
                  </div>

                  <FloatingInput 
                    label="New Secure Password" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                    icon={Lock}
                  />

                  <button 
                    type="submit" 
                    disabled={loading || code.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                  >
                    {loading ? 'Resetting...' : 'Save New Password'} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              <p className="text-center mt-8 text-gray-600 font-medium">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Sign in securely
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
