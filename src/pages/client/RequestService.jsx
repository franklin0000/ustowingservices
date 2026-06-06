import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Wrench, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Zap, Camera, Trash2, ShieldCheck, Star, MessageSquare } from 'lucide-react'
import { VEHICLE_TYPES, SERVICE_TYPES } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { useNotifications } from '../../context/NotificationContext'
import MapView from '../../components/MapView'
import { onEvent } from '../../services/websocket'
import { motion, AnimatePresence } from 'framer-motion'
import AddressAutocomplete from '../../components/AddressAutocomplete'

export default function RequestService() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    service: '', location: '', destination: '', lat: null, lng: null,
    destLat: null, destLng: null,
    vehicleType: '', vehicleDetails: '', licensePlate: '', notes: '', photos: [], fuelType: '', propertyType: '',
  })
  const [quote, setQuote] = useState(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [matching, setMatching] = useState(false)
  const [matched,  setMatched]  = useState(false)
  const [nearbyDrivers, setNearbyDrivers] = useState([])
  const { createJob, getQuote, geocode, fetchNearbyDrivers, uploadJobPhoto } = useApp()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const requiresVehicle = ['tow', 'mechanic', 'fuel', 'lockout', 'jumpstart', 'tire'].includes(form.service)
  
  const steps = [
    { label: 'Service', icon: Wrench },
    { label: 'Location', icon: MapPin },
    ...(requiresVehicle ? [{ label: 'Vehicle', icon: Car }] : [{ label: 'Details', icon: Camera }]),
    { label: 'Confirm', icon: CheckCircle2 },
  ]

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhotos(true)
    try {
      const res = await uploadJobPhoto(file)
      if (res?.photoUrl) {
        setForm(f => ({ ...f, photos: [...f.photos, res.photoUrl] }))
      }
    } catch (err) {
      addNotification({ title: 'Error', message: 'Failed to upload photo', type: 'error' })
    } finally {
      setUploadingPhotos(false)
    }
  }

  const removePhoto = (idx) => {
    setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }))
  }

  // Initial GPS Location
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
            if (data?.features?.length > 0) address = data.features[0].place_name
          } catch (err) {}
          setForm(f => ({ ...f, lat, lng, location: f.location || address }))
        },
        () => {}
      )
    }
  }, [])

  // Fetch nearby drivers whenever lat/lng exist
  useEffect(() => {
    if (form.lat && form.lng) {
      fetchNearbyDrivers(form.lat, form.lng).then(d => setNearbyDrivers(d || []))
    }
  }, [form.lat, form.lng, fetchNearbyDrivers])

  const selectedService = SERVICE_TYPES.find(s => s.id === form.service)
  const selectedVehicle = VEHICLE_TYPES.find(v => v.id === form.vehicleType)

  const handleNextStep = async () => {
    // Validation
    if (step === 0 && !form.service) return alert("Please select a service.")
    
    if (step === 1) {
      if (!form.location) return alert("Please enter a pickup location.")
      if (['tow', 'moving'].includes(form.service) && !form.destination) return alert(`${form.service === 'moving' ? 'Moving' : 'Towing'} requires a destination.`)
      
      setLoadingQuote(true)
      try {
        if (!form.lat) {
          const data = await geocode(form.location)
          if (data?.length > 0) {
            form.lat = parseFloat(data[0].lat); form.lng = parseFloat(data[0].lon); form.location = data[0].display_name
            setForm(f => ({ ...f, lat: form.lat, lng: form.lng, location: form.location }))
          } else throw new Error("Could not locate address.")
        }
        if (form.destination && !form.destLat) {
          const data = await geocode(form.destination)
          if (data?.length > 0) {
            form.destLat = parseFloat(data[0].lat); form.destLng = parseFloat(data[0].lon); form.destination = data[0].display_name
            setForm(f => ({ ...f, destLat: form.destLat, destLng: form.destLng, destination: form.destination }))
          } else throw new Error("Could not locate destination.")
        }
      } catch (err) {
        setLoadingQuote(false); return alert(err.message)
      }
      setLoadingQuote(false)
    }

    if (step === 2) {
      if (requiresVehicle && !form.vehicleType) return alert("Please select a vehicle type.")
      if (form.service === 'fuel' && !form.fuelType) return alert("Please select a fuel type (Gasoline or Diesel).")
      if (form.service === 'cleaning' && !form.propertyType) return alert("Please specify the type of property to clean.")
      setLoadingQuote(true)
      try {
        const q = await getQuote({
          pickupLat: form.lat, pickupLng: form.lng,
          destLat: form.destLat, destLng: form.destLng,
          vehicleType: form.vehicleType || 'sedan'
        })
        setQuote(q)
      } catch (err) { console.warn(err) }
      setLoadingQuote(false)
    }

    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setMatching(true)
    try {
      let finalDetails = form.vehicleDetails ? `${form.vehicleDetails} - ${form.licensePlate}` : form.notes
      if (form.service === 'fuel') finalDetails = `Fuel Type: ${form.fuelType} | ${finalDetails}`
      if (form.service === 'cleaning') finalDetails = `Property: ${form.propertyType} | ${finalDetails}`

      await createJob({
        serviceType:     form.service,
        vehicleType:     form.vehicleType || 'none',
        vehicleDetails:  finalDetails,
        pickupLocation:  form.location,
        pickupLat:       form.lat,
        pickupLng:       form.lng,
        destination:     form.destination || null,
        destLat:         form.destLat,
        destLng:         form.destLng,
        amount:          quote?.total || selectedService?.price || 85,
        notes:           form.notes,
        photos:          form.photos,
      })
      
      const unsubAcc = onEvent('job_accepted', (data) => {
        setMatching(false); setMatched(true)
        addNotification({ type: 'job', title: 'Provider Assigned!', message: `${data.driver.name} is on the way. ETA: ${data.eta} min` })
        unsubAcc(); setTimeout(() => navigate('/track'), 2000)
      })

      const unsubNeg = onEvent('job_negotiating', (data) => {
        setMatching(false); setMatched(true)
        addNotification({ type: 'job', title: 'Provider Available!', message: `${data.driver.name} is ready to negotiate.` })
        unsubNeg(); setTimeout(() => navigate('/track'), 2000)
      })
    } catch (err) { setMatching(false); alert('Failed: ' + err.message) }
  }

  if (matched) return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
      <p className="text-gray-500">Connecting you with the verified provider...</p>
    </motion.div>
  )

  if (matching) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-lg mx-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        </div>
        <span className="absolute -inset-2 rounded-full border-2 border-brand-200 animate-ping" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Locating Providers...</h2>
      <p className="text-gray-500 text-sm mb-6">Pinging 100% verified professionals nearby</p>
      <div className="w-full h-48 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <MapView 
          center={form.lat ? [form.lat, form.lng] : [19.4284, -99.1676]}
          markers={[
            ...(form.lat ? [{ lat: form.lat, lng: form.lng, type: 'client', label: 'You' }] : []),
            ...nearbyDrivers.map(d => ({ lat: d.latitude, lng: d.longitude, type: 'nearby_driver', label: d.name }))
          ]}
          className="h-full" 
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Global Trust Banner */}
      <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3 mb-6 flex items-center justify-center gap-4 flex-wrap text-sm font-medium text-brand-800 shadow-sm backdrop-blur-sm">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Verified Providers</span>
        <span className="hidden sm:block text-brand-200">|</span>
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> ~15 Min Response Time</span>
        <span className="hidden sm:block text-brand-200">|</span>
        <span className="flex items-center gap-1.5 text-gray-600 text-xs font-bold uppercase tracking-wider">🔒 Stripe Secure Payment</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step {step + 1} of {steps.length}</span>
          <span className="text-xs font-medium text-gray-400">{steps[step].label}</span>
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-sm' : 'bg-gray-100 shadow-inner'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          
          {/* STEP 0: SERVICE */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">What do you need?</h2>
                <p className="text-gray-500 mt-1">Select a service to dispatch a verified professional immediately.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SERVICE_TYPES.map(s => (
                  <button key={s.id} onClick={() => setForm({ ...form, service: s.id })}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 overflow-hidden group
                      ${form.service === s.id ? 'border-transparent shadow-lg scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'}`}>
                    
                    {/* Background active state */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} transition-opacity duration-300 ${form.service === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-5'}`} />
                    
                      <div className="flex flex-col items-center text-center">
                        <div className={`text-3xl p-3 rounded-2xl bg-white shadow-sm mb-2 ${form.service === s.id ? 'shadow-md scale-110 transition-transform' : ''}`}>
                          {s.icon}
                        </div>
                        <h3 className={`text-sm font-bold ${form.service === s.id ? 'text-white' : 'text-gray-900'}`}>{s.label}</h3>
                      </div>
                  </button>
                ))}
              </div>

              {/* Live Map Preview */}
              <div className="mt-8 rounded-3xl overflow-hidden border border-gray-200 shadow-soft h-[250px] sm:h-[300px] relative">
                <MapView 
                  center={form.lat ? [form.lat, form.lng] : [19.4284, -99.1676]}
                  markers={[
                    ...(form.lat ? [{ lat: form.lat, lng: form.lng, type: 'client', label: 'You' }] : []),
                    ...nearbyDrivers.map(d => ({ lat: d.latitude, lng: d.longitude, type: 'nearby_driver', label: d.name }))
                  ]}
                  className="h-full w-full" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 text-xs sm:text-sm">Live Provider Network</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{nearbyDrivers.length || 12} verified pros nearby</p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-200" />)}
                  </div>
                </div>
              </div>

              {/* Client Testimonials */}
              <div className="mt-8 bg-gray-50 border border-gray-100 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> What Our Clients Say
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex text-amber-500 mb-1"><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/></div>
                    <p className="text-sm text-gray-600 italic">"My tire blew out on the highway. A verified mechanic was there in 12 minutes! Absolute lifesaver."</p>
                    <p className="text-xs font-bold text-gray-900 mt-2">— Sarah M.</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hidden sm:block">
                    <div className="flex text-amber-500 mb-1"><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/><Star className="w-3 h-3 fill-amber-500"/></div>
                    <p className="text-sm text-gray-600 italic">"Locked my keys in the car at 2 AM. The app showed exactly where the driver was, zero stress."</p>
                    <p className="text-xs font-bold text-gray-900 mt-2">— David K.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Set Location</h2>
                <p className="text-gray-500 mt-1">Where should the provider meet you?</p>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {form.service === 'fuel' ? 'Drop-off Location' : 'Pickup Location'}
                  </label>
                  <AddressAutocomplete 
                    placeholder="Enter current address..."
                    value={form.location}
                    onChange={(val) => setForm(f => ({ ...f, location: val, lat: null, lng: null }))}
                    onSelect={(addr, lat, lng) => setForm(f => ({ ...f, location: addr, lat, lng }))}
                  />
                </div>

                {['tow', 'moving'].includes(form.service) && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Destination (Required for {form.service === 'moving' ? 'Moving' : 'Towing'})</label>
                    <AddressAutocomplete 
                      placeholder={`Where are we ${form.service === 'moving' ? 'moving' : 'towing'} to?`}
                      value={form.destination}
                      onChange={(val) => setForm(f => ({ ...f, destination: val, destLat: null, destLng: null }))}
                      onSelect={(addr, lat, lng) => setForm(f => ({ ...f, destination: addr, destLat: lat, destLng: lng }))}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS/VEHICLE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{requiresVehicle ? 'Vehicle Details' : 'Job Details'}</h2>
                <p className="text-gray-500 mt-1">{requiresVehicle ? "Tell us about your vehicle." : "Provide more context for the provider."}</p>
              </div>

              {requiresVehicle && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {VEHICLE_TYPES.map(v => (
                    <button key={v.id} onClick={() => setForm({ ...form, vehicleType: v.id })}
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-200
                        ${form.vehicleType === v.id ? 'border-brand-600 bg-brand-50 shadow-md scale-105' : 'border-gray-100 bg-white hover:border-brand-200'}`}>
                      <span className="text-3xl block mb-2">{v.icon}</span>
                      <p className="text-xs font-bold text-gray-700">{v.label}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                {form.service === 'fuel' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Fuel Type Required</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setForm({ ...form, fuelType: 'Gasoline' })}
                        className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${form.fuelType === 'Gasoline' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300'}`}>
                        Gasoline
                      </button>
                      <button onClick={() => setForm({ ...form, fuelType: 'Diesel' })}
                        className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${form.fuelType === 'Diesel' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300'}`}>
                        Diesel
                      </button>
                    </div>
                  </div>
                )}

                {form.service === 'cleaning' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['House', 'Apartment', 'Restaurant', 'Other'].map(pt => (
                        <button key={pt} onClick={() => setForm({ ...form, propertyType: pt })}
                          className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${form.propertyType === pt ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300'}`}>
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {requiresVehicle && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vehicle Make/Model & Color</label>
                      <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all" placeholder="e.g., 2020 Honda Civic - Blue"
                        value={form.vehicleDetails} onChange={e => setForm({ ...form, vehicleDetails: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">License Plate (Optional)</label>
                      <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all" placeholder="e.g., ABC-1234"
                        value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })} />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Photos (Highly Recommended)</label>
                  <div className="flex flex-wrap gap-3">
                    {form.photos.map((photo, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 shadow-sm hover:bg-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {form.photos.length < 5 && (
                      <label className="w-24 h-24 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 flex flex-col items-center justify-center text-brand-600 cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
                        {uploadingPhotos ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6 mb-1" />}
                        <span className="text-xs font-bold">{uploadingPhotos ? 'Uploading...' : 'Add Photo'}</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhotos} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Instructions</label>
                  <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all min-h-[100px]" placeholder="Access codes, specific problem, tools needed..."
                    value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Confirm & Connect</h2>
                <p className="text-gray-500 mt-1">Review details and secure your professional.</p>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedService?.color} rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl bg-white/10 p-2.5 rounded-xl">{selectedService?.icon}</div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium">Selected Service</p>
                        <p className="text-xl font-bold">{selectedService?.label}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Pickup</span>
                      <span className="font-semibold text-right max-w-[60%] truncate">{form.location}</span>
                    </div>
                    {form.destination && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Destination</span>
                        <span className="font-semibold text-right max-w-[60%] truncate">{form.destination}</span>
                      </div>
                    )}
                    {requiresVehicle && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Vehicle</span>
                        <span className="font-semibold">{selectedVehicle?.label} {form.licensePlate && `(${form.licensePlate})`}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">Total Price</p>
                      <p className="text-xl font-black tracking-tight text-white">To be negotiated</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded-lg">
                        <MessageSquare className="w-3 h-3" /> Mutual Agreement
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <Star className="w-6 h-6 text-amber-500 mb-2" />
                  <p className="text-sm font-bold text-gray-900">Top Rated</p>
                  <p className="text-xs text-gray-500">Providers average 4.8★</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="text-sm font-bold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">Processed by Stripe</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-gray-200 text-gray-700 font-bold disabled:opacity-30 transition-all hover:bg-gray-50 active:scale-95">
            <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back</span>
          </button>
          {step < 3 ? (
            <button onClick={handleNextStep} disabled={loadingQuote}
              className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-70">
              {loadingQuote ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'} <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={matching}
              className="flex-1 bg-gradient-to-r from-brand-600 to-brand-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-brand-500/30 disabled:opacity-70">
              {matching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Confirm & Dispatch</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
