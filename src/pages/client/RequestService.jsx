import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Wrench, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Zap } from 'lucide-react'
import { VEHICLE_TYPES, SERVICE_TYPES } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { useNotifications } from '../../context/NotificationContext'
import MapView from '../../components/MapView'
import { onEvent } from '../../services/websocket'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import AddressAutocomplete from '../../components/AddressAutocomplete'

const steps = [
  { label: 'Location', icon: MapPin },
  { label: 'Vehicle',  icon: Car },
  { label: 'Service',  icon: Wrench },
  { label: 'Confirm',  icon: CheckCircle2 },
]

export default function RequestService() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    location: '', destination: '', lat: null, lng: null,
    destLat: null, destLng: null,
    vehicleType: '', vehicleDetails: '', licensePlate: '',
    service: '', notes: '',
  })
  const [quote, setQuote] = useState(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [matching, setMatching] = useState(false)
  const [matched,  setMatched]  = useState(false)
  const [nearbyDrivers, setNearbyDrivers] = useState([])
  const { createJob, getQuote, geocode, fetchNearbyDrivers } = useApp()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  // Get real user GPS location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          let address = 'Current Location'
          
          try {
            const MAPBOX_TOKEN = 'pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA'
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
            const data = await res.json()
            if (data && data.features && data.features.length > 0) {
              address = data.features[0].place_name
            }
          } catch (err) {
            console.warn('Geocoding failed:', err)
          }

          setForm(f => ({
            ...f,
            lat,
            lng,
            location: f.location || address
          }))
        },
        (err) => console.warn('Could not get GPS:', err)
      )
    }
  }, [])

  // Fetch nearby drivers when location changes
  useEffect(() => {
    if (form.lat && form.lng && step === 0) {
      fetchNearbyDrivers(form.lat, form.lng)
        .then(drivers => setNearbyDrivers(drivers || []))
        .catch(err => console.warn('Failed to fetch nearby drivers', err))
    }
  }, [form.lat, form.lng, step, fetchNearbyDrivers])

  // Listen for real-time driver movement
  useEffect(() => {
    const unsub = onEvent('driver_location_update', (data) => {
      setNearbyDrivers(prev => {
        const idx = prev.findIndex(d => d.id === data.driverId)
        if (idx === -1) return prev // If driver wasn't in initial nearby list, ignore or could add them if close enough
        const next = [...prev]
        next[idx] = { ...next[idx], latitude: data.latitude, longitude: data.longitude }
        return next
      })
    })
    return unsub
  }, [])

  const selectedService = SERVICE_TYPES.find(s => s.id === form.service)
  const selectedVehicle  = VEHICLE_TYPES.find(v => v.id === form.vehicleType)

  const handleSubmit = async () => {
    setMatching(true)
    try {
      await createJob({
        serviceType:     form.service,
        vehicleType:     form.vehicleType,
        vehicleDetails:  `${form.vehicleDetails} - ${form.licensePlate}`,
        pickupLocation:  form.location,
        pickupLat:       form.lat,
        pickupLng:       form.lng,
        destination:     form.destination || null,
        destLat:         form.destLat,
        destLng:         form.destLng,
        amount:          quote ? quote.total : (selectedService?.price || 85),
        notes:           form.notes,
      })
      const unsubAcc = onEvent('job_accepted', (data) => {
        setMatching(false); setMatched(true)
        addNotification({ type: 'job', title: 'Driver Assigned!', message: `${data.driver.name} is on the way. ETA: ${data.eta} min` })
        unsubAcc(); if (typeof unsubNeg === 'function') unsubNeg();
        setTimeout(() => navigate('/track'), 2000)
      })

      const unsubNeg = onEvent('job_negotiating', (data) => {
        setMatching(false); setMatched(true)
        addNotification({ type: 'job', title: 'Driver Available!', message: `${data.driver.name} is ready to negotiate.` })
        unsubNeg(); if (typeof unsubAcc === 'function') unsubAcc();
        setTimeout(() => navigate('/track'), 2000)
      })
      
      // Store the unsub function so we can clean it up if the user navigates away, 
      // but we NO LONGER auto-simulate the match. They must wait for a real driver.
    } catch (err) { setMatching(false); alert('Failed: ' + err.message) }
  }

  /* ── Loading states ──────────────────────────────────── */
  if (matched) return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
      <p className="text-gray-500">Taking you to tracking...</p>
    </motion.div>
  )

  if (matching) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-lg mx-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <span className="absolute -inset-2 rounded-full border-2 border-blue-200 animate-ping" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Finding drivers...</h2>
      <p className="text-gray-500 text-sm mb-6">Matching you with the closest operator</p>
      <div className="w-full h-48 rounded-2xl overflow-hidden">
        <MapView 
          center={form.lat && form.lng ? [form.lat, form.lng] : [19.4284, -99.1676]}
          markers={[
            ...(form.lat && form.lng ? [{ lat: form.lat, lng: form.lng, type: 'client', label: 'Your Location' }] : []),
            ...nearbyDrivers.map(d => ({ lat: d.latitude, lng: d.longitude, type: 'nearby_driver', label: d.name, sublabel: d.vehicle }))
          ]}
          className="h-full" 
        />
      </div>
    </div>
  )

  const handleNextStep = async () => {
    if (step === 0) {
      if (!form.location || !form.destination) {
        return alert("Please enter both pickup and destination addresses.");
      }

      // Geocode Pickup if needed
      if (!form.lat || !form.lng) {
        setLoadingQuote(true);
        try {
          const data = await geocode(form.location);
          if (data && data.length > 0) {
            form.lat = parseFloat(data[0].lat);
            form.lng = parseFloat(data[0].lon);
            form.location = data[0].display_name || form.location;
            setForm(f => ({ ...f, lat: form.lat, lng: form.lng, location: form.location }));
          } else {
            setLoadingQuote(false);
            return alert("Could not locate pickup address. Please provide a valid address.");
          }
        } catch (err) {
          console.warn('Pickup geocoding failed:', err);
          setLoadingQuote(false);
          return alert("Pickup geocoding failed. Try again.");
        }
        setLoadingQuote(false);
      }

      // Geocode Destination if needed
      if (!form.destLat || !form.destLng) {
        setLoadingQuote(true);
        try {
          const data = await geocode(form.destination);
          if (data && data.length > 0) {
            form.destLat = parseFloat(data[0].lat);
            form.destLng = parseFloat(data[0].lon);
            form.destination = data[0].display_name || form.destination;
            setForm(f => ({ ...f, destLat: form.destLat, destLng: form.destLng, destination: form.destination }));
          } else {
            setLoadingQuote(false);
            return alert("Could not locate destination. Please provide a valid address.");
          }
        } catch (err) {
          console.warn('Destination geocoding failed:', err);
          setLoadingQuote(false);
          return alert("Geocoding failed. Try again.");
        }
        setLoadingQuote(false);
      }
    }

    if (step === 1) {
      setLoadingQuote(true);
      try {
        const q = await getQuote({
          pickupLat: form.lat, pickupLng: form.lng,
          destLat: form.destLat, destLng: form.destLng,
          vehicleType: form.vehicleType
        });
        setQuote(q);
      } catch (err) {
        setLoadingQuote(false);
        return alert("Failed to get pricing quote: " + err.message);
      }
      setLoadingQuote(false);
    }
    
    setStep(s => s + 1);
  }

  /* ── Main form ───────────────────────────────────────── */
  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-8">

      {/* ── Left col: multi-step form ── */}
      <div className="lg:col-span-3">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-xs text-gray-400">{steps[step].label}</span>
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Step content with animation */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}>

            {/* Step 0: Location */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">📍 Your Location</h2>
                  <p className="text-sm text-gray-500">Where do you need us?</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Pickup Address</label>
                    <AddressAutocomplete 
                      placeholder="Enter your current address..."
                      value={form.location}
                      onChange={(val) => setForm(f => ({ ...f, location: val, lat: null, lng: null }))}
                      onSelect={(addr, lat, lng) => setForm(f => ({ ...f, location: addr, lat, lng }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Destination (Required)</label>
                    <AddressAutocomplete 
                      placeholder="Where should we tow?"
                      value={form.destination}
                      onChange={(val) => setForm(f => ({ ...f, destination: val, destLat: null, destLng: null }))}
                      onSelect={(addr, lat, lng) => setForm(f => ({ ...f, destination: addr, destLat: lat, destLng: lng }))}
                    />
                  </div>
                </div>
                <div className="h-64 mt-6 rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative">
                  <MapView 
                    center={form.lat && form.lng ? [form.lat, form.lng] : [19.4284, -99.1676]}
                    markers={[
                      ...(form.lat && form.lng ? [{ lat: form.lat, lng: form.lng, type: 'client', label: 'Your Location' }] : []),
                      ...(form.destLat && form.destLng ? [{ lat: form.destLat, lng: form.destLng, type: 'destination', label: 'Destination' }] : []),
                      ...nearbyDrivers.map(d => ({ lat: d.latitude, lng: d.longitude, type: 'nearby_driver', label: d.name, sublabel: d.vehicle }))
                    ]}
                    className="h-full" 
                  />
                  {!form.lat && !form.lng && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                      <p className="text-sm text-gray-500 font-medium">Select pickup location to see map</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Vehicle */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">🚗 Your Vehicle</h2>
                  <p className="text-sm text-gray-500">Tell us what we're towing</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {VEHICLE_TYPES.map(v => (
                    <button key={v.id} onClick={() => setForm({ ...form, vehicleType: v.id })}
                      className={`py-4 px-2 rounded-2xl border-2 text-center transition-all duration-200
                        ${form.vehicleType === v.id
                          ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                          : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                      <span className="text-3xl block mb-1">{v.icon}</span>
                      <p className="text-xs font-semibold text-gray-700">{v.label}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                    <input className="input-field" placeholder="e.g., 2020 Toyota Camry - Silver"
                      value={form.vehicleDetails} onChange={e => setForm({ ...form, vehicleDetails: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">License Plate</label>
                    <input className="input-field" placeholder="e.g., ABC-1234"
                      value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">🔧 Select Service</h2>
                  <p className="text-sm text-gray-500">What do you need?</p>
                </div>
                <div className="space-y-2.5">
                  {SERVICE_TYPES.map(s => (
                    <button key={s.id} onClick={() => setForm({ ...form, service: s.id })}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200
                        ${form.service === s.id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                      <span className="text-3xl">{s.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900">
                          {s.title || s.label} {s.id === 'tow' && selectedVehicle ? `(${selectedVehicle.label})` : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-blue-600">
                          Negotiate
                        </p>
                      </div>
                      {form.service === s.id && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Notes</label>
                  <textarea className="input-field" rows={2} placeholder="Any special instructions..."
                    value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-0.5">✅ Confirm Request</h2>
                  <p className="text-sm text-gray-500">Review before submitting</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-blue-200 text-sm">Selected Service</span>
                    <span className="text-3xl">{selectedService?.icon}</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{selectedService?.label}</p>
                  <p className="text-blue-200 text-sm">{selectedVehicle?.label} · {form.vehicleDetails}</p>
                  <div className="mt-4 pt-4 border-t border-blue-500/50 flex items-center justify-between">
                    <span className="text-blue-200">Price</span>
                    <span className="text-lg font-bold text-white">To be negotiated</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Pickup',       value: form.location || 'Av. Reforma 222' },
                    form.destination && { label: 'Destination', value: form.destination },
                    { label: 'License Plate', value: form.licensePlate || '—' },
                  ].filter(Boolean).map(row => (
                    <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <Zap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800">You will negotiate the final price directly with the driver via chat before the service begins.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-30 transition hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={handleNextStep} disabled={loadingQuote}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-blue-200 disabled:opacity-70">
              {loadingQuote ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-300">
              <Zap className="w-4 h-4" /> Confirm &amp; Find Driver
            </button>
          )}
        </div>

      </div>{/* end left col */}

      {/* ── Right col: desktop sidebar ── */}
      <aside className="hidden lg:flex lg:col-span-2 flex-col gap-5 mt-0">

        {/* Live summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-900 text-right max-w-[55%] truncate">{form.location || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium text-gray-900">{selectedVehicle?.label || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-900">{selectedService?.label || '—'}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Price</span>
                <span className="font-bold text-blue-700 text-sm">
                  To be negotiated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-5 text-white">
          <h3 className="font-bold mb-3">Why US Towing?</h3>
          <ul className="space-y-2">
            {['⚡ Response under 15 min', '✅ Verified drivers', '📍 Real-time GPS tracking', '💬 24/7 customer support', '💳 Transparent pricing'].map(item => (
              <li key={item} className="text-sm text-blue-100">{item}</li>
            ))}
          </ul>
        </div>

      </aside>

    </div>
  )
}
