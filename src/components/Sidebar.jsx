import { NavLink } from 'react-router-dom'
import {
  MapPin, Clock, CreditCard, Truck, LayoutDashboard,
  Users, FileText, BarChart3, Settings, Navigation, DollarSign, Star
} from 'lucide-react'

const menuItems = {
  client: [
    { to: '/request', label: 'Request Service', icon: MapPin },
    { to: '/track', label: 'Track Driver', icon: Navigation },
    { to: '/history', label: 'My Requests', icon: Clock },
    { to: '/payments', label: 'Payments', icon: CreditCard },
  ],
  driver: [
    { to: '/driver', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/driver/jobs', label: 'Available Jobs', icon: Truck },
    { to: '/driver/active', label: 'Active Job', icon: Navigation },
    { to: '/driver/earnings', label: 'Earnings', icon: DollarSign },
    { to: '/driver/ratings', label: 'Ratings', icon: Star },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'All Requests', icon: FileText },
    { to: '/admin/drivers', label: 'Drivers', icon: Truck },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
}

export default function Sidebar({ role }) {
  const items = menuItems[role] || []

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto z-40">
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
          {role === 'client' ? 'Services' : role === 'driver' ? 'Driver Panel' : 'Administration'}
        </p>
      </div>
      <nav className="space-y-1">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/driver'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-brand-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-brand-800">Need Help?</p>
          <p className="text-xs text-brand-600 mt-1">Contact support anytime</p>
          <button className="mt-3 w-full text-sm btn-primary py-2">
            Support Chat
          </button>
        </div>
      </div>
    </aside>
  )
}
