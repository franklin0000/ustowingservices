import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from './AdminLayout'
import LoginPage from '../../pages/LoginPage'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import AdminRequests from '../../pages/admin/AdminRequests'
import AdminDrivers from '../../pages/admin/AdminDrivers'
import AdminUsers from '../../pages/admin/AdminUsers'
import AdminPayments from '../../pages/admin/AdminPayments'
import AdminAnalytics from '../../pages/admin/AdminAnalytics'
import AdminSettings from '../../pages/admin/AdminSettings'

export default function AdminApp() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <LoginPage />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/admin"            element={<AdminDashboard />} />
        <Route path="/admin/requests"   element={<AdminRequests />} />
        <Route path="/admin/drivers"    element={<AdminDrivers />} />
        <Route path="/admin/users"      element={<AdminUsers />} />
        <Route path="/admin/payments"   element={<AdminPayments />} />
        <Route path="/admin/analytics"  element={<AdminAnalytics />} />
        <Route path="/admin/settings"   element={<AdminSettings />} />
        <Route path="*"                 element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
