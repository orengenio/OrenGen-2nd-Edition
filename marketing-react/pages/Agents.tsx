import React from 'react';
import { Mic, Globe, Cpu, Check, Play, MessageSquare, PhoneCall, Building2, Stethoscope, ShoppingCart, Gavel } from 'lucide-react';
import CtaSection from '../components/CtaSection';

const Agents: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent"></div>
        <div className="absolute right-0 top-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
            <Mic size={14} /> Neural Voice Engine V4.0
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase">
            The Voice of <br /><span className="text-brand-orange">Your Business</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Deploy hyper-realistic AI agents that handle support, sales, and scheduling 24/7. 
            Indistinguishable from human staff.
          </p>
          <a 
            href="https://api.orengen.io/widget/groups/coffeedate"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] inline-block"
          >
            Book Agent Strategy Call
          </a>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24 bg-white dark:bg-brand-gray border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Core Capabilities</h2>
                <p className="text-gray-500">More than just a chatbot. A complete workforce.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Inbound Receptionist", icon: MessageSquare, desc: "Answers every call, routes leads, and answers FAQs instantly with zero hold time." },
                    { title: "Outbound SDR", icon: PhoneCall, desc: "Cold calls leads, qualifies interest, and books appointments directly on your calendar." },
                    { title: "Multilingual Support", icon: Globe, desc: "Real-time translation in English, Spanish, French, and Portuguese without missing a beat." }
                ].map((item, idx) => (
                    <div key={idx} className="group bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-brand-orange/50 transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-brand-orange/20 text-brand-orange rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Industries Section (NEW) */}
      <section className="py-24 bg-brand-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Industries We <span className="text-brand-blue">Dominate</span></h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                       { name: "Real Estate", icon: Building2, desc: "ISA agents that qualify buyers and book showings instantly." },
                       { name: "Healthcare", icon: Stethoscope, desc: "HIPAA-compliant appointment reminders and patient intake." },
                       { name: "E-Commerce", icon: ShoppingCart, desc: "Abandoned cart recovery calls and order status updates." },
                       { name: "Legal", icon: Gavel, desc: "Client intake for law firms, filtering qualified cases 24/7." }
                   ].map((ind, i) => (
                       <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                           <ind.icon className="text-brand-blue mb-4" size={32} />
                           <h3 className="text-xl font-bold text-white mb-2">{ind.name}</h3>
                           <p className="text-gray-400 text-sm">{ind.desc}</p>
                       </div>
                   ))}
               </div>
          </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-gray-100 dark:bg-black">
          <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-center text-4xl font-display font-bold text-gray-900 dark:text-white mb-16">Human vs. AI Workforce</h2>
              <div className="bg-white dark:bg-brand-gray rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10">
                  <div className="grid grid-cols-3 bg-gray-50 dark:bg-white/5 p-6 border-b border-gray-200 dark:border-white/10 font-bold text-gray-900 dark:text-white text-lg">
                      <div>Metric</div>
                      <div className="text-center text-gray-500">Traditional Hire</div>
                      <div className="text-center text-brand-orange">Orengen AI</div>
                  </div>
                  {[
                      { metric: "Availability", human: "8 hours/day", ai: "24/7/365" },
                      { metric: "Cost Per Month", human: "$3,000 - $5,000", ai: "$97 - $497" },
                      { metric: "Training Time", human: "2-4 Weeks", ai: "Instant" },
                      { metric: "Concurrent Calls", human: "1 at a time", ai: "Unlimited" },
                      { metric: "Language Skills", human: "Usually Monolingual", ai: "Fluent in 5+ Langs" }
                  ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 p-6 border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <div className="font-bold text-gray-700 dark:text-gray-300">{row.metric}</div>
                          <div className="text-center text-gray-500">{row.human}</div>
                          <div className="text-center text-brand-orange font-bold flex justify-center items-center gap-2">
                              {row.ai} <Check size={16} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default Agents;