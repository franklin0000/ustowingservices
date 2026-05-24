import React from 'react';
import { Link } from 'react-router-dom';

export default function ArrivalNotificationsMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      

<main className="max-w-md mx-auto px-margin-mobile py-lg">
{/* Section Header */}
<div className="flex items-center justify-between mb-lg">
<h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Alerts</h2>
<button className="font-label-md text-label-md text-primary hover:bg-surface-container-high transition-colors px-sm py-xs rounded-lg">
                Mark all as read
            </button>
</div>
{/* Notification Feed */}
<div className="space-y-sm">{/* Driver Arrival Notification */}
<div className="bg-surface border border-outline-variant rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer">
<div className="bg-secondary-container text-on-secondary-container p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="location_on">location_on</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">Arrival Confirmed</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">Just now</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Your arrival at 452 Broadway has been logged. Waiting for client.</p>
</div>
<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
</div>
{/* Client Arrival Notification */}
<div className="bg-surface border border-outline-variant rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer">
<div className="bg-secondary-container text-on-secondary-container p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="hail">hail</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">Driver Arrived</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">Just now</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Your driver is here at the pickup location. Look for Job #284-B.</p>
</div>
<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
</div>
{/* Job Completed Notification */}
<div className="bg-surface border border-outline-variant rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer">
<div className="bg-secondary-container text-on-secondary-container p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">Job Completed</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">2m ago</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Delivery to 124 Oak St successfully verified by client signature.</p>
</div>
<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
</div>
{/* New Bonus Available */}
<div className="bg-surface border border-outline-variant rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer">
<div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="military_tech" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">New Bonus Available</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">45m ago</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Complete 5 more rides tonight to unlock a $25 surge bonus.</p>
<div className="mt-sm">
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-3/5"></div>
</div>
<p className="font-label-sm text-label-sm text-primary mt-xs">3/5 Completed</p>
</div>
</div>
<div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
</div>
{/* Payment Received */}
<div className="bg-surface-container-low border border-transparent rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer opacity-80">
<div className="bg-primary-fixed text-on-primary-fixed-variant p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">Payment Received</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">2h ago</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Your weekly earnings of $842.50 have been deposited.</p>
</div>
</div>
{/* System Update */}
<div className="bg-surface-container-low border border-transparent rounded-xl p-lg flex gap-md items-start active:scale-[0.98] transition-transform cursor-pointer opacity-80">
<div className="bg-surface-variant text-on-surface-variant p-sm rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-label-md text-label-md text-on-surface">System Update</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">Yesterday</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">DriveService v2.4.0 is now live. Check out the new route optimization features.</p>
</div>
</div>
{/* Bonus Image Card (Visual Interest) */}
<div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mt-xl">
<img className="w-full h-full object-cover" data-alt="A clean, professional photograph of a modern service vehicle driving through a sleek, brightly lit city at dusk. The lighting is soft and cinematic, with a high-key blue and white palette that reflects efficiency and technological progress. The composition is dynamic, showing motion and reliability in a minimal urban setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl5L_jrevpBTR--zZNdhUPbAjyaE6qiaAcsfu0ea9yydie7oIECFHDFeoa8Y7kL7hC7GqKKF20Q_a_IFmcGT79UH_lbsegPqr08yw9cuNYZpVua3imAPovQbndl5R-B3QJqGQSdDu_-NUiwQVg1Ymqox73_jUy3L8fgO3QVa9jirmvG3lE7jcpBcCTPvk5nkBzNl4RTJBvi308hYLtwZjYogxJK1p6Zv9_6CVFWo-TRLaGMi5UQF1wnKr2wgbUfyDDiE546bXDBis"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-lg">
<span className="inline-block bg-secondary text-on-secondary font-label-sm text-label-sm px-sm py-xs rounded-full w-fit mb-xs">Promotion</span>
<h4 className="text-white font-headline-md text-headline-md">Earn 20% More</h4>
<p className="text-white/90 font-body-md text-body-md">During the weekend holiday peak hours.</p>
</div>
</div>
</div>
</main>



    </div>
  );
}
