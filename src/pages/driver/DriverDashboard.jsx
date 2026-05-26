import { Truck, DollarSign, Star, CheckCircle2, Clock, Navigation, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { onEvent } from '../../services/websocket'

export default function DriverDashboard() {
  const { getDriverProfile, getActiveJob, getDriverHistory, getAvailableJobs } = useApp()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [activeJob, setActiveJob] = useState(null)
  const [history, setHistory] = useState([])
  const [pendingCount, setPendingCount] = useState(0)

  const fetchData = () => {
    getDriverProfile().then(setProfile).catch(() => {})
    getActiveJob().then(setActiveJob).catch(() => {})
    getDriverHistory().then(setHistory).catch(() => {})
    getAvailableJobs().then(j => setPendingCount(j.length)).catch(() => {})
  }

  useEffect(() => {
    fetchData()
    const u1 = onEvent('job_status', fetchData)
    const u2 = onEvent('new_job', fetchData)
    return () => {
      if (u1) u1()
      if (u2) u2()
    }
  }, [])

  const todayEarnings = profile?.totalEarnings || 0

  if (!profile) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-emerald-500/30 overflow-hidden relative group shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                {profile.name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Edit</span>
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                if (e.target.files[0]) {
                  try {
                    const { auth } = await import('../../services/api');
                    const res = await auth.uploadAvatar(e.target.files[0]);
                    setProfile(prev => ({ ...prev, avatar: res.avatarUrl }));
                  } catch (err) {
                    alert('Failed to upload avatar: ' + err.message);
                  }
                }
              }} />
            </label>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-100">Driver Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome back, {profile.name}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 border shadow-sm
          ${profile.available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
          <span className="relative flex h-2.5 w-2.5">
            {profile.available && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${profile.available ? 'bg-emerald-500' : 'bg-gray-500'}`} />
          </span>
          <span className="hidden sm:inline">{profile.available ? 'Online & Ready' : 'Offline'}</span>
          <span className="sm:hidden">{profile.available ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Earnings', value: `$${todayEarnings.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Completed Jobs', value: profile.completedJobs, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Avg Rating', value: profile.rating, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Nearby Requests', value: pendingCount, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-100">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active/Available Job Card */}
        {activeJob ? (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-emerald-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl" />
            <div className="flex items-center justify-between mb-5 relative">
              <h3 className="font-bold text-emerald-400 text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5" /> Active Job
              </h3>
              <span className="bg-emerald-500 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                In Progress
              </span>
            </div>
            <div className="space-y-4 relative">
              <div>
                <p className="text-[10px] text-emerald-500/80 uppercase font-bold tracking-widest mb-1">Client</p>
                <p className="font-semibold text-gray-100">{activeJob.clientName}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-500/80 uppercase font-bold tracking-widest mb-1">Pickup Location</p>
                <p className="text-sm text-gray-300">{activeJob.pickupLocation}</p>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-emerald-500/20">
                <div>
                  <p className="text-[10px] text-emerald-500/80 uppercase font-bold tracking-widest mb-1">Estimated Payout</p>
                  <span className="font-black text-3xl text-emerald-400">${(activeJob.amount * 0.8).toFixed(2)}</span>
                </div>
                <Link to="/driver/active" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-900/50">
                  View <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="font-bold text-gray-300 text-lg">Ready for your next job?</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Stay online and keep an eye on new requests.</p>
            <Link to="/driver/jobs" className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition">
              Find Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-100 text-lg">Recent Activity</h3>
            <Link to="/driver/history" className="text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition">View all</Link>
          </div>
          <div className="space-y-3">
            {history.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {job.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-200 truncate">{job.clientName}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{job.pickupLocation}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-400">${(job.amount * 0.8).toFixed(0)}</p>
                  {job.rating && (
                    <p className="text-[11px] font-bold text-amber-400 flex items-center justify-end gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {job.rating}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
