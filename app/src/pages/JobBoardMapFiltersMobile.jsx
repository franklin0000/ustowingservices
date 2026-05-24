import React from 'react';
import { Link } from 'react-router-dom';

export default function JobBoardMapFiltersMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      

<main className="relative">
{/* Map Section */}
<div className="map-container relative w-full overflow-hidden border-b border-white/10">
<img className="w-full h-full object-cover grayscale brightness-50" data-alt="A stylized, top-down minimalist map snippet with clean lines and a monochromatic blue palette. The map shows simplified street layouts with glow pins for jobs." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBz0yY03Ryg_YQxPKSpbMOrzYXNDWByhHzU5D-y52E6TZFBfiPagRZt5zAd8nzWV3AAWm_QK9cH1CQh4X7rbVwPXVonlKRePeUlxyRfVZeXsqxI2rWtlqvoMx74xwj7iQXg-pI27P7uGJkSdSxcSFcZ8VeF_7Nalm3tvFEC82kJboC3WuujZDSzr5-TvUWCT1EdE3zMp8oO5x34lA0y3Ci0FuZ1pPsYZjBG86spy98vsELUl4NeB0Wbw1k1WgfbafWAUMfeAefts4"/>
{/* Interactive Pins Overlay (Simulated) */}
<div className="absolute inset-0 pointer-events-none">
<div className="absolute top-1/4 left-1/3 w-4 h-4 bg-vibrant-blue border-2 border-white rounded-full animate-pulse-custom pointer-events-auto cursor-pointer"></div>
<div className="absolute top-1/2 left-2/3 w-4 h-4 bg-secondary border-2 border-white rounded-full animate-pulse-custom pointer-events-auto cursor-pointer" style="animation-delay: 0.5s"></div>
<div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-vibrant-blue border-2 border-white rounded-full animate-pulse-custom pointer-events-auto cursor-pointer" style="animation-delay: 1s"></div>
</div>
{/* Search Bar & View Toggle */}
<div className="absolute top-4 left-0 right-0 px-4 flex flex-col gap-3">
<div className="flex gap-2">
<div className="flex-1 glass-card !bg-white/95 rounded-full flex items-center px-4 py-2.5 shadow-lg">
<span className="material-symbols-outlined text-slate-400 mr-2">search</span>
<input className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-slate-700" placeholder="Search routes or cities..." type="text"/>
<span className="material-symbols-outlined text-vibrant-blue cursor-pointer">my_location</span>
</div>
<button className="glass-card !bg-white/95 w-11 h-11 flex items-center justify-center rounded-full shadow-lg">
<span className="material-symbols-outlined text-slate-700">layers</span>
</button>
</div>
</div>
{/* Float Map/List Toggle */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
<div className="glass-card !bg-slate-900/80 !backdrop-blur-xl p-1 rounded-full flex items-center shadow-2xl border border-white/20">
<button className="px-6 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest text-white/50 transition-all">List</button>
<button className="px-6 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest text-white bg-vibrant-blue shadow-lg shadow-vibrant-blue/30 transition-all">Map</button>
</div>
</div>
</div>
{/* Content Overlap */}
<div className="px-margin-mobile -mt-4 relative z-30">
{/* Section Header */}
<div className="flex flex-col gap-1 mb-6">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></span>
<span className="text-[10px] font-black uppercase tracking-[0.2em] text-electric-cyan">Real-time Available</span>
</div>
<h2 className="heading-font text-3xl font-extrabold text-white">Job Board</h2>
</div>
{/* Scrolling Filters */}
<div className="flex overflow-x-auto gap-3 pb-6 hide-scrollbar -mx-4 px-4">
<button className="flex items-center gap-2 bg-vibrant-blue text-white px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm shadow-xl shadow-vibrant-blue/20">
<span className="material-symbols-outlined text-lg">tune</span>
                Filter
            </button>
<button className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm hover:bg-white/20 transition-all">
                High Priority
            </button>
<button className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm hover:bg-white/20 transition-all">
                $100+ Pay
            </button>
<button className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm hover:bg-white/20 transition-all">
                Long Distance
            </button>
<button className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm hover:bg-white/20 transition-all">
                Local
            </button>
</div>
{/* Job Cards List */}
<div className="space-y-4">
{/* Featured Card */}
<div className="glass-card rounded-2xl overflow-hidden group">
<div className="p-6">
<div className="flex justify-between items-start mb-6">
<div className="bg-secondary text-white px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-secondary/20">
                            High Priority
                        </div>
<div className="text-right">
<p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated</p>
<p className="heading-font text-2xl font-black text-vibrant-blue">$142.50</p>
</div>
</div>
<div className="flex flex-col gap-4 mb-6">
<div className="flex gap-4">
<div className="flex flex-col items-center pt-1">
<span className="material-symbols-outlined text-vibrant-blue text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
<div className="w-px h-full border-l-2 border-dashed border-slate-300 my-1"></div>
</div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
<p className="text-sm font-extrabold text-slate-800">Port Logistics Center, Zone A</p>
<p className="text-xs font-medium text-slate-500">14:00 PM</p>
</div>
</div>
<div className="flex gap-4">
<span className="material-symbols-outlined text-red-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Dropoff</p>
<p className="text-sm font-extrabold text-slate-800">Central Distribution Hub</p>
<p className="text-xs font-medium text-slate-500">18:30 PM Deadline</p>
</div>
</div>
</div>
<div className="flex items-center justify-between pt-5 border-t border-slate-200/50">
<div className="flex gap-4">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-slate-400 text-lg">route</span>
<span className="text-xs font-bold text-slate-700">42.5 mi</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
<span className="text-xs font-bold text-slate-700">24 Pallets</span>
</div>
</div>
<button className="bg-vibrant-blue text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-vibrant-blue/30 hover:scale-105 transition-transform active:scale-95">
                            Quick Accept
                        </button>
</div>
</div>
</div>
{/* Standard Card */}
<div className="glass-card rounded-2xl p-5 hover:border-vibrant-blue/50 transition-colors">
<div className="flex justify-between items-center mb-4">
<p className="heading-font text-xl font-black text-slate-900">$65.00</p>
<span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">12.2 mi</span>
</div>
<div className="space-y-2.5 mb-5">
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-vibrant-blue"></span>
<span className="text-sm font-bold text-slate-700 truncate">Eastside Pharma Lab</span>
</div>
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-red-500"></span>
<span className="text-sm font-bold text-slate-700 truncate">Metro General Hospital</span>
</div>
</div>
<button className="w-full bg-white border border-vibrant-blue/30 text-vibrant-blue py-3 rounded-xl font-bold text-sm hover:bg-vibrant-blue hover:text-white transition-all">
                    Quick Accept
                </button>
</div>
{/* Standard Card 2 */}
<div className="glass-card rounded-2xl p-5">
<div className="flex justify-between items-center mb-4">
<p className="heading-font text-xl font-black text-slate-900">$88.20</p>
<span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">18.5 mi</span>
</div>
<div className="space-y-2.5 mb-5">
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-vibrant-blue"></span>
<span className="text-sm font-bold text-slate-700 truncate">Tech Park Gate 4</span>
</div>
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-red-500"></span>
<span className="text-sm font-bold text-slate-700 truncate">Downtown Retail Center</span>
</div>
</div>
<button className="w-full bg-white border border-vibrant-blue/30 text-vibrant-blue py-3 rounded-xl font-bold text-sm hover:bg-vibrant-blue hover:text-white transition-all">
                    Quick Accept
                </button>
</div>
</div>
</div>
</main>
{/* BottomNavBar (Mobile Only) */}
<nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center h-16 md:hidden glass-card rounded-2xl !bg-white/95">
<a className="flex flex-col items-center justify-center text-vibrant-blue scale-110 px-4" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Jobs</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4" href="#">
<span className="material-symbols-outlined">history</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4 relative" href="#">
<span className="material-symbols-outlined">notifications</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Alerts</span>
<div className="absolute top-1 right-3 w-2 h-2 bg-vibrant-blue rounded-full"></div>
</a>
<a className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4" href="#">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
</a>
</nav>


    </div>
  );
}
