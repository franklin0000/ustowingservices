import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RoleSelection() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'client') navigate('/app/client-request');
    else if (role === 'driver') navigate('/app/home');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-lg">
      
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

      <div className="glass-panel max-w-md w-full rounded-2xl p-xl text-center relative z-10 animate-float">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-md border border-primary/20 shadow-glow-sm">
          <span className="material-symbols-outlined text-[40px] text-primary">local_shipping</span>
        </div>
        
        <h1 className="font-headline-lg text-4xl font-extrabold mb-sm text-gradient">Gruas Premium</h1>
        <p className="font-body-md text-text-muted mb-xl">Select your operation mode to access the platform.</p>
        
        <div className="flex flex-col gap-md">
          <button 
            onClick={() => handleLogin('client')}
            className="w-full btn-glass font-label-md py-4 rounded-xl flex items-center justify-center gap-sm group"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">person</span>
            Access as Client
          </button>
          
          <button 
            onClick={() => handleLogin('driver')}
            className="w-full btn-primary-glow font-label-md py-4 rounded-xl flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined">directions_car</span>
            Access as Driver
          </button>
          
          <button 
            onClick={() => handleLogin('admin')}
            className="w-full btn-glass font-label-md py-4 rounded-xl flex items-center justify-center gap-sm group"
          >
            <span className="material-symbols-outlined group-hover:text-secondary transition-colors">admin_panel_settings</span>
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
