import React from 'react';
import { REVIEW_LINKS } from '../constants';
import { Star } from 'lucide-react';

const Stars = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-3 h-3 text-brand-orange fill-brand-orange" />
    ))}
  </div>
);

export const Reviews: React.FC = () => {
  const platforms = [
    { name: 'Google', url: REVIEW_LINKS.GOOGLE },
    { name: 'Trustpilot', url: REVIEW_LINKS.TRUSTPILOT },
    { name: 'G2', url: REVIEW_LINKS.G2 },
    { name: 'Capterra', url: REVIEW_LINKS.CAPTERRA },
    { name: 'SiteJabber', url: REVIEW_LINKS.SITEJABBER },
    { name: 'Clutch', url: REVIEW_LINKS.CLUTCH },
    { name: 'Facebook', url: REVIEW_LINKS.FACEBOOK },
    { name: 'Product Hunt', url: REVIEW_LINKS.PRODUCT_HUNT },
  ];

  return (
    <section className="bg-gray-50 dark:bg-brand-dark border-t border-gray-200 dark:border-white/5 py-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">
            Trusted by Business Owners & Email Delivery Professionals Worldwide
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
             
             {/* BBB Badge - Prominent */}
             <a 
               href={REVIEW_LINKS.BBB} 
               target="_blank" 
               rel="noopener noreferrer"
               className="transition-transform hover:scale-105"
               title="Check out our BBB Reviews"
             >
                <img src={REVIEW_LINKS.BBB_BADGE} alt="BBB Accredited Business" className="h-14 w-auto" />
             </a>

             {/* Divider for desktop */}
             <div className="hidden md:block w-px h-10 bg-gray-300 dark:bg-gray-700 mx-2"></div>

             {/* Links Grid */}
             {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hover:border-brand-orange/50 dark:hover:border-brand-orange/50 hover:shadow-lg transition-all duration-300"
                >
                   <span className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-brand-orange transition-colors">{p.name}</span>
                   <Stars />
                </a>
             ))}
          </div>
       </div>
    </section>
  );
};