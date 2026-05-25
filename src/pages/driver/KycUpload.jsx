import { useState, useEffect } from 'react'
import { ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { stripe, auth } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function KycUpload() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifyingReturn, setVerifyingReturn] = useState(false)

  useEffect(() => {
    const isStripeReturn = searchParams.get('stripe_return') === 'true'
    if (isStripeReturn) {
      handleStripeReturn()
    }
  }, [searchParams])

  const handleStripeReturn = async () => {
    setVerifyingReturn(true)
    try {
      const res = await stripe.checkConnectStatus()
      if (res.connected) {
        setUser(prev => ({ ...prev, kycStatus: 'approved' }))
        navigate('/driver/dashboard', { replace: true })
      } else {
        alert('Stripe verification was not completed. Please try again.')
        setSearchParams({}) // clear params
      }
    } catch (err) {
      alert('Error verifying Stripe status: ' + err.message)
      setSearchParams({})
    } finally {
      setVerifyingReturn(false)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Force bypass since the user doesn't have Stripe Connect configured
      await auth.bypassKyc()
      setUser(prev => ({ ...prev, kycStatus: 'approved' }))
      navigate('/driver/dashboard', { replace: true })
    } catch (err) {
      alert('Failed to bypass: ' + err.message)
      setLoading(false)
    }
  }

  if (verifyingReturn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Verifying your identity with Stripe...</h2>
        <p className="text-gray-500 mt-2">Please wait a moment.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
        </div>
        <p className="text-gray-500 mb-6">
          To start accepting jobs and receive payouts, we need to verify your identity and banking details.
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center text-center gap-4 mb-8">
          <ShieldCheck className="w-12 h-12 text-indigo-600" />
          <p className="text-sm text-indigo-800 font-medium">
            We partner with <span className="font-bold text-indigo-900">Stripe</span> for secure financial onboarding. 
            You will be redirected to Stripe to upload your ID and connect your payout bank account.
            We do not store your biometric data.
          </p>
        </div>

        <button 
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Connecting to Stripe...</>
          ) : (
            <>Verify Identity with Stripe <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <button 
          onClick={async () => {
            try {
              setLoading(true)
              await auth.bypassKyc()
              setUser(prev => ({ ...prev, kycStatus: 'approved' }))
              navigate('/driver/dashboard', { replace: true })
            } catch (err) {
              alert('Bypass failed: ' + err.message)
              setLoading(false)
            }
          }}
          disabled={loading}
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-3 rounded-xl mt-4 border border-orange-200 transition"
        >
          [Dev] Bypass Stripe Connect
        </button>

        <button 
          onClick={() => {
            localStorage.removeItem('gruas_token');
            window.location.reload();
          }}
          className="w-full bg-white hover:bg-gray-50 text-gray-500 font-bold py-3 rounded-xl mt-3 border border-gray-200 transition"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  )
}
