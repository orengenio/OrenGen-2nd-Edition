import React, { useState } from 'react';
import { Pipeline } from './components/Dashboard'; // Formerly Dashboard
import { LeadFinder } from './components/LeadFinder';
import { LiveAgent } from './components/LiveAgent';
import { EmailAccounts } from './components/EmailAccounts';
import { EmailCampaigns } from './components/EmailCampaigns';
import { Onebox } from './components/Onebox';
import { Analytics } from './components/Analytics';
import { BlacklistMonitor } from './components/BlacklistMonitor';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { ViewState, Lead } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.PIPELINE);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads(prev => [...newLeads, ...prev]);
    setCurrentView(ViewState.PIPELINE); // Redirect to pipeline after adding
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-sans selection:bg-blue-500/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
        
        {/* Only show the top fade overlay if NOT in Onebox view (Onebox handles its own layout) */}
        {currentView !== ViewState.ONEBOX && (
           <div className="fixed top-0 left-64 right-0 h-8 bg-gradient-to-b from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
        )}

        <div className={currentView === ViewState.ONEBOX ? "h-full" : "max-w-7xl mx-auto pb-12"}>
            {currentView === ViewState.FINDER && (
                <LeadFinder onAddLeads={handleAddLeads} />
            )}

            {currentView === ViewState.PIPELINE && (
                <Pipeline 
                    leads={leads} 
                    onUpdateLead={handleUpdateLead} 
                    onSetLeads={setLeads}
                />
            )}

            {currentView === ViewState.ONEBOX && (
                <Onebox />
            )}
            
            {currentView === ViewState.EMAIL_CAMPAIGNS && (
                <EmailCampaigns />
            )}

            {currentView === ViewState.EMAIL_ACCOUNTS && (
                <EmailAccounts />
            )}

            {currentView === ViewState.ANALYTICS && (
                <Analytics />
            )}
            
            {currentView === ViewState.BLACKLIST_MONITOR && (
                <BlacklistMonitor />
            )}

            {currentView === ViewState.LIVE_AGENT && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">AI Employee & Router</h2>
                        <p className="text-slate-400">The central nervous system for routing calls, emails, and tasks.</p>
                    </div>
                    <LiveAgent />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <i className="ph-duotone ph-address-book text-3xl text-blue-400 mb-3"></i>
                            <h3 className="font-bold text-white mb-1">List Loader</h3>
                            <p className="text-sm text-slate-400">Sync with the Pipeline to auto-dial qualified leads.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <i className="ph-duotone ph-scroll text-3xl text-purple-400 mb-3"></i>
                            <h3 className="font-bold text-white mb-1">Script Strategy</h3>
                            <p className="text-sm text-slate-400">Agent uses Gemini Thinking model to adapt scripts dynamically.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <i className="ph-duotone ph-record text-3xl text-red-400 mb-3"></i>
                            <h3 className="font-bold text-white mb-1">Call Recording</h3>
                            <p className="text-sm text-slate-400">All calls are transcribed and pushed to your CRM automatically.</p>
                        </div>
                    </div>
                </div>
            )}

            {currentView === ViewState.SETTINGS && <Settings />}
        </div>
      </main>
    </div>
  );
}