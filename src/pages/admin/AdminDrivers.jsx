import { Search, Star, Truck, Phone, ToggleLeft, ToggleRight, CheckCircle, XCircle, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { admin } from '../../services/api'

export default function AdminDrivers() {
  const { getAdminDrivers, updateDriverAvailability } = useApp()
  const [drivers, setDrivers] = useState([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('active') // 'active' | 'pending'
  const [docModal, setDocModal] = useState({ open: false, title: '', src: null })

  useEffect(() => { getAdminDrivers().then(setDrivers).catch(() => {}) }, [])

  const filtered = drivers.filter(d => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.vehicle.toLowerCase().includes(search.toLowerCase())
    if (tab === 'active') return matchesSearch && d.kycStatus === 'approved'
    return matchesSearch && d.kycStatus === 'pending'
  })

  const toggleAvailability = async (id, current) => {
    await updateDriverAvailability(id, !current)
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, available: !current } : d))
  }

  const handleKyc = async (id, status) => {
    try {
      await admin.updateKycStatus(id, status)
      setDrivers(prev => prev.map(d => d.id === id ? { ...d, kycStatus: status } : d))
    } catch (err) {
      alert('Failed to update KYC status: ' + err.message)
    }
  }

  const pendingCount = drivers.filter(d => d.kycStatus === 'pending').length

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-500 mt-1">{drivers.length} total registered drivers</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setTab('active')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Active Drivers
          </button>
          <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${tab === 'pending' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Pending Approvals
            {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="input-field pl-10" placeholder="Search drivers by name or vehicle..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(driver => (
          <div key={driver.id} className="card hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${driver.available && driver.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{driver.name}</h3>
                  {driver.kycStatus === 'approved' ? (
                    <button onClick={() => toggleAvailability(driver.id, driver.available)} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium transition shrink-0 ${driver.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {driver.available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}{driver.available ? 'Online' : 'Offline'}
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold shrink-0">Pending KYC</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 truncate"><Truck className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{driver.vehicle}</span></div>
                
                {tab === 'active' ? (
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-gray-100">
                    <div><p className="text-xs text-gray-400">Rating</p><p className="font-semibold flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {driver.rating}</p></div>
                    <div><p className="text-xs text-gray-400">Jobs</p><p className="font-semibold">{driver.completedJobs}</p></div>
                    <div><p className="text-xs text-gray-400">Earnings</p><p className="font-semibold text-emerald-600">${driver.totalEarnings.toLocaleString()}</p></div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setDocModal({ open: true, title: `${driver.name} - ID Document`, src: driver.idDocument })} disabled={!driver.idDocument} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-xl hover:bg-blue-100 transition disabled:opacity-50">
                        <FileText className="w-4 h-4" /> View ID
                      </button>
                      <button onClick={() => setDocModal({ open: true, title: `${driver.name} - Insurance`, src: driver.insuranceDoc })} disabled={!driver.insuranceDoc} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 py-2 rounded-xl hover:bg-blue-100 transition disabled:opacity-50">
                        <FileText className="w-4 h-4" /> View Insurance
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button onClick={() => handleKyc(driver.id, 'approved')} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl hover:bg-emerald-500 flex items-center justify-center gap-2 transition">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => handleKyc(driver.id, 'rejected')} className="flex-1 bg-red-100 text-red-600 font-bold py-2 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2 transition">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500"><Phone className="w-3.5 h-3.5 shrink-0" /> {driver.phone}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No drivers found for this category.</p>
        </div>
      )}

      {/* Document View Modal */}
      {docModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{docModal.title}</h3>
              <button onClick={() => setDocModal({ open: false, src: null })} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto flex justify-center bg-gray-100">
              {docModal.src ? (
                docModal.src.startsWith('data:application/pdf') ? (
                  <iframe src={docModal.src} className="w-full h-[600px] border-0" title="Document" />
                ) : (
                  <img src={docModal.src} alt="Document" className="max-w-full h-auto object-contain rounded-lg shadow-sm" />
                )
              ) : (
                <div className="text-gray-500 flex flex-col items-center justify-center h-48">
                  <FileText className="w-12 h-12 mb-2 opacity-20" />
                  No document uploaded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
