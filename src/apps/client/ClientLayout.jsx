import { Outlet } from 'react-router-dom'
import { Bell, LogOut, Truck, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { motion } from 'framer-motion'
import ClientNav from './ClientNav'
import NotificationPanel from '../../components/NotificationPanel'

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const { unreadCount, setShowPanel } = useNotifications()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Navbar (all breakpoints) ── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-100/50 shadow-sm"
      >
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-screen-2xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-md">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">US Towing Services</p>
              <p className="text-[11px] text-brand-500 font-bold uppercase tracking-wider">Client Portal</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPanel(true)}
              className="relative p-2 rounded-xl hover:bg-brand-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              {/* Show name on md+ */}
              <span className="hidden md:block text-sm font-semibold text-gray-800">{user?.name}</span>
              <button onClick={logout} className="p-1.5 rounded-lg hover:bg-gray-100 transition" title="Logout">
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Navigation (responsive sidebar / bottom bar) ── */}
      <ClientNav />

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
