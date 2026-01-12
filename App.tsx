import React, { useState } from 'react';
import { generateCampaignContent } from './services/geminiService';
import { CampaignData } from './types';
import ImageGenerator from './components/ImageGenerator';
import ApiKeyGate from './components/ApiKeyGate';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional yet conversational');
  
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !targetAudience) return;

    setLoading(true);
    setError(null);
    setCampaign(null);

    try {
      const data = await generateCampaignContent(topic, targetAudience, tone);
      setCampaign(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const MainContent = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ColdMail Pro
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 3.0 Pro
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Campaign Details
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
                    What are you pitching?
                  </label>
                  <textarea
                    id="topic"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. A SaaS platform that automates HR payroll for small businesses..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    id="audience"
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. HR Managers at tech startups"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-1">
                    Tone of Voice
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option>Professional yet conversational</option>
                    <option>Witty and humorous</option>
                    <option>Direct and authoritative</option>
                    <option>Empathetic and warm</option>
                    <option>High energy and exciting</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Crafting Campaign...
                      </>
                    ) : (
                      'Generate Campaign'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">Spam-Free Guarantee</h3>
              <p className="text-xs text-indigo-700">
                Our AI is trained to avoid common trigger words like "Free", "Guarantee", and "Act Now" to ensure high deliverability rates.
              </p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 space-y-6">
            {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                 {error}
               </div>
            )}

            {!campaign && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Ready to start your campaign?</p>
                <p className="text-sm">Fill out the form to generate professional copy.</p>
              </div>
            )}

            {campaign && (
              <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
                
                {/* Subject Lines */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Subject Lines</h2>
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">High Open Rate Potential</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {campaign.subjectLines.map((subject, idx) => (
                      <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 font-medium select-all">{subject}</p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(subject)}
                          className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
                          title="Copy to clipboard"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body Copy */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">Email Body</h2>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-800">
                       <pre className="whitespace-pre-wrap font-sans text-base">{campaign.body}</pre>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => navigator.clipboard.writeText(campaign.body)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        Copy Body Text
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visual Generator */}
                <ImageGenerator initialPrompt={campaign.imagePromptSuggestion} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );

  return (
    <ApiKeyGate>
      <MainContent />
    </ApiKeyGate>
  );
};

export default App;
