import React from 'react';
import { Link } from 'react-router-dom';

export default function RegistrationPlanMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      

<main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
{/* Stepper */}
<div className="flex items-center justify-between mb-xl max-w-2xl mx-auto">
<div className="flex flex-col items-center gap-xs">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center transition-colors" id="step-node-1">
<span className="font-label-md text-label-md">1</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface">Details</span>
</div>
<div className="flex-1 h-[2px] bg-outline-variant mx-4 mt-[-20px]">
<div className="h-full bg-primary w-0 transition-all duration-500" id="progress-1"></div>
</div>
<div className="flex flex-col items-center gap-xs">
<div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors" id="step-node-2">
<span className="font-label-md text-label-md">2</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Plan</span>
</div>
<div className="flex-1 h-[2px] bg-outline-variant mx-4 mt-[-20px]">
<div className="h-full bg-primary w-0 transition-all duration-500" id="progress-2"></div>
</div>
<div className="flex flex-col items-center gap-xs">
<div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors" id="step-node-3">
<span className="font-label-md text-label-md">3</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Finish</span>
</div>
</div>
{/* Form Containers */}
<div className="relative overflow-hidden min-h-[500px]">
{/* Step 1: Basic Details */}
<section className="step-transition w-full" id="step-1">
<div className="max-w-xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
<h2 className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md mb-md">Basic Details</h2>
<p className="font-body-md text-on-surface-variant mb-xl">Tell us a bit about yourself to get your driving career started.</p>
<form className="space-y-lg" onsubmit="event.preventDefault(); goToStep(2);">
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Full Name</label>
<input className="w-full p-md bg-transparent border border-outline rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="e.g. Alex Johnson" required="" type="text"/>
</div>
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Phone Number</label>
<input className="w-full p-md bg-transparent border border-outline rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="+1 (555) 000-0000" required="" type="tel"/>
</div>
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface">Email Address</label>
<input className="w-full p-md bg-transparent border border-outline rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="alex@example.com" required="" type="email"/>
</div>
<button className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors mt-xl" type="submit">
                            Continue to Plans
                        </button>
</form>
</div>
</section>
{/* Step 2: Plan Selection */}
<section className="step-transition w-full hidden translate-x-full absolute top-0" id="step-2">
<div className="max-w-3xl mx-auto">
<div className="text-center mb-xl">
<h2 className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md mb-xs">Choose Your Plan</h2>
<p className="font-body-md text-on-surface-variant">Select a flexible option that fits your schedule.</p>
</div>
<div className="grid md:grid-cols-2 gap-lg">
{/* Daily Plan */}
<div className="cursor-pointer bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary/50 transition-all group relative" id="plan-daily" onclick="selectPlan('daily')">
<div className="flex justify-between items-start mb-md">
<div>
<h3 className="font-headline-md text-headline-md text-primary">Daily</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">For occasional drivers</p>
</div>
<div className="text-right">
<span className="font-headline-md text-headline-md">$9</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">/day</span>
</div>
</div>
<ul className="space-y-sm mb-xl">
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    24-hour full access
                                </li>
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    Standard support
                                </li>
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    No long-term commitment
                                </li>
</ul>
<div className="absolute top-4 right-4 hidden group-[.plan-card-active]:block">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
</div>
{/* Monthly Plan */}
<div className="plan-card-active cursor-pointer bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-primary/50 transition-all group relative" id="plan-monthly" onclick="selectPlan('monthly')">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-sm py-xs rounded-full font-label-sm text-label-sm">
                                MOST POPULAR
                            </div>
<div className="flex justify-between items-start mb-md">
<div>
<h3 className="font-headline-md text-headline-md text-primary">Monthly</h3>
<p className="font-label-sm text-label-sm text-on-surface-variant">For career professionals</p>
</div>
<div className="text-right">
<span className="font-headline-md text-headline-md">$149</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">/mo</span>
</div>
</div>
<ul className="space-y-sm mb-xl">
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    Priority route matching
                                </li>
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    24/7 Dedicated support
                                </li>
<li className="flex items-center gap-sm font-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                    Fuel &amp; maintenance perks
                                </li>
</ul>
<div className="absolute top-4 right-4 hidden group-[.plan-card-active]:block">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
</div>
</div>
<div className="mt-xl flex flex-col md:flex-row gap-md">
<button className="flex-1 border border-outline text-primary py-md rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors" onclick="goToStep(1)">
                            Back
                        </button>
<button className="flex-[2] bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors" onclick="goToStep(3)">
                            Confirm Plan
                        </button>
</div>
</div>
</section>
{/* Step 3: Enable Notifications */}
<section className="step-transition w-full hidden translate-x-full absolute top-0" id="step-3">
<div className="max-w-xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="aspect-video w-full bg-primary-container relative">
<img className="w-full h-full object-cover mix-blend-overlay opacity-60" data-alt="A modern, high-tech conceptual illustration showing a digital interface with floating notification icons and glowing light trails. The scene is dominated by a deep corporate blue and vibrant cyan color palette, evoking a sense of real-time communication and efficient fleet management. The lighting is crisp and futuristic, emphasizing speed and reliability in a professional minimalist workspace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjRFjSVdxzq9ax3sx6i1Z352SV8X4GpJdlgxYUX2e5OTd1aHaPZ-OYFb1BcxXlrvM4CR6J0MuyJ_tLzckv1Vj60UmJYhc_TqknoSyIGSDSEn_zcbHzZT1Ck5K729Cb24EIxtZz1p3Xjc2lH5x6qeStqRabb5oL_AMR9ovjpOpVetzRLs8Q8cl7uczso1xpor_f-Xq1nA5RFrNDkZkDOnpnl797tjPufws0doJ7E_O1QtmuPyCHPj_hfvobD5OnxqvxRMP3uetT6JQ"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
<span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
</div>
</div>
</div>
<div className="p-lg text-center">
<h2 className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md mb-md">Stay Notified</h2>
<p className="font-body-md text-on-surface-variant mb-xl">
                            Don't miss out on high-priority jobs. Enable notifications to get real-time alerts about new deliveries and route updates.
                        </p>
<div className="flex flex-col gap-md">
<button className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md" onclick="completeRegistration()">
                                Enable Notifications
                            </button>
<button className="w-full text-on-surface-variant py-md rounded-lg font-label-md text-label-md hover:underline transition-all" onclick="completeRegistration()">
                                Skip for now
                            </button>
</div>
</div>
</div>
</section>
</div>
</main>
{/* BottomNavBar (Mobile Only) */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 md:hidden bg-surface dark:bg-inverse-surface border-t border-outline-variant dark:border-outline">
<div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 transition-transform active:scale-90">
<span className="material-symbols-outlined">work</span>
<span className="font-label-sm text-label-sm">Jobs</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 transition-transform active:scale-90">
<span className="material-symbols-outlined">history</span>
<span className="font-label-sm text-label-sm">History</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 transition-transform active:scale-90">
<span className="material-symbols-outlined">notifications</span>
<span className="font-label-sm text-label-sm">Alerts</span>
</div>
<div className="flex flex-col items-center justify-center bg-primary-container dark:bg-on-primary-fixed-variant text-on-primary-container dark:text-primary-fixed rounded-xl px-4 py-1 transition-transform">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</div>
</nav>


    </div>
  );
}
