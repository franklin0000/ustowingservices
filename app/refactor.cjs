const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/bot/Desktop/gruas/app/src';
const pagesDir = path.join(srcDir, 'pages');
const layoutsDir = path.join(srcDir, 'layouts');

if (!fs.existsSync(layoutsDir)) {
    fs.mkdirSync(layoutsDir, { recursive: true });
}

// 1. Create MobileLayout.jsx
const mobileLayoutCode = `import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function MobileLayout() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-24 flex flex-col">
      {/* Global TopAppBar for Mobile */}
      <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile h-16">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">menu</span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">DriveService</h1>
        </div>
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
      </header>
      
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Global BottomNavBar for Mobile */}
      <nav className="fixed bottom-0 w-full z-50 border-t border-outline-variant bg-surface h-16 flex justify-around items-center pb-safe">
        <NavLink to="/app/home" className={({isActive}) => \`flex flex-col items-center justify-center px-4 py-1 transition-colors \${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
          <span className="font-label-sm text-label-sm">Home</span>
        </NavLink>
        <NavLink to="/app/payments" className={({isActive}) => \`flex flex-col items-center justify-center px-4 py-1 transition-colors \${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <span className="font-label-sm text-label-sm">Payments</span>
        </NavLink>
        <NavLink to="/app/alerts" className={({isActive}) => \`flex flex-col items-center justify-center px-4 py-1 transition-colors \${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
          <span className="font-label-sm text-label-sm">Alerts</span>
        </NavLink>
        <NavLink to="/app/profile" className={({isActive}) => \`flex flex-col items-center justify-center px-4 py-1 transition-colors \${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full font-bold' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
`;
fs.writeFileSync(path.join(layoutsDir, 'MobileLayout.jsx'), mobileLayoutCode);

// 2. Create AdminLayout.jsx
const adminLayoutCode = `import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Global Sidebar for Admin */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant h-screen sticky top-0 flex flex-col hidden md:flex">
        <div className="p-lg flex items-center gap-sm border-b border-outline-variant">
          <span className="material-symbols-outlined text-primary text-[28px]">admin_panel_settings</span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">DriveAdmin</h1>
        </div>
        <nav className="flex-1 py-md flex flex-col gap-xs px-sm">
          <NavLink to="/admin/dashboard" className={({isActive}) => \`flex items-center gap-md px-md py-sm rounded-full transition-colors \${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={({isActive}) => \`flex items-center gap-md px-md py-sm rounded-full transition-colors \${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-label-md text-label-md">Analytics</span>
          </NavLink>
          <NavLink to="/admin/performance" className={({isActive}) => \`flex items-center gap-md px-md py-sm rounded-full transition-colors \${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'}\`}>
            <span className="material-symbols-outlined">speed</span>
            <span className="font-label-md text-label-md">Performance</span>
          </NavLink>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
        <Outlet />
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(layoutsDir, 'AdminLayout.jsx'), adminLayoutCode);

// 3. Process Pages
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    // Remove individual headers/navs to use Layouts
    content = content.replace(/\{\/\*\s*TopAppBar\s*\*\/\}.*?<\/header>/gis, '');
    content = content.replace(/\{\/\*\s*BottomNavBar\s*\*\/\}.*?<\/nav>/gis, '');
    content = content.replace(/\{\/\*\s*Navigation Drawer[^]*?\*\/\}.*?<\/aside>/gis, '');
    content = content.replace(/\{\/\*\s*NavigationDrawer[^]*?\*\/\}.*?<\/aside>/gis, '');
    content = content.replace(/\{\/\*\s*Sidebar\s*\*\/\}.*?<\/aside>/gis, '');

    // For some files that have <div className="bg-background... pb-24">, change pb-24 to pb-0 since layout handles it
    content = content.replace(/min-h-screen pb-24/g, 'h-full');

    fs.writeFileSync(path.join(pagesDir, file), content);
});

// 4. Update App.jsx with nested routing
const appCode = `import React from 'react';
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
import AdminAnalyticsCommunicationHub from './pages/AdminAnalyticsCommunicationHub';
import FullAdminPanelDesktop from './pages/FullAdminPanelDesktop';
import DynamicServiceLogic from './pages/DynamicServiceLogic';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app/home" replace />} />
        
        {/* Mobile App Flow */}
        <Route path="/app" element={<MobileLayout />}>
          <Route path="home" element={<JobBoardMobile />} />
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardDesktop />} />
          <Route path="analytics" element={<AdvancedAdminAnalyticsDashboard />} />
          <Route path="performance" element={<AdminPerformanceDashboardDesktop />} />
          <Route path="communication" element={<AdminAnalyticsCommunicationHub />} />
          <Route path="full" element={<FullAdminPanelDesktop />} />
          <Route path="logic" element={<DynamicServiceLogic />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;
fs.writeFileSync(path.join(srcDir, 'App.jsx'), appCode);
console.log('Refactoring complete!');
