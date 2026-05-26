import { CreditCard, Wallet, DollarSign, CheckCircle2, Clock, Plus, TrendingUp, Trash2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { payments as paymentsApi, stripe as stripeApi } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function PaymentPage() {
  const [data, setData] = useState({ totalSpent: 0, completedCount: 0, pendingCount: 0, payments: [] })
  const [methods, setMethods] = useState([])
  const [filter, setFilter] = useState('all')
  const [loaded, setLoaded] = useState(false)
  
  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', expiry: '' })
  const [adding, setAdding] = useState(false)

  const loadData = async () => {
    try {
      const [history, savedMethods] = await Promise.all([
        paymentsApi.my(),
        paymentsApi.getMethods()
      ])
      setData(history)
      setMethods(savedMethods)
    } catch (e) {
      console.error(e)
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddCard = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await paymentsApi.addMethod({ cardNumber: newCard.number, expiry: newCard.expiry })
      await loadData()
      setShowAddModal(false)
      setNewCard({ number: '', expiry: '' })
    } catch (err) {
      alert(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveCard = async (id) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    try {
      await paymentsApi.removeMethod(id)
      await loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = data.payments.filter(p => filter === 'all' || p.status === filter)

  if (!loaded) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your billing history</p>
      </div>

      {/* Hero spend card */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold">Total Spent</p>
            <p className="text-4xl font-black mt-1">${data.totalSpent.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t border-blue-500/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs text-blue-200">Paid</p>
              <p className="font-bold text-white">{data.completedCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-blue-200">Pending</p>
              <p className="font-bold text-white">{data.pendingCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-green-400">This month</span>
          </div>
        </div>
      </motion.div>

      {/* Payment methods */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" /> Payment Methods & Billing
          </h2>
          <p className="text-xs text-gray-500 mt-1">Manage your cards and view billing details securely on Stripe.</p>
        </div>
        <button onClick={async () => {
          try {
            const { url } = await stripeApi.createPortalSession()
            window.location.href = url
          } catch (err) { alert(err.message) }
        }} className="whitespace-nowrap px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition">
          Manage on Stripe
        </button>
      </div>

      {/* Transaction history */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Transactions</h2>
          <div className="flex gap-1.5">
            {['all', 'completed', 'pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  {p.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Towing Service</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CreditCard className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">•••• {p.cardLast4}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(p.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">${p.amount.toFixed(2)}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status === 'completed' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}
