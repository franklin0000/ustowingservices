import { useState, useEffect } from 'react'
import { Phone, MessageSquare, Navigation, MapPin, CheckCircle2, Clock, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import MapView from '../../components/MapView'
import { onEvent } from '../../services/websocket'
import { motion, AnimatePresence } from 'framer-motion'
import { stripe } from '../../services/api'
import { useSearchParams, useNavigate } from 'react-router-dom'
import LiveChat from '../../components/LiveChat'
import DriverProfileModal from '../../components/DriverProfileModal'

const STATUS_CONFIG = {
  negotiating: { label: 'Negotiating Price', color: 'bg-orange-100 text-orange-700', step: 1 },
  accepted:   { label: 'Driver Assigned',    color: 'bg-blue-100 text-blue-700',     step: 1 },
  en_route:   { label: 'On the Way',          color: 'bg-indigo-100 text-indigo-700', step: 2 },
  arrived:    { label: 'Driver Arrived',      color: 'bg-purple-100 text-purple-700', step: 3 },
  in_service: { label: 'Service in Progress', color: 'bg-amber-100 text-amber-700',   step: 4 },
  completed:  { label: 'Completed',           color: 'bg-emerald-100 text-emerald-700', step: 5 },
}

const PROGRESS_STEPS = ['Assigned', 'On Way', 'Arrived', 'Service', 'Done']

export default function TrackDriver() {
  const { getMyJobs, rateJob, cancelJob } = useApp()
  const navigate = useNavigate()
  const [activeReq,  setActiveReq]  = useState(null)
  const [driver,     setDriver]     = useState(null)
  const [driverLoc,  setDriverLoc]  = useState(null)
  const [eta,        setEta]        = useState(8)
  const [showRating, setShowRating] = useState(false)
  const [rating,     setRating]     = useState(0)
  const [loaded,     setLoaded]     = useState(false)
  const [isPaying,   setIsPaying]   = useState(false)
  const [chatOpen,   setChatOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchAndVerify = async () => {
      const paymentStatus = searchParams.get('payment')
      const sessionId = searchParams.get('session_id')

      if (paymentStatus === 'success' || paymentStatus === 'success_negotiating') {
        if (sessionId) {
          try {
            // Force manual verification before pulling jobs to prevent race conditions
            await stripe.verifySession(sessionId)
          } catch (err) {
            console.error("Session verify failed:", err)
          }
        }
        
        if (paymentStatus === 'success') setShowRating(true)
        setSearchParams({})
      }

      try {
        const jobs = await getMyJobs()
        const active = jobs.find(j =>
          ['accepted', 'negotiating', 'en_route', 'arrived', 'in_service', 'matched'].includes(j.status)
        )
        if (active) {
          setActiveReq(active)
          import('../../services/api').then(({ jobs: jobsApi }) => {
            jobsApi.get(active.id).then(full => {
              if (full.driver) {
                setDriver(full.driver)
                setDriverLoc({ lat: full.driver.latitude, lng: full.driver.longitude })
              }
            })
          })
        }
      } catch (err) {
        console.error("Failed to fetch active job:", err)
      } finally {
        setLoaded(true)
      }
    }

    fetchAndVerify()
  }, [searchParams])

  useEffect(() => {
    const u1 = onEvent('driver_location', ({ latitude, longitude }) => setDriverLoc({ lat: latitude, lng: longitude }))
    const u2 = onEvent('job_status',      ({ status }) => {
      setActiveReq(prev => prev ? { ...prev, status } : null)
      if (status === 'completed') setShowRating(true)
    })
    const u3 = onEvent('job_accepted',    ({ driver: d, eta: e }) => {
      setDriver(d); setDriverLoc({ lat: d.lat, lng: d.lng }); setEta(e)
      setActiveReq(prev => prev ? { ...prev, status: 'accepted', driverId: d.id } : null)
    })
    const u4 = onEvent('price_proposed',  ({ amount }) => {
      setActiveReq(prev => prev ? { ...prev, agreedPrice: amount } : null)
    })
    return () => { u1(); u2(); u3(); u4(); }
  }, [])

  useEffect(() => {
    if (eta > 0 && activeReq) {
      const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 10000)
      return () => clearInterval(t)
    }
  }, [eta, activeReq])

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return
    try {
      await cancelJob(activeReq.id)
      setActiveReq(null)
      navigate('/client')
    } catch (err) {
      alert('Failed to cancel: ' + err.message)
    }
  }

  const [review,     setReview]     = useState('')

  const handleComplete = async () => {
    if (rating > 0 && activeReq) {
      await rateJob(activeReq.id, rating, review)
      setShowRating(false)
      setActiveReq(null)
    }
  }

  const handlePayment = async () => {
    setIsPaying(true)
    try {
      const res = await stripe.createJobCheckout(activeReq.id)
      window.location.href = res.url
    } catch (err) {
      alert('Failed to initialize payment: ' + err.message)
      setIsPaying(false)
    }
  }

  /* ── Loading ── */
  if (!loaded) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  /* ── Empty state ── */
  if (!activeReq || !activeReq.driverId) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Navigation className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-lg font-bold text-gray-700 mb-1">No Active Request</h2>
      <p className="text-sm text-gray-400">Request a service to track your driver here.</p>
    </div>
  )

  const statusInfo = STATUS_CONFIG[activeReq.status] || STATUS_CONFIG.accepted
  const markers = [
    { lat: activeReq.pickupLat, lng: activeReq.pickupLng, type: 'client', label: 'Pickup', sublabel: activeReq.pickupLocation },
    ...(driverLoc ? [{ lat: driverLoc.lat, lng: driverLoc.lng, type: 'driver', label: driver?.name || 'Driver' }] : []),
    ...(activeReq.destLat ? [{ lat: activeReq.destLat, lng: activeReq.destLng, type: 'destination', label: 'Dropoff', sublabel: activeReq.destination }] : [])
  ]

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      
      {/* ── Background Full-Screen Map ── */}
      <div className="absolute inset-0 z-0">
        <MapView markers={markers} className="w-full h-full !rounded-none !border-none" zoom={14} />
      </div>

      {/* ── Overlay UI (Floating Elements) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pb-0">
        
        {/* Top Floating Status (Like Uber's header) */}
        <div className="w-full max-w-md mx-auto mt-6 md:mt-16 pointer-events-auto space-y-4 px-4">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md rounded-full px-5 py-3 shadow-lg flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600" />
              </span>
              <span className="font-bold text-gray-900 text-sm">{statusInfo.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('SOS: Calling 911...')} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-200 transition-colors">
                SOS
              </button>
              <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">ETA {eta} min</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Floating Sheet (Driver & Job Details) */}
        <div className="w-full max-w-md mx-auto pointer-events-auto px-2 md:px-0 pb-4 md:pb-6">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[2rem] p-5 shadow-2xl border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
            
            {/* Progress Bar top edge */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
              <div className="h-full bg-brand-600 transition-all duration-1000" 
                style={{ width: `${(statusInfo.step / 5) * 100}%` }} />
            </div>

            {/* Drag Handle */}
            <div 
              className="w-full flex justify-center pt-1 pb-1 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="w-12 h-1.5 bg-gray-200 hover:bg-gray-300 transition-colors rounded-full" />
            </div>

            {/* Driver Profile Section */}
            {driver ? (
              <div className="flex items-center gap-4 pt-2">
                <button onClick={() => setProfileOpen(true)} className="relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white overflow-hidden">
                    {driver.avatar ? (
                      <img src={driver.avatar} alt="Driver" className="w-full h-full object-cover" />
                    ) : (
                      driver.name?.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow border border-gray-100 flex items-center gap-1 text-[10px] font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {driver.rating}
                  </div>
                </button>
                <div 
                  className="flex-1 cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded-lg transition"
                  onClick={() => setProfileOpen(true)}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{driver.name}</h3>
                    <div className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{driver.vehicle}</p>
                  <p className="text-xs text-brand-600 font-semibold mt-0.5">{driver.phone || 'No phone provided'}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${driver.phone}`} className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition relative">
                    <Phone className="w-4 h-4" />
                  </a>
                  <button onClick={() => setChatOpen(true)} className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 transition relative">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-gray-400 text-sm font-medium pt-2">
                Locating driver details...
              </div>
            )}

            <div className="h-px bg-gray-100 w-full" />

            {/* Location Details (Collapsible) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-sm bg-gray-800" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs text-gray-400 font-medium">Pickup</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{activeReq.pickupLocation}</p>
                    </div>
                  </div>
                  {activeReq.destination && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-xs text-gray-400 font-medium">Dropoff</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{activeReq.destination}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Complete action */}
            {activeReq.status === 'negotiating' && (
              <div className="space-y-3 pt-2">
                {activeReq.agreedPrice ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-orange-900 font-bold mb-1">
                      <span>Total to Pay:</span>
                      <span className="text-2xl">${activeReq.agreedPrice}</span>
                    </div>
                    <p className="text-xs text-orange-800/80 mb-1 leading-tight">
                      If you'd like to negotiate this price, use the chat button above to message the provider.
                    </p>
                    <button onClick={handlePayment} disabled={isPaying}
                      className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-75">
                      {isPaying ? 'Processing...' : 'Pay Now & Continue'}
                    </button>
                    <button onClick={handleCancel} disabled={isPaying}
                      className="w-full bg-white border-2 border-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition disabled:opacity-75">
                      Cancel Request
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="text-center p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 font-medium text-sm">
                      Please use the chat to negotiate the final price with the driver.
                    </div>
                    <button onClick={handleCancel}
                      className="w-full bg-white border-2 border-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition">
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeReq.status === 'in_service' && (
              <button onClick={() => setShowRating(true)}
                className="w-full bg-gray-100 text-gray-500 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition cursor-not-allowed">
                <Clock className="w-4 h-4 animate-spin" /> Service in Progress...
              </button>
            )}
            {activeReq.status === 'completed' && (
              <button onClick={() => setShowRating(true)}
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition hover:bg-emerald-700">
                <CheckCircle2 className="w-5 h-5" /> Rate Your Driver
              </button>
            )}

          </motion.div>
        </div>
      </div>

      {/* ── Rating bottom sheet ── */}
      {showRating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-t-3xl p-8 w-full max-w-lg">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold text-center mb-1">Rate Your Experience</h3>
            <p className="text-gray-500 text-center text-sm mb-6">How was {driver?.name}?</p>
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-5xl transition-all duration-150 ${s <= rating ? 'scale-110' : 'opacity-25 grayscale'}`}>⭐</button>
              ))}
            </div>
            <div className="mb-8">
              <textarea
                placeholder="Leave a comment about the service... (optional)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRating(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">Cancel</button>
              <button onClick={handleComplete} disabled={rating === 0}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-40">Submit</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Live Chat ── */}
      {chatOpen && activeReq && (
        <LiveChat 
          jobId={activeReq.id} 
          otherPartyName={driver?.name} 
          otherPartyAvatar={driver?.avatar}
          onClose={() => setChatOpen(false)} 
        />
      )}

      {/* ── Driver Profile Modal ── */}
      <AnimatePresence>
        {profileOpen && driver && (
          <DriverProfileModal
            isOpen={profileOpen}
            driverId={driver.id}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
