import { Clock, MapPin, Star, Search, ChevronRight, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { SERVICE_TYPES } from '../../data/mockData'
import { motion } from 'framer-motion'

const STATUS = {
  completed:  { label: 'Completed',   cls: 'bg-emerald-100 text-emerald-700' },
  in_service: { label: 'In Service',  cls: 'bg-amber-100 text-amber-700' },
  accepted:   { label: 'Accepted',    cls: 'bg-blue-100 text-blue-700' },
  en_route:   { label: 'En Route',    cls: 'bg-indigo-100 text-indigo-700' },
  arrived:    { label: 'Arrived',     cls: 'bg-purple-100 text-purple-700' },
  pending:    { label: 'Pending',     cls: 'bg-gray-100 text-gray-600' },
  cancelled:  { label: 'Cancelled',   cls: 'bg-red-100 text-red-600' },
}

const FILTERS = ['all', 'completed', 'pending', 'cancelled']

export default function RequestHistory() {
  const { getMyJobs } = useApp()
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getMyJobs().then(data => { setJobs(data); setLoaded(true) }).catch(() => setLoaded(true))
  }, [])

  const filtered = jobs.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter ||
      (filter === 'pending' && ['pending', 'accepted', 'en_route', 'arrived', 'in_service'].includes(r.status))
    const matchSearch = !search || (r.pickupLocation || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.vehicleDetails || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (!loaded) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
      {/* Left: filters + list */}
      <div className="lg:col-span-2 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">{jobs.length} total services</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Search by location or vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total', value: jobs.length, color: 'text-blue-600' },
          { label: 'Done', value: jobs.filter(j => j.status === 'completed').length, color: 'text-emerald-600' },
          { label: 'Active', value: jobs.filter(j => ['accepted', 'en_route', 'arrived', 'in_service', 'pending'].includes(j.status)).length, color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl py-3 px-3 text-center shadow-sm">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Truck className="w-12 h-12 text-gray-200 mb-3" />
          <p className="font-semibold text-gray-500">No requests found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, i) => {
            const service = SERVICE_TYPES.find(s => s.id === req.serviceType)
            const st = STATUS[req.status] || STATUS.pending
            return (
              <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">
                    {service?.icon || '🔗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{service?.label || req.serviceType}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{req.pickupLocation}</span>
                    </div>
                    {req.vehicleDetails && <p className="text-xs text-gray-400 mt-0.5 truncate">{req.vehicleDetails}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        {req.rating && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500" />{req.rating}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-blue-700">${req.amount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      </div>{/* end left col */}

      {/* Right sidebar: desktop only */}
      <div className="hidden lg:block space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-20">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Total', value: jobs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Active', value: jobs.filter(j => ['accepted','en_route','arrived','in_service','pending'].includes(j.status)).length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length, color: 'text-red-500', bg: 'bg-red-50' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-xl px-4 py-3 flex items-center justify-between`}>
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-5 text-white">
          <p className="font-bold mb-1">Need help?</p>
          <p className="text-blue-200 text-sm">Support is available 24/7</p>
          <a href="mailto:USTowingServices@protonmail.com" className="mt-4 w-full bg-white text-blue-700 font-bold py-2 rounded-xl text-sm hover:bg-blue-50 transition flex items-center justify-center">Contact Us</a>
        </div>
      </div>
    </div>
  )
}
