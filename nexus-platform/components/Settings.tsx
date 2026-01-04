import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import { Globe, Cpu, Languages, Sparkles, Building, Hash, ShieldCheck, CheckSquare, Save, Brain, Trash2, HardDrive } from 'lucide-react';
import { generateAgentResponse } from '../services/geminiService';

const Settings: React.FC = () => {
  const { language, setLanguage, federalProfile, setFederalProfile, agentMemory, setAgentMemory, clearAllData } = useNexus();
  const [activeTab, setActiveTab] = useState<'system' | 'federal' | 'evolution' | 'data'>('system');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [translationTest, setTranslationTest] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Federal Form State
  const [fedForm, setFedForm] = useState(federalProfile);

  const handleTranslate = async () => {
    if(!translationTest) return;
    setIsTranslating(true);
    const result = await generateAgentResponse('translator', `Translate this to ${language}: "${translationTest}"`, '', false);
    setTranslatedResult(result);
    setIsTranslating(false);
  };

  const saveFederalProfile = () => {
    setFederalProfile(fedForm);
    alert("Federal Identity Profile Saved. Agents will now use these credentials for proposals.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold mb-2">System Configuration</h1>
              <p className="text-slate-500">Global settings for the Nexus OS.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1 overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('system')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'system' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                  <Cpu size={16} /> System
              </button>
              <button 
                onClick={() => setActiveTab('evolution')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'evolution' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                  <Brain size={16} /> Agent Evolution
              </button>
              <button 
                onClick={() => setActiveTab('federal')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'federal' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                  <Building size={16} /> Federal Identity
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'data' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                  <HardDrive size={16} /> Data
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
      {activeTab === 'system' && (
          <div className="space-y-6">
            {/* LLM Config */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Cpu size={20} className="text-brand-accent"/> Intelligence Engine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Primary Model</label>
                        <select 
                            value={model} 
                            onChange={e => setModel(e.target.value)}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                        >
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Reasoning)</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Speed)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">The Pro model is used for complex reasoning (RFPs, Strategy). Flash is used for chat and UI generation.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Context Window</label>
                        <div className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed">
                            1,000,000 Tokens (Managed)
                        </div>
                    </div>
                </div>
            </div>

            {/* Localization */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-500"/> Global Localization</h3>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">System Language</label>
                    <select 
                            value={language} 
                            onChange={e => setLanguage(e.target.value)}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none max-w-xs"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Español (LATAM)</option>
                            <option value="fr">Français (France)</option>
                            <option value="de">Deutsch</option>
                            <option value="jp">日本語</option>
                        </select>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><Languages size={16}/> Translation API Test</h4>
                    <div className="flex gap-2 mb-2">
                        <input 
                            value={translationTest}
                            onChange={e => setTranslationTest(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                        />
                        <button 
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium text-sm"
                        >
                            {isTranslating ? 'Translating...' : 'Test'}
                        </button>
                    </div>
                    {translatedResult && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded border border-green-200 dark:border-green-800 text-sm">
                            <Sparkles size={12} className="inline mr-1" /> {translatedResult}
                        </div>
                    )}
                </div>
            </div>
          </div>
      )}

      {activeTab === 'evolution' && (
          <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-6 rounded-xl border border-purple-800 shadow-lg">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-full animate-pulse">
                          <Brain size={32} className="text-purple-300"/>
                      </div>
                      <div>
                          <h3 className="font-bold text-xl mb-1">Global Agent Memory</h3>
                          <p className="text-purple-200 text-sm">
                              Instructions added here are injected into the "Subconscious" of every agent in the system. Use this to enforce global rules, style guides, or forbidden topics. The agents effectively "evolve" as you refine this memory.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Persistent Instructions</h3>
                  <textarea 
                      value={agentMemory}
                      onChange={(e) => setAgentMemory(e.target.value)}
                      className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-primary font-mono text-sm resize-none"
                      placeholder={`e.g.\n- Always output dates in ISO 8601 format.\n- Never use the word "synergy".\n- Maintain a tone of "Radical Candor".\n- When generating code, always add comments.`}
                  />
                  <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-slate-500">Auto-saves to local persistence layer.</span>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                          <Save size={16} /> Update Memory
                      </button>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'federal' && (
          <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-full">
                          <Building size={32} className="text-brand-accent"/>
                      </div>
                      <div>
                          <h3 className="font-bold text-xl mb-1">Corporate Entity Profile</h3>
                          <p className="text-slate-400 text-sm">
                              This data is injected into the context of every Federal Agent (RFP Analyst, Proposal Writer). 
                              Ensure your UEI, CAGE, and NAICS codes are accurate for compliance.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Hash size={20} className="text-blue-500"/> Identifiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                          <label className="block text-sm font-medium mb-1">Legal Business Name</label>
                          <input 
                              value={fedForm.legalName}
                              onChange={e => setFedForm({...fedForm, legalName: e.target.value})}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">UEI (SAM.gov)</label>
                              <input 
                                  value={fedForm.uei}
                                  onChange={e => setFedForm({...fedForm, uei: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary font-mono"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">CAGE Code</label>
                              <input 
                                  value={fedForm.cageCode}
                                  onChange={e => setFedForm({...fedForm, cageCode: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary font-mono"
                              />
                          </div>
                      </div>
                  </div>

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-green-500"/> Codes & Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                          <label className="block text-sm font-medium mb-1">NAICS Codes (Comma Separated)</label>
                          <input 
                              value={fedForm.naics.join(', ')}
                              onChange={e => setFedForm({...fedForm, naics: e.target.value.split(',').map(s => s.trim())})}
                              placeholder="541511, 541512, ..."
                              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">SIC Codes</label>
                          <input 
                              value={fedForm.sic.join(', ')}
                              onChange={e => setFedForm({...fedForm, sic: e.target.value.split(',').map(s => s.trim())})}
                              placeholder="7371, 7379..."
                              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
                          />
                      </div>
                  </div>

                  <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Set-Aside Status</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['Small Business', 'Service-Disabled Veteran-Owned', 'Woman-Owned (WOSB)', '8(a) Program', 'HUBZone'].map(status => (
                              <label key={status} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                                  <input 
                                      type="checkbox"
                                      checked={fedForm.setAsides.includes(status)}
                                      onChange={e => {
                                          if(e.target.checked) setFedForm({...fedForm, setAsides: [...fedForm.setAsides, status]});
                                          else setFedForm({...fedForm, setAsides: fedForm.setAsides.filter(s => s !== status)});
                                      }}
                                      className="rounded border-slate-300 text-brand-primary focus:ring-brand-accent"
                                  />
                                  <span className="text-xs font-medium">{status}</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Core Capabilities Statement</label>
                      <textarea 
                          value={fedForm.capabilities}
                          onChange={e => setFedForm({...fedForm, capabilities: e.target.value})}
                          className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary resize-none"
                          placeholder="Summarize what your company does best..."
                      />
                  </div>

                  <div className="flex justify-end">
                      <button 
                          onClick={saveFederalProfile}
                          className="px-6 py-3 bg-brand-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-lg"
                      >
                          <Save size={18} /> Save Federal Profile
                      </button>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'data' && (
          <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
                  <h3 className="font-bold text-lg text-red-700 dark:text-red-400 mb-2 flex items-center gap-2"><Trash2 size={20}/> Danger Zone</h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-6">
                      Manage your local data persistence. Warning: These actions are destructive.
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/50">
                      <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">Factory Reset</div>
                          <div className="text-xs text-slate-500">Wipes all Projects, Contacts, and Settings from Local Storage.</div>
                      </div>
                      <button 
                          onClick={clearAllData}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                      >
                          Delete All Data
                      </button>
                  </div>
              </div>
          </div>
      )}
      </div>
    </div>
  );
};

export default Settings;