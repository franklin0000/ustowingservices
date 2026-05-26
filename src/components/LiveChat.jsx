import { useState, useEffect, useRef } from 'react'
import { X, Send, User, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { jobs } from '../services/api'
import { onEvent } from '../services/websocket'
import { useAuth } from '../context/AuthContext'

export default function LiveChat({ jobId, otherPartyName, otherPartyAvatar, onClose }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Fetch chat history
    jobs.getChat(jobId)
      .then(msgs => {
        setMessages(msgs)
        setLoading(false)
        scrollToBottom()
      })
      .catch(err => {
        console.error('Failed to load chat', err)
        setLoading(false)
      })

    // Listen for new messages
    const unsub = onEvent('chat_message', (msg) => {
      if (msg.jobId === jobId) {
        setMessages(prev => [...prev, msg])
        setTimeout(scrollToBottom, 100)
      }
    })

    return () => unsub()
  }, [jobId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const msgText = input.trim()
    setInput('')
    
    // Optimistic UI update
    const tempMsg = {
      id: Date.now().toString(),
      senderId: user.id,
      message: msgText,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])
    setTimeout(scrollToBottom, 100)

    try {
      await jobs.sendChatMessage(jobId, msgText)
    } catch (err) {
      console.error('Failed to send message', err)
      // Optionally remove tempMsg or show error
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none"
      >
        {/* Backdrop for desktop, or just click to dismiss */}
        <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />
        
        <div className="w-full max-w-md mx-auto bg-gray-100 h-[80vh] md:h-[600px] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto relative z-10 border-t border-gray-200">
          
          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                {otherPartyAvatar ? (
                  <img src={otherPartyAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  otherPartyName?.split(' ').map(n => n[0]).join('').slice(0, 2) || <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{otherPartyName || 'Chat'}</h3>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-50">
                <MapPin className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">Send a message to coordinate the pickup.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderId === user.id
                return (
                  <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-base ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white border border-gray-200 text-gray-800 font-medium rounded-bl-sm'
                    }`}>
                      <p>{msg.message}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-gray-200 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-5 py-3 text-base text-black font-bold placeholder-gray-700 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="w-12 h-12 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </form>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
