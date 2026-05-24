import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      
{/* Hero Background Section */}
<div className="fixed inset-0 vibrant-gradient h-1/2 w-full z-0"></div>
{/* Main Content Wrapper */}
<main className="relative z-10 h-full px-margin-mobile">
{/* Header App Bar (TopAppBar Logic) */}
<header className="flex justify-between items-center w-full h-16 mb-4">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white drop-shadow-sm">DriveService</h1>
<div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
<img alt="Driver Profile" className="w-full h-full object-cover" data-alt="A professional headshot of a smiling driver in his 30s with a neat beard, wearing a high-quality navy blue polo shirt. The lighting is warm and natural, suggesting a sunrise or sunset in a clean suburban environment. The image is crisp with a shallow depth of field, emphasizing the driver's friendly and reliable expression against a softly blurred background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMnd0mW6pwGJvRv55B7DkRAIuOoyuZXfprD3mfn_8Ac3HcU0Z7X61ihrXwLwVaK5Fzu068fJGRd513EO2MnrRnjoClbOalgzWcf_jb6oOfqP7vaH_VxUk7KGTw7z3TAAE9-42VLgnM0Szyrd8NB1sUH0v3JqI8wHJrWmInU4MdHg1YQunLs-kfle8ggI4lh3q9lK3jJF5iT7d0DCT2OASyTc7U7URt_FS-KQdOdi7eSZfwNhFyPbYaUjjOqL98YtiliSF018x16bY"/>
</div>
</header>
{/* Profile Hero Section */}
<section className="glass-card rounded-xl p-lg mb-xl mt-4 flex flex-col items-center text-center shadow-lg">
<div className="relative mb-md">
<div className="w-24 h-24 rounded-full border-4 border-primary-container overflow-hidden shadow-xl">
<img alt="Driver Avatar" className="w-full h-full object-cover" data-alt="A detailed, vibrant close-up portrait of a professional driver with a warm, confident smile. He is positioned in the center against a modern, bright urban backdrop. The lighting is vibrant and high-energy, with blue and teal highlights reflecting off surfaces to match a high-tech transportation aesthetic. The overall mood is energetic, reliable, and professional." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfKtSlR5WDzP9Mtnwa0Pk6ErpZKhB4p4Yn3tu9LfH-wM2oUb_EHqORPD81kTAp5rhdlVR_5wBEX5Xc9VSzKEYhsvrOM2FO02O_0b-V49L0fQfAN0CoF6SJ7Y6WIYfFPL5EVi08A-NwAQqA3tnsFzAUm7-B7gcxJI5u4UjTcdJLfqdpksZXcBUN8LgRaGPChoHCmuwerJc0uGFnBHTyJJ_DfBo6qf1ihAYUH0XNeJ_tyGZlEa46wDmcanpuS8HO5EXXNwva-I_NNKg"/>
</div>
<div className="absolute bottom-0 right-0 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full flex items-center gap-xs shadow-md">
<span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="font-label-md text-label-md">4.92</span>
</div>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Marcus Sterling</h2>
<p className="font-body-md text-on-surface-variant mb-lg">Elite Partner • London, UK</p>
<div className="grid grid-cols-3 w-full gap-sm">
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg">
<span className="font-headline-md text-primary">1.2k</span>
<span className="font-label-sm text-on-surface-variant">Jobs</span>
</div>
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg">
<span className="font-headline-md text-primary">3y</span>
<span className="font-label-sm text-on-surface-variant">Tenure</span>
</div>
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg">
<span className="font-headline-md text-primary">98%</span>
<span className="font-label-sm text-on-surface-variant">Rating</span>
</div>
</div>
</section>
{/* Notification Settings Section */}
<section className="glass-card rounded-xl p-lg mb-xl shadow-md">
<div className="flex items-center gap-md mb-lg">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white">
<span className="material-symbols-outlined">notifications_active</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Notification Settings</h3>
</div>
<div className="space-y-lg">
{/* New Job Alerts */}
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">New Job Alerts</span>
<span className="font-body-md text-on-surface-variant text-[14px]">Instant pings for available rides</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only toggle-checkbox" type="checkbox"/>
<div className="toggle-label w-12 h-6 bg-outline-variant rounded-full transition-colors duration-200 ease-in-out">
<div className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
</div>
</label>
</div>
<div className="h-px bg-outline-variant opacity-30"></div>
{/* Payment Confirmations */}
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">Payment Confirmations</span>
<span className="font-body-md text-on-surface-variant text-[14px]">Updates on earnings and withdrawals</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only toggle-checkbox" type="checkbox"/>
<div className="toggle-label w-12 h-6 bg-outline-variant rounded-full transition-colors duration-200 ease-in-out">
<div className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
</div>
</label>
</div>
<div className="h-px bg-outline-variant opacity-30"></div>
{/* System Updates */}
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">System Updates</span>
<span className="font-body-md text-on-surface-variant text-[14px]">App maintenance and new feature news</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only toggle-checkbox" type="checkbox"/>
<div className="toggle-label w-12 h-6 bg-outline-variant rounded-full transition-colors duration-200 ease-in-out">
<div className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"></div>
</div>
</label>
</div>
</div>
</section>
{/* Account Actions */}
<section className="space-y-md">
<button className="w-full flex items-center justify-between p-lg glass-card rounded-xl text-on-surface font-label-md">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">security</span>
<span>Security &amp; Privacy</span>
</div>
<span className="material-symbols-outlined text-outline">chevron_right</span>
</button>
<button className="w-full flex items-center justify-between p-lg glass-card rounded-xl text-on-surface font-label-md">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">credit_card</span>
<span>Payout Methods</span>
</div>
<span className="material-symbols-outlined text-outline">chevron_right</span>
</button>
<button className="w-full flex items-center justify-center p-lg bg-surface border border-error text-error rounded-xl font-label-md mt-lg">
<span className="material-symbols-outlined mr-sm">logout</span>
                Logout
            </button>
</section>
</main>
{/* Bottom Navigation Bar (Mandatory Shell) */}
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-surface border-t border-outline-variant md:hidden">
{/* Jobs */}
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-highest transition-transform scale-95 active:scale-90">
<span className="material-symbols-outlined" data-icon="work">work</span>
<span className="font-label-sm text-label-sm">Jobs</span>
</div>
{/* History */}
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-highest transition-transform scale-95 active:scale-90">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-label-sm text-label-sm">History</span>
</div>
{/* Alerts */}
<div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-highest transition-transform scale-95 active:scale-90">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="font-label-sm text-label-sm">Alerts</span>
</div>
{/* Profile (Active) */}
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 transition-transform scale-95 active:scale-90">
<span className="material-symbols-outlined" data-icon="person" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
<span className="font-label-sm text-label-sm">Profile</span>
</div>
</nav>
{/* Desktop Navigation Drawer (Hidden on Mobile) */}
<aside className="fixed left-0 top-0 h-screen p-lg hidden md:flex flex-col w-72 bg-surface-container-low border-r border-outline-variant z-50">
<div className="mb-xl">
<span className="font-headline-md text-headline-md text-primary font-bold">DriveService</span>
</div>
<div className="flex items-center gap-md p-md mb-lg">
<div className="w-12 h-12 rounded-full overflow-hidden">
<img alt="Admin Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYU2mkbktU2MgCGsmBR0AACPE_aM8tY_Z6UfFM3I-b4Ld4Og4ro4J7g_F_bohqj7omSyoPkIm8WVaYMggmF4Y4WMWoT3BHXEb_mBlFzsBBsgTK8aafxooNXgDjO_O5GPg23bVYL6s4uynLjvuJS1C0-o4gGyNVoqI-AOnnO-9JE5eEFxCh4AsVAH4f4oxNsdWrBgvBPPbDc206oQZkBV-IZwcbb5YEmxtufg3np24xXuBK3tTQO1qI99nPuz8qQ66IxEQLmtIary0"/>
</div>
<div>
<p className="font-label-md text-on-surface">Admin Panel</p>
<p className="text-on-surface-variant text-xs">Fleet Manager</p>
</div>
</div>
<nav className="flex-col space-y-xs">
<div className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-md">Dashboard</span>
</div>
<div className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all">
<span className="material-symbols-outlined">list_alt</span>
<span className="font-label-md">Job Listings</span>
</div>
<div className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all">
<span className="material-symbols-outlined">bar_chart</span>
<span className="font-label-md">Analytics</span>
</div>
<div className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all">
<span className="material-symbols-outlined">receipt_long</span>
<span className="font-label-md">Service History</span>
</div>
<div className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all">
<span className="material-symbols-outlined">card_membership</span>
<span className="font-label-md">Subscriptions</span>
</div>
<div className="flex items-center gap-md p-md bg-primary-container text-on-primary-container rounded-lg font-bold transition-all">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
<span className="font-label-md">Settings</span>
</div>
</nav>
</aside>


    </div>
  );
}
