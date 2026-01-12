import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OpportunityFinder from './components/OpportunityFinder';
import ProposalGenerator from './components/ProposalGenerator';
import Pipeline from './components/Pipeline';
import Profile from './components/Profile';
import { Opportunity } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setActiveTab('proposals');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'opportunities':
        return <OpportunityFinder onSelect={handleSelectOpportunity} />;
      case 'pipeline':
        return <Pipeline />;
      case 'proposals':
        if (selectedOpportunity) {
            return <ProposalGenerator opportunity={selectedOpportunity} onBack={() => setSelectedOpportunity(null)} />;
        }
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No Opportunity Selected</h2>
                <p className="text-slate-400 mb-6">Select a contract from the Finder to generate a proposal.</p>
                <button 
                    onClick={() => setActiveTab('opportunities')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Go to Finder
                </button>
            </div>
        );
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
