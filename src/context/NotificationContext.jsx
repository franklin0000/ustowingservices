import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { notifications as notifApi } from '../services/api'
import { onEvent } from '../services/websocket'
import { useAuth } from './AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageSquare, X } from 'lucide-react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [toast, setToast] = useState(null)
  const { isAuthenticated } = useAuth()

  const showToast = useCallback((payload, type = 'notification') => {
    setToast({ ...payload, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // Load notifications from API when authenticated
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const data = await notifApi.list()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch { /* ignore */ }
  }, [isAuthenticated])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    if (!isAuthenticated) return

    let unsubs = []

    import('../utils/audio').then(({ playNotificationSound }) => {
      unsubs.push(onEvent('notification', (payload) => {
        setNotifications(prev => [payload, ...prev])
        setUnreadCount(prev => prev + 1)
        playNotificationSound('default')
        showToast(payload, 'notification')
      }))

      unsubs.push(onEvent('chat_message', (payload) => {
        playNotificationSound('chat')
        showToast({ title: 'New Message', message: payload.message }, 'chat')
      }))
      unsubs.push(onEvent('new_job', () => playNotificationSound('new_job')))
      unsubs.push(onEvent('price_proposed', () => playNotificationSound('new_job')))
      unsubs.push(onEvent('job_accepted', () => playNotificationSound('new_job')))
    }).catch(() => {})

    return () => {
      unsubs.forEach(fn => fn && fn())
    }
  }, [isAuthenticated])

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ ...notif, id: `local_${Date.now()}`, read: false, created_at: new Date().toISOString() }, ...prev])
    setUnreadCount(prev => prev + 1)
  }, [])

  const markAsRead = useCallback(async (id) => {
    try {
      await notifApi.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* ignore */ }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await notifApi.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch { /* ignore */ }
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications, showPanel, setShowPanel,
      addNotification, markAsRead, markAllRead, unreadCount,
      fetchNotifications,
    }}>
      {children}
      
      {/* Global Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-sm"
          >
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toast.type === 'chat' ? 'bg-blue-100 text-blue-600' : 'bg-brand-100 text-brand-600'}`}>
                {toast.type === 'chat' ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-bold text-gray-900 truncate">{toast.title}</p>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                <motion.div 
                  initial={{ width: "100%" }} 
                  animate={{ width: 0 }} 
                  transition={{ duration: 4, ease: "linear" }}
                  className={`h-full ${toast.type === 'chat' ? 'bg-blue-500' : 'bg-brand-500'}`} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
