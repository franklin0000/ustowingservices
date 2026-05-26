import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { notifications as notifApi } from '../services/api'
import { onEvent } from '../services/websocket'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const { isAuthenticated } = useAuth()

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
      }))

      unsubs.push(onEvent('chat_message', () => playNotificationSound('chat')))
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
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
