import React from 'react';
import { Link } from 'react-router-dom';

export default function FullAdminPanelDesktop() {
  return (
    <div className="bg-background text-on-background h-full">
      

{/* Main Content */}
<main className="flex-1 md:ml-72 flex flex-col h-screen overflow-y-auto">
{/* Top App Bar */}
<header className="sticky top-0 z-30 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 shrink-0">
<div className="flex items-center gap-md">
<button className="md:hidden p-2 text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<h2 className="font-headline-md text-headline-md font-bold text-primary">Overview</h2>
</div>
<div className="flex items-center gap-md">
<div className="hidden md:flex bg-surface-container-low px-md py-1.5 rounded-full border border-outline-variant items-center gap-sm">
<span className="material-symbols-outlined text-primary text-sm" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-label-sm w-48" placeholder="Search operations..." type="text"/>
</div>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                    JD
                </div>
</div>
</header>
{/* Main Content Area */}
<div className="p-lg md:p-xl flex flex-col gap-xl max-w-[1280px] w-full mx-auto">
{/* Tabs Navigation */}
<div className="flex border-b border-outline-variant">
<button className="tab-btn px-lg py-md border-b-2 border-primary text-primary font-label-md transition-colors" id="tab-income" onclick="switchTab('income')">Income Metrics</button>
<button className="tab-btn px-lg py-md border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md transition-colors" id="tab-jobs" onclick="switchTab('jobs')">Job History</button>
<button className="tab-btn px-lg py-md border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md transition-colors" id="tab-subs" onclick="switchTab('subs')">Subscription Management</button>
</div>
{/* TAB 1: Income Metrics */}
<section className="tab-content flex flex-col gap-lg" id="content-income">
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-xs">Total Revenue</p>
<h3 className="font-headline-lg text-headline-lg">$142,580.00</h3>
<div className="mt-md flex items-center gap-xs text-secondary font-label-md">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span>+12.5% from last month</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-xs">Active Drivers</p>
<h3 className="font-headline-lg text-headline-lg">1,204</h3>
<div className="mt-md flex items-center gap-xs text-secondary font-label-md">
<span className="material-symbols-outlined text-sm" data-icon="group">group</span>
<span>84 new this week</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-xs">Average Job Value</p>
<h3 className="font-headline-lg text-headline-lg">$34.50</h3>
<div className="mt-md flex items-center gap-xs text-tertiary font-label-md">
<span className="material-symbols-outlined text-sm" data-icon="trending_down">trending_down</span>
<span>-2.1% volatility</span>
</div>
</div>
</div>
{/* Chart Placeholder Visual */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl min-h-[400px] flex flex-col">
<div className="flex justify-between items-center mb-xl">
<div>
<h4 className="font-headline-md text-headline-md">Revenue Growth</h4>
<p className="text-on-surface-variant text-body-md">Monthly performance analytics overview</p>
</div>
<select className="bg-surface-container-low border-outline-variant rounded-lg text-label-md py-2 px-md">
<option>Last 6 Months</option>
<option>Last Year</option>
</select>
</div>
<div className="flex-1 flex items-end justify-between gap-md pt-lg">
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{ height: '40%' }}></div>
<span className="text-label-sm text-on-surface-variant">Jan</span>
</div>
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{ height: '60%' }}></div>
<span className="text-label-sm text-on-surface-variant">Feb</span>
</div>
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{ height: '55%' }}></div>
<span className="text-label-sm text-on-surface-variant">Mar</span>
</div>
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{ height: '85%' }}></div>
<span className="text-label-sm text-on-surface-variant">Apr</span>
</div>
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary-container rounded-t-lg transition-all hover:brightness-110" style={{ height: '70%' }}></div>
<span className="text-label-sm text-on-surface-variant">May</span>
</div>
<div className="w-full flex flex-col gap-sm items-center">
<div className="w-full bg-primary rounded-t-lg transition-all hover:brightness-110" style={{ height: '95%' }}></div>
<span className="text-label-sm text-on-surface-variant font-bold">Jun</span>
</div>
</div>
</div>
</section>
{/* TAB 2: Job History */}
<section className="tab-content hidden flex flex-col gap-lg" id="content-jobs">
<div className="flex justify-between items-center">
<h4 className="font-headline-md text-headline-md">Recent Operations</h4>
<button className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md flex items-center gap-sm">
<span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                        Export CSV
                    </button>
</div>
<div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-xl">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-lg py-md font-label-md text-on-surface-variant">Job ID</th>
<th className="px-lg py-md font-label-md text-on-surface-variant">Driver Name</th>
<th className="px-lg py-md font-label-md text-on-surface-variant">Earnings</th>
<th className="px-lg py-md font-label-md text-on-surface-variant">Timestamp</th>
<th className="px-lg py-md font-label-md text-on-surface-variant">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md text-label-md">#DRV-7742</td>
<td className="px-lg py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest"></div>
<span className="text-label-md">Alex Thompson</span>
</td>
<td className="px-lg py-md text-label-md">$42.00</td>
<td className="px-lg py-md text-label-sm text-on-surface-variant">2023-10-24 14:32</td>
<td className="px-lg py-md">
<span className="px-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">Completed</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md text-label-md">#DRV-7741</td>
<td className="px-lg py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest"></div>
<span className="text-label-md">Maria Garcia</span>
</td>
<td className="px-lg py-md text-label-md">$18.50</td>
<td className="px-lg py-md text-label-sm text-on-surface-variant">2023-10-24 14:15</td>
<td className="px-lg py-md">
<span className="px-md py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold uppercase tracking-wider">Disputed</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md text-label-md">#DRV-7740</td>
<td className="px-lg py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest"></div>
<span className="text-label-md">James Wilson</span>
</td>
<td className="px-lg py-md text-label-md">$56.20</td>
<td className="px-lg py-md text-label-sm text-on-surface-variant">2023-10-24 13:58</td>
<td className="px-lg py-md">
<span className="px-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">Completed</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md text-label-md">#DRV-7739</td>
<td className="px-lg py-md flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest"></div>
<span className="text-label-md">Sarah Jenkins</span>
</td>
<td className="px-lg py-md text-label-md">$29.00</td>
<td className="px-lg py-md text-label-sm text-on-surface-variant">2023-10-24 13:42</td>
<td className="px-lg py-md">
<span className="px-md py-1 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wider">In Progress</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
{/* TAB 3: Subscription Management */}
<section className="tab-content hidden flex flex-col gap-lg" id="content-subs">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
{/* Sub Card 1 */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-md">
<div className="flex justify-between items-start">
<div className="w-12 h-12 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
</div>
<div className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</div>
</div>
<div>
<h5 className="font-headline-md text-headline-md">Enterprise Pro</h5>
<p className="text-on-surface-variant text-label-sm">Driver: Alex Thompson</p>
</div>
<div className="flex justify-between items-center text-label-sm pt-md border-t border-outline-variant">
<span className="text-on-surface-variant">Renewal Date</span>
<span className="font-bold">Nov 12, 2023</span>
</div>
</div>
{/* Sub Card 2 */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-md">
<div className="flex justify-between items-start">
<div className="w-12 h-12 rounded-lg bg-secondary-container/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="electric_car">electric_car</span>
</div>
<div className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</div>
</div>
<div>
<h5 className="font-headline-md text-headline-md">Basic Flex</h5>
<p className="text-on-surface-variant text-label-sm">Driver: Maria Garcia</p>
</div>
<div className="flex justify-between items-center text-label-sm pt-md border-t border-outline-variant">
<span className="text-on-surface-variant">Renewal Date</span>
<span className="font-bold">Oct 30, 2023</span>
</div>
</div>
{/* Sub Card 3 */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-md opacity-75 grayscale-[0.5]">
<div className="flex justify-between items-start">
<div className="w-12 h-12 rounded-lg bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="person">person</span>
</div>
<div className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</div>
</div>
<div>
<h5 className="font-headline-md text-headline-md">Legacy Plan</h5>
<p className="text-on-surface-variant text-label-sm">Driver: James Wilson</p>
</div>
<div className="flex justify-between items-center text-label-sm pt-md border-t border-outline-variant">
<span className="text-on-surface-variant">Status</span>
<span className="font-bold text-error">Expired</span>
</div>
</div>
</div>
</section>
</div>
</main>
{/* Bottom Nav (Mobile Only) */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 md:hidden bg-surface border-t border-outline-variant">
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1">
<span className="material-symbols-outlined" data-icon="work">work</span>
<span className="font-label-sm text-label-sm">Jobs</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-label-sm text-label-sm">History</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="font-label-sm text-label-sm">Alerts</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</div>
</nav>


    </div>
  );
}
