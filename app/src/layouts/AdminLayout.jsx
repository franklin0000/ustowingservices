import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="bg-background text-text-main min-h-screen flex overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Global Sidebar for Admin */}
      <aside className="w-64 glass-panel border-y-0 border-l-0 border-r border-outline-variant/30 h-screen sticky top-0 flex flex-col hidden md:flex z-20">
        <div className="p-lg flex items-center gap-sm border-b border-outline-variant/30">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] text-primary">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-md text-xl font-bold text-gradient">DriveAdmin</h1>
        </div>
        <nav className="flex-1 py-md flex flex-col gap-xs px-sm">
          <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center gap-md px-md py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm' : 'text-text-muted hover:bg-surface-color-light hover:text-text-main'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/analytics" className={({isActive}) => `flex items-center gap-md px-md py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm' : 'text-text-muted hover:bg-surface-color-light hover:text-text-main'}`}>
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-label-md">Analytics</span>
          </NavLink>
          <NavLink to="/admin/performance" className={({isActive}) => `flex items-center gap-md px-md py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary shadow-glow-sm' : 'text-text-muted hover:bg-surface-color-light hover:text-text-main'}`}>
            <span className="material-symbols-outlined">speed</span>
            <span className="font-label-md">Performance</span>
          </NavLink>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
