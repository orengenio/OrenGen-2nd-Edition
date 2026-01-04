import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, Sun, Moon, Globe, 
  Layout, Users, Briefcase, ChevronDown, 
  Home, Zap, Phone, Command, Shield, Mail, Mic
} from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [solutionsOpen, setSolutionsOpen] = useState(true);
  
  // Theme Toggle Logic
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
    } else {
        setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
    } else {
        document.documentElement.classList.add('dark');
        setIsDark(true);
    }
  };

  const navItems = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Buy-Lingual™ Agents', view: 'agents', icon: MicIcon },
    { label: 'Voice Lab', view: 'voice-lab', icon: Mic },
    { label: 'Digital Assets', view: 'marketplace', icon: Zap },
  ];

  const solutions = [
    { label: 'Intelligent CRM', view: 'crm', icon: Briefcase },
    { label: 'Lead Generation', view: 'leadgen', icon: Users },
    { label: 'Web Development', view: 'webdev', icon: Layout },
    { label: 'Enterprise SMTP', view: 'smtp', icon: Mail },
  ];

  // Helper Icon Component
  function MicIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    )
  }

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar (Only visible on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-brand-black/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={() => handleNavClick('home')} className="h-8">
            <Logo className="h-full" />
        </button>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Directory (Fixed Left) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FAFAFA] dark:bg-[#050505] border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
            
            {/* Logo Area */}
            <div className="p-6 md:p-8 flex items-center justify-between md:justify-start">
                <button onClick={() => handleNavClick('home')}>
                    <Logo className="h-8 md:h-10" />
                </button>
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
                    <X size={20} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search Directory..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg leading-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange sm:text-sm transition-all shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-xs border border-gray-200 dark:border-white/10 rounded px-1.5 py-0.5 hidden md:block">⌘K</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Directory Links */}
            <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
                
                {/* Main Menu */}
                <div>
                    <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Main Menu
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button 
                                key={item.label} 
                                onClick={() => handleNavClick(item.view)}
                                className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${
                                    currentPage === item.view 
                                    ? 'bg-white dark:bg-white/5 text-brand-orange' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-brand-orange dark:hover:text-white'
                                }`}
                            >
                                <item.icon size={18} className={`mr-3 transition-colors ${currentPage === item.view ? 'text-brand-orange' : 'text-gray-400 group-hover:text-brand-orange'}`} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Solutions (Accordion Style) */}
                <div>
                     <button 
                        onClick={() => setSolutionsOpen(!solutionsOpen)}
                        className="w-full flex items-center justify-between px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-brand-orange transition-colors"
                    >
                        Solutions
                        <ChevronDown size={14} className={`transform transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {solutionsOpen && (
                        <nav className="space-y-1 ml-1 border-l border-gray-200 dark:border-white/5 pl-2 animate-fade-in">
                             {solutions.map((item) => (
                                <button 
                                    key={item.label} 
                                    onClick={() => handleNavClick(item.view)}
                                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${
                                        currentPage === item.view 
                                        ? 'text-brand-orange dark:text-white font-bold' 
                                        : 'text-gray-600 dark:text-gray-400 hover:text-brand-orange dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon size={16} className={`mr-3 transition-colors ${
                                        currentPage === item.view 
                                        ? 'text-brand-orange' 
                                        : 'text-gray-400 group-hover:text-brand-orange'
                                    }`} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>

                 {/* Status Card */}
                 <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-gray-100 to-white dark:from-white/5 dark:to-white/0 border border-gray-200 dark:border-white/5">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">Systems Operational</span>
                     </div>
                     <div className="text-[10px] text-gray-500">
                        v2.4.0 (Stable)
                     </div>
                 </div>

            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="flex items-center justify-between gap-2 mb-4">
                     <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors border border-gray-200 dark:border-white/5 shadow-sm"
                        title="Toggle Theme"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button 
                        onClick={() => handleNavClick('admin')}
                        className="p-2 rounded-lg bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors border border-gray-200 dark:border-white/5 shadow-sm"
                        title="Admin Command Center"
                    >
                        <Shield size={18} />
                    </button>
                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
                     <button className="p-2 rounded-lg bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors border border-gray-200 dark:border-white/5 shadow-sm">
                        <Command size={18} />
                    </button>
                </div>
                
                <a 
                    href="https://api.orengen.io/widget/groups/coffeedate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-black dark:bg-white text-white dark:text-brand-black px-4 py-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                    <Phone size={16} className="text-brand-orange fill-brand-orange" />
                    Book Strategy Call
                </a>
            </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;