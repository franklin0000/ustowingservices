import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPerformanceDashboardDesktop() {
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
{/* Main Content Area: Performance Dashboard */}
<div className="p-lg md:p-xl flex flex-col gap-xl max-w-[1280px] w-full mx-auto">
{/* Metric Cards Row */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
{/* Total Revenue */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col relative overflow-hidden">
<div className="flex justify-between items-start mb-sm">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider">Total Revenue</p>
<span className="text-secondary text-label-sm font-bold flex items-center gap-xs">
<span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                            12.5%
                        </span>
</div>
<h3 className="font-headline-lg text-headline-lg mb-md">$142,580.00</h3>
{/* Sparkline SVG Placeholder */}
<div className="h-10 w-full mt-auto">
<svg className="w-full h-full text-secondary opacity-20" preserveaspectratio="none" viewbox="0 0 100 20">
<path d="M0 20 L0 15 L20 18 L40 10 L60 14 L80 5 L100 8 L100 20 Z" fill="currentColor"></path>
<path d="M0 15 L20 18 L40 10 L60 14 L80 5 L100 8" fill="none" stroke="currentColor" strokeWidth="2"></path>
</svg>
</div>
</div>
{/* Active Drivers */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-start mb-sm">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider">Active Drivers</p>
<span className="text-secondary text-label-sm font-bold">+84 this week</span>
</div>
<h3 className="font-headline-lg text-headline-lg mb-md">1,204</h3>
<div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[85%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-label-sm mt-2">85% of total fleet currently online</p>
</div>
{/* Average Job Value */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-start mb-sm">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider">Avg. Job Value</p>
<span className="text-tertiary text-label-sm font-bold flex items-center gap-xs">
<span className="material-symbols-outlined text-xs" data-icon="trending_down">trending_down</span>
                            2.1%
                        </span>
</div>
<h3 className="font-headline-lg text-headline-lg mb-md">$34.50</h3>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span className="text-on-surface-variant text-label-sm">Live market volatility high</span>
</div>
</div>
</div>
{/* Revenue Growth Area Chart Section */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
<div>
<h4 className="font-headline-md text-headline-md">Revenue Growth</h4>
<p className="text-on-surface-variant text-body-md">Financial trajectory across the last 6 operational months</p>
</div>
<div className="flex items-center gap-md">
<div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
<button className="px-md py-1.5 bg-surface-container-lowest shadow-sm rounded-md text-label-md font-bold text-primary">Monthly</button>
<button className="px-md py-1.5 text-on-surface-variant text-label-md hover:text-on-surface">Weekly</button>
</div>
<select className="bg-surface-container-low border-outline-variant rounded-lg text-label-md py-2 px-md">
<option>Last 6 Months</option>
<option>Last Year</option>
</select>
</div>
</div>
{/* Visual Area Chart Simulation */}
<div className="relative h-[320px] w-full mt-lg">
{/* Grid Lines */}
<div className="absolute inset-0 flex flex-col justify-between">
<div className="border-t border-outline-variant w-full opacity-50"></div>
<div className="border-t border-outline-variant w-full opacity-50"></div>
<div className="border-t border-outline-variant w-full opacity-50"></div>
<div className="border-t border-outline-variant w-full opacity-50"></div>
<div className="border-t border-outline-variant w-full opacity-50"></div>
</div>
{/* SVG Area Chart */}
<div className="absolute inset-0 pt-8">
<svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 1000 100">
{/* Area Fill */}
<path className="text-primary/10" d="M0 80 Q 200 70, 400 60 T 600 40 T 800 20 T 1000 5 L 1000 100 L 0 100 Z" fill="currentColor"></path>
{/* Line */}
<path className="text-primary" d="M0 80 Q 200 70, 400 60 T 600 40 T 800 20 T 1000 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
</svg>
{/* Tooltip Placeholder */}
<div className="absolute left-[80%] top-[10%] bg-surface border border-outline-variant shadow-xl p-md rounded-lg z-10 hidden md:block">
<p className="text-label-sm text-on-surface-variant">May 2024</p>
<p className="font-bold text-primary">$28,450</p>
</div>
</div>
{/* X-Axis Labels */}
<div className="absolute -bottom-8 left-0 right-0 flex justify-between px-md text-label-sm text-on-surface-variant">
<span>Jan</span>
<span>Feb</span>
<span>Mar</span>
<span>Apr</span>
<span>May</span>
<span>Jun</span>
</div>
</div>
</div>
{/* Bottom Grid: Driver Performance & Subscriptions */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
{/* Driver Performance Widget */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-headline-md text-headline-md text-base">Driver Performance</h4>
<button className="text-primary text-label-md font-bold hover:underline">View All</button>
</div>
<div className="space-y-md">
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
<div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">AT</div>
</div>
<div className="flex-1">
<div className="flex justify-between">
<p className="font-label-md text-label-md">Alex Thompson</p>
<span className="text-secondary font-bold text-label-sm">4.9/5.0</span>
</div>
<div className="w-full bg-surface-container-low h-1.5 rounded-full mt-1">
<div className="bg-secondary h-full w-[98%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-label-sm mt-1">Reliability: 98% (Exemplary)</p>
</div>
</div>
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
<div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">MG</div>
</div>
<div className="flex-1">
<div className="flex justify-between">
<p className="font-label-md text-label-md">Maria Garcia</p>
<span className="text-secondary font-bold text-label-sm">4.7/5.0</span>
</div>
<div className="w-full bg-surface-container-low h-1.5 rounded-full mt-1">
<div className="bg-secondary h-full w-[92%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-label-sm mt-1">Reliability: 92% (High)</p>
</div>
</div>
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
<div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">JW</div>
</div>
<div className="flex-1">
<div className="flex justify-between">
<p className="font-label-md text-label-md">James Wilson</p>
<span className="text-on-surface-variant font-bold text-label-sm">3.8/5.0</span>
</div>
<div className="w-full bg-surface-container-low h-1.5 rounded-full mt-1">
<div className="bg-primary h-full w-[75%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-label-sm mt-1">Reliability: 75% (Fair)</p>
</div>
</div>
</div>
</div>
{/* Subscription Analytics Widget */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<h4 className="font-headline-md text-headline-md text-base mb-lg">Subscription Tiers</h4>
<div className="flex flex-col md:flex-row items-center gap-xl h-full pb-md">
{/* Donut Chart Placeholder */}
<div className="relative w-40 h-40">
<svg className="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<circle cx="18" cy="18" fill="none" r="16" stroke="#f0edec" strokeWidth="4"></circle>
<circle cx="18" cy="18" fill="none" r="16" stroke="#0050cb" stroke-dasharray="60, 100" strokeLinecap="round" strokeWidth="4"></circle>
<circle cx="18" cy="18" fill="none" r="16" stroke="#006c49" stroke-dasharray="30, 100" stroke-dashoffset="-60" strokeLinecap="round" strokeWidth="4"></circle>
<circle cx="18" cy="18" fill="none" r="16" stroke="#e5e2e1" stroke-dasharray="10, 100" stroke-dashoffset="-90" strokeLinecap="round" strokeWidth="4"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-headline-md font-bold">1.2k</span>
<span className="text-[10px] uppercase text-on-surface-variant tracking-tighter">Total Subs</span>
</div>
</div>
{/* Legend */}
<div className="flex-1 space-y-sm">
<div className="flex items-center justify-between gap-md">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-label-md">Enterprise Pro</span>
</div>
<span className="font-bold">60%</span>
</div>
<div className="flex items-center justify-between gap-md">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-secondary"></span>
<span className="text-label-md">Basic Flex</span>
</div>
<span className="font-bold">30%</span>
</div>
<div className="flex items-center justify-between gap-md">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-surface-variant"></span>
<span className="text-label-md">Free Tier</span>
</div>
<span className="font-bold">10%</span>
</div>
</div>
</div>
</div>
</div>
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
