import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ClientLayout from './ClientLayout'
import LoginPage from '../../pages/LoginPage'
import RequestService from '../../pages/client/RequestService'
import TrackDriver from '../../pages/client/TrackDriver'
import RequestHistory from '../../pages/client/RequestHistory'
import PaymentPage from '../../pages/client/PaymentPage'
import ProfileSettings from '../../pages/client/ProfileSettings'

export default function ClientApp() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <LoginPage />
  if (user?.role !== 'client') return <Navigate to="/" replace />

  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/request"  element={<RequestService />} />
        <Route path="/track"    element={<TrackDriver />} />
        <Route path="/history"  element={<RequestHistory />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/profile"  element={<ProfileSettings />} />
        <Route path="*"         element={<Navigate to="/request" replace />} />
      </Route>
    </Routes>
  )
}
