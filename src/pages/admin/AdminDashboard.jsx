import { DollarSign, Users, Truck, FileText, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import MapView from '../../components/MapView'
import { onEvent } from '../../services/websocket'

const SERVICE_COLORS = { tow: '#2563eb', jumpstart: '#eab308', tire: '#16a34a', fuel: '#dc2626', lockout: '#9333ea' }

export default function AdminDashboard() {
  const { getAdminDashboard } = useApp()
  const [data, setData] = useState(null)

  const fetchData = () => { getAdminDashboard().then(setData).catch(() => {}) }

  useEffect(() => { 
    fetchData() 
    
    // Listen to real-time events to dynamically update dashboard
    const u1 = onEvent('job_status', fetchData)
    const u2 = onEvent('new_job', fetchData)
    const u3 = onEvent('job_accepted', fetchData)
    
    // Live driver GPS tracking
    const u4 = onEvent('driver_location', ({ userId, latitude, longitude }) => {
      setData(prev => {
        if (!prev) return prev
        const exists = prev.activeDriversList.find(d => d.id === userId)
        if (exists) {
          const updatedDrivers = prev.activeDriversList.map(d => 
            d.id === userId ? { ...d, latitude, longitude } : d
          )
          return { ...prev, activeDriversList: updatedDrivers }
        } else {
          // Add them dynamically so they pop up immediately on the map!
          return {
            ...prev,
            activeDriversList: [...prev.activeDriversList, { id: userId, name: 'Active Driver', latitude, longitude, vehicle: 'Vehicle' }]
          }
        }
      })
    })

    return () => { u1(); u2(); u3(); u4() }
  }, [])

  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" /></div>

  const stats = [
    { label: 'Platform Revenue', value: `$${data.totalRevenue.toFixed(0)}`, change: '+18%', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600', up: true },
    { label: 'Total Requests', value: data.totalRequests, change: '+12%', icon: FileText, color: 'bg-blue-100 text-blue-600', up: true },
    { label: 'Active Drivers', value: `${data.activeDrivers}/${data.totalDrivers}`, change: `${data.activeDrivers} online`, icon: Truck, color: 'bg-purple-100 text-purple-600', up: true },
    { label: 'Pending Requests', value: data.pendingRequests, change: data.pendingRequests > 0 ? 'Needs attention' : 'All clear', icon: Clock, color: 'bg-amber-100 text-amber-600', up: data.pendingRequests === 0 },
  ]

  const pieData = data.serviceDistribution.map(s => ({ ...s, color: SERVICE_COLORS[s.name] || '#6b7280' }))

  const mapMarkers = []
  const mapConnections = []

  if (data?.activeDriversList) {
    data.activeDriversList.forEach(d => {
      mapMarkers.push({ lat: d.latitude, lng: d.longitude, type: 'driver', label: d.name, sublabel: d.vehicle, id: d.id })
    })
  }

  if (data?.activeJobsList) {
    data.activeJobsList.forEach(j => {
      // Pickup marker
      mapMarkers.push({ lat: j.pickup_lat, lng: j.pickup_lng, type: 'client', label: `Job: ${j.service_type}`, sublabel: j.status })
      
      // Destination marker (if present)
      if (j.dest_lat && j.dest_lng) {
        mapMarkers.push({ lat: j.dest_lat, lng: j.dest_lng, type: 'destination', label: `Dropoff`, sublabel: j.service_type })
      }

      // Draw lines if a driver is assigned
      if (j.driver_id) {
        const driver = data.activeDriversList?.find(d => d.id === j.driver_id)
        if (driver) {
          // Driver to Pickup
          mapConnections.push([[driver.latitude, driver.longitude], [j.pickup_lat, j.pickup_lng]])
          // Pickup to Destination
          if (j.dest_lat && j.dest_lng) {
            mapConnections.push([[j.pickup_lat, j.pickup_lng], [j.dest_lat, j.dest_lng]])
          }
        }
      }
    })
  }

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-gray-500 mt-1">Platform overview and metrics</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}><stat.icon className="w-6 h-6" /></div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-600' : 'text-amber-600'}`}>{stat.up ? <ArrowUpRight className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{stat.change}</div>
            </div>
            <div className="mt-3"><p className="text-sm text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-gray-900">{stat.value}</p></div>
          </div>
        ))}
      </div>

      {/* Live Map Overview - Spherical & Large */}
      <div className="card mb-8 p-0 overflow-hidden border border-gray-800 shadow-2xl relative rounded-[2.5rem] bg-gray-900 group">
        
        {/* Spherical Lens Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.5rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0)_60%)]" />

        <div className="absolute top-6 left-6 z-30 bg-black/50 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-gray-700/50 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">Live Global Tracking</span>
        </div>
        
        {/* Enormous Map */}
        <div className="h-[50vh] min-h-[500px] lg:h-[70vh] lg:min-h-[700px] w-full">
          <MapView markers={mapMarkers} connections={mapConnections} disableRouting={true} className="h-full w-full !border-none !rounded-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 13 }} /><YAxis tick={{ fontSize: 13 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Service Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie><Tooltip formatter={(v) => [`${v}%`, 'Share']} /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">{pieData.map(s => (
            <div key={s.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: s.color }} /><span className="text-gray-600">{s.name}</span></div><span className="font-semibold">{s.value}%</span></div>
          ))}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Weekly Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyRevenue || []}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="day" tick={{ fontSize: 13 }} /><YAxis tick={{ fontSize: 13 }} /><Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} /><Line type="monotone" dataKey="jobs" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Recent Requests</h3>
          <div className="space-y-3">{data.recentRequests.map(req => (
            <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : req.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {req.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : req.status === 'pending' ? <Clock className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
              </div>
              <div className="flex-1"><p className="text-sm font-medium">{req.clientName}</p><p className="text-xs text-gray-500">{req.pickupLocation}</p></div>
              <span className="font-semibold text-sm">${req.amount}</span>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  )
}
