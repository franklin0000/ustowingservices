import { Bell, LogOut, Truck, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, switchRole } = useAuth()
  const { unreadCount, setShowPanel } = useNotifications()
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  const roleColors = {
    client: 'bg-blue-100 text-blue-700',
    driver: 'bg-emerald-100 text-emerald-700',
    admin: 'bg-purple-100 text-purple-700',
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="US Towing Services" className="h-12 object-contain" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`${roleColors[user?.role]} px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:opacity-80 transition`}
          >
            {user?.role === 'client' ? 'Client' : user?.role === 'driver' ? 'Driver' : 'Admin'}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showRoleMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-44 z-50">
                <div className="px-3 py-1.5 text-xs text-gray-400 font-medium uppercase">Switch View</div>
                {['client', 'driver', 'admin'].map(role => (
                  <button
                    key={role}
                    onClick={() => { switchRole(role); setShowRoleMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition flex items-center gap-2 ${user?.role === role ? 'font-semibold text-brand-700' : 'text-gray-700'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${user?.role === role ? 'bg-brand-600' : 'bg-gray-300'}`} />
                    {role.charAt(0).toUpperCase() + role.slice(1)} View
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setShowPanel(true)}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button onClick={logout} className="p-2 rounded-xl hover:bg-gray-100 transition" title="Logout">
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </nav>
  )
}
