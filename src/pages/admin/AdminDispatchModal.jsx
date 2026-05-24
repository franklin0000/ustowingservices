import { useState, useEffect } from 'react'
import { XCircle, Search, User, MapPin, Truck, DollarSign } from 'lucide-react'
import { pricing } from '../../services/api'
import { SERVICE_TYPES } from '../../data/mockData'

export default function AdminDispatchModal({ onClose, onSubmit, activeDrivers = [] }) {
  const [formData, setFormData] = useState({
    clientPhone: '', clientName: '', serviceType: 'tow',
    vehicleType: '', vehicleDetails: '',
    pickupLocation: '', pickupLat: null, pickupLng: null,
    destination: '', destLat: null, destLng: null,
    amount: '50', notes: '', driverId: ''
  })
  const [searchingPickup, setSearchingPickup] = useState(false)
  const [pickupResults, setPickupResults] = useState([])
  const [searchingDest, setSearchingDest] = useState(false)
  const [destResults, setDestResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearchLoc = async (type, query) => {
    if (type === 'pickup') setFormData(prev => ({ ...prev, pickupLocation: query }))
    else setFormData(prev => ({ ...prev, destination: query }))
    
    if (query.length < 4) return
    try {
      if (type === 'pickup') setSearchingPickup(true)
      else setSearchingDest(true)
      const res = await pricing.geocode(query)
      if (type === 'pickup') setPickupResults(res)
      else setDestResults(res)
    } catch (e) { } finally {
      setSearchingPickup(false)
      setSearchingDest(false)
    }
  }

  const selectLoc = (type, loc) => {
    if (type === 'pickup') {
      setFormData(prev => ({ ...prev, pickupLocation: loc.place_name, pickupLat: loc.center[1], pickupLng: loc.center[0] }))
      setPickupResults([])
    } else {
      setFormData(prev => ({ ...prev, destination: loc.place_name, destLat: loc.center[1], destLng: loc.center[0] }))
      setDestResults([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.pickupLat) return setError('Please select a valid pickup location from the suggestions.')
    
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to dispatch job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col fade-in shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Manual Dispatch</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
          <form id="dispatchForm" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Phone *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="tel" className="input-field pl-9" placeholder="+1 555-0101" value={formData.clientPhone} onChange={e => setFormData(d => ({...d, clientPhone: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
                <input type="text" className="input-field" placeholder="John Doe" value={formData.clientName} onChange={e => setFormData(d => ({...d, clientName: e.target.value}))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type *</label>
                <select className="input-field" value={formData.serviceType} onChange={e => setFormData(d => ({...d, serviceType: e.target.value}))}>
                  {SERVICE_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Type / Model *</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="text" className="input-field pl-9" placeholder="e.g. Ford F-150" value={formData.vehicleType} onChange={e => setFormData(d => ({...d, vehicleType: e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required type="text" className="input-field pl-9" placeholder="Search address..." value={formData.pickupLocation} onChange={e => handleSearchLoc('pickup', e.target.value)} />
                </div>
                {pickupResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-lg mt-1 z-50 max-h-48 overflow-y-auto">
                    {pickupResults.map((r, i) => (
                      <div key={i} className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0" onClick={() => selectLoc('pickup', r)}>{r.place_name}</div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Destination (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className="input-field pl-9" placeholder="Search address..." value={formData.destination} onChange={e => handleSearchLoc('dest', e.target.value)} />
                </div>
                {destResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-lg mt-1 z-50 max-h-48 overflow-y-auto">
                    {destResults.map((r, i) => (
                      <div key={i} className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0" onClick={() => selectLoc('dest', r)}>{r.place_name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Cost / Base ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" className="input-field pl-9" value={formData.amount} onChange={e => setFormData(d => ({...d, amount: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to Driver (Optional)</label>
                <select className="input-field" value={formData.driverId} onChange={e => setFormData(d => ({...d, driverId: e.target.value}))}>
                  <option value="">Broadcast to all nearby drivers</option>
                  {activeDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.vehicle})</option>
                  ))}
                </select>
              </div>
            </div>
            
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
          <button form="dispatchForm" type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-200 disabled:opacity-50">
            {loading ? 'Dispatching...' : 'Dispatch Request'}
          </button>
        </div>
      </div>
    </div>
  )
}
