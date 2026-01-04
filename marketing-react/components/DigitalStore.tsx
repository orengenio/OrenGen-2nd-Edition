import React, { useState } from 'react';
import { ShoppingBag, Mic, Database, Code, Zap, BookOpen, ArrowRight, Check } from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: string;
  category: 'Automation' | 'AI Agents' | 'Design' | 'Systems';
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: React.ElementType;
  popular?: boolean;
}

const DigitalStore: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 'snapshot-solar',
      category: 'Automation',
      title: 'Solar Sales AI Snapshot',
      description: 'Complete GHL ecosystem with pre-built funnels, automated text follow-ups, and booking workflows.',
      price: '$497',
      features: ['One-Click GHL Install', 'SMS & Email Drip Campaigns', 'Calendar Config'],
      icon: Database,
      popular: true
    },
    {
      id: 'script-shark',
      category: 'AI Agents',
      title: "The 'Shark' Sales Script",
      description: 'A meticulously crafted system prompt designed to handle objections and close deals on Bland AI or Vapi.',
      price: '$27',
      features: ['Objection Handling Logic', 'Tone & Pacing Directives', 'JSON Format'],
      icon: Mic
    },
    {
      id: 'blueprint-router',
      category: 'Automation',
      title: 'Universal Lead Router',
      description: 'Make.com blueprint that instantly verifies leads, adds them to CRM, and triggers a Voice AI call.',
      price: '$97',
      features: ['Make.com JSON Import', 'Error Handling Nodes', 'Webhook Setup Guide'],
      icon: Zap
    },
    {
      id: 'saas-starter',
      category: 'Design',
      title: 'Orengen SaaS Starter',
      description: 'The exact Next.js + Tailwind + Stripe stack we use. Save 40+ hours of setup time.',
      price: '$149',
      features: ['Next.js 14 App Router', 'Stripe Integration', 'Dark Mode Built-in'],
      icon: Code,
      popular: true
    },
    {
      id: 'ops-manual',
      category: 'Systems',
      title: 'AI Transformation Playbook',
      description: 'SOPs and legal templates for integrating AI agents into HR and Sales departments compliantly.',
      price: '$49',
      features: ['FCC Compliance Docs', 'Team Training SOPs', 'Implementation Timeline'],
      icon: BookOpen
    },
    {
      id: 'lp-template',
      category: 'Design',
      title: 'Disruptor Landing Page',
      description: 'High-converting React/Tailwind template featuring our signature "Dark Mode" aesthetic.',
      price: '$79',
      features: ['Fully Responsive', 'Framer Motion Animations', 'SEO Optimized'],
      icon: ShoppingBag
    }
  ];

  const categories = ['All', 'Automation', 'AI Agents', 'Design', 'Systems'];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <>
    <section id="assets" className="py-24 bg-gray-50 dark:bg-brand-black border-t border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-xs uppercase tracking-wider mb-4">
             <Zap size={12} /> Instant Scale
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900 dark:text-white mb-4">
            The Digital <span className="text-brand-orange">Arsenal</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Skip the build time. Deploy our proven enterprise-grade assets directly into your business infrastructure today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat
                  ? 'bg-brand-black dark:bg-white text-white dark:text-brand-black shadow-lg'
                  : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-brand-orange/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group relative bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col hover:border-brand-orange/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {product.popular && (
                <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                  Best Seller
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-brand-black dark:text-white mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                <product.icon size={24} />
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1 block">{product.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{product.title}</h3>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {product.description}
              </p>

              <div className="space-y-3 mb-8">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-300">
                    <Check size={14} className="text-brand-orange shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10 mt-auto">
                <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">{product.price}</span>
                <button className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-brand-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-orange dark:hover:bg-gray-200 transition-colors">
                  Get Access <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Looking for a custom enterprise solution?</p>
            <a href="#services" className="text-brand-orange font-bold hover:underline inline-flex items-center gap-1">
                View Full Service Options <ArrowRight size={14} />
            </a>
        </div>
      </div>
    </section>

    {/* Dedicated Product Page Overlay */}
    <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
    />
    </>
  );
};

export default DigitalStore;