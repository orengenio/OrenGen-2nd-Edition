import React, { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': any;
    }
  }
}

export const Pricing: React.FC = () => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePlanClick = (index: number) => {
    setLoading(true);
    // Map plans to tables based on index
    // Plans 0 (Nube) & 1 (Starter) -> Table 1 (Left/One-Time)
    // Plans 2 (Pro) & 3 (Premium) -> Table 2 (Right/Subscription)
    if (index < 2) {
      setSelectedTableId("prctbl_1SkIzhFwNooeR24SqWdlTu5G");
    } else {
      setSelectedTableId("prctbl_1SkJ4aFwNooeR24S2hbIxsWA");
    }
    
    // Small delay to ensure modal transition is smooth
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <section id="pricing" className="py-24 bg-brand-darker relative overflow-hidden scroll-mt-24">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Product Demo Video */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 aspect-video group">
             <video 
                src="https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6956c8d3748303574a88db04.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
             />
             <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-3xl"></div>
          </div>
          <div className="text-center mt-4">
             <p className="text-sm text-gray-400 font-medium">See the BIMI Forge engine in real-time</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-900/30 border border-brand-orange/30 text-brand-orange text-xs font-bold tracking-wider uppercase mb-6">
            LOCK IN FOUNDERS PRICING BEFORE IT INCREASES
          </div>
          <h2 className="font-black tracking-widest text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-2xl text-white">
            Scale Your Brand <span className="text-brand-orange">Presence.</span>
          </h2>
          <p className="text-xl text-gray-400">
            Choose your tier. Lock in founder pricing <span className="text-white font-semibold underline decoration-brand-orange decoration-2 underline-offset-4">forever</span>.
          </p>
        </div>

        {/* 4 Column Custom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan, idx) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-brand-orange shadow-2xl shadow-brand-orange/20 scale-105 z-10' 
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <p className="mt-4 text-sm text-gray-400 min-h-[40px]">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="h-5 w-5 text-brand-orange shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(idx)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight || plan.cta === 'Buy Now' || plan.cta === 'Subscribe'
                    ? 'bg-brand-orange hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Modal */}
      {selectedTableId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950">
               <h3 className="font-bold text-gray-900 dark:text-white">Complete Secure Checkout</h3>
               <button 
                 onClick={() => setSelectedTableId(null)} 
                 className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-200 dark:bg-slate-800 rounded-full transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-slate-900">
              {loading && (
                 <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                 </div>
              )}
              {/* @ts-ignore */}
              <stripe-pricing-table 
                pricing-table-id={selectedTableId}
                publishable-key="pk_live_51QqyMyFwNooeR24SYxrxndDGzCUT1VcH4XkW3eqMrFofCH2kMpgMepil922xMFQtgFEB977yyW7tgrFsEc4sBnbP00Xh0MYZy3"
              >
              {/* @ts-ignore */}
              </stripe-pricing-table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};