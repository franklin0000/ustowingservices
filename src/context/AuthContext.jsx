import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth as authApi, setToken, getToken } from '../services/api'
import { connectWS, disconnectWS } from '../services/websocket'

const AuthContext = createContext(null)

// Demo credentials for easy role switching
const DEMO_CREDENTIALS = {
  client: { email: 'juan@email.com', password: 'password' },
  driver: { email: 'carlos@email.com', password: 'password' },
  admin:  { email: 'admin@gruas.com', password: 'admin123' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount, check for existing token
  useEffect(() => {
    const token = getToken()
    if (token) {
      authApi.me()
        .then(u => { setUser(u); setIsAuthenticated(true); connectWS(); })
        .catch(() => { setToken(null); })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (role) => {
    const creds = DEMO_CREDENTIALS[role]
    if (!creds) throw new Error('Unknown role')
    const { token, user: u } = await authApi.login(creds.email, creds.password)
    setToken(token)
    setUser(u)
    setIsAuthenticated(true)
    connectWS()
    return u
  }, [])

  const loginWithCredentials = useCallback(async (email, password) => {
    const { token, user: u } = await authApi.login(email, password)
    setToken(token)
    setUser(u)
    setIsAuthenticated(true)
    connectWS()
    return u
  }, [])

  const register = useCallback(async (data) => {
    const response = await authApi.register(data)
    // We no longer log the user in immediately. We return the response which contains a success message.
    return response
  }, [])

  const loginWithGoogle = useCallback(async (credential, role) => {
    const { token, user: u } = await authApi.googleLogin(credential, role)
    setToken(token)
    setUser(u)
    setIsAuthenticated(true)
    connectWS()
    return u
  }, [])

  const verifyPhone = useCallback(async (code) => {
    await authApi.verifySms(code)
    // Update local user state
    setUser(prev => ({ ...prev, phoneVerified: true }))
    return true
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    disconnectWS()
  }, [])

  const switchRole = useCallback(async (role) => {
    disconnectWS()
    const creds = DEMO_CREDENTIALS[role]
    const { token, user: u } = await authApi.login(creds.email, creds.password)
    setToken(token)
    setUser(u)
    connectWS()
    return u
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, loading, setUser,
      login, loginWithCredentials, loginWithGoogle, verifyPhone, register, logout, switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
