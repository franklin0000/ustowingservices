import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Network error during verification. Please try again.')
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('/hero_bg.png')] bg-cover bg-center opacity-20"></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.jpg" alt="US Towing Services" className="h-16 object-contain" />
        </div>

        {status === 'verifying' && (
          <div className="py-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
            <p className="text-gray-500">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition inline-block">
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
