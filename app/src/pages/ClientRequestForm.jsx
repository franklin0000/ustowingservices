import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ClientRequestForm() {
  const { createJob } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: '',
    destination: '',
    vehicle: '',
    issue: 'Flat Tire'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location || !formData.vehicle) return;
    
    setIsSubmitting(true);
    
    // Create the job in context
    createJob(formData);
    
    // Simulate finding a driver and navigating to tracking page
    setTimeout(() => {
      navigate('/app/job-arrival');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-float" style={{ animationDuration: '10s' }}>
      <div className="mb-md">
        <h1 className="font-headline-lg text-3xl font-extrabold text-gradient mb-xs">Request Rescue</h1>
        <p className="font-body-md text-text-muted">Enter details below to dispatch a premium tow truck.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-md glass-panel rounded-2xl p-6">
        
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-text-main flex items-center gap-sm">
            <span className="material-symbols-outlined text-sm text-primary">my_location</span>
            Pickup Location
          </label>
          <input 
            type="text" name="location" 
            placeholder="E.g. 123 Main St, New York" 
            value={formData.location} onChange={handleChange}
            className="input-premium rounded-xl p-3 w-full"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-md text-text-main flex items-center gap-sm">
            <span className="material-symbols-outlined text-sm text-secondary">pin_drop</span>
            Destination (Optional)
          </label>
          <input 
            type="text" name="destination" 
            placeholder="E.g. Joe's Garage" 
            value={formData.destination} onChange={handleChange}
            className="input-premium rounded-xl p-3 w-full"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-md text-text-main flex items-center gap-sm">
            <span className="material-symbols-outlined text-sm text-primary">directions_car</span>
            Vehicle Details
          </label>
          <input 
            type="text" name="vehicle" 
            placeholder="Make, Model, Color" 
            value={formData.vehicle} onChange={handleChange}
            className="input-premium rounded-xl p-3 w-full"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-md text-text-main flex items-center gap-sm">
            <span className="material-symbols-outlined text-sm text-secondary">build</span>
            Issue Type
          </label>
          <select 
            name="issue" 
            value={formData.issue} onChange={handleChange}
            className="input-premium rounded-xl p-3 w-full appearance-none"
            disabled={isSubmitting}
          >
            <option value="Flat Tire" className="text-black">Flat Tire</option>
            <option value="Dead Battery" className="text-black">Dead Battery</option>
            <option value="Engine Overheating" className="text-black">Engine Overheating</option>
            <option value="Accident / Tow" className="text-black">Accident / Tow</option>
            <option value="Out of Gas" className="text-black">Out of Gas</option>
            <option value="Locked Out" className="text-black">Locked Out</option>
          </select>
        </div>

        <div className="mt-auto pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary-glow font-label-md py-4 rounded-xl flex justify-center items-center gap-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Dispatching Unit...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">sos</span>
                Request Rescue Unit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
