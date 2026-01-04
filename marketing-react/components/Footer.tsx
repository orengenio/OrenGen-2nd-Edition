import React from 'react';
import Logo from './Logo';
import { Linkedin, Twitter, Instagram, Facebook, Github, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const links = {
    company: [
      { name: "Our Portfolio", view: "portfolio" },
      { name: "Team", view: "about" },
      { name: "In The News", view: "about" },
      { name: "Why Choose Us", view: "solutions" }
    ],
    resources: [
      { name: "Client Testimonials", view: "about" },
      { name: "Blog", view: "#" },
      { name: "Sitemap", view: "#" },
      { name: "Opportunities", view: "about" },
      { name: "Become An Affiliate", view: "#" },
      { name: "Partnerships", view: "about" },
      { name: "Investors", view: "about" }
    ],
    support: [
      { name: "Work From Home Programs", view: "support" },
      { name: "Knowledge Base", view: "support" },
      { name: "Getting Started", view: "support" },
      { name: "Setup & Installation", view: "support" },
      { name: "AI Agent Guides", view: "agents" },
      { name: "FAQ's", view: "support" }
    ],
    marketplace: [
      { name: "Browse All Assets", view: "marketplace" },
      { name: "Top Sellers", view: "marketplace" },
      { name: "Automation Templates", view: "marketplace" },
      { name: "AI Scripts & Prompts", view: "marketplace" },
      { name: "Consulting Packages", view: "solutions" },
      { name: "Custom Dev", view: "solutions" },
      { name: "Enterprise SMTP", view: "smtp" }
    ],
    legal: [
      { name: "Compliance", view: "legal" },
      { name: "Copyright Notice", view: "legal" },
      { name: "Trademark Policy", view: "legal" },
      { name: "Cookie Policy", view: "legal" },
      { name: "Refund Policy", view: "legal" },
      { name: "Anti-Spam Compliance", view: "legal" },
      { name: "Affiliate Disclaimer", view: "legal" },
      { name: "Trust & Security", view: "legal" }
    ]
  };

  return (
    <footer className="bg-gray-100 dark:bg-brand-dark border-t border-gray-200 dark:border-white/10 pt-16 md:pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="mb-16 md:mb-20 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg text-center md:text-left">
                <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">Subscribe to our Intelligence Brief</h3>
                <p className="text-gray-600 dark:text-gray-400">Get the latest on AI trends, Orengen updates, and strategies to scale.</p>
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
                <form className="flex flex-col sm:flex-row gap-3 w-full">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-white/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-orange w-full sm:w-64"
                    />
                    <button className="bg-brand-orange text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                        Subscribe <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 mb-12 md:mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo className="h-8 md:h-10 mb-6" />
            <p className="text-gray-600 dark:text-gray-500 text-sm mb-6 leading-relaxed max-w-sm">
              Orengen.io is a premier AI & Technology firm dedicated to disrupting traditional workflows through intelligent automation.
            </p>
            <div className="flex gap-3 flex-wrap mb-8">
              <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Instagram size={16} />
              </a>
               <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Github size={16} />
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {links.company.map((item) => (
                <li key={item.name}>
                    <button onClick={() => onNavigate(item.view)} className="hover:text-brand-orange transition-colors text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-wider">Marketplace</h4>
             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {links.marketplace.map((item) => (
                <li key={item.name}>
                    <button onClick={() => onNavigate(item.view)} className="hover:text-brand-orange transition-colors text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-wider">Support</h4>
             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {links.support.map((item) => (
                <li key={item.name}>
                    <button onClick={() => onNavigate(item.view)} className="hover:text-brand-orange transition-colors text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-wider">Legal</h4>
             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {links.legal.map((item) => (
                <li key={item.name}>
                    <button onClick={() => onNavigate(item.view)} className="hover:text-brand-orange transition-colors text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© Copyright 2025. OrenGen Worldwide. All Rights Reserved.</p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <button onClick={() => onNavigate('legal')} className="hover:text-gray-900 dark:hover:text-white transition-colors">AI-Communications Opt-In</button>
            <span className="hidden md:inline">|</span>
            <button onClick={() => onNavigate('legal')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</button>
            <span className="hidden md:inline">|</span>
            <button onClick={() => onNavigate('legal')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;