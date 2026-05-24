import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function JobBoardMobile() {
  const { jobs, acceptJob } = useAppContext();
  const navigate = useNavigate();
  return (
    <div className="bg-transparent h-full animate-float" style={{ animationDuration: '15s' }}>
      <main className="flex-1 pb-24 md:pb-lg">
        <div className="py-md max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
            <div>
              <div className="flex items-center gap-sm mb-xs">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse-glow shadow-glow-sm"></span>
                <span className="font-label-sm text-label-sm text-secondary font-bold tracking-widest uppercase">Live Dispatch</span>
              </div>
              <h2 className="font-headline-lg text-3xl font-extrabold text-gradient">Radar</h2>
            </div>
            <div className="flex gap-sm">
              <button className="btn-glass px-4 py-2 rounded-xl font-label-md text-sm transition-all hover:bg-white/10">
                Filter
              </button>
            </div>
          </div>
          
          {/* Jobs Grid */}
          <div className="flex flex-col gap-lg">
            {jobs.filter(j => j.status === 'pending').map((job, index) => (
              <div key={job.id} className="glass-panel rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-wider">Ticket #{job.id.substring(0,6)}</span>
                    <p className="font-headline-md text-2xl text-primary font-bold shadow-glow-sm inline-block">${job.price.toFixed(2)}</p>
                  </div>
                  <div className="bg-secondary/20 border border-secondary/30 text-secondary px-3 py-1 rounded-full font-label-sm text-[10px] uppercase shadow-glow-sm">
                    {job.issue}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">my_location</span>
                    <span className="font-label-md text-sm text-text-main truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-sm">pin_drop</span>
                    <span className="font-label-md text-sm text-text-muted truncate">{job.destination || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-muted text-sm">directions_car</span>
                    <span className="font-label-md text-sm text-text-main truncate">{job.vehicle}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    acceptJob(job.id);
                    navigate('/app/job-arrival');
                  }}
                  className="w-full btn-primary-glow py-4 rounded-xl font-bold text-sm tracking-wide group-hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Intercept Request
                </button>
              </div>
            ))}
            
            {jobs.filter(j => j.status === 'pending').length === 0 && (
              <div className="p-xl text-center text-text-muted glass-panel rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">radar</span>
                <p className="font-body-md">Scanning frequencies... No live requests found.</p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
