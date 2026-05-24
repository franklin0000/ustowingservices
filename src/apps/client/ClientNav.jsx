import { NavLink } from 'react-router-dom'
import { MapPin, Navigation, Clock, CreditCard, User } from 'lucide-react'

const tabs = [
  { to: '/request',  label: 'Request',  icon: MapPin },
  { to: '/track',    label: 'Track',    icon: Navigation },
  { to: '/history',  label: 'History',  icon: Clock },
  { to: '/payments', label: 'Pay',      icon: CreditCard },
  { to: '/profile',  label: 'Profile',  icon: User },
]

export default function ClientNav() {
  return (
    <>
      {/* ── Mobile bottom tab bar (< md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blue-100 flex items-stretch shadow-[0_-4px_24px_rgba(37,99,235,0.08)]">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/request'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 text-xs font-semibold
              ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-400'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${isActive ? 'bg-blue-50 scale-110' : ''}`}>
                  <tab.icon className="w-5 h-5" />
                </span>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Tablet sidebar (md only — icon-only) ── */}
      <aside className="hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-blue-100 flex-col items-center py-4 gap-2 z-40 shadow-sm">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/request'}
            title={tab.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600'}`
            }
          >
            <tab.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </aside>

      {/* ── Desktop sidebar (lg+ — full labels) ── */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-blue-100 flex-col py-6 px-3 gap-1 z-40 shadow-sm">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/request'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200
              ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'}`
            }
          >
            <tab.icon className="w-5 h-5 shrink-0" />
            {tab.label}
          </NavLink>
        ))}

        {/* Help card at bottom */}
        <div className="mt-auto bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm font-bold text-blue-800">Need help?</p>
          <p className="text-xs text-blue-500 mt-1">Our support is 24/7</p>
          <a href="mailto:USTowingServices@protonmail.com" className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center">
            Contact Support
          </a>
        </div>
      </aside>
    </>
  )
}
