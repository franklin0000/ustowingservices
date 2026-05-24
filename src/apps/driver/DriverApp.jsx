import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DriverLayout from './DriverLayout'
import LoginPage from '../../pages/LoginPage'
import DriverDashboard from '../../pages/driver/DriverDashboard'
import AvailableJobs from '../../pages/driver/AvailableJobs'
import ActiveJob from '../../pages/driver/ActiveJob'
import Earnings from '../../pages/driver/Earnings'
import Ratings from '../../pages/driver/Ratings'
import KycUpload from '../../pages/driver/KycUpload'
import Subscriptions from '../../pages/driver/Subscriptions'

export default function DriverApp() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <LoginPage />
  if (user?.role !== 'driver') return <Navigate to="/" replace />

  // KYC Verification Gateway
  if (user.kycStatus === 'pending' || user.kycStatus === 'rejected') {
    return <KycUpload />
  }

  // Stripe Subscription Gateway removed for 25% commission model

  return (
    <Routes>
      <Route element={<DriverLayout />}>
        <Route path="/driver"          element={<DriverDashboard />} />
        <Route path="/driver/jobs"     element={<AvailableJobs />} />
        <Route path="/driver/active"   element={<ActiveJob />} />
        <Route path="/driver/earnings" element={<Earnings />} />
        <Route path="/driver/ratings"  element={<Ratings />} />
        <Route path="*"                element={<Navigate to="/driver" replace />} />
      </Route>
    </Routes>
  )
}
