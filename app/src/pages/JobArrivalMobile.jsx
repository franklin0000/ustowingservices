import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function JobArrivalMobile() {
  const { jobs, userRole, completeJob } = useAppContext();
  const navigate = useNavigate();
  
  // Find the active job (client can see pending or accepted, driver only sees accepted)
  const activeJob = jobs.find(j => 
    userRole === 'client' ? (j.status === 'accepted' || j.status === 'pending') : j.status === 'accepted'
  );

  if (!activeJob) {
    return (
      <div className="bg-transparent min-h-full flex flex-col items-center justify-center p-xl text-center">
        <span className="material-symbols-outlined text-6xl text-primary mb-md shadow-glow-sm">check_circle</span>
        <h2 className="font-headline-md text-3xl text-text-main mb-sm font-bold">No Active Jobs</h2>
        <p className="font-body-md text-text-muted mb-lg">You do not have any jobs currently in progress.</p>
        <button 
          onClick={() => navigate(userRole === 'client' ? '/app/client-request' : '/app/home')}
          className="btn-primary-glow font-label-md py-3 px-8 rounded-full"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleComplete = () => {
    completeJob(activeJob.id);
    navigate('/app/payments');
  };

  return (
    <div className="bg-transparent h-full animate-float">
      <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-128px)] rounded-3xl">
        {/* Map Background Section */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <img className="w-full h-full object-cover opacity-20 mix-blend-screen" data-alt="A clean, high-contrast aerial map of a modern city grid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbqybV1C95D5ShyDeHvYzNLAWUGv12zvTvFt4EHu9er6eGki6NQnL9jZR0LIFFUqLA4_UZZ627Nfr7rZHehQlrcs7nJlmkW5MG_sdpSF-0aNwJoYL6eOFu2SpmxQIY5sjN_ci76ecGEuu4rmB_4RO4D3wdqrxvQ90ZxK7yBpQfR3-NF2mZvkZQqlpqJXsKKT75RAA4VL5qenWSimf_2oZMjvNAL6E9YKjUTkX9z8OZFykfuse-5XVH8NotZSWn9y0S3WUxHOqNUlQ"/>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        {/* Job Notification UI */}
        <div className="relative z-10 flex-1 flex flex-col justify-end p-4 pb-8">
          {/* Floating Indicator */}
          <div className="mx-auto mb-lg bg-secondary/20 border border-secondary/30 text-secondary px-6 py-2 rounded-full flex items-center gap-sm shadow-glow-sm animate-pulse-glow">
            <span className="material-symbols-outlined text-sm">radar</span>
            <span className="font-label-md text-sm uppercase tracking-wider font-bold">
              {userRole === 'client' 
                ? (activeJob.status === 'pending' ? 'Searching for Driver...' : 'Driver is on the way') 
                : 'Navigating to destination'}
            </span>
          </div>
          
          {/* Active Job Card */}
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md mx-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-label-sm text-[10px] uppercase shadow-glow-sm">
                  {activeJob.status === 'pending' ? 'PENDING' : 'IN PROGRESS'}
                </span>
                <h2 className="font-headline-md text-2xl text-text-main mt-3 font-bold">Ticket {activeJob.id.substring(0,6)}</h2>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-text-muted text-xs uppercase tracking-widest">Est. Cost</p>
                <p className="font-headline-md text-2xl text-primary font-bold shadow-glow-sm">${activeJob.price.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Job Details */}
            <div className="space-y-6 mb-8 relative bg-black/20 p-5 rounded-xl border border-white/5">
              <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-primary via-secondary to-transparent"></div>
              
              <div className="flex items-start gap-4 relative">
                <div className="z-10 bg-primary/20 border border-primary w-8 h-8 rounded-full flex items-center justify-center shadow-glow-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                </div>
                <div>
                  <p className="font-label-sm text-text-muted text-xs uppercase tracking-wider">Pickup Location</p>
                  <p className="font-label-md text-text-main text-sm mt-1">{activeJob.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 relative">
                <div className="z-10 bg-secondary/20 border border-secondary w-8 h-8 rounded-full flex items-center justify-center shadow-glow-sm">
                  <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                </div>
                <div>
                  <p className="font-label-sm text-text-muted text-xs uppercase tracking-wider">Issue / Destination</p>
                  <p className="font-label-md text-text-main text-sm mt-1">{activeJob.destination || activeJob.issue}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {userRole === 'driver' && (
              <div className="flex flex-col gap-sm">
                <button 
                  onClick={handleComplete}
                  className="w-full btn-primary-glow font-label-md text-sm tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  MARK COMPLETE
                </button>
              </div>
            )}
            {userRole === 'client' && (
              <div className="flex flex-col gap-sm">
                <button 
                  onClick={() => alert("Simulating a call to the driver...")}
                  disabled={activeJob.status === 'pending'}
                  className="w-full btn-glass font-label-md text-sm tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  {activeJob.status === 'pending' ? 'WAITING FOR DRIVER...' : 'CONTACT DRIVER'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
