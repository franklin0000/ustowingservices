import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Role: 'client', 'driver', 'admin', null
  const [userRole, setUserRole] = useState(localStorage.getItem('gruas_role') || null);
  
  // Jobs: { id, status: 'pending'|'accepted'|'completed', location, destination, vehicle, issue, price, driverId }
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('gruas_jobs');
    return saved ? JSON.parse(saved) : [
      { id: 'DX-9821', status: 'completed', location: '123 Main St', vehicle: 'Toyota Camry', issue: 'Flat Tire', price: 124.50 },
      { id: 'DX-9822', status: 'pending', location: '456 Oak Ave', vehicle: 'Honda Civic', issue: 'Engine Overheating', price: 85.00 },
    ];
  });

  const [driverBalance, setDriverBalance] = useState(482.00);

  // Sync to local storage
  useEffect(() => {
    if (userRole) localStorage.setItem('gruas_role', userRole);
    else localStorage.removeItem('gruas_role');
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('gruas_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const login = (role) => setUserRole(role);
  const logout = () => setUserRole(null);

  const createJob = (jobDetails) => {
    const newJob = {
      id: `DX-${Math.floor(Math.random() * 10000)}`,
      status: 'pending',
      ...jobDetails,
      price: Math.floor(Math.random() * 100) + 50, // random price
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob.id;
  };

  const acceptJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'accepted' } : job
    ));
  };

  const completeJob = (jobId) => {
    setJobs(prev => {
      const updated = prev.map(job => {
        if (job.id === jobId) {
          setDriverBalance(b => b + job.price);
          return { ...job, status: 'completed' };
        }
        return job;
      });
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      userRole, login, logout,
      jobs, createJob, acceptJob, completeJob,
      driverBalance
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
