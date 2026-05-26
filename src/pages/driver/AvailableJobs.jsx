import { MapPin, Clock, DollarSign, Navigation, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useNotifications } from '../../context/NotificationContext'
import { SERVICE_TYPES } from '../../data/mockData'
import { useNavigate } from 'react-router-dom'
import { onEvent } from '../../services/websocket'
import MapView from '../../components/MapView'
import { motion } from 'framer-motion'

export default function AvailableJobs() {
  const { getAvailableJobs, acceptJob, getDriverProfile } = useApp()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [driverLoc, setDriverLoc] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getAvailableJobs().then(j => { setJobs(j); setLoaded(true) }).catch(() => setLoaded(true))
    
    // Get real GPS location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setDriverLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          // Fallback to profile if GPS fails
          getDriverProfile().then(p => {
            if (p.latitude && p.longitude) {
              setDriverLoc({ lat: p.latitude, lng: p.longitude })
            }
          }).catch(() => {})
        }
      )
    } else {
      getDriverProfile().then(p => {
        if (p.latitude && p.longitude) setDriverLoc({ lat: p.latitude, lng: p.longitude })
      }).catch(() => {})
    }

    const unsub = onEvent('new_job', () => {
      getAvailableJobs().then(setJobs).catch(() => {})
    })
    return unsub
  }, [])

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId)
      addNotification({ type: 'job', title: 'Job Accepted', message: 'Navigate to the client location to begin service' })
      navigate('/driver/active')
    } catch (err) {
      alert(err.message)
    }
  }

  if (!loaded) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  const mapMarkers = [
    ...(driverLoc ? [{ lat: driverLoc.lat, lng: driverLoc.lng, type: 'driver', label: 'You' }] : []),
    ...jobs.map(j => ({ lat: j.pickupLat, lng: j.pickupLng, type: 'client', label: j.clientName, sublabel: j.pickupLocation }))
  ]

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-5 lg:gap-8 lg:space-y-0 h-full">

      {/* ── Left Column: Job List ── */}
      <div className="lg:col-span-3 flex flex-col h-full space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Available Jobs</h1>
          <p className="text-sm text-gray-400 mt-0.5">{jobs.length} jobs waiting nearby</p>
        </div>

        {/* Map on mobile/tablet (hidden on lg) */}
        {jobs.length > 0 && (
          <div className="h-64 rounded-2xl overflow-hidden shadow-md lg:hidden shrink-0 border border-gray-800">
            <MapView markers={mapMarkers} className="h-full" />
          </div>
        )}

        <div className="space-y-3 flex-1">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">
              <Navigation className="w-12 h-12 text-gray-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-300">No Jobs Available</h2>
              <p className="text-sm text-gray-500 mt-1">Stay online, new requests will appear here.</p>
            </div>
          ) : (
            jobs.map((job, i) => {
              const service = SERVICE_TYPES.find(s => s.id === job.serviceType)
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-gray-800/80 hover:bg-gray-800 border border-gray-700/50 rounded-2xl p-4 shadow-sm transition">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden relative">
                      {job.clientAvatar ? (
                        <img src={job.clientAvatar} alt="Client" className="w-full h-full object-cover" />
                      ) : (
                        service?.icon || '🔗'
                      )}
                      {job.clientAvatar && <div className="absolute bottom-0 right-0 bg-emerald-500/90 text-[10px] w-5 h-5 flex items-center justify-center rounded-tl-lg">{service?.icon}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-100 text-sm truncate">{service?.label || job.serviceType}</h3>
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">To Negotiate</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 truncate">{job.clientName} · {job.vehicleDetails}</p>

                      {job.photos && job.photos.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {job.photos.map((url, idx) => (
                            <img key={idx} src={url} alt="Job" onClick={() => window.open(url, '_blank')}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-700/50 cursor-pointer hover:opacity-80 transition" title="Click to enlarge" />
                          ))}
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Pickup</p>
                            <p className="text-xs font-medium text-gray-300 truncate">{job.pickupLocation}</p>
                          </div>
                        </div>
                        {job.destination && (
                          <div className="flex items-start gap-2">
                            <Navigation className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Destination</p>
                              <p className="text-xs font-medium text-gray-300 truncate">{job.destination}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-700 pt-3 mt-3">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {job.distance != null && <span className="font-semibold text-blue-400" title="Distance to pickup">{job.distance} km away</span>}
                          {job.tripDistance != null && <span className="font-semibold text-emerald-400" title="Trip distance"> • {job.tripDistance} km trip</span>}
                        </div>
                        <button onClick={() => handleAccept(job.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition shadow-lg shadow-emerald-900/50">
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Right Column: Map (lg+ only) ── */}
      <div className="hidden lg:block lg:col-span-2 relative h-[calc(100vh-8rem)]">
        <div className="sticky top-24 h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
          <MapView markers={mapMarkers} className="h-full" />
        </div>
      </div>

    </div>
  )
}
