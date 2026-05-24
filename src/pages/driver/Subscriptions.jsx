import { useState } from 'react'
import { Check, ShieldCheck, Zap, DollarSign } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { stripe } from '../../services/api'

export default function Subscriptions() {
  const { logout } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async () => {
    setIsProcessing(true)
    try {
      await stripe.bypassSubscription(selectedPlan)
      window.location.reload()
    } catch (err) {
      alert('Failed to subscribe: ' + err.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 lg:p-8">
      <div className="absolute top-6 right-6">
        <button onClick={logout} className="text-gray-400 hover:text-white transition">Log Out</button>
      </div>

      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">Account Approved</h1>
        <p className="text-gray-400 text-lg">
          Your documents have been verified. To start receiving towing requests from clients across the city, choose your access pass.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Daily Plan */}
        <div 
          onClick={() => setSelectedPlan('daily')}
          className={`relative cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 ${
            selectedPlan === 'daily' 
            ? 'bg-gray-800 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] transform scale-105 z-10' 
            : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          }`}
        >
          {selectedPlan === 'daily' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              Selected
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">24-Hour Pass</h3>
          <p className="text-gray-400 text-sm mb-6">Perfect for part-time drivers or trying the platform.</p>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-black text-white">$30</span>
            <span className="text-gray-400 font-medium mb-1">/ day</span>
          </div>
          <ul className="space-y-4 mb-8">
            {['24 hours of unlimited job requests', 'Instant payouts available', 'Basic driver support'].map(feature => (
              <li key={feature} className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly Plan */}
        <div 
          onClick={() => setSelectedPlan('monthly')}
          className={`relative cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 ${
            selectedPlan === 'monthly' 
            ? 'bg-gray-800 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] transform scale-105 z-10' 
            : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          }`}
        >
          {selectedPlan === 'monthly' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              Best Value
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">Pro Monthly Pass</h3>
          <p className="text-gray-400 text-sm mb-6">For serious professionals maximizing their earnings.</p>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-black text-white">$50</span>
            <span className="text-gray-400 font-medium mb-1">/ month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {['30 days of unlimited job requests', 'Priority matching algorithm', '0% withdrawal fees', 'Premium 24/7 support'].map(feature => (
              <li key={feature} className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <button 
          onClick={handleSubscribe} 
          disabled={isProcessing}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {isProcessing ? <span className="animate-pulse">Redirecting to Stripe...</span> : <><Zap className="w-5 h-5" /> Start Earning Now</>}
        </button>
        <p className="text-center text-gray-500 text-xs mt-4 flex items-center justify-center gap-1">
          <DollarSign className="w-3 h-3" /> Secure payments powered by Stripe
        </p>
      </div>
    </div>
  )
}
