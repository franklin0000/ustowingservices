import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MobileLayout from './layouts/MobileLayout';
import AdminLayout from './layouts/AdminLayout';

// Mobile Pages
import JobBoardMobile from './pages/JobBoardMobile';
import PaymentsMobile from './pages/PaymentsMobile';
import NotificationsMobile from './pages/NotificationsMobile';
import ProfileMobile from './pages/ProfileMobile';
import JobRequestMobile from './pages/JobRequestMobile';
import JobArrivalMobile from './pages/JobArrivalMobile';
import DynamicRegistrationFlowMobile from './pages/DynamicRegistrationFlowMobile';
import OnboardingSurveyMobile from './pages/OnboardingSurveyMobile';
import RegistrationPlanMobile from './pages/RegistrationPlanMobile';
import ArrivalNotificationsMobile from './pages/ArrivalNotificationsMobile';
import JobBoardMapFiltersMobile from './pages/JobBoardMapFiltersMobile';

// Admin Pages
import AdminDashboardDesktop from './pages/AdminDashboardDesktop';
import AdvancedAdminAnalyticsDashboard from './pages/AdvancedAdminAnalyticsDashboard';
import AdminPerformanceDashboardDesktop from './pages/AdminPerformanceDashboardDesktop';
import FullAdminPanelDesktop from './pages/FullAdminPanelDesktop';
import AdminAnalyticsCommunicationHub from './pages/AdminAnalyticsCommunicationHub';
import RoleSelection from './pages/RoleSelection';
import ClientRequestForm from './pages/ClientRequestForm';
import { AppProvider, useAppContext } from './context/AppContext';

function AuthWrapper({ children }) {
  const { userRole } = useAppContext();
  if (!userRole) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<RoleSelection />} />
          
          {/* Mobile App Flow */}
          <Route path="/app" element={<AuthWrapper><MobileLayout /></AuthWrapper>}>
            <Route path="home" element={<JobBoardMobile />} />
            <Route path="client-request" element={<ClientRequestForm />} />
            <Route path="payments" element={<PaymentsMobile />} />
            <Route path="alerts" element={<NotificationsMobile />} />
            <Route path="profile" element={<ProfileMobile />} />
            <Route path="job-request" element={<JobRequestMobile />} />
            <Route path="job-arrival" element={<JobArrivalMobile />} />
            <Route path="registration" element={<DynamicRegistrationFlowMobile />} />
            <Route path="onboarding" element={<OnboardingSurveyMobile />} />
            <Route path="plan" element={<RegistrationPlanMobile />} />
            <Route path="map" element={<JobBoardMapFiltersMobile />} />
            <Route path="arrival-alerts" element={<ArrivalNotificationsMobile />} />
          </Route>

          {/* Admin Dashboard Flow */}
          <Route path="/admin" element={<AuthWrapper><AdminLayout /></AuthWrapper>}>
            <Route path="dashboard" element={<AdminDashboardDesktop />} />
            <Route path="analytics" element={<AdvancedAdminAnalyticsDashboard />} />
            <Route path="performance" element={<AdminPerformanceDashboardDesktop />} />
            <Route path="communication" element={<AdminAnalyticsCommunicationHub />} />
            <Route path="full" element={<FullAdminPanelDesktop />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
