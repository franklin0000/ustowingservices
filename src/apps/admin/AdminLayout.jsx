import { Outlet } from 'react-router-dom'
import { Bell, LogOut, Shield, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import NotificationPanel from '../../components/NotificationPanel'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { unreadCount, setShowPanel } = useNotifications()

  return (
    <div className="admin-app min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main column */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-64 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-purple-900/50 shadow-soft h-16 px-6 flex items-center justify-between"
        >
          {/* Search */}
          <div className="flex items-center gap-3 bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-2 w-80">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search requests, drivers, users..."
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none flex-1"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPanel(true)}
              className="relative p-2 rounded-xl hover:bg-white/5 transition"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border border-purple-400/20">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-200">{user?.name}</p>
                <p className="text-[11px] text-purple-400 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> Administrator
                </p>
              </div>
              <button onClick={logout} className="p-2 rounded-xl hover:bg-white/5 transition" title="Logout">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="mt-16 flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationPanel />
    </div>
  )
}
