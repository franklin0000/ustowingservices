import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function PaymentsMobile() {
  const { driverBalance, jobs } = useAppContext();
  const completedJobs = jobs.filter(j => j.status === 'completed');

  return (
    <div className="bg-background text-on-background h-full">
      <main className="px-margin-mobile pt-lg max-w-md mx-auto">
        {/* Balance Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm mb-lg">
          <div className="flex flex-col gap-xs mb-lg">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Balance</span>
            <span className="font-headline-xl text-headline-xl text-on-surface">${driverBalance.toFixed(2)}</span>
          </div>
          <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined">payments</span>
            Cash Out
          </button>
        </section>

        {/* Earnings Chart (Simulated) */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg mb-lg">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Weekly Earnings</h2>
            <span className="font-label-sm text-label-sm text-primary">This Week</span>
          </div>
          <div className="chart-bar-container px-xs">
            {/* Chart Bars with dynamic heights */}
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-surface-container-high w-full" style={{ height: '40%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">M</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-surface-container-high w-full" style={{ height: '65%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">T</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-primary-container w-full" style={{ height: '85%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">W</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-surface-container-high w-full" style={{ height: '30%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">T</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-surface-container-high w-full" style={{ height: '95%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">F</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-primary w-full" style={{ height: '100%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">S</span>
            </div>
            <div className="flex flex-col flex-1 items-center gap-xs">
              <div className="chart-bar bg-surface-container-high w-full" style={{ height: '20%' }}></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">S</span>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h2>
            <button className="font-label-md text-label-md text-primary">See All</button>
          </div>
          <div className="flex flex-col gap-sm pb-xl">
            {completedJobs.length === 0 ? (
              <p className="text-on-surface-variant text-center p-md">No recent transactions.</p>
            ) : (
              completedJobs.map(job => (
                <div key={job.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex justify-between items-center hover:bg-surface-container-high transition-colors cursor-pointer">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">local_shipping</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">Job ID: #{job.id}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Completed</span>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-secondary-container font-bold">+${job.price.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
