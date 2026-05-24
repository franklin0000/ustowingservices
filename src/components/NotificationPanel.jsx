import { X, Bell, CreditCard, Star, Settings, CheckCheck } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

const typeIcons = {
  job: Bell,
  payment: CreditCard,
  rating: Star,
  system: Settings,
}

const typeColors = {
  job: 'bg-blue-100 text-blue-600',
  payment: 'bg-emerald-100 text-emerald-600',
  rating: 'bg-amber-100 text-amber-600',
  system: 'bg-purple-100 text-purple-600',
}

export default function NotificationPanel() {
  const { notifications, showPanel, setShowPanel, markAsRead, markAllRead, unreadCount } = useNotifications()

  if (!showPanel) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setShowPanel(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 slide-in flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
            <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bell className="w-12 h-12 mb-3" />
              <p className="font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map(notif => {
                const Icon = typeIcons[notif.type] || Bell
                return (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition flex gap-3 ${!notif.read ? 'bg-brand-50/50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && <span className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
