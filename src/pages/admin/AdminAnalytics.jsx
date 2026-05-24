import { TrendingUp, Users, Clock, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'
import { useApp } from '../../context/AppContext'

const SERVICE_COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#9333ea']

export default function AdminAnalytics() {
  const { getAdminAnalytics } = useApp()
  const [data, setData] = useState(null)

  useEffect(() => {
    getAdminAnalytics().then(setData).catch(console.error)
  }, [])

  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" /></div>

  // Add colors to regionData
  const regionData = data.topRegions.map((r, i) => ({ ...r, color: SERVICE_COLORS[i % SERVICE_COLORS.length] }))

  // Mock response time data for visual effect since we don't track full lifecycle times yet
  const responseTimeData = [
    { month: 'Jan', avgTime: 12 }, { month: 'Feb', avgTime: 10 }, { month: 'Mar', avgTime: 11 },
    { month: 'Apr', avgTime: 8 }, { month: 'May', avgTime: data.avgResponseTime },
  ]

  // Format hourly data for display
  const hourlyData = data.hourlyDistribution.map(h => ({
    hour: h.hour < 12 ? `${h.hour}am` : h.hour === 12 ? '12pm' : `${h.hour - 12}pm`,
    requests: h.requests
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed platform performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-3xl font-bold text-emerald-600">{data.completionRate}%</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Avg Response Time</p>
          <p className="text-3xl font-bold text-brand-700">{data.avgResponseTime} min</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Customer Satisfaction</p>
          <p className="text-3xl font-bold text-amber-600">{data.avgRating} ★</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Active Coverage</p>
          <p className="text-3xl font-bold text-purple-600">{data.activeCoverage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" /> Peak Hours
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="requests" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> Response Time Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}m`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  formatter={(v) => [`${v} min`, 'Avg Response']}
                />
                <Line type="monotone" dataKey="avgTime" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Jobs & Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 13 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 13 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                <Bar yAxisId="left" dataKey="jobs" fill="#2563eb" radius={[4, 4, 0, 0]} name="Jobs" />
                <Bar yAxisId="right" dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Top Regions
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {regionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {regionData.map(r => (
              <div key={r.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                  <span className="text-gray-600">{r.name || 'Unknown'}</span>
                </div>
                <span className="font-semibold">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
