import React from 'react';
import { Link } from 'react-router-dom';

export default function DynamicRegistrationFlowMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      

<main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl pb-32">
{/* Stepper */}
<div className="flex items-center justify-between mb-xl max-w-2xl mx-auto relative z-10">
<div className="flex flex-col items-center gap-2 group">
<div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-lg shadow-xl shadow-primary/20 transition-all animate-float ring-4 ring-white/10" id="step-node-1">
                1
            </div>
<span className="text-xs font-bold uppercase tracking-wider text-white">Details</span>
</div>
<div className="flex-1 h-1 bg-white/20 mx-4 mt-[-28px] rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-white to-electric-cyan w-0 transition-all duration-700" id="progress-1"></div>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-12 h-12 rounded-full bg-white/20 text-white/60 flex items-center justify-center font-bold text-lg transition-all border border-white/20" id="step-node-2">
                2
            </div>
<span className="text-xs font-bold uppercase tracking-wider text-white/40">Plan</span>
</div>
<div className="flex-1 h-1 bg-white/20 mx-4 mt-[-28px] rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-white to-electric-cyan w-0 transition-all duration-700" id="progress-2"></div>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-12 h-12 rounded-full bg-white/20 text-white/60 flex items-center justify-center font-bold text-lg transition-all border border-white/20" id="step-node-3">
                3
            </div>
<span className="text-xs font-bold uppercase tracking-wider text-white/40">Finish</span>
</div>
</div>
{/* Form Containers */}
<div className="relative overflow-visible min-h-[500px]">
{/* Step 1: Basic Details */}
<section className="step-transition w-full animate-slide-up" id="step-1">
<div className="max-w-xl mx-auto glass-card rounded-xl p-8 md:p-10">
<h2 className="heading-font text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Basic Details</h2>
<p className="text-slate-600 mb-8 font-medium">Tell us a bit about yourself to get your driving career started.</p>
<form className="space-y-6" onsubmit="event.preventDefault(); goToStep(2);">
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
<input className="input-focus-effect w-full p-4 bg-white/50 border border-slate-200 rounded-xl focus:border-vibrant-blue focus:ring-0 outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="e.g. Alex Johnson" required="" type="text"/>
</div>
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
<input className="input-focus-effect w-full p-4 bg-white/50 border border-slate-200 rounded-xl focus:border-vibrant-blue focus:ring-0 outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="+1 (555) 000-0000" required="" type="tel"/>
</div>
<div className="space-y-2">
<label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
<input className="input-focus-effect w-full p-4 bg-white/50 border border-slate-200 rounded-xl focus:border-vibrant-blue focus:ring-0 outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="alex@example.com" required="" type="email"/>
</div>
<button className="shimmer-btn w-full bg-gradient-to-r from-vibrant-blue to-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all mt-8" type="submit">
                        Continue to Plans
                    </button>
</form>
</div>
</section>
{/* Step 2: Plan Selection */}
<section className="step-transition w-full hidden translate-x-full absolute top-0" id="step-2">
<div className="max-w-4xl mx-auto">
<div className="text-center mb-10">
<h2 className="heading-font text-3xl md:text-5xl font-extrabold text-white mb-4">Choose Your Plan</h2>
<p className="text-white/70 text-lg">Select a flexible option that fits your schedule.</p>
</div>
<div className="grid md:grid-cols-2 gap-8 px-4">
{/* Daily Plan */}
<div className="cursor-pointer glass-card !bg-white/90 border-transparent rounded-2xl p-8 hover:scale-[1.02] transition-all group relative" id="plan-daily" onclick="selectPlan('daily')">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="heading-font text-2xl font-bold text-primary">Daily</h3>
<p className="text-slate-500 font-medium">For occasional drivers</p>
</div>
<div className="text-right">
<span className="heading-font text-3xl font-extrabold text-slate-900">$9</span>
<span className="text-slate-500 font-bold">/day</span>
</div>
</div>
<ul className="space-y-4 mb-8">
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-secondary font-bold">check</span>
                                24-hour full access
                            </li>
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-secondary font-bold">check</span>
                                Standard support
                            </li>
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-secondary font-bold">check</span>
                                No long-term commitment
                            </li>
</ul>
<div className="plan-indicator absolute top-4 right-4 opacity-0 transition-opacity">
<span className="material-symbols-outlined text-vibrant-blue text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
</div>
{/* Monthly Plan */}
<div className="cursor-pointer glass-card !bg-white border-vibrant-blue/50 border-2 rounded-2xl p-8 hover:scale-[1.02] transition-all group relative" id="plan-monthly" onclick="selectPlan('monthly')">
<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary to-vibrant-blue text-white px-6 py-1 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">
                            MOST POPULAR
                        </div>
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="heading-font text-2xl font-bold text-primary">Monthly</h3>
<p className="text-slate-500 font-medium">For career professionals</p>
</div>
<div className="text-right">
<span className="heading-font text-3xl font-extrabold text-slate-900">$149</span>
<span className="text-slate-500 font-bold">/mo</span>
</div>
</div>
<ul className="space-y-4 mb-8">
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-vibrant-blue font-bold">verified</span>
                                Priority route matching
                            </li>
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-vibrant-blue font-bold">verified</span>
                                24/7 Dedicated support
                            </li>
<li className="flex items-center gap-3 text-slate-700 font-medium">
<span className="material-symbols-outlined text-vibrant-blue font-bold">verified</span>
                                Fuel &amp; maintenance perks
                            </li>
</ul>
<div className="plan-indicator absolute top-4 right-4 opacity-100 transition-opacity">
<span className="material-symbols-outlined text-vibrant-blue text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
</div>
</div>
<div className="mt-12 flex flex-col md:flex-row gap-4 px-4">
<button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-xl font-bold transition-all" onclick="goToStep(1)">
                        Back
                    </button>
<button className="shimmer-btn flex-[2] bg-gradient-to-r from-vibrant-blue to-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30" onclick="goToStep(3)">
                        Confirm Plan
                    </button>
</div>
</div>
</section>
{/* Step 3: Enable Notifications */}
<section className="step-transition w-full hidden translate-x-full absolute top-0" id="step-3">
<div className="max-w-xl mx-auto glass-card rounded-2xl overflow-hidden">
<div className="aspect-video w-full relative overflow-hidden">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjRFjSVdxzq9ax3sx6i1Z352SV8X4GpJdlgxYUX2e5OTd1aHaPZ-OYFb1BcxXlrvM4CR6J0MuyJ_tLzckv1Vj60UmJYhc_TqknoSyIGSDSEn_zcbHzZT1Ck5K729Cb24EIxtZz1p3Xjc2lH5x6qeStqRabb5oL_AMR9ovjpOpVetzRLs8Q8cl7uczso1xpor_f-Xq1nA5RFrNDkZkDOnpnl797tjPufws0doJ7E_O1QtmuPyCHPj_hfvobD5OnxqvxRMP3uetT6JQ"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-custom">
<span className="material-symbols-outlined text-vibrant-blue text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
</div>
</div>
</div>
<div className="p-10 text-center">
<h2 className="heading-font text-3xl font-extrabold text-slate-900 mb-4">Stay Notified</h2>
<p className="text-slate-600 font-medium mb-10 text-lg leading-relaxed">
                        Don't miss out on high-priority jobs. Enable notifications to get real-time alerts about new deliveries and route updates.
                    </p>
<div className="flex flex-col gap-4">
<button className="shimmer-btn w-full bg-vibrant-blue text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-vibrant-blue/30 hover:-translate-y-1 transition-all" onclick="completeRegistration()">
                            Enable Notifications
                        </button>
<button className="w-full text-slate-500 py-3 rounded-xl font-bold hover:text-vibrant-blue transition-all" onclick="completeRegistration()">
                            Skip for now
                        </button>
</div>
</div>
</div>
</section>
</div>
</main>
{/* BottomNavBar (Mobile Only) */}
<nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center h-16 md:hidden glass-card rounded-2xl !bg-white/90">
<div className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4">
<span className="material-symbols-outlined">work</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Jobs</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4">
<span className="material-symbols-outlined">history</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-400 transition-all hover:text-vibrant-blue active:scale-90 px-4 relative">
<span className="material-symbols-outlined">notifications</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Alerts</span>
<div className="absolute top-1 right-3 w-2 h-2 bg-vibrant-blue rounded-full"></div>
</div>
<div className="flex flex-col items-center justify-center text-vibrant-blue px-4 scale-110">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
</div>
</nav>


    </div>
  );
}
