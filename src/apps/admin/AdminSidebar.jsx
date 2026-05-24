import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Truck,
  Users, CreditCard, BarChart3, Settings, Shield
} from 'lucide-react'

const sections = [
  {
    title: 'Overview',
    items: [
      { to: '/admin',            label: 'Dashboard',   icon: LayoutDashboard, end: true },
      { to: '/admin/analytics',  label: 'Analytics',   icon: BarChart3 },
    ]
  },
  {
    title: 'Operations',
    items: [
      { to: '/admin/requests', label: 'All Requests', icon: FileText },
      { to: '/admin/drivers',  label: 'Drivers',      icon: Truck },
      { to: '/admin/users',    label: 'Users',        icon: Users },
    ]
  },
  {
    title: 'Finance',
    items: [
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    ]
  },
  {
    title: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gray-950 border-r border-purple-900/30 flex flex-col z-40 overflow-y-auto">
      {/* Brand section */}
      <div className="px-4 py-5 border-b border-purple-900/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold">Admin Panel</p>
            <p className="text-purple-400 text-[11px]">US Towing Services</p>
          </div>
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-purple-500/70 uppercase tracking-widest px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-900/20">
        <div className="bg-purple-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-purple-300">Need Support?</p>
          <p className="text-[11px] text-purple-500 mt-0.5">Contact the dev team</p>
        </div>
      </div>
    </aside>
  )
}
