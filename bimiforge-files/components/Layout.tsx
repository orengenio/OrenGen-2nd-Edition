import React, { useState, useEffect } from 'react';
import { ASSETS } from '../constants';
import { Menu, X, Sun, Moon, ArrowRight, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CookieConsent } from './CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(true); // Default to dark
    }

    // Check Auth Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (location.pathname === '/') {
       window.scrollTo(0,0);
    }
  }, [location]);

  const toggleTheme = () => setIsDark(!isDark);

  const MarqueeContent = () => (
    <div className="animate-scroll flex shrink-0 whitespace-nowrap min-w-full items-center">
      {[...Array(3)].map((_, i) => (
        <span key={i} className="mx-6 text-white font-bold uppercase tracking-widest text-xs md:text-sm flex items-center">
          The World's First and Only All-In-One BIMI Compliant Logo Generator
          <span className="ml-6 text-white/50">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/90 dark:bg-brand-darker/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 h-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/">
                <img 
                  src={isDark ? ASSETS.LOGO_DARK : ASSETS.LOGO_LIGHT} 
                  alt="BIMI Forge" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange transition-colors">
                Home
              </Link>
              <Link to="/#how-it-works" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange transition-colors">
                The Process
              </Link>
              <Link to="/#pricing" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange transition-colors">
                Pricing
              </Link>
              <Link to="/#affiliate" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange transition-colors">
                Affiliate
              </Link>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              
              <LanguageSwitcher />

              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                {isDark ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>

              {session ? (
                 <Link 
                   to="/workspace"
                   className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-white hover:text-brand-orange transition-colors"
                 >
                   <User className="w-5 h-5" />
                   <span className="uppercase">Account</span>
                 </Link>
              ) : (
                <>
                  <Link 
                    to="/workspace"
                    className="text-sm font-extrabold text-gray-700 dark:text-white hover:text-brand-orange uppercase transition-colors"
                  >
                    LOGIN
                  </Link>

                  <Link 
                    to="/workspace"
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-extrabold rounded-lg text-white bg-brand-orange hover:bg-orange-700 transition-all uppercase shadow-lg hover:shadow-orange-500/20"
                  >
                    SIGN UP FREE
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <LanguageSwitcher />
              <button onClick={toggleTheme} className="p-2">
                {isDark ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-brand-orange"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-base font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange">Home</Link>
              <Link to="/#how-it-works" className="block px-3 py-2 text-base font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange">The Process</Link>
              <Link to="/#pricing" className="block px-3 py-2 text-base font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange">Pricing</Link>
              <Link to="/#affiliate" className="block px-3 py-2 text-base font-bold text-gray-700 dark:text-gray-300 hover:text-brand-orange">Affiliate</Link>
              
              {session ? (
                 <Link to="/workspace" className="block w-full mt-4 text-center px-5 py-3 rounded-md text-base font-extrabold text-white bg-brand-orange hover:bg-orange-700 uppercase">
                   GO TO WORKSPACE
                 </Link>
              ) : (
                <>
                  <Link to="/workspace" className="block w-full mt-4 text-center px-5 py-3 rounded-md text-base font-extrabold text-white bg-brand-orange hover:bg-orange-700 uppercase">
                   SIGN UP FREE
                  </Link>
                  <Link to="/workspace" className="block w-full mt-2 text-center px-5 py-2 text-base font-extrabold text-gray-700 dark:text-white uppercase hover:text-brand-orange">
                    LOGIN
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Scrolling Banner - Positioned right under the header (top-20) */}
      <div className="fixed top-20 w-full z-40 bg-[#cc5500] h-10 flex items-center overflow-hidden shadow-md">
         <MarqueeContent />
         <MarqueeContent />
      </div>

      {/* Main Content - Increased padding-top to account for Header (80px) + Banner (40px) */}
      <main className="flex-grow pt-32">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-brand-dark border-t border-gray-200 dark:border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            
            {/* Column 1: COMPANY */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/story" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Our Story</Link></li>
                <li><Link to="/news" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">In The News</Link></li>
                <li><Link to="/why-us" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Why Choose Us</Link></li>
                <li><Link to="/#pricing" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Pricing</Link></li>
                <li><Link to="/#reviews" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Testimonials</Link></li>
                <li><Link to="/blog" className="text-sm font-bold text-brand-orange hover:text-orange-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Column 2: KNOWLEDGE CENTER */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Knowledge Center</h3>
              <ul className="space-y-3">
                <li><Link to="/quiz" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Knowledge Quiz</Link></li>
                <li><Link to="/history" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">BIMI History</Link></li>
                <li><Link to="/vmc" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">VMC Certification</Link></li>
                <li><Link to="/#faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">FAQ's</Link></li>
              </ul>
            </div>

            {/* Column 3: FREE TOOLS & RESOURCES */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Free Tools</h3>
              <ul className="space-y-3">
                <li><Link to="/check" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">BIMI Record Checker</Link></li>
                <li><Link to="/tools/spf" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">SPF Generator</Link></li>
                <li><Link to="/tools/dmarc" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">DMARC Generator</Link></li>
                <li><Link to="/tools/dkim" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">DKIM Key Generator</Link></li>
              </ul>
            </div>

            {/* Column 4: COMPANIES & MARKETPLACE */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Marketplace</h3>
              <ul className="space-y-3">
                <li>
                    <a href="https://orengen.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1">
                        OrenGen.io <ArrowRight className="w-3 h-3" />
                    </a>
                </li>
                <li>
                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1">
                        OrenGen Digital <ArrowRight className="w-3 h-3" />
                    </a>
                </li>
                <li>
                    <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1">
                        OrenGen Capital <ArrowRight className="w-3 h-3" />
                    </a>
                </li>
              </ul>
            </div>

            {/* Column 5: LEGAL & COMPLIANCE */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Legal & Compliance</h3>
              <ul className="space-y-3">
                <li><Link to="/sla" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Service Level Agreement</Link></li>
                <li><Link to="/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Security & Compliance</Link></li>
                <li><Link to="/dpa" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Data Processing Agreement</Link></li>
                <li><Link to="/refund" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">Refund Policy</Link></li>
                <li><Link to="/gdpr" className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">GDPR</Link></li>
              </ul>
            </div>
            
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} BIMI Forge. All rights reserved.
            </p>
            <span className="hidden md:inline text-gray-600 dark:text-gray-600">|</span>
            <Link to="/terms" className="text-gray-400 hover:text-brand-orange text-xs transition-colors">Terms of Service</Link>
            <span className="hidden md:inline text-gray-600 dark:text-gray-600">|</span>
            <Link to="/privacy" className="text-gray-400 hover:text-brand-orange text-xs transition-colors">Privacy Policy</Link>
          </div>
          
          <div className="mt-8 flex justify-center">
               <a 
                href="https://orengen.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity"
              >
                <img src={ASSETS.ORENGEN_ICON} alt="OrenGen" className="h-6 w-6" />
                <span className="text-[10px] font-bold text-gray-900 dark:text-white group-hover:text-brand-orange transition-colors">Another OrenGen Worldwide Product</span>
              </a>
          </div>

        </div>
      </footer>
      
      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};