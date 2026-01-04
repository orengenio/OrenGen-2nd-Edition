import React from 'react';
import { Star, Quote, TrendingUp } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "VP of Sales, TechGrowth",
      content: "The Buy-Lingual™ Agents completely transformed our inbound strategy. We're capturing 40% more leads during off-hours.",
      stars: 5
    },
    {
      name: "Marcus Thorne",
      role: "CEO, Thorne Real Estate",
      content: "I was skeptical about AI calling, but Orengen's system is undetectable. My team just wakes up to booked appointments.",
      stars: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Operations Director, LogiCorp",
      content: "Their CRM integration and website overhaul gave us the professional edge we needed to secure enterprise contracts.",
      stars: 5
    },
    {
      name: "David Chen",
      role: "Founder, Apex Solar",
      content: "Since implementing Orengen's lead gen systems, our cost per acquisition dropped by 60%. The ROI is undeniable.",
      stars: 5
    },
    {
      name: "James Wilson",
      role: "CMO, Wilson Legal Group",
      content: "The automated follow-ups are a game changer. No lead gets left behind, and our conversion rate has doubled in 3 months.",
      stars: 5
    },
    {
      name: "Priya Patel",
      role: "Director, HealthConnect",
      content: "We needed a solution that could handle bilingual patients. The Buy-Lingual agents switch languages flawlessly. Incredible tech.",
      stars: 5
    }
  ];

  const results = [
    "TechGrowth: +40% Leads",
    "Apex Solar: -60% CPA",
    "Thorne Real Estate: 150+ Appts/mo",
    "Wilson Legal: 2x Conversion",
    "LogiCorp: $2M Contract Secured",
    "HealthConnect: 98% Patient Sat."
  ];

  const stats = [
    { label: "Calls Handled", value: "1.2M+" },
    { label: "Leads Generated", value: "850k" },
    { label: "Client ROI", value: "300%" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-brand-black relative transition-colors duration-300 overflow-hidden">
       {/* Decorative */}
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
       
       {/* Result Ticker */}
       <div className="w-full bg-brand-orange/10 border-b border-brand-orange/20 py-3 mb-12 md:mb-16 overflow-hidden flex">
          <div className="animate-infinite-scroll flex gap-8 whitespace-nowrap">
             {results.map((r, i) => (
                 <div key={i} className="flex items-center gap-2 text-brand-orange font-bold text-xs md:text-sm uppercase tracking-wide">
                     <TrendingUp size={14} /> {r}
                 </div>
             ))}
              {results.map((r, i) => (
                 <div key={`dup-${i}`} className="flex items-center gap-2 text-brand-orange font-bold text-xs md:text-sm uppercase tracking-wide">
                     <TrendingUp size={14} /> {r}
                 </div>
             ))}
              {results.map((r, i) => (
                 <div key={`dup2-${i}`} className="flex items-center gap-2 text-brand-orange font-bold text-xs md:text-sm uppercase tracking-wide">
                     <TrendingUp size={14} /> {r}
                 </div>
             ))}
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mb-16 md:mb-20 border-b border-gray-200 dark:border-white/10 pb-12">
            {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                    <div className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 mb-2">
                        {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-brand-orange font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
          </div>

          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600 dark:text-gray-400">Join the hundreds of businesses scaling with Orengen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {testimonials.map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl relative shadow-lg dark:shadow-none hover:shadow-xl transition-shadow">
                    <Quote className="absolute top-4 right-4 text-gray-100 dark:text-white/10" size={32} />
                    <div className="flex gap-1 mb-4">
                        {[...Array(t.stars)].map((_, i) => (
                            <Star key={i} size={16} className="fill-brand-orange text-brand-orange" />
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10 min-h-[80px]">"{t.content}"</p>
                    <div className="border-t border-gray-100 dark:border-white/10 pt-4">
                        <div className="text-gray-900 dark:text-white font-bold">{t.name}</div>
                        <div className="text-brand-blue text-sm font-medium">{t.role}</div>
                    </div>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

export default Testimonials;