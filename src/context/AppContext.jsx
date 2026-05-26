import { createContext, useContext, useState, useCallback } from 'react'
import { jobs as jobsApi, drivers as driversApi, admin as adminApi, pricing as pricingApi, stripe as stripeApi } from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Shared loading/error state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])

  // Wrapper for API calls with loading state
  const apiCall = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Client API methods ──────────────────────────────────
  const createJob = useCallback((data) => apiCall(() => jobsApi.create(data)), [apiCall])
  const uploadJobPhoto = useCallback((file) => apiCall(() => jobsApi.uploadPhoto(file)), [apiCall])
  const getMyJobs = useCallback((status) => apiCall(() => jobsApi.my(status)), [apiCall])
  const getJob = useCallback((id) => apiCall(() => jobsApi.get(id)), [apiCall])
  const cancelJob = useCallback((id) => apiCall(() => jobsApi.cancel(id)), [apiCall])
  const rateJob = useCallback((id, rating, review) => apiCall(() => jobsApi.rate(id, rating, review)), [apiCall])
  const getMyPayments = useCallback(() => apiCall(() => {
    // Dynamic import to get the correct module
    return import('../services/api').then(mod => mod.payments.my())
  }), [apiCall])
  
  const getQuote = useCallback((params) => apiCall(() => pricingApi.getQuote(params)), [apiCall])
  const geocode = useCallback((query) => apiCall(() => pricingApi.geocode(query)), [apiCall])

  // ── Driver API methods ──────────────────────────────────
  const getAvailableJobs = useCallback(() => apiCall(() => jobsApi.available()), [apiCall])
  const acceptJob = useCallback((id) => apiCall(() => jobsApi.accept(id)), [apiCall])
  const updateJobStatus = useCallback((id, status) => apiCall(() => jobsApi.updateStatus(id, status)), [apiCall])
  const proposePrice = useCallback((id, amount) => apiCall(() => jobsApi.proposePrice(id, amount)), [apiCall])
  const fetchNearbyDrivers = useCallback((lat, lng) => apiCall(() => jobsApi.nearbyDrivers(lat, lng)), [apiCall])

  const getDriverProfile = useCallback(() => apiCall(() => driversApi.profile()), [apiCall])
  const getActiveJob = useCallback(() => apiCall(() => driversApi.activeJob()), [apiCall])
  const updateLocation = useCallback((lat, lng) => driversApi.updateLocation(lat, lng), [])
  const setAvailability = useCallback((avail) => apiCall(() => driversApi.setAvailability(avail)), [apiCall])
  const getEarnings = useCallback(() => apiCall(() => driversApi.earnings()), [apiCall])
  const getRatings = useCallback(() => apiCall(() => driversApi.ratings()), [apiCall])
  const getDriverHistory = useCallback(() => apiCall(() => driversApi.history()), [apiCall])
  const getDriverPayouts = useCallback(() => apiCall(() => driversApi.getPayouts()), [apiCall])
  const requestDriverPayout = useCallback((amount) => apiCall(() => driversApi.requestPayout(amount)), [apiCall])
  const connectDriverStripe = useCallback(() => apiCall(() => stripeApi.connectAccount()), [apiCall])
  const checkDriverStripeStatus = useCallback(() => apiCall(() => stripeApi.checkConnectStatus()), [apiCall])

  // ── Admin API methods ───────────────────────────────────
  const getAdminDashboard = useCallback(() => apiCall(() => adminApi.dashboard()), [apiCall])
  const getAdminJobs = useCallback((params) => apiCall(() => adminApi.jobs(params)), [apiCall])
  const getAdminDrivers = useCallback(() => apiCall(() => adminApi.drivers()), [apiCall])
  const getAdminUsers = useCallback((search) => apiCall(() => adminApi.users(search)), [apiCall])
  const updateUserStatus = useCallback((id, status) => apiCall(() => adminApi.updateUserStatus(id, status)), [apiCall])
  const updateDriverAvailability = useCallback((id, avail) => apiCall(() => adminApi.updateDriverAvailability(id, avail)), [apiCall])
  const getAdminPayments = useCallback(() => apiCall(() => adminApi.payments()), [apiCall])
  const getAdminAnalytics = useCallback(() => apiCall(() => adminApi.analytics()), [apiCall])
  const getAdminSettings = useCallback(() => apiCall(() => adminApi.settings()), [apiCall])
  const updateAdminSettings = useCallback((data) => apiCall(() => adminApi.updateSettings(data)), [apiCall])
  const adminCancelJob = useCallback((id) => apiCall(() => adminApi.cancelJob(id)), [apiCall])
  const adminCreateJob = useCallback((data) => apiCall(() => adminApi.createJob(data)), [apiCall])
  const adminAssignDriver = useCallback((jobId, driverId) => apiCall(() => adminApi.assignJob(jobId, driverId)), [apiCall])
  const getAdminPayouts = useCallback(() => apiCall(() => adminApi.getPayouts()), [apiCall])
  const processAdminPayout = useCallback((id) => apiCall(() => adminApi.processPayout(id)), [apiCall])

  return (
    <AppContext.Provider value={{
      loading, error, clearError,
      // Client
      createJob, uploadJobPhoto, getMyJobs, getJob, cancelJob, rateJob, getMyPayments, getQuote,
      geocode,
      // Driver
      getAvailableJobs, acceptJob, updateJobStatus, proposePrice, fetchNearbyDrivers,
      getDriverProfile, getActiveJob, updateLocation, setAvailability,
      getEarnings, getRatings, getDriverHistory,
      getDriverPayouts, requestDriverPayout, connectDriverStripe, checkDriverStripeStatus,
      // Admin
      getAdminDashboard, getAdminJobs, getAdminDrivers, getAdminUsers,
      updateUserStatus, updateDriverAvailability,
      getAdminPayments, getAdminAnalytics,
      getAdminSettings, updateAdminSettings, adminCancelJob, adminCreateJob, adminAssignDriver,
      getAdminPayouts, processAdminPayout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
