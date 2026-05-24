import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboardDesktop() {
  const { jobs } = useAppContext();
  
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  
  const totalRevenue = completedJobs.reduce((acc, job) => acc + job.price, 428190); // Base mock + actual
  const avgJobValue = completedJobs.length > 0 
    ? (completedJobs.reduce((acc, job) => acc + job.price, 0) / completedJobs.length).toFixed(2)
    : "342.20";

  return (
    <div className="bg-background text-on-background h-full">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 w-full bg-surface dark:bg-background border-b border-outline-variant dark:border-outline z-40">
        <div className="flex items-center gap-md">
          <button className="md:hidden text-primary transition-transform active:scale-95">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">Dashboard</h2>
        </div>
        <div className="flex items-center gap-md">
          <div className="hidden md:flex bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input className="bg-transparent border-none outline-none text-label-md text-on-surface w-48 focus:ring-0" placeholder="Search data..." type="text"/>
          </div>
          <button className="text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="md:ml-64 p-margin-mobile md:p-margin-desktop space-y-xl pb-24">
        {/* KPI Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="bg-surface border border-outline-variant p-lg rounded-xl flex flex-col gap-xs group hover:border-primary transition-colors cursor-default">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Total Revenue</span>
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">+12.5%</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-primary">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Past 30 days performance</p>
          </div>
          
          <div className="bg-surface border border-outline-variant p-lg rounded-xl flex flex-col gap-xs group hover:border-primary transition-colors cursor-default">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Active Jobs</span>
              <span className="material-symbols-outlined text-primary">local_shipping</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">{pendingJobs.length}</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Currently awaiting dispatch</p>
          </div>
          
          <div className="bg-surface border border-outline-variant p-lg rounded-xl flex flex-col gap-xs group hover:border-primary transition-colors cursor-default">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Average Job Value</span>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">${avgJobValue}</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Based on completed jobs</p>
          </div>
        </section>

        {/* Live Platform Jobs Table */}
        <section className="space-y-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Live Platform Jobs</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Monitor real-time service requests</p>
            </div>
            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs hover:shadow-md transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>
          
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Job ID</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Vehicle / Issue</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Location</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Value</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-lg py-md font-label-md text-label-md text-on-surface">{job.id}</td>
                    <td className="px-lg py-md">
                      <p className="font-label-md text-label-md text-on-surface">{job.vehicle}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{job.issue}</p>
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md truncate max-w-[200px]">{job.location}</td>
                    <td className="px-lg py-md font-body-md text-body-md font-semibold text-primary">${job.price.toFixed(2)}</td>
                    <td className="px-lg py-md">
                      {job.status === 'completed' && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Completed</span>}
                      {job.status === 'accepted' && <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">In Progress</span>}
                      {job.status === 'pending' && <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Pending</span>}
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-lg py-xl text-center text-on-surface-variant">No jobs found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
<div className="fixed bottom-margin-desktop right-margin-desktop bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-xl shadow-xl flex items-center gap-md transform translate-y-24 opacity-0 transition-all duration-300 z-50" id="toast">
<span className="material-symbols-outlined text-secondary-container">check_circle</span>
<div>
<p className="font-label-md text-label-md">Report Generated</p>
<p className="font-label-sm text-label-sm opacity-80">Income metrics exported to CSV.</p>
</div>
</div>


    </div>
  );
}
