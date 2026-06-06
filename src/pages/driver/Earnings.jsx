import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ChevronRight, CreditCard, Loader2 } from 'lucide-react'
import { onEvent } from '../../services/websocket'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function Earnings() {
  const { getEarnings, getDriverPayouts, requestDriverPayout, connectDriverStripe, checkDriverStripeStatus } = useApp()
  const { user, setUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [payoutData, setPayoutData] = useState(null)
  const [loadingPayout, setLoadingPayout] = useState(false)
  const [loadingConnect, setLoadingConnect] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const statusRes = await checkDriverStripeStatus();
      if (statusRes && statusRes.connected && user?.kycStatus !== 'approved') {
        setUser(prev => ({ ...prev, kycStatus: 'approved' }));
      }
      const [s, p] = await Promise.all([getEarnings(), getDriverPayouts()]);
      setStats(s);
      setPayoutData(p);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData()
    const unsub = onEvent('job_status', loadData)
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const handleConnectStripe = async () => {
    setLoadingConnect(true)
    try {
      const res = await connectDriverStripe()
      if (res && res.url) {
        window.location.href = res.url // Redirect to Stripe Onboarding
      }
    } catch (e) {
      setError('Failed to connect to Stripe: ' + e.message)
    } finally {
      setLoadingConnect(false)
    }
  }

  const handleRequestPayout = async () => {
    if (user?.kycStatus !== 'approved') {
      return setError('Your identity must be verified by Stripe to request payouts.')
    }
    if (payoutData.available_balance < 50) {
      return setError('Minimum payout is $50')
    }
    setLoadingPayout(true)
    setError('')
    try {
      await requestDriverPayout(payoutData.available_balance)
      loadData()
    } catch (e) {
      setError(e.message || 'Failed to request payout')
    } finally {
      setLoadingPayout(false)
    }
  }

  if (!stats || !payoutData) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  const earningsData = (stats.weeklyRevenue || []).map(d => ({ ...d, earnings: d.revenue }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl shadow-xl">
          <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-emerald-400 font-black text-lg">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-100">Earnings & Payouts</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your net income (after 20% platform fee)</p>
        </div>
        
        <div className="bg-gray-800/80 border border-gray-700/50 p-4 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Available to Payout</p>
            <p className="text-2xl font-black text-emerald-400">${payoutData.available_balance.toFixed(2)}</p>
          </div>
          
          {!payoutData.stripe_account_id ? (
            <button onClick={handleConnectStripe} disabled={loadingConnect} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 transition">
              {loadingConnect ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Connect Stripe</>}
            </button>
          ) : (
            <button onClick={handleRequestPayout} disabled={loadingPayout || payoutData.available_balance < 50} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 transition">
              {loadingPayout ? <Loader2 className="w-5 h-5 animate-spin" /> : <><DollarSign className="w-5 h-5" /> Withdraw</>}
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-bold">{error}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Net Earnings', value: `$${stats.totalEarnings.toFixed(0)}`, icon: DollarSign,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: '+12%' },
          { label: 'Completed Jobs', value: stats.completedJobs,                  icon: TrendingUp,  color: 'text-blue-400',    bg: 'bg-blue-500/10' },
          { label: 'Net Avg Per Job',    value: `$${stats.avgPerJob.toFixed(0)}`,     icon: Calendar,    color: 'text-purple-400',  bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-100">{stat.value}</p>
              </div>
            </div>
            {stat.badge && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" /> {stat.badge}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Chart Section ── */}
        <div className="lg:col-span-2 bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-100 text-sm uppercase tracking-wide">Weekly Net Earnings (80%)</h3>
          </div>
          <div className="h-64 sm:h-72 w-full flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.4 }} />
                <Bar dataKey="earnings" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Payout History ── */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-100 text-sm uppercase tracking-wide">Payout History</h3>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {payoutData.payouts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">No payouts yet</p>
            ) : payoutData.payouts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-900/50 border border-gray-800 transition group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    p.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200 capitalize">{p.status}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-0.5">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-200">${p.amount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
