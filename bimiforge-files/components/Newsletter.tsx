import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Shield, Bell, Lock, Loader2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
        // REPLACE with your actual newsletter API endpoint (e.g., GoHighLevel, Mailchimp, ConvertKit)
        const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID';
        
        // Simulating the fetch call structure for production
        // const response = await fetch(WEBHOOK_URL, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        
        // if (!response.ok) throw new Error('Subscription failed');

        // Artificial delay for UI feedback since endpoint is placeholder
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');
    } catch (error) {
        console.error('Newsletter Error:', error);
        setStatus('error');
        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-brand-darker border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] mix-blend-screen opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] mix-blend-screen opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden relative shadow-2xl">
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Copy */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-blue/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-brand-blue/30">
                  <Bell className="w-3 h-3 mr-2" />
                  Deliverability Weekly
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                  Don't let your emails <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
                    get lost in the void.
                  </span>
                </h2>
                <p className="text-lg text-slate-400 max-w-lg">
                  Join 12,000+ email marketers receiving weekly tips on BIMI compliance, DMARC enforcement, and increasing open rates.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Weekly SVG compliance hacks',
                  'DMARC policy updates & news',
                  'Exclusive deliverability case studies'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: The Form Card */}
            <div className="relative">
              <div id="ghl-newsletter-container" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative z-10 hover:border-brand-orange/30 transition-colors duration-300">
                
                {status === 'success' ? (
                  <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                    <p className="text-slate-400">Keep an eye on your inbox for the welcome kit.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center lg:text-left mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">Join the Inner Circle</h3>
                      <p className="text-sm text-slate-400">Zero spam. Unsubscribe at any time.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-brand-orange transition-colors" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="block w-full pl-11 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${
                           status === 'error' 
                           ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' 
                           : 'bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-orange-900/20 hover:-translate-y-1'
                        }`}
                      >
                        {status === 'loading' ? (
                          <>Processing... <Loader2 className="ml-2 h-5 w-5 animate-spin" /></>
                        ) : status === 'error' ? (
                           <>Try Again</>
                        ) : (
                          <>
                            Subscribe Free <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                      <Lock className="w-3 h-3" />
                      <span>Your data is secure. Powered by BIMI Forge.</span>
                    </div>
                  </form>
                )}
                
              </div>
              
              {/* Glow behind form */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-blue rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};