import { Phone, MessageSquare, MapPin, Navigation, CheckCircle2, User, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useNotifications } from '../../context/NotificationContext'
import { SERVICE_TYPES } from '../../data/mockData'
import { useNavigate } from 'react-router-dom'
import { onEvent } from '../../services/websocket'
import MapView from '../../components/MapView'
import LiveChat from '../../components/LiveChat'

const JOB_STAGES = ['Accepted', 'En Route', 'Arrived', 'In Service', 'Completed']
const STATUS_TO_STAGE = { accepted: 1, en_route: 2, arrived: 3, in_service: 4, completed: 5 }
const NEXT_STATUS = { accepted: 'en_route', en_route: 'arrived', arrived: 'in_service', in_service: 'completed' }

export default function ActiveJob() {
  const { getActiveJob, updateJobStatus, getDriverProfile, updateLocation, proposePrice, cancelJob } = useApp()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [driverLoc, setDriverLoc] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [proposeAmount, setProposeAmount] = useState('')
  const [proposing, setProposing] = useState(false)
  const [basePrice, setBasePrice] = useState('50')
  const [ratePerKm, setRatePerKm] = useState('2.5')

  useEffect(() => {
    getActiveJob().then(j => { setJob(j); setLoaded(true) }).catch(() => setLoaded(true))
    // Fetch last known profile location, but we'll override it with live GPS ASAP
    getDriverProfile().then(p => setDriverLoc({ lat: p.latitude, lng: p.longitude })).catch(() => {})

    // Listen if the client cancels the job
    const unsubCancel = onEvent('job_cancelled', ({ jobId }) => {
      setJob(current => {
        if (current && current.id === jobId) {
          addNotification({ type: 'alert', title: 'Job Cancelled', message: 'The client has cancelled this request.' })
          navigate('/driver')
          return null
        }
        return current
      })
    })

    // Listen to job status changes (e.g. when client pays and status becomes en_route)
    const unsubStatus = onEvent('job_status', ({ jobId, status }) => {
      setJob(current => {
        if (current && current.id === jobId) {
          return { ...current, status }
        }
        return current
      })
    })

    return () => {
      unsubCancel()
      unsubStatus()
    }
  }, [])

  // Use real-time GPS tracking via HTML5 Geolocation API
  useEffect(() => {
    if (!job || job.status === 'completed' || job.status === 'in_service') return

    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setDriverLoc({ lat: newLat, lng: newLng });
          
          // Send to server so client gets real-time map updates
          updateLocation(newLat, newLng).catch(() => {});
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [job, updateLocation])

  // Also listen for job status changes in case client pays and it goes to en_route
  useEffect(() => {
    const unsub = onEvent('job_status', ({ status }) => {
      setJob(prev => prev ? { ...prev, status } : null)
    });
    return () => unsub();
  }, [])

  const stage = job ? (job.status === 'negotiating' ? 0 : (STATUS_TO_STAGE[job.status] || 0)) : 0
  const service = job ? SERVICE_TYPES.find(s => s.id === job.serviceType) : null

  const handleProposePrice = async () => {
    if (!proposeAmount || isNaN(proposeAmount) || Number(proposeAmount) <= 0) return alert('Invalid amount');
    setProposing(true);
    try {
      await proposePrice(job.id, Number(proposeAmount));
      setJob(prev => ({ ...prev, agreedPrice: Number(proposeAmount) }));
      addNotification({ type: 'success', title: 'Price Proposed', message: 'Waiting for client to pay.' });
    } catch (e) {
      alert(e.message);
    } finally {
      setProposing(false);
    }
  }

  const handleCancelJob = async () => {
    if (!window.confirm('Are you sure you want to cancel this job?')) return;
    try {
      await cancelJob(job.id);
      addNotification({ type: 'alert', title: 'Job Cancelled', message: 'You have cancelled the service request.' });
      navigate('/driver');
    } catch (e) {
      alert(e.message);
    }
  }

  const advanceStage = async () => {
    if (!job) return
    const nextStatus = NEXT_STATUS[job.status]
    if (!nextStatus) return
    try {
      const updated = await updateJobStatus(job.id, nextStatus)
      if (nextStatus === 'completed') {
        addNotification({ type: 'success', title: 'Job Completed!', message: `Earned $${(job.amount * 0.95).toFixed(2)}` })
        navigate('/driver')
      } else {
        setJob(prev => ({ ...prev, status: nextStatus }))
      }
    } catch (err) {
      alert(err.message)
    }
  }

  if (!loaded) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
          <Truck className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-100 mb-2">No Active Job</h2>
        <p className="text-gray-400">Accept a job from the available list to get started.</p>
        <button onClick={() => navigate('/driver/jobs')} className="mt-6 bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-500 transition">
          Find Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      
      {/* ── Background Full-Screen Map ── */}
      <div className="absolute inset-0 z-0">
        <MapView markers={[
          { lat: job.pickupLat, lng: job.pickupLng, type: 'client', label: 'Pickup', sublabel: job.pickupLocation },
          ...(driverLoc ? [{ lat: driverLoc.lat, lng: driverLoc.lng, type: 'driver', label: 'You' }] : []),
          ...(job.destLat ? [{ lat: job.destLat, lng: job.destLng, type: 'destination', label: 'Dropoff', sublabel: job.destination }] : [])
        ]} className="h-full w-full !border-none !rounded-none" zoom={14} />
      </div>

      {/* ── Overlay UI (Floating Elements) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 pb-24 md:pb-6">
        
        {/* Top Floating Status */}
        <div className="w-full max-w-md mx-auto mt-16 pointer-events-auto space-y-4">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-full px-5 py-3 shadow-lg flex items-center justify-between border border-gray-700">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="font-bold text-gray-100 text-sm">Active Job</span>
            </div>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {JOB_STAGES[stage - 1] || job.status}
            </span>
          </div>
        </div>

        {/* Bottom Floating Sheet */}
        <div className="w-full max-w-md mx-auto pointer-events-auto">
          <div className="bg-gray-800 rounded-[2rem] p-5 shadow-2xl border border-gray-700 space-y-5 relative overflow-hidden">
            
            {/* Progress Bar top edge */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-700">
              <div className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(stage / 5) * 100}%` }} />
            </div>

            {/* Client Profile Section */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl shadow-md border-2 border-gray-600 overflow-hidden">
                {job.clientAvatar ? (
                  <img src={`http://localhost:3001${job.clientAvatar}`} alt="Client" className="w-full h-full object-cover" />
                ) : (
                  job.clientName?.split(' ').map(n => n[0]).join('').slice(0, 2)
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-100 text-lg leading-tight">{job.clientName}</h3>
                <p className="text-sm text-gray-400 font-medium">{service?.label}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">{job.clientPhone || 'No phone provided'}</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${job.clientPhone}`} className="w-10 h-10 rounded-full bg-gray-700 text-emerald-400 flex items-center justify-center hover:bg-gray-600 transition">
                  <Phone className="w-4 h-4" />
                </a>
                <button onClick={() => setChatOpen(true)} className="w-10 h-10 rounded-full bg-gray-700 text-blue-400 flex items-center justify-center hover:bg-gray-600 transition relative">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-700 w-full" />

            {/* Location Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-400" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs text-gray-500 font-medium">Pickup</p>
                  <p className="text-sm font-semibold text-gray-200 truncate">{job.pickupLocation}</p>
                </div>
              </div>
              {job.destination && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs text-gray-500 font-medium">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-200 truncate">{job.destination}</p>
                    {job.tripDistance && <p className="text-xs text-emerald-400 font-medium mt-0.5">{job.tripDistance} km distance</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Complete action / Negotiate action */}
            {job.status === 'negotiating' ? (
              <div className="space-y-3 pt-2">
                {job.tripDistance ? (
                  <div className="bg-gray-700/40 rounded-2xl p-4 border border-gray-600/50 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                      <span className="text-sm font-semibold text-gray-300">Trip Distance</span>
                      <span className="text-lg font-bold text-emerald-400">{job.tripDistance} km</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">Base Fee ($)</label>
                        <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                          value={basePrice} onChange={e => { setBasePrice(e.target.value); setProposeAmount(''); }} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">Rate / km ($)</label>
                        <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                          value={ratePerKm} onChange={e => { setRatePerKm(e.target.value); setProposeAmount(''); }} />
                      </div>
                    </div>
                    <button onClick={() => setProposeAmount(Math.round((parseFloat(basePrice||0) + (job.tripDistance * parseFloat(ratePerKm||0)))).toString())}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold py-2 rounded-lg transition">
                      Calculate Total
                    </button>
                  </div>
                ) : (
                   <p className="text-xs text-gray-400 italic">Distance not available (no destination provided).</p>
                )}
                
                <div className="flex gap-2">
                  <span className="flex items-center justify-center bg-gray-700 text-gray-400 px-4 rounded-xl font-bold">$</span>
                  <input type="number" placeholder="Final Total Price" 
                    className="flex-1 bg-gray-700 border-none rounded-xl text-white px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                    value={proposeAmount} onChange={e => setProposeAmount(e.target.value)}
                    disabled={job.agreedPrice > 0 || proposing} />
                </div>
                {job.agreedPrice ? (
                  <div className="text-center text-sm font-semibold text-emerald-400 bg-emerald-500/10 py-3 rounded-xl">
                    Waiting for client to pay ${job.agreedPrice}
                  </div>
                ) : (
                  <button onClick={handleProposePrice} disabled={proposing}
                    className="w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">
                    {proposing ? 'Sending...' : 'Send Payment Link'}
                  </button>
                )}
                <button onClick={handleCancelJob} className="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 mt-2">
                  Cancel Job
                </button>
              </div>
            ) : (
              <button onClick={advanceStage}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2
                  ${stage < 4 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-gray-900'}`}>
                {stage === 1 ? <><Navigation className="w-5 h-5" /> Mark En Route</>
                 : stage === 2 ? <><Navigation className="w-5 h-5" /> Mark as Arrived</>
                 : stage === 3 ? <><Navigation className="w-5 h-5" /> Start Service</>
                 : <><CheckCircle2 className="w-5 h-5" /> Complete Job</>}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ── Live Chat ── */}
      {chatOpen && job && (
        <LiveChat 
          jobId={job.id} 
          otherPartyName={job.clientName} 
          otherPartyAvatar={job.clientAvatar}
          onClose={() => setChatOpen(false)} 
        />
      )}

    </div>
  )
}
