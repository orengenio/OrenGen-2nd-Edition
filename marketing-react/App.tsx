import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuditModal from './components/AuditModal';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Marketplace from './pages/Marketplace';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Support from './pages/Support';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import CRM from './pages/CRM';
import WebDev from './pages/WebDev';
import LeadGen from './pages/LeadGen';
import Portfolio from './pages/Portfolio';
import SMTP from './pages/SMTP';
import VoiceLab from './pages/VoiceLab';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isVoiceLabMode, setIsVoiceLabMode] = useState(false);

  // SEO Mastermind: Dynamic Title Updater
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "Orengen.io | AI Systems That Support, Sell, and Scale",
      agents: "Buy-Lingual™ AI Agents | Neural Voice Tech by Orengen.io",
      marketplace: "AI Digital Arsenal | Automation Snapshots & Scripts",
      about: "About Us | The Visionaries Behind Orengen.io",
      solutions: "Business Automation Solutions | Elite Tech Stack",
      crm: "AI Infinite CRM | All-in-One Business Automation",
      webdev: "AI Web Development | High-Performance Websites by Orengen",
      leadgen: "AI Lead Generation | Automated Prospecting Systems",
      smtp: "Enterprise SMTP Infrastructure | Email Systems by Orengen",
      support: "Support Center | Orengen.io Resources & Help",
      legal: "Legal & Compliance | Privacy & Ethics at Orengen.io",
      admin: "Command Center | Orengen OS Admin",
      portfolio: "Portfolio | Results That Speak Volumes - Orengen.io",
      'voice-lab': "Voice Lab | Build & Test AI Agents",
    };
    document.title = titles[currentView] || "Orengen.io | AI & Tech Powerhouse";
    window.scrollTo(0, 0);
    
    // Check modes to hide/show main layout elements
    setIsAdminMode(currentView === 'admin');
    setIsVoiceLabMode(currentView === 'voice-lab');
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleTestCall = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Initiating demo call to ${testNumber}...`);
  };

  const renderView = () => {
    const content = () => {
        switch (currentView) {
          case 'home':
            return <Home onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'agents':
            return <Agents onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'marketplace':
            return <Marketplace onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'about':
            return <About onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'solutions':
            return <Solutions onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'crm':
            return <CRM onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'webdev':
            return <WebDev onOpenAudit={() => setIsAuditOpen(true)} onNavigate={handleNavigate} />;
          case 'leadgen':
            return <LeadGen onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'smtp':
            return <SMTP onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'support':
            return <Support onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'legal':
            return <Legal />;
          case 'portfolio':
            return <Portfolio onOpenAudit={() => setIsAuditOpen(true)} />;
          case 'admin':
            return <Admin onExit={() => setCurrentView('home')} />;
          case 'voice-lab':
            return <VoiceLab />;
          default:
            return <Home onOpenAudit={() => setIsAuditOpen(true)} />;
        }
    };

    return (
        <div key={currentView} className="animate-fade-in">
            {content()}
        </div>
    );
  };

  // Determine if we should show nav/footer/ticker
  const isImmersiveMode = isAdminMode || isVoiceLabMode;

  return (
    <div className={`min-h-screen bg-white dark:bg-brand-black text-gray-900 dark:text-white selection:bg-brand-orange selection:text-white transition-colors duration-300 ${isImmersiveMode ? 'bg-[#050505]' : ''}`}>
      
      {/* Navigation (Sidebar) - Hidden in Immersive Modes */}
      {!isImmersiveMode && <Navbar onNavigate={handleNavigate} currentPage={currentView} />}

      {/* Main Content Area */}
      <div className={`${!isImmersiveMode ? 'md:pl-72' : ''} flex flex-col min-h-screen transition-all duration-300 ease-in-out`}>
        
        {/* Top Ticker - Hidden in Immersive Modes */}
        {!isImmersiveMode && (
            <div className="bg-brand-black border-b border-brand-orange/30 sticky top-0 z-40">
                <div className="px-4 py-2 flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2 sm:gap-6 text-xs sm:text-sm text-white">
                <div className="flex items-center gap-2 animate-pulse whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                    <span className="font-bold tracking-widest text-brand-orange uppercase">Live AI Voice Demo</span>
                </div>
                
                <form onSubmit={handleTestCall} className="flex items-center gap-2 w-full sm:w-auto max-w-sm">
                    <input 
                        type="tel" 
                        placeholder="Phone number" 
                        value={testNumber}
                        onChange={(e) => setTestNumber(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange transition-colors w-full sm:w-40 text-xs"
                        aria-label="Phone number for demo"
                    />
                    <button type="submit" className="bg-brand-orange text-white font-bold px-3 py-1 rounded hover:bg-orange-600 transition-colors uppercase text-xs whitespace-nowrap">
                        Call Me
                    </button>
                </form>
                </div>
            </div>
        )}

        <main id="main-content" className="flex-grow w-full">
            {renderView()}
        </main>
        
        {!isImmersiveMode && <Footer onNavigate={handleNavigate} />}
      </div>
      
      {!isImmersiveMode && (
          <>
            <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
            <CookieConsent />
          </>
      )}
    </div>
  );
}

export default App;