import React from 'react';

interface CtaSectionProps {
  onOpenAudit: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onOpenAudit }) => {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-orange/90">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-blue rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
          Ready to Disrupt Your Market?
        </h2>
        <p className="text-white/90 text-lg md:text-2xl mb-12 max-w-2xl">
          Join the forward-thinking companies using Orengen's AI solutions. Get a comprehensive analysis of your business potential today.
        </p>
        
        <button 
            onClick={onOpenAudit}
            className="w-full sm:w-auto group relative bg-white text-brand-orange px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] hover:scale-105 transition-all duration-300"
        >
            <span className="flex items-center justify-center gap-3">
              Get Your Free Business Audit
              <span className="bg-brand-orange text-white rounded-full p-1 group-hover:rotate-45 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </span>
            </span>
        </button>

        <p className="mt-6 text-white/60 text-sm">
            Instant Analysis • No Credit Card Required
        </p>
      </div>
    </section>
  );
};

export default CtaSection;