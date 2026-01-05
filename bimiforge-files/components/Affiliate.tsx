import React from 'react';
import { Users, ArrowRight } from 'lucide-react';

export const Affiliate: React.FC = () => {
  return (
    <section id="affiliate" className="py-24 bg-brand-orange relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Partner with BIMI Forge
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
                Join our high-paying affiliate program. Earn 30% recurring commission on every agency or enterprise you refer.
            </p>
            <a 
                href="#" 
                className="inline-flex items-center px-8 py-4 bg-white text-brand-orange rounded-xl font-bold text-lg shadow-xl hover:bg-gray-50 transition-colors"
                onClick={(e) => e.preventDefault()} // Placeholder action
            >
                Become an Affiliate <ArrowRight className="ml-2 h-5 w-5" />
            </a>
        </div>
    </section>
  );
};