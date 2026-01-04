import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import { generateAgentResponse } from '../services/geminiService';
import { LandingPageSchema } from '../types';
import { 
  LayoutTemplate, Code, Eye, RefreshCw, Zap, 
  Smartphone, Monitor, ChevronRight, Wand2, Download,
  CheckCircle, Layers, ArrowRight, Loader2, Globe, Copy
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

const WebStudio: React.FC = () => {
  const { activeProject, setProjects, activeProjectId } = useNexus();
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [cloneUrl, setCloneUrl] = useState('');

  if (!activeProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <LayoutTemplate size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Web & Funnel Studio</h1>
          <p className="text-slate-500 max-w-md mb-8">
              AI-driven landing page architect. Generate high-conversion funnels, wireframes, and copy in seconds.
          </p>
          <div className="flex gap-4">
               <Link to="/new-project" className="px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <Wand2 size={20} /> Create New Project
               </Link>
          </div>
      </div>
    );
  }

  const handleGenerate = async (customPrompt?: string) => {
    setLoading(true);
    
    const basePrompt = `
      Generate a Landing Page structure for a project with the following context:
      Name: ${activeProject.name}
      Type: ${activeProject.type}
      Audience: ${activeProject.audience}
      Tone: ${activeProject.tone}
      Goal: ${activeProject.kpis['Launch Date']}

      ${customPrompt ? `Refinement Instruction: ${customPrompt}` : ''}

      Return ONLY a JSON object adhering to this schema:
      {
        "theme": "modern" | "dark" | "playful" | "minimal",
        "hero": { "headline": "", "subheadline": "", "ctaPrimary": "", "ctaSecondary": "" },
        "features": [ { "title": "", "description": "", "icon": "Zap" | "Layers" | "CheckCircle" } ], // Max 3 features
        "socialProof": [ { "stat": "", "label": "" } ], // Max 3 stats
        "ctaSection": { "headline": "", "buttonText": "" }
      }
    `;

    try {
      const response = await generateAgentResponse('web_architect', basePrompt, '', true); // Using thinking for better structure
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const pageData: LandingPageSchema = JSON.parse(cleanJson);

      setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, landingPage: pageData } : p));
      setRefinementPrompt('');
    } catch (e) {
      console.error("Generation Error", e);
      alert("Failed to generate structure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
      if (!cloneUrl) return;
      setLoading(true);
      
      // Simulate cloning by asking Gemini to hallucinate the structure of the provided URL or infer it.
      const prompt = `
        Analyze the likely structure and content of the website "${cloneUrl}".
        Imagine you are viewing this website. Extract its style, tone, and core sections.
        
        Generate a Landing Page Schema that mimics "${cloneUrl}" for the project "${activeProject.name}".
        
        Return ONLY a JSON object adhering to this schema:
        {
            "theme": "modern" | "dark" | "playful" | "minimal",
            "hero": { "headline": "", "subheadline": "", "ctaPrimary": "", "ctaSecondary": "" },
            "features": [ { "title": "", "description": "", "icon": "Zap" | "Layers" | "CheckCircle" } ], // Max 3 features
            "socialProof": [ { "stat": "", "label": "" } ], // Max 3 stats
            "ctaSection": { "headline": "", "buttonText": "" }
        }
      `;

      try {
          const response = await generateAgentResponse('web_architect', prompt, `Clone Target: ${cloneUrl}`, true);
          const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
          const pageData: LandingPageSchema = JSON.parse(cleanJson);
          setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, landingPage: pageData } : p));
          setCloneUrl('');
      } catch (e) {
          console.error("Clone Error", e);
          alert("Failed to clone website structure.");
      } finally {
          setLoading(false);
      }
  };

  const getThemeClasses = (theme: string) => {
    switch(theme) {
        case 'dark': return 'bg-slate-900 text-white';
        case 'playful': return 'bg-yellow-50 text-slate-900 font-rounded'; // Mock font class
        case 'minimal': return 'bg-white text-slate-800 font-serif';
        default: return 'bg-white text-slate-900'; // Modern
    }
  };

  const renderIcon = (iconName: string) => {
      switch(iconName) {
          case 'Layers': return <Layers className="w-8 h-8 text-brand-accent mb-4" />;
          case 'CheckCircle': return <CheckCircle className="w-8 h-8 text-brand-accent mb-4" />;
          default: return <Zap className="w-8 h-8 text-brand-accent mb-4" />;
      }
  };

  const Preview = () => {
      if (!activeProject.landingPage) return null;
      const { hero, features, socialProof, ctaSection, theme } = activeProject.landingPage;
      const themeClass = getThemeClasses(theme);

      return (
          <div className={`w-full h-full overflow-y-auto ${themeClass} transition-colors duration-500`}>
              {/* Navbar Mock */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-black/5">
                  <div className="font-bold text-xl tracking-tight">{activeProject.name}</div>
                  <div className="hidden sm:flex gap-4 text-sm font-medium opacity-70">
                      <span>Features</span>
                      <span>Pricing</span>
                      <span>About</span>
                  </div>
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium">Get Started</button>
              </div>

              {/* Hero */}
              <div className="px-6 py-20 md:py-32 max-w-5xl mx-auto text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                      {hero.headline}
                  </h1>
                  <p className="text-lg md:text-xl opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
                      {hero.subheadline}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="px-8 py-4 bg-brand-accent text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
                          {hero.ctaPrimary}
                      </button>
                      <button className="px-8 py-4 border-2 border-current rounded-lg font-bold text-lg hover:bg-black/5 transition-colors">
                          {hero.ctaSecondary}
                      </button>
                  </div>
              </div>

              {/* Social Proof */}
              <div className="border-y border-black/5 py-12 bg-black/5">
                  <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      {socialProof.map((item, i) => (
                          <div key={i}>
                              <div className="text-3xl font-bold mb-1">{item.stat}</div>
                              <div className="text-sm opacity-60 uppercase tracking-wider font-semibold">{item.label}</div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Features */}
              <div className="py-20 px-6 max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {features.map((feat, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-white/50 border border-black/5 shadow-sm">
                              {renderIcon(feat.icon)}
                              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                              <p className="opacity-70 leading-relaxed">{feat.description}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* CTA */}
              <div className="py-20 px-6 text-center">
                  <div className="bg-brand-primary text-white rounded-3xl p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                       <div className="relative z-10">
                           <h2 className="text-3xl md:text-4xl font-bold mb-8">{ctaSection.headline}</h2>
                           <button className="px-8 py-4 bg-white text-brand-primary rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors">
                               {ctaSection.buttonText} <ArrowRight size={20} className="inline ml-2" />
                           </button>
                       </div>
                  </div>
              </div>

              {/* Footer */}
              <div className="py-10 text-center opacity-40 text-sm">
                  &copy; {new Date().getFullYear()} {activeProject.name}. All rights reserved.
              </div>
          </div>
      );
  };

  const CodeView = () => (
      <div className="w-full h-full bg-slate-900 text-slate-300 p-6 overflow-auto font-mono text-sm">
          <p className="text-slate-500 mb-4">// React Component Structure (Tailwind CSS)</p>
          <pre>{JSON.stringify(activeProject.landingPage, null, 2)}</pre>
      </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
       {/* Sidebar Controls */}
       <div className="w-full md:w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-10">
           <div className="p-6 border-b border-slate-200 dark:border-slate-700">
               <h2 className="text-lg font-bold flex items-center gap-2 mb-1"><LayoutTemplate className="text-brand-accent"/> Web Studio</h2>
               <p className="text-xs text-slate-500">Funnel Architect & Copywriter</p>
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Project Context</h3>
                    <div className="text-xs space-y-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-medium">{activeProject.name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Target:</span> <span className="font-medium truncate ml-2">{activeProject.audience}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Tone:</span> <span className="font-medium">{activeProject.tone}</span></div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Generation Controls</h3>
                    <textarea 
                        value={refinementPrompt}
                        onChange={(e) => setRefinementPrompt(e.target.value)}
                        placeholder="e.g. 'Make the hero more aggressive', 'Change theme to dark', 'Focus on speed features'"
                        className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg mb-3 h-24 resize-none focus:border-brand-primary outline-none"
                    />
                    <button 
                        onClick={() => handleGenerate(refinementPrompt)}
                        disabled={loading}
                        className="w-full py-2.5 bg-brand-primary text-white rounded-lg font-medium text-sm hover:bg-slate-700 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                        {loading ? 'Architecting...' : (activeProject.landingPage ? 'Refine Page' : 'Generate Landing Page')}
                    </button>
                </div>

                {/* Clone Website Section */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Clone Existing Site</h3>
                    <div className="relative mb-3">
                        <input 
                            value={cloneUrl}
                            onChange={(e) => setCloneUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full p-2 pl-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-brand-primary"
                        />
                        <Globe className="absolute left-2 top-2.5 text-slate-400" size={14} />
                    </div>
                    <button 
                        onClick={handleClone}
                        disabled={loading || !cloneUrl}
                        className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={14} /> : <Copy size={14} />}
                        Clone Structure
                    </button>
                </div>

                {activeProject.landingPage && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-sm mb-1">
                            <CheckCircle size={16} /> Structure Ready
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-500">
                            Theme: <span className="capitalize">{activeProject.landingPage.theme}</span>
                        </p>
                    </div>
                )}
           </div>

           <div className="p-4 border-t border-slate-200 dark:border-slate-700">
               <button className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-brand-primary text-sm font-medium transition-colors">
                   <Download size={16} /> Export React Code
               </button>
           </div>
       </div>

       {/* Main Stage */}
       <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex flex-col relative overflow-hidden">
           {/* Toolbar */}
           <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
               <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                   <button 
                    onClick={() => setDevice('desktop')}
                    className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white dark:bg-slate-600 shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                       <Monitor size={18} />
                   </button>
                   <button 
                    onClick={() => setDevice('mobile')}
                    className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white dark:bg-slate-600 shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                       <Smartphone size={18} />
                   </button>
               </div>

               <div className="flex items-center gap-2">
                   <button 
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'preview' ? 'bg-brand-accent text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       <Eye size={16} /> Preview
                   </button>
                   <button 
                    onClick={() => setViewMode('code')}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'code' ? 'bg-brand-accent text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       <Code size={16} /> Code
                   </button>
               </div>
           </div>

           {/* Canvas */}
           <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-200/50 dark:bg-black/50">
               {activeProject.landingPage ? (
                   <div 
                    className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden relative ${
                        device === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-slate-800' : 'w-full h-full rounded-lg border border-slate-200 dark:border-slate-700'
                    }`}
                   >
                       {viewMode === 'preview' ? <Preview /> : <CodeView />}
                   </div>
               ) : (
                   <div className="flex flex-col items-center justify-center text-slate-400">
                       <LayoutTemplate size={64} className="mb-4 opacity-20" />
                       <p>No landing page generated yet.</p>
                       <p className="text-sm">Use the controls on the left to start architecting.</p>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

export default WebStudio;