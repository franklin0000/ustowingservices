import { Search, Eye, XCircle, Plus, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { SERVICE_TYPES } from '../../data/mockData'
import AdminDispatchModal from './AdminDispatchModal'

const statusStyles = { completed: 'badge-success', in_progress: 'badge-info', in_service: 'badge-info', accepted: 'badge-info', en_route: 'badge-info', arrived: 'badge-info', pending: 'badge-warning', cancelled: 'badge-danger' }
const statusLabels = { completed: 'Completed', in_progress: 'In Progress', in_service: 'In Service', accepted: 'Accepted', en_route: 'En Route', arrived: 'Arrived', pending: 'Pending', cancelled: 'Cancelled' }

export default function AdminRequests() {
  const { getAdminJobs, getAdminDrivers, adminCancelJob, adminCreateJob, adminAssignDriver } = useApp()
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  
  const [showDispatch, setShowDispatch] = useState(false)
  const [activeDrivers, setActiveDrivers] = useState([])
  const [assigningDriver, setAssigningDriver] = useState('')

  const load = () => {
    const params = {}
    if (filter !== 'all') params.status = filter
    if (search) params.search = search
    getAdminJobs(params).then(d => { setJobs(d.jobs); setTotal(d.total) }).catch(() => {})
  }

  const loadDrivers = () => {
    getAdminDrivers().then(d => setActiveDrivers(d.filter(x => x.available && x.kycStatus === 'approved'))).catch(()=>{})
  }

  useEffect(() => { load() }, [filter, search])
  useEffect(() => { loadDrivers() }, [])

  const handleCancel = async (id) => {
    await adminCancelJob(id)
    load()
  }

  const handleCreateDispatch = async (data) => {
    await adminCreateJob(data)
    load()
    loadDrivers() // refresh drivers if assigned
  }

  const handleAssign = async () => {
    if (!assigningDriver) return
    await adminAssignDriver(detail.id, assigningDriver)
    setDetail(null)
    setAssigningDriver('')
    load()
    loadDrivers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Service Requests</h1><p className="text-gray-500 mt-1">{total} total requests</p></div>
        <button onClick={() => setShowDispatch(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5"/> New Dispatch</button>
      </div>
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input className="input-field pl-10" placeholder="Search by client, location, or ID..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-sm font-medium transition ${filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f === 'all' ? 'All' : statusLabels[f] || f}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="card overflow-hidden"><div className="overflow-x-auto">
        <table className="w-full"><thead><tr className="border-b border-gray-100">
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Client</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Service</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Location</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Driver</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Amount</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Status</th>
          <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">Actions</th>
        </tr></thead><tbody>
          {jobs.map(req => {
            const service = SERVICE_TYPES.find(s => s.id === req.serviceType)
            return (
              <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 px-4"><p className="text-sm font-medium">{req.clientName}</p><p className="text-xs text-gray-400">{req.clientPhone}</p></td>
                <td className="py-3 px-4 text-sm">{service?.icon} {service?.label || req.serviceType}</td>
                <td className="py-3 px-4"><p className="text-sm text-gray-600 max-w-[180px] truncate">{req.pickupLocation}</p></td>
                <td className="py-3 px-4 text-sm">{req.driverName || <span className="text-gray-400">Unassigned</span>}</td>
                <td className="py-3 px-4 text-sm font-semibold">${req.amount}</td>
                <td className="py-3 px-4"><span className={statusStyles[req.status] || 'badge-info'}>{statusLabels[req.status] || req.status}</span></td>
                <td className="py-3 px-4"><div className="flex gap-1">
                  <button onClick={() => setDetail(req)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><Eye className="w-4 h-4" /></button>
                  {req.status === 'pending' && <button onClick={() => handleCancel(req.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-500"><XCircle className="w-4 h-4" /></button>}
                </div></td>
              </tr>
            )
          })}
        </tbody></table>
      </div></div>

      {detail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Request Details</h3><span className={statusStyles[detail.status]}>{statusLabels[detail.status]}</span></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-400">Client</p><p className="font-medium">{detail.clientName}</p></div>
                <div><p className="text-xs text-gray-400">Driver</p><p className="font-medium">{detail.driverName || 'Unassigned'}</p></div>
                <div><p className="text-xs text-gray-400">Service</p><p className="font-medium">{detail.serviceType}</p></div>
                <div><p className="text-xs text-gray-400">Vehicle</p><p className="font-medium">{detail.vehicleDetails}</p></div>
              </div>
              <div><p className="text-xs text-gray-400">Location</p><p className="font-medium">{detail.pickupLocation}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-400">Amount</p><p className="font-bold text-lg">${detail.amount}</p></div>
                <div><p className="text-xs text-gray-400">Rating</p><p className="font-medium">{detail.rating ? `★ ${detail.rating}` : 'N/A'}</p></div>
              </div>
              
              {(detail.status === 'pending' || detail.status === 'matched') && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Manual Assign Driver</label>
                  <div className="flex gap-2">
                    <select className="input-field flex-1" value={assigningDriver} onChange={e => setAssigningDriver(e.target.value)}>
                      <option value="">Select an available driver...</option>
                      {activeDrivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.vehicle})</option>
                      ))}
                    </select>
                    <button onClick={handleAssign} disabled={!assigningDriver} className="btn-primary px-4 flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
                      <Send className="w-4 h-4"/> Assign
                    </button>
                  </div>
                </div>
              )}
              
            </div>
            <button onClick={() => setDetail(null)} className="mt-4 w-full btn-secondary">Close</button>
          </div>
        </div>
      )}
      
      {showDispatch && <AdminDispatchModal activeDrivers={activeDrivers} onClose={() => setShowDispatch(false)} onSubmit={handleCreateDispatch} />}
    </div>
  )
}
