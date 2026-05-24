import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MobileLayout() {
  const { userRole } = useAppContext();
  const homeRoute = userRole === 'client' ? '/app/client-request' : '/app/home';

  return (
    <div className="bg-background text-on-background min-h-screen pb-28 flex flex-col relative overflow-hidden">
      
      {/* Global TopAppBar for Mobile */}
      <header className="w-full top-0 sticky z-40 glass-panel border-b-0 border-outline-variant/30 flex items-center justify-between px-margin-mobile h-16 shadow-none">
        <div className="flex items-center gap-md">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-primary">local_shipping</span>
          </div>
          <h1 className="font-headline-md text-xl font-bold text-gradient">DrivePremium</h1>
        </div>
        <div className="flex items-center gap-sm">
          <span className="font-label-sm uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 shadow-glow-sm">{userRole}</span>
          <span className="material-symbols-outlined text-text-muted hover:text-primary transition-colors cursor-pointer">account_circle</span>
        </div>
      </header>
      
      <div className="flex-1 relative z-10 w-full max-w-2xl mx-auto p-4">
        <Outlet />
      </div>

      {/* Floating Glass BottomNavBar for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <nav className="glass-panel rounded-full h-16 flex justify-around items-center px-2">
          <NavLink to={homeRoute} className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm scale-110' : 'text-text-muted hover:text-primary'}`}>
            {({ isActive }) => (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>local_shipping</span>
            )}
          </NavLink>
          <NavLink to="/app/payments" className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm scale-110' : 'text-text-muted hover:text-primary'}`}>
            {({ isActive }) => (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>payments</span>
            )}
          </NavLink>
          <NavLink to="/app/alerts" className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm scale-110' : 'text-text-muted hover:text-primary'}`}>
            {({ isActive }) => (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
            )}
          </NavLink>
          <NavLink to="/app/profile" className={({isActive}) => `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm scale-110' : 'text-text-muted hover:text-primary'}`}>
            {({ isActive }) => (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>person</span>
            )}
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
