import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminAnalyticsCommunicationHub() {
  return (
    <div className="bg-background text-on-background h-full">
      

{/* Main Content */}
<main className="flex-1 md:ml-72 md:mr-80 flex flex-col h-screen overflow-y-auto">
{/* Top App Bar */}
<header className="sticky top-0 z-30 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 shrink-0">
<div className="flex items-center gap-md">
<button className="md:hidden p-2 text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<h2 className="font-headline-md text-headline-md font-bold text-primary">Performance Dashboard</h2>
</div>
<div className="flex items-center gap-md">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full relative" onclick="toggleChat()">
<span className="material-symbols-outlined" data-icon="forum">forum</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                    JD
                </div>
</div>
</header>
{/* Filter Bar */}
<div className="bg-surface-container-low border-b border-outline-variant px-margin-mobile md:px-margin-desktop py-md sticky top-16 z-20">
<div className="max-w-[1280px] mx-auto flex flex-wrap items-center gap-md">
<div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-2 min-w-[180px]">
<span className="material-symbols-outlined text-on-surface-variant text-sm">location_on</span>
<select className="bg-transparent border-none focus:ring-0 text-label-md w-full p-0">
<option>All Regions</option>
<option>North America</option>
<option>Europe</option>
<option>Asia Pacific</option>
</select>
</div>
<div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-2 min-w-[180px]">
<span className="material-symbols-outlined text-on-surface-variant text-sm">category</span>
<select className="bg-transparent border-none focus:ring-0 text-label-md w-full p-0">
<option>All Services</option>
<option>Courier Delivery</option>
<option>Heavy Freight</option>
<option>Express Parcel</option>
</select>
</div>
<div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-2 min-w-[220px]">
<span className="material-symbols-outlined text-on-surface-variant text-sm">calendar_today</span>
<select className="bg-transparent border-none focus:ring-0 text-label-md w-full p-0">
<option>Last 30 Days</option>
<option>Last 7 Days</option>
<option>Current Quarter</option>
<option>Custom Range</option>
</select>
</div>
<button className="ml-auto bg-primary text-on-primary px-lg py-2 rounded-lg font-bold text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
            Apply Filters
        </button>
</div>
</div>
{/* Main Content Area */}
<div className="p-lg md:p-xl flex flex-col gap-xl max-w-[1280px] w-full mx-auto pb-24">
{/* Top Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-sm">Total Revenue</p>
<h3 className="font-headline-lg text-headline-lg">$142,580</h3>
<span className="text-secondary text-label-sm font-bold flex items-center gap-xs mt-1">
<span className="material-symbols-outlined text-xs">trending_up</span> 12.5% vs LW
            </span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-sm">Avg. Job Value</p>
<h3 className="font-headline-lg text-headline-lg">$34.50</h3>
<span className="text-tertiary text-label-sm font-bold flex items-center gap-xs mt-1">
<span className="material-symbols-outlined text-xs">trending_down</span> 2.1% vs LW
            </span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-sm">Completion Rate</p>
<h3 className="font-headline-lg text-headline-lg">94.2%</h3>
<span className="text-secondary text-label-sm font-bold flex items-center gap-xs mt-1">
<span className="material-symbols-outlined text-xs">check_circle</span> +0.8% Target
            </span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-sm">Active Drivers</p>
<h3 className="font-headline-lg text-headline-lg">1,204</h3>
<span className="text-on-surface-variant text-label-sm flex items-center gap-xs mt-1">
                85% of total fleet online
            </span>
</div>
</div>
{/* Communication Hub: Broadcast Section */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-lg">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">campaign</span>
</div>
<div>
<h4 className="font-headline-md text-headline-md text-base">Broadcast Center</h4>
<p className="text-on-surface-variant text-label-sm">Send instant push notifications to your fleet</p>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-end">
<div className="md:col-span-3">
<label className="block text-label-sm font-bold text-on-surface-variant mb-xs">Title</label>
<input className="w-full bg-surface border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-2 text-body-md" placeholder="e.g. Inclement Weather Alert" type="text"/>
</div>
<div className="md:col-span-4">
<label className="block text-label-sm font-bold text-on-surface-variant mb-xs">Message</label>
<input className="w-full bg-surface border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-2 text-body-md" placeholder="Details about the broadcast..." type="text"/>
</div>
<div className="md:col-span-3">
<label className="block text-label-sm font-bold text-on-surface-variant mb-xs">Target Audience</label>
<select className="w-full bg-surface border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-md py-2 text-body-md">
<option>All Drivers</option>
<option>High Rated (4.5+)</option>
<option>On-Duty Only</option>
<option>Regional: North</option>
</select>
</div>
<div className="md:col-span-2">
<button className="w-full bg-primary text-on-primary h-[42px] rounded-lg font-bold text-label-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined text-sm">send</span>
                    Send Now
                </button>
</div>
</div>
</div>
{/* Job Volume vs Completion Analytics (Multi-series Chart Replacement) */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
<div>
<h4 className="font-headline-md text-headline-md">Job History Analytics</h4>
<p className="text-on-surface-variant text-body-md">Daily volume and fulfillment efficiency</p>
</div>
<div className="flex items-center gap-lg">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-label-sm">Job Volume</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-secondary"></span>
<span className="text-label-sm">Completion Rate (%)</span>
</div>
</div>
</div>
<div className="relative h-[300px] w-full flex items-end gap-2 pt-10">
{/* Simulated Multi-series Bar/Line Hybrid */}
{/* Columns representing days */}
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 450 | Rate: 92%</div>
<div className="w-full bg-primary/20 rounded-t h-[60%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[62%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Mon</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 520 | Rate: 95%</div>
<div className="w-full bg-primary/20 rounded-t h-[75%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[78%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Tue</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 610 | Rate: 89%</div>
<div className="w-full bg-primary/20 rounded-t h-[85%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[82%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Wed</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 480 | Rate: 94%</div>
<div className="w-full bg-primary/20 rounded-t h-[65%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[68%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Thu</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 720 | Rate: 96%</div>
<div className="w-full bg-primary/20 rounded-t h-[95%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[92%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Fri</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 310 | Rate: 91%</div>
<div className="w-full bg-primary/20 rounded-t h-[40%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[42%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Sat</span>
</div>
<div className="flex-1 flex flex-col justify-end items-center group relative h-full">
<div className="absolute bottom-full mb-2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Vol: 240 | Rate: 98%</div>
<div className="w-full bg-primary/20 rounded-t h-[30%] hover:bg-primary/40 transition-colors"></div>
<div className="absolute bottom-[35%] left-0 right-0 h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
<span className="text-[10px] mt-2 text-on-surface-variant">Sun</span>
</div>
</div>
</div>
{/* Second Row: Peak Hours & Distribution */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
{/* Peak Hours Heat Map */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-headline-md text-headline-md text-base">Peak Hours Heat Map</h4>
<span className="text-label-sm text-on-surface-variant">Hourly load over 24h</span>
</div>
<div className="grid grid-cols-12 gap-1 h-48">
{/* Row 1: AM */}
<div className="bg-primary/5 heatmap-cell rounded-sm" title="00:00 - Low"></div>
<div className="bg-primary/5 heatmap-cell rounded-sm" title="01:00 - Low"></div>
<div className="bg-primary/10 heatmap-cell rounded-sm" title="02:00"></div>
<div className="bg-primary/10 heatmap-cell rounded-sm" title="03:00"></div>
<div className="bg-primary/20 heatmap-cell rounded-sm" title="04:00"></div>
<div className="bg-primary/40 heatmap-cell rounded-sm" title="05:00"></div>
<div className="bg-primary/60 heatmap-cell rounded-sm" title="06:00 - Rising"></div>
<div className="bg-primary/80 heatmap-cell rounded-sm" title="07:00 - High"></div>
<div className="bg-primary heatmap-cell rounded-sm" title="08:00 - Peak"></div>
<div className="bg-primary/90 heatmap-cell rounded-sm" title="09:00 - Peak"></div>
<div className="bg-primary/70 heatmap-cell rounded-sm" title="10:00"></div>
<div className="bg-primary/50 heatmap-cell rounded-sm" title="11:00"></div>
{/* Row 2: PM */}
<div className="bg-primary/40 heatmap-cell rounded-sm" title="12:00"></div>
<div className="bg-primary/40 heatmap-cell rounded-sm" title="13:00"></div>
<div className="bg-primary/60 heatmap-cell rounded-sm" title="14:00"></div>
<div className="bg-primary/70 heatmap-cell rounded-sm" title="15:00"></div>
<div className="bg-primary/80 heatmap-cell rounded-sm" title="16:00 - High"></div>
<div className="bg-primary heatmap-cell rounded-sm" title="17:00 - Peak"></div>
<div className="bg-primary/90 heatmap-cell rounded-sm" title="18:00 - Peak"></div>
<div className="bg-primary/60 heatmap-cell rounded-sm" title="19:00"></div>
<div className="bg-primary/40 heatmap-cell rounded-sm" title="20:00"></div>
<div className="bg-primary/20 heatmap-cell rounded-sm" title="21:00"></div>
<div className="bg-primary/10 heatmap-cell rounded-sm" title="22:00"></div>
<div className="bg-primary/5 heatmap-cell rounded-sm" title="23:00"></div>
</div>
<div className="flex justify-between mt-md text-label-sm text-on-surface-variant">
<span>00:00</span>
<span>08:00 (Peak)</span>
<span>17:00 (Peak)</span>
<span>23:59</span>
</div>
<div className="mt-lg flex items-center gap-md">
<div className="flex-1 bg-surface-container-low p-md rounded-lg border border-outline-variant">
<p className="text-label-sm text-on-surface-variant">Optimal Staffing</p>
<p className="font-bold text-primary">07:00 - 10:00</p>
</div>
<div className="flex-1 bg-surface-container-low p-md rounded-lg border border-outline-variant">
<p className="text-label-sm text-on-surface-variant">Peak Demand</p>
<p className="font-bold text-primary">17:00 - 19:00</p>
</div>
</div>
</div>
{/* Job Category Distribution Pie/Donut Chart */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col">
<h4 className="font-headline-md text-headline-md text-base mb-lg">Job Category Distribution</h4>
<div className="flex flex-col md:flex-row items-center gap-xl h-full pb-md">
<div className="relative w-44 h-44 shrink-0">
<svg className="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<circle cx="18" cy="18" fill="none" r="16" stroke="#f0edec" strokeWidth="4"></circle>
{/* Courier (45%) */}
<circle cx="18" cy="18" fill="none" r="16" stroke="#0050cb" stroke-dasharray="45, 100" strokeLinecap="round" strokeWidth="4"></circle>
{/* Freight (30%) */}
<circle cx="18" cy="18" fill="none" r="16" stroke="#006c49" stroke-dasharray="30, 100" stroke-dashoffset="-45" strokeLinecap="round" strokeWidth="4"></circle>
{/* Express (25%) */}
<circle cx="18" cy="18" fill="none" r="16" stroke="#b21320" stroke-dasharray="25, 100" stroke-dashoffset="-75" strokeLinecap="round" strokeWidth="4"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-headline-md font-bold text-primary">2.4k</span>
<span className="text-[10px] uppercase text-on-surface-variant tracking-tighter">Jobs Total</span>
</div>
</div>
<div className="flex-1 space-y-md w-full">
<div className="flex items-center justify-between group hover:bg-surface-container-low p-2 rounded-lg transition-colors cursor-default">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-label-md">Courier Delivery</span>
</div>
<span className="font-bold">45%</span>
</div>
<div className="flex items-center justify-between group hover:bg-surface-container-low p-2 rounded-lg transition-colors cursor-default">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-secondary"></span>
<span className="text-label-md">Heavy Freight</span>
</div>
<span className="font-bold">30%</span>
</div>
<div className="flex items-center justify-between group hover:bg-surface-container-low p-2 rounded-lg transition-colors cursor-default">
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-tertiary"></span>
<span className="text-label-md">Express Parcel</span>
</div>
<span className="font-bold">25%</span>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Performance Row */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
{/* Top Drivers */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-headline-md text-headline-md text-base">Top Performance Fleet</h4>
<button className="text-primary text-label-md font-bold hover:underline">Full Leaderboard</button>
</div>
<div className="space-y-md">
<div className="flex items-center gap-md group p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer" onclick="openDirectChat('Alex Thompson')">
<div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">AT</div>
<div className="flex-1">
<div className="flex justify-between">
<p className="font-label-md">Alex Thompson</p>
<span className="text-secondary font-bold text-label-sm">4.9/5.0</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1">
<div className="bg-secondary h-full w-[98%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-[10px] mt-1">Status: Elite • 142 Jobs Completed</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chat_bubble</span>
</div>
<div className="flex items-center gap-md group p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer" onclick="openDirectChat('Maria Garcia')">
<div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">MG</div>
<div className="flex-1">
<div className="flex justify-between">
<p className="font-label-md">Maria Garcia</p>
<span className="text-secondary font-bold text-label-sm">4.7/5.0</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1">
<div className="bg-secondary h-full w-[92%] rounded-full"></div>
</div>
<p className="text-on-surface-variant text-[10px] mt-1">Status: Senior • 118 Jobs Completed</p>
</div>
<span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chat_bubble</span>
</div>
</div>
</div>
{/* Alerts/Issues Card */}
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<h4 className="font-headline-md text-headline-md text-base mb-lg">Operational Alerts</h4>
<div className="space-y-sm">
<div className="flex gap-md items-start p-md bg-error-container/20 rounded-lg border border-error/10">
<span className="material-symbols-outlined text-error mt-0.5">report</span>
<div>
<p className="text-label-md font-bold text-error">Delayed Shipment #4928</p>
<p className="text-label-sm text-on-surface-variant">Vehicle breakdown on Highway 101. Estimated 45min delay.</p>
</div>
</div>
<div className="flex gap-md items-start p-md bg-secondary-container/20 rounded-lg border border-secondary/10">
<span className="material-symbols-outlined text-secondary mt-0.5">verified</span>
<div>
<p className="text-label-md font-bold text-secondary-container-on">Peak Capacity Met</p>
<p className="text-label-sm text-on-surface-variant">All Express units successfully deployed for morning rush.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
{/* Communication Hub: Fleet Chat Sidebar */}
<aside className="fixed right-0 top-0 h-screen w-80 bg-surface border-l border-outline-variant z-40 hidden md:flex flex-col shadow-xl chat-sidebar" id="chatSidebar">
<div className="h-16 shrink-0 flex items-center justify-between px-lg border-b border-outline-variant bg-surface-container-low">
<h2 className="font-headline-md text-base font-bold text-primary flex items-center gap-sm">
<span className="material-symbols-outlined">forum</span>
            Fleet Chat
        </h2>
<button className="p-1 hover:bg-surface-container-high rounded-full" onclick="toggleChat()">
<span className="material-symbols-outlined text-on-surface-variant">close</span>
</button>
</div>
{/* Search & Active Chats */}
<div className="p-md space-y-md border-b border-outline-variant">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
<input className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 py-2 text-label-md focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Search drivers..." type="text"/>
</div>
<div className="flex gap-sm overflow-x-auto pb-1 no-scrollbar">
<div className="shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
<div className="relative">
<div className="w-10 h-10 rounded-full bg-primary-container border-2 border-white"></div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></span>
</div>
<span className="text-[10px] font-bold">Alex</span>
</div>
<div className="shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
<div className="relative">
<div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-white"></div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></span>
</div>
<span className="text-[10px] font-bold">Maria</span>
</div>
<div className="shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
<div className="relative">
<div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-white"></div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-surface-dim rounded-full border-2 border-white"></span>
</div>
<span className="text-[10px] font-bold">Steve</span>
</div>
<div className="shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
<div className="relative text-on-surface-variant">
<div className="w-10 h-10 rounded-full bg-surface-container-low border border-dashed border-outline flex items-center justify-center">
<span className="material-symbols-outlined text-sm">add</span>
</div>
</div>
<span className="text-[10px] font-bold">New</span>
</div>
</div>
</div>
{/* Chat Area */}
<div className="flex-1 overflow-y-auto p-md space-y-lg bg-surface-container-lowest">
<div className="text-center">
<span className="text-[10px] bg-surface-container-high px-2 py-1 rounded text-on-surface-variant font-bold uppercase tracking-wider">Today</span>
</div>
{/* Message Sent */}
<div className="flex flex-col items-end gap-1">
<div className="bg-primary text-on-primary px-lg py-2 rounded-2xl rounded-tr-none max-w-[85%] text-label-md">
            Alex, please confirm ETA for #4928.
        </div>
<span className="text-[10px] text-on-surface-variant">10:42 AM • Read</span>
</div>
{/* Message Received */}
<div className="flex gap-2 items-start">
<div className="w-6 h-6 rounded-full bg-primary-container shrink-0"></div>
<div className="flex flex-col gap-1">
<div className="bg-surface-container-high text-on-surface px-lg py-2 rounded-2xl rounded-tl-none max-w-[85%] text-label-md">
                Stuck in traffic on 101. Will be delayed by 45min. Breakdown team notified.
            </div>
<span className="text-[10px] text-on-surface-variant">10:45 AM</span>
</div>
</div>
</div>
{/* Input Area */}
<div className="p-md bg-surface border-t border-outline-variant">
<div className="bg-surface-container-low rounded-xl border border-outline-variant p-2 flex items-center gap-sm">
<button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded-full">
<span className="material-symbols-outlined text-base">attach_file</span>
</button>
<textarea className="flex-1 bg-transparent border-none focus:ring-0 text-label-md resize-none p-1 max-h-24" placeholder="Type a message..." rows="1"></textarea>
<button className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-sm">send</span>
</button>
</div>
</div>
</aside>
{/* Bottom Nav (Mobile Only) */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 md:hidden bg-surface border-t border-outline-variant">
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-sm text-label-sm">Home</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1" onclick="toggleChat()">
<span className="material-symbols-outlined" data-icon="forum">forum</span>
<span className="font-label-sm text-label-sm">Chat</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
<span className="material-symbols-outlined" data-icon="bar_chart">bar_chart</span>
<span className="font-label-sm text-label-sm">Stats</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</div>
</nav>


    </div>
  );
}
