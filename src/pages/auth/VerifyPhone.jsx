import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, Lock, CheckCircle2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifyPhone() {
  const { user, verifyPhone, logout } = useAuth()
  const navigate = useNavigate()
  
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingSms, setSendingSms] = useState(false)
  
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Automatically send SMS when landing on this page
  useEffect(() => {
    if (user && user.phone && !user.phoneVerified) {
      triggerSendSms()
    }
  }, []) // Run once on mount

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const triggerSendSms = async () => {
    try {
      setSendingSms(true)
      const { auth: authApi } = await import('../../services/api')
      await authApi.sendSms(user.phone)
    } catch (err) {
      console.error('Failed to send SMS:', err)
      setError('Failed to send verification SMS. Please check your phone number.')
    } finally {
      setSendingSms(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyPhone(code)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid verification code')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setTimeLeft(60)
    setCanResend(false)
    await triggerSendSms()
  }

  if (user && user.phoneVerified) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[480px] bg-white p-8 sm:p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col"
      >
        
        {/* Top Header */}
        <div className="mb-8">
          <button onClick={logout} className="text-blue-600 mb-8 flex items-center gap-1 text-sm font-bold hover:underline">
            ← Change Phone Number
          </button>
          
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            Security Check
          </h1>
          <p className="text-gray-500 font-medium">
            We sent a secure 6-digit code to:
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-xl text-gray-900">{user?.phone || 'your phone number'}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="flex-1">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100">
              <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                maxLength="6"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                className="block px-4 pb-4 pt-4 w-full text-center text-4xl tracking-[0.5em] font-black text-gray-900 bg-gray-50 rounded-xl border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
                placeholder="000000"
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 pt-2">
              <button 
                type="button" 
                onClick={handleResend}
                disabled={!canResend}
                className={`text-sm font-bold flex items-center gap-1.5 transition ${canResend ? 'text-blue-600 hover:underline' : 'text-gray-400'}`}
              >
                <RefreshCw className={`w-4 h-4 ${!canResend && 'animate-spin-slow'}`} />
                {canResend ? 'Resend Verification Code' : `Resend available in ${timeLeft}s`}
              </button>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading || code.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying Identity...' : 'Verify & Access Dashboard'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
