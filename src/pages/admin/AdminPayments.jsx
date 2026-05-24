import { DollarSign, TrendingUp, Download, Search, Wallet, Send, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function AdminPayments() {
  const { getAdminPayments, getAdminPayouts, processAdminPayout } = useApp()
  const [data, setData] = useState(null)
  const [payouts, setPayouts] = useState([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('transactions') // 'transactions' | 'payouts'
  const [processing, setProcessing] = useState(false)

  const loadAll = () => {
    getAdminPayments().then(setData).catch(() => {})
    getAdminPayouts().then(setPayouts).catch(() => {})
  }

  useEffect(() => { loadAll() }, [])

  const handleProcess = async (id) => {
    setProcessing(id)
    try {
      await processAdminPayout(id)
      loadAll()
    } catch (e) {
      alert(e.message)
    } finally {
      setProcessing(false)
    }
  }

  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" /></div>

  const filteredTx = data.payments.filter(p => !search || p.clientName?.toLowerCase().includes(search.toLowerCase()) || p.cardLast4?.includes(search))
  const filteredPayouts = payouts.filter(p => !search || p.driver_name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financials & Payouts</h1>
          <p className="text-gray-500 mt-1">Manage platform revenue and driver withdrawals</p>
        </div>
        <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-900">${data.total_revenue.toFixed(2)}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-emerald-600" /></div><div><p className="text-sm text-gray-500">Platform Fees (25%)</p><p className="text-2xl font-bold text-emerald-600">${data.platform_fees.toFixed(2)}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-500">Driver Earnings (75%)</p><p className="text-2xl font-bold text-gray-900">${data.driver_payouts.toFixed(2)}</p></div></div></div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
          <div className="flex gap-4">
            <button onClick={() => setTab('transactions')} className={`font-bold pb-2 border-b-2 transition ${tab === 'transactions' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Transactions</button>
            <button onClick={() => setTab('payouts')} className={`font-bold pb-2 border-b-2 transition ${tab === 'payouts' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Payout Requests {payouts.filter(p => p.status==='pending').length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{payouts.filter(p => p.status==='pending').length}</span>}</button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9 py-2 text-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {tab === 'transactions' && (
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Date</th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Client</th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Driver</th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">Amount</th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">Fee</th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Status</th>
          </tr></thead><tbody>
            {filteredTx.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-sm">{new Date(p.date).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-sm font-medium">{p.clientName}</td>
                <td className="py-3 px-4 text-sm">{p.driverName}</td>
                <td className="py-3 px-4 text-sm font-bold text-right">${p.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm font-semibold text-emerald-600 text-right">${p.platformFee.toFixed(2)}</td>
                <td className="py-3 px-4"><span className={p.status === 'completed' ? 'badge-success' : 'badge-warning'}>{p.status === 'completed' ? 'Completed' : 'Pending'}</span></td>
              </tr>
            ))}
          </tbody></table></div>
        )}

        {tab === 'payouts' && (
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Requested On</th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Driver</th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Stripe Account</th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">Amount</th>
            <th className="text-center text-xs font-semibold text-gray-400 uppercase py-3 px-4">Status</th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">Actions</th>
          </tr></thead><tbody>
            {filteredPayouts.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-sm font-medium">{p.driver_name} <p className="text-xs text-gray-400">{p.driver_email}</p></td>
                <td className="py-3 px-4 text-sm font-mono text-gray-500">{p.stripe_account_id || 'Not Connected'}</td>
                <td className="py-3 px-4 text-sm font-bold text-right">${p.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={p.status === 'completed' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}>{p.status}</span>
                </td>
                <td className="py-3 px-4 flex justify-end">
                  {p.status === 'pending' && (
                    <button onClick={() => handleProcess(p.id)} disabled={processing === p.id} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 disabled:opacity-50">
                      {processing === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Send className="w-3 h-3" /> Process</>}
                    </button>
                  )}
                  {p.status === 'completed' && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Paid</span>}
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}

      </div>
    </div>
  )
}
