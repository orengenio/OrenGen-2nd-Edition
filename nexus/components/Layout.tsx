import React, { useState } from 'react';
import { Link, Outlet, useRouter, useLocation } from '@tanstack/react-router';
import { NAV_ITEMS } from '../constants';
import { useNexus } from './NexusContext';
import TourGuide from './TourGuide';
import { Sun, Moon, Globe, Search, Bell, Menu, ChevronLeft, ChevronRight, X, HelpCircle, ShieldAlert, ChevronDown, ArrowLeft } from 'lucide-react';

const Layout: React.FC = () => {
  const { darkMode, toggleDarkMode, language, setLanguage, startTour, userRole } = useNexus();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const router = useRouter();
  const location = useLocation();

  const toggleSection = (section: string) => {
      setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderNavItems = (mobile: boolean) => {
    // Group items by section manually for rendering
    const groupedItems: Record<string, typeof NAV_ITEMS> = {};
    NAV_ITEMS.forEach(item => {
        const sec = item.section || 'other';
        if (!groupedItems[sec]) groupedItems[sec] = [];
        groupedItems[sec].push(item);
    });

    const sections = ['core', 'growth', 'federal', 'infrastructure', 'system'];

    return sections.map(section => {
        const items = groupedItems[section];
        if (!items) return null;
        
        const isCollapsed = collapsedSections[section];
        const sectionLabel = section.replace('_', ' ');

        return (
            <div key={section} className="mb-2">
                {(isSidebarOpen || mobile) && section !== 'core' && (
                    <button 
                        onClick={() => toggleSection(section)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-brand-primary transition-colors"
                    >
                        {sectionLabel}
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                    </button>
                )}
                
                <div className={`space-y-1 transition-all duration-300 overflow-hidden ${(isCollapsed && (isSidebarOpen || mobile)) ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                    {items.map(item => (
                        <Link
                            key={item.id}
                            id={`nav-${item.id.replace('/', '')}`}
                            to={item.id}
                            onClick={() => mobile && setIsMobileMenuOpen(false)}
                            activeProps={{ className: 'bg-brand-accent/10 text-brand-accent' }}
                            inactiveProps={{ className: 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800' }}
                            className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative
                            ${!isSidebarOpen && !mobile && 'justify-center'}
                            `}
                            title={!isSidebarOpen && !mobile ? item.label : ''}
                        >
                            <item.icon size={20} className="flex-shrink-0" />
                            {(isSidebarOpen || mobile) && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
                            
                            {!isSidebarOpen && !mobile && (
                                <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
                {(!isSidebarOpen && !mobile && section !== 'system') && <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-3"></div>}
            </div>
        );
    });
  };

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div className={`flex h-screen w-full transition-colors duration-200 overflow-hidden ${darkMode ? 'dark bg-brand-dark text-white' : 'bg-brand-light text-slate-900'}`}>
      
      <TourGuide />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`w-64 h-full shadow-2xl transition-colors duration-200 ${darkMode ? 'bg-slate-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
             <div className="h-16 flex items-center justify-between px-6 border-b border-inherit dark:border-slate-800 border-slate-200">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <span className="text-brand-accent">ORENGEN</span>
                    <span className="text-brand-primary dark:text-white">NEXUS</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
                    <X size={24} />
                </button>
            </div>
            <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                {renderNavItems(true)}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col flex-shrink-0 border-r transition-all duration-300 ease-in-out
            ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}
            ${isSidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        <div className={`h-16 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center'} border-b border-inherit`}>
          {isSidebarOpen ? (
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight whitespace-nowrap overflow-hidden">
                <span className="text-brand-accent">ORENGEN</span>
                <span className="text-brand-primary dark:text-white">NEXUS</span>
              </div>
          ) : (
             <div className="font-bold text-xl text-brand-accent">O</div>
          )}
        </div>

        <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
           {renderNavItems(false)}
        </nav>

        {/* Sidebar Toggle Button */}
        <div className="p-4 border-t border-inherit flex justify-end">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-6 border-b transition-colors duration-200 ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          
          <div className="flex items-center gap-4 flex-1">
            <button 
                className="lg:hidden p-2 -ml-2 text-slate-500"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Global Back Button Logic */}
            {!isDashboard && (
              <button 
                onClick={() => router.history.back()}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-1 group"
                title="Go Back"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>
            )}

            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Command Nexus..."
                className={`w-full pl-10 pr-4 py-2 rounded-md text-sm outline-none border transition-colors ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-brand-accent' 
                    : 'bg-slate-50 border-slate-200 focus:border-brand-primary'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-2">
            
            {userRole === 'super_admin' && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold animate-pulse">
                    <ShieldAlert size={14} /> SUPER ADMIN
                </div>
            )}

             {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
               <Globe size={16} />
               <select 
                 value={language} 
                 onChange={(e) => setLanguage(e.target.value)}
                 className="bg-transparent outline-none cursor-pointer"
               >
                 <option value="en">EN</option>
                 <option value="es">ES</option>
                 <option value="fr">FR</option>
               </select>
            </div>

            <button 
                onClick={startTour}
                className="flex items-center gap-1 text-slate-500 hover:text-brand-accent dark:text-slate-400 text-sm font-medium"
            >
              <HelpCircle size={20} />
              <span className="hidden sm:inline">Tour</span>
            </button>

            <button className="text-slate-500 hover:text-brand-accent dark:text-slate-400">
              <Bell size={20} />
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-brand-accent/20">
              {userRole === 'super_admin' ? 'SA' : 'ON'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 scroll-smooth w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;