import React from 'react';
import { Link } from 'react-router-dom';

export default function JobRequestMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      

{/* Main Content Canvas */}
<main className="flex-1 relative overflow-hidden flex flex-col">
{/* Map Background Section */}
<div className="absolute inset-0 z-0 h-full w-full">
<img className="w-full h-full object-cover grayscale opacity-40" data-alt="A clean, high-contrast aerial map of a modern city grid with bright blue and white navigation lines highlighting a specific route. The aesthetic is professional and digital, featuring soft daylight lighting that ensures all street names and markers are highly legible. The visual style is minimalist, using a cool blue and gray color palette consistent with a tech-forward fleet management application." data-location="New York City" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbqybV1C95D5ShyDeHvYzNLAWUGv12zvTvFt4EHu9er6eGki6NQnL9jZR0LIFFUqLA4_UZZ627Nfr7rZHehQlrcs7nJlmkW5MG_sdpSF-0aNwJoYL6eOFu2SpmxQIY5sjN_ci76ecGEuu4rmB_4RO4D3wdqrxvQ90ZxK7yBpQfR3-NF2mZvkZQqlpqJXsKKT75RAA4VL5qenWSimf_2oZMjvNAL6E9YKjUTkX9z8OZFykfuse-5XVH8NotZSWn9y0S3WUxHOqNUlQ"/>
<div className="absolute inset-0 bg-map-overlay"></div>
</div>
{/* Job Notification UI */}
<div className="relative z-10 flex-1 flex flex-col justify-end p-margin-mobile pb-24">
{/* Floating Indicator */}
<div className="mx-auto mb-lg bg-primary-container text-on-primary-container px-lg py-sm rounded-full flex items-center gap-sm shadow-sm pulse-animation">
<span className="material-symbols-outlined text-body-md" data-icon="radar">radar</span>
<span className="font-label-md text-label-md">Searching for job...</span>
</div>
{/* New Job Request Card */}
<div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm w-full max-w-md mx-auto animate-in slide-in-from-bottom-10 duration-500">
<div className="flex justify-between items-start mb-lg">
<div>
<span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm">NEW REQUEST</span>
<h2 className="font-headline-md text-headline-md mt-sm">Job #284-B</h2>
</div>
<div className="text-right">
<p className="font-label-sm text-on-surface-variant">Estimated Earnings</p>
<p className="font-headline-md text-headline-md text-primary">$24.50</p>
</div>
</div>
{/* Job Details */}
<div className="space-y-lg mb-xl relative">
{/* Connector Line */}
<div className="absolute left-[11px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-outline-variant"></div>
<div className="flex items-start gap-md relative">
<div className="z-10 bg-primary w-6 h-6 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-white" data-icon="location_on" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
</div>
<div>
<p className="font-label-sm text-on-surface-variant">Pickup Location</p>
<p className="font-label-md text-label-md">452 Broadway, Manhattan</p>
</div>
</div>
<div className="flex items-start gap-md relative">
<div className="z-10 bg-on-surface w-6 h-6 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-white" data-icon="flag" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
</div>
<div>
<p className="font-label-sm text-on-surface-variant">Destination</p>
<p className="font-label-md text-label-md">Terminal 4, JFK Airport</p>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-md mb-xl border-t border-b border-outline-variant py-md">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary" data-icon="route">route</span>
<div>
<p className="font-label-sm text-on-surface-variant">Distance</p>
<p className="font-label-md text-label-md">3.2 miles</p>
</div>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-primary" data-icon="schedule">schedule</span>
<div>
<p className="font-label-sm text-on-surface-variant">Duration</p>
<p className="font-label-md text-label-md">14 mins</p>
</div>
</div>
</div>
{/* Action Buttons */}
<div className="flex flex-col gap-sm">
<button className="w-full bg-primary text-on-primary font-label-md text-label-md py-lg rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm" id="acceptBtn">
                        Accept Job
                    </button>
<button className="w-full border border-error text-error font-label-md text-label-md py-lg rounded-lg hover:bg-error-container/10 active:scale-95 transition-all">
                        Reject
                    </button>
</div>
</div>
</div>
</main>



    </div>
  );
}
