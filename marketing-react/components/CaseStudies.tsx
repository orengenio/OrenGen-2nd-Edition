import React from 'react';
import { ArrowRight, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const CaseStudies: React.FC = () => {
  const studies = [
    {
      company: "TechGrowth Solutions",
      industry: "SaaS / B2B",
      metric: "+40% Lead Vol",
      description: "How TechGrowth utilized our Buy-Lingual™ agents to capture international leads during off-hours, resulting in a massive pipeline expansion.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
      company: "Apex Solar",
      industry: "Renewable Energy",
      metric: "-60% CPA",
      description: "By implementing our automated lead nurturing workflows, Apex Solar slashed their Cost Per Acquisition while doubling appointment set rates.",
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    },
    {
      company: "LogiCorp",
      industry: "Logistics",
      metric: "$2M Revenue",
      description: "A complete digital infrastructure overhaul, including intelligent CRM and predictive analytics, helped LogiCorp secure a major enterprise contract.",
      icon: PieChart,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-xs uppercase tracking-wider mb-4">
            <BarChart3 size={12} /> Real Results
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Client <span className="text-brand-orange">Success Stories</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how forward-thinking companies are using Orengen to disrupt their markets and achieve exponential growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studies.map((study, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-brand-orange/30 transition-all duration-300 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-brand-blue/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src={study.image} 
                  alt={study.company} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-black dark:text-white border border-white/20">
                  {study.industry}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{study.company}</h3>
                    <div className="flex items-center gap-1 text-brand-orange font-bold text-sm bg-brand-orange/10 px-2 py-1 rounded">
                        <TrendingUp size={14} /> {study.metric}
                    </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {study.description}
                </p>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-orange transition-colors mt-auto">
                  Read Case Study <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;