import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell, LogOut, Truck, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { motion } from 'framer-motion'
import DriverNav from './DriverNav'
import NotificationPanel from '../../components/NotificationPanel'

export default function DriverLayout() {
  const { user, logout } = useAuth()
  const { unreadCount, setShowPanel } = useNotifications()
  const [isOnline, setIsOnline] = useState(true)

  return (
    <div className="driver-app min-h-screen bg-gray-900 text-gray-100">

      {/* ── Top Navbar (all breakpoints) ── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50 shadow-sm"
      >
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-screen-2xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md border border-emerald-400/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">US Towing Services</p>
              <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Driver Portal</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Online toggle */}
            <button
              onClick={() => setIsOnline(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? 'Online' : 'Offline'}
            </button>

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

            <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm border border-emerald-400/20">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)
                )}
              </div>
              <span className="hidden md:block text-sm font-semibold text-gray-200">{user?.name}</span>
              <button onClick={logout} className="p-1.5 rounded-lg hover:bg-white/5 transition" title="Logout">
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Navigation (responsive sidebar / bottom bar) ── */}
      <DriverNav />

      {/* ── Main content ──
          mobile:  full width, bottom padding for tab bar
          tablet:  left margin for icon-sidebar (w-20)
          desktop: left margin for full sidebar (w-60) + max content width
      ── */}
      <main className="
        pt-16
        pb-24 md:pb-6
        md:ml-20 lg:ml-60
        min-h-screen
      ">
        <div className="
          max-w-2xl mx-auto
          md:max-w-3xl
          lg:max-w-5xl
          xl:max-w-6xl
          px-4 md:px-6 lg:px-8
          py-6
          fade-in
        ">
          <Outlet />
        </div>
      </main>

      <NotificationPanel />
    </div>
  )
}
