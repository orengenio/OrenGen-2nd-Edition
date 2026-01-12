import React, { useState } from 'react';
import { View } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CampaignWizard } from './components/CampaignWizard';
import { ContentStudio } from './components/ContentStudio';
import { IntelligenceHub } from './components/IntelligenceHub';
import { LiveVoice } from './components/LiveVoice';
import { AgentOrchestrator } from './components/AgentOrchestrator';
import { Bot, X, Send } from 'lucide-react';
import { createChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Hello! I am your Gemini 3.0 Pro assistant. How can I help with your marketing today?' }
  ]);
  
  // Persistent chat session ref would go here in a real app,
  // For demo we re-init or use a context, but here we just use the service function directly on send.
  const [chatSession] = useState(() => createChatSession());

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');

    try {
      const result = await chatSession.sendMessage(userMsg.text);
      const modelMsg = { role: 'model', text: result.response.text() };
      setChatHistory(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 ml-64 relative">
        {currentView === View.DASHBOARD && <Dashboard />}
        {currentView === View.AGENT_ORCHESTRATOR && <AgentOrchestrator />}
        {currentView === View.CAMPAIGN_WIZARD && <CampaignWizard />}
        {currentView === View.CONTENT_STUDIO && <ContentStudio />}
        {currentView === View.INTELLIGENCE_HUB && <IntelligenceHub />}
        {currentView === View.LIVE_VOICE && <LiveVoice />}
      </main>

      {/* Floating Chat Assistant (Available on all screens except Live Voice and Agent Orchestrator) */}
      {currentView !== View.LIVE_VOICE && currentView !== View.AGENT_ORCHESTRATOR && (
        <>
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all z-40"
            >
              <Bot size={28} />
            </button>
          )}

          {isChatOpen && (
            <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-semibold">Gemini Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;