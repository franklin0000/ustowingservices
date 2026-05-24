import React from 'react';
import { Link } from 'react-router-dom';

export default function OnboardingSurveyMobile() {
  return (
    <div className="bg-background text-on-background h-full">
      
{/* Main Container */}
<main className="w-full max-w-lg glass-panel rounded-xl shadow-2xl overflow-hidden relative">
{/* Atmospheric background element */}
<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container opacity-20 rounded-full blur-3xl pointer-events-none"></div>
<div className="p-xl relative z-10">
{/* Header Section */}
<header className="mb-xl text-center md:text-left">
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary-fixed mb-xs">
                    Quick Question
                </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant opacity-80">
                    Help us match you with the best jobs.
                </p>
</header>
{/* Survey Content */}
<div className="space-y-xl">
{/* Satisfaction Section */}
<section className="space-y-md">
<h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                        How was your registration experience?
                    </h2>
<div className="flex justify-between items-center bg-surface-container-low/50 p-lg rounded-xl">
<button className="emoji-btn text-4xl grayscale hover:grayscale-0 focus:grayscale-0 focus:scale-125 transition-all outline-none" onclick="selectEmoji(this)" title="Angry">😠</button>
<button className="emoji-btn text-4xl grayscale hover:grayscale-0 focus:grayscale-0 focus:scale-125 transition-all outline-none" onclick="selectEmoji(this)" title="Dissatisfied">🙁</button>
<button className="emoji-btn text-4xl grayscale hover:grayscale-0 focus:grayscale-0 focus:scale-125 transition-all outline-none" onclick="selectEmoji(this)" title="Neutral">😐</button>
<button className="emoji-btn text-4xl grayscale hover:grayscale-0 focus:grayscale-0 focus:scale-125 transition-all outline-none" onclick="selectEmoji(this)" title="Satisfied">🙂</button>
<button className="emoji-btn text-4xl grayscale hover:grayscale-0 focus:grayscale-0 focus:scale-125 transition-all outline-none" onclick="selectEmoji(this)" title="Very Satisfied">😍</button>
</div>
</section>
{/* Job Preferences Section */}
<section className="space-y-md">
<h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                        Which types of jobs do you prefer?
                    </h2>
<div className="flex flex-wrap gap-sm">
<button className="px-lg py-sm rounded-full border border-outline text-label-md bg-surface-container-lowest hover:bg-surface-container-high transition-colors" onclick="toggleChip(this)">
                            Long distance
                        </button>
<button className="px-lg py-sm rounded-full border border-outline text-label-md bg-surface-container-lowest hover:bg-surface-container-high transition-colors" onclick="toggleChip(this)">
                            Local delivery
                        </button>
<button className="px-lg py-sm rounded-full border border-outline text-label-md bg-surface-container-lowest hover:bg-surface-container-high transition-colors" onclick="toggleChip(this)">
                            High value
                        </button>
<button className="px-lg py-sm rounded-full border border-outline text-label-md bg-surface-container-lowest hover:bg-surface-container-high transition-colors" onclick="toggleChip(this)">
                            Flexible hours
                        </button>
</div>
</section>
{/* Informational Graphic / Image */}
<div className="relative h-40 w-full rounded-xl overflow-hidden shadow-sm group">
<img alt="Logistics Fleet" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A professional fleet of high-end logistics delivery trucks parked in a modern, brightly lit warehouse facility during the golden hour. The sunlight filters through large glass panels, creating a warm, vibrant atmosphere with blue and purple lens flares. The scene reflects the DriveService brand's focus on efficiency, reliability, and technological advancement in modern transportation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBifb-ugAYtPDVLBzgoei6TMtOY4DCFIjm4QYUDFeCOK4vpMHlVePCiXgOcXGR1z_4g5SOAYhiFlSAcWJe8m_kj5KIENSQ-osiEsVQ-FCAmPG7AM82dpRN7IsyMmKl2a56KXKtYK-uwnxabU4DnLJKNr1CMDQgTlJ3ZfUlC_JpxJORCgQ0oroN8-4XwTo8t8P6fByEFr7rJSXi_vMh3eHLZMVQ7N75T3f2ngcxeY5N1C2-fpKcHGEckOW1wH2DzxU1SNL1cfLiPiVU"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-lg">
<span className="text-white font-label-md">Ready to hit the road?</span>
</div>
</div>
{/* Action Section */}
<footer className="pt-md flex flex-col gap-md items-center">
<button className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-lg rounded-lg shadow-lg hover:shadow-xl hover:bg-primary transition-all active:scale-[0.98]">
                        Finish &amp; Go to Jobs
                    </button>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
                        Skip for now
                    </a>
</footer>
</div>
</div>
</main>
{/* Interactive Logic */}


    </div>
  );
}
