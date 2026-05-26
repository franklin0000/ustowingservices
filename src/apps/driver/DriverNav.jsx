import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Truck, Navigation, DollarSign, Star, Settings } from 'lucide-react'

const tabs = [
  { to: '/driver',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/driver/jobs',     label: 'Jobs',      icon: Truck },
  { to: '/driver/active',   label: 'Active',    icon: Navigation },
  { to: '/driver/earnings', label: 'Earnings',  icon: DollarSign },
  { to: '/driver/ratings',  label: 'Ratings',   icon: Star },
  { to: '/driver/profile',  label: 'Profile',   icon: Settings },
]

export default function DriverNav() {
  return (
    <>
      {/* ── Mobile bottom tab bar (< md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-emerald-900/40 flex items-stretch shadow-[0_-4px_24px_rgba(16,185,129,0.1)]">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 text-xs font-semibold
              ${isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-500'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${isActive ? 'bg-emerald-500/10 scale-110' : ''}`}>
                  <tab.icon className="w-5 h-5" />
                </span>
                <span className="truncate max-w-[60px]">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Tablet sidebar (md only — icon-only) ── */}
      <aside className="hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 bg-gray-900 border-r border-gray-800 flex-col items-center py-4 gap-2 z-40 shadow-xl">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            title={tab.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200
              ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-emerald-400'}`
            }
          >
            <tab.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </aside>

      {/* ── Desktop sidebar (lg+ — full labels) ── */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 bg-gray-900 border-r border-gray-800 flex-col py-6 px-3 gap-1 z-40 shadow-xl">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Driver Menu</p>
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200
              ${isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-gray-400 hover:bg-white/5 hover:text-emerald-400'}`
            }
          >
            <tab.icon className="w-5 h-5 shrink-0" />
            {tab.label}
          </NavLink>
        ))}

        {/* Info card at bottom */}
        <div className="mt-auto bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <p className="text-sm font-bold text-white">Driver Support</p>
          <p className="text-xs text-gray-400 mt-1">Need help with a job?</p>
          <a href="tel:+18005550000" className="mt-3 w-full bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold py-2 rounded-xl hover:bg-emerald-600/20 transition flex items-center justify-center">
            Call Dispatch
          </a>
        </div>
      </aside>
    </>
  )
}
