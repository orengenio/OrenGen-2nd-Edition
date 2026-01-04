import React from 'react';
import { Layout, Users, Zap, Database, Briefcase } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: "Custom Web Development",
      description: "We don't just build websites; we build digital empires. High-performance, SEO-optimized, and visually stunning architectures designed to convert visitors into loyal clients.",
      icon: Layout,
      color: "blue"
    },
    {
      title: "Strategic Lead Generation",
      description: "Fuel your sales pipeline with high-intent leads. Our AI-driven targeting ensures you speak to decision-makers, not gatekeepers.",
      icon: Users,
      color: "orange"
    },
    {
      title: "Intelligent CRM",
      description: "Centralize your operations with our robust CRM. Automate follow-ups, track pipeline velocity, and manage customer relationships effortlessly.",
      icon: Briefcase,
      color: "orange"
    },
    {
      title: "Data Analytics & AI",
      description: "Turn raw data into actionable intelligence. We implement predictive analytics to help you forecast trends and stay ahead of the curve.",
      icon: Database,
      color: "blue"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-brand-dark relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Total Tech <span className="text-brand-blue">Solutions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From foundation to scale, Orengen provides the technological infrastructure required for modern business dominance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-lg dark:hover:shadow-none"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${service.color === 'orange' ? 'bg-brand-orange' : 'bg-brand-blue'} transition-all duration-300 group-hover:w-2`}></div>
              
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${service.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'}`}>
                <service.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              <a href="#" className="inline-flex items-center text-xs font-bold uppercase tracking-wide text-brand-black dark:text-white group-hover:text-brand-blue transition-colors mt-auto">
                Learn More <Zap size={14} className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;