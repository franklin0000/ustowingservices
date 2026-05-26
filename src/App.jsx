import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import VerifyPhone from './pages/auth/VerifyPhone'
import ForgotPassword from './pages/auth/ForgotPassword'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ClientApp from './apps/client/ClientApp'
import DriverApp from './apps/driver/DriverApp'
import AdminApp  from './apps/admin/AdminApp'

/**
 * Root orchestrator — reads the authenticated user's role
 * and mounts the corresponding isolated sub-application.
 * Each sub-app has its own layout, navigation, and route guards.
 */
export default function App() {
  const { isAuthenticated, user } = useAuth()

  // Not logged in → Auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // If logged in but phone is not verified (and not an admin, or admins too?)
  // Let's enforce for all clients and drivers
  if (user?.role !== 'admin' && !user?.phoneVerified) {
    return (
      <Routes>
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="*" element={<Navigate to="/verify-phone" replace />} />
      </Routes>
    )
  }

  // Route to the correct sub-app based on role
  if (user?.role === 'client') return <ClientApp />
  if (user?.role === 'driver') return <DriverApp />
  if (user?.role === 'admin')  return <AdminApp />

  // Unknown role fallback
  return <Navigate to="/login" />
}
