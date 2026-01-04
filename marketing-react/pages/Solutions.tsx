import React from 'react';
import Services from '../components/Services';
import CaseStudies from '../components/CaseStudies';
import CtaSection from '../components/CtaSection';
import { Search, PenTool, Rocket, TrendingUp } from 'lucide-react';

const Solutions: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-brand-black">
        {/* Header */}
        <div className="bg-brand-black py-24 text-center px-4 relative overflow-hidden">
             <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none"></div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 relative z-10">Our <span className="text-brand-blue">Solutions</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg relative z-10">Comprehensive technological infrastructure for the modern enterprise.</p>
        </div>
        
        <Services />

        {/* Methodology / Process Section */}
        <section className="py-24 bg-gray-50 dark:bg-[#050505] border-y border-gray-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">The Orengen Methodology</h2>
                    <p className="text-gray-500">How we go from problem to profitable solution.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent z-0"></div>

                    {[
                        { step: "01", title: "Audit & Discovery", icon: Search, text: "We analyze your current infrastructure and identify automation bottlenecks." },
                        { step: "02", title: "Architect", icon: PenTool, text: "Our engineers design a custom stack involving AI agents, CRM, and Web." },
                        { step: "03", title: "Deploy", icon: Rocket, text: "We launch your systems with full team training and SOP implementation." },
                        { step: "04", title: "Scale", icon: TrendingUp, text: "Continuous optimization based on data analytics to maximize ROI." }
                    ].map((phase, i) => (
                        <div key={i} className="relative z-10 bg-white dark:bg-brand-gray p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg text-center group hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-brand-black dark:bg-white text-white dark:text-brand-black rounded-full flex items-center justify-center font-bold text-2xl mb-6 shadow-lg group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                <phase.icon size={28} />
                            </div>
                            <div className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2">Phase {phase.step}</div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">{phase.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{phase.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <CaseStudies />
        <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default Solutions;