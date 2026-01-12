import React, { useState, useEffect } from 'react';
import { AppView, Project, BlueprintTab, ProjectData, WireframeScreen } from './types';
import { SYSTEM_INSTRUCTION_ARCHITECT, SYSTEM_INSTRUCTION_UX, SYSTEM_INSTRUCTION_COPY, SYSTEM_INSTRUCTION_POLICY, SYSTEM_INSTRUCTION_MARKETER, Icons } from './constants';
import * as gemini from './services/geminiService';
import LiveSession from './components/LiveSession';

// -- Sub-Components --

const SidebarItem = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
      active 
        ? 'bg-brand-primary text-white border-r-4 border-brand-accent' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const WizardStep = ({ title, children }: any) => (
  <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
    <h2 className="text-2xl font-bold text-brand-primary dark:text-white mb-6">{title}</h2>
    {children}
  </div>
);

// New Component: Renders JSON wireframes visually
const WireframeRenderer = ({ data }: { data: string }) => {
    let screens: WireframeScreen[] = [];
    try {
        const parsed = JSON.parse(data);
        screens = parsed.screens || [];
    } catch (e) {
        return <div className="text-red-500">Invalid Wireframe Data</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {screens.map((screen) => (
                <div key={screen.id} className="border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm flex flex-col">
                    <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-300 dark:border-slate-600 flex justify-between items-center">
                        <span className="font-bold text-sm dark:text-white">{screen.title}</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1 bg-slate-50 dark:bg-slate-900 min-h-[300px]">
                        {screen.components.map((comp, idx) => {
                             if (comp.type === 'Button') {
                                 const bg = comp.variant === 'primary' ? 'bg-brand-primary text-white' : comp.variant === 'secondary' ? 'bg-slate-200 text-slate-800' : 'bg-transparent border border-slate-400 text-slate-500';
                                 return <button key={idx} className={`w-full py-2 rounded shadow-sm ${bg}`}>{comp.label}</button>
                             }
                             if (comp.type === 'Input') {
                                 return <input key={idx} type="text" placeholder={comp.label} className="w-full p-2 border rounded bg-white dark:bg-slate-800 dark:border-slate-600" disabled />
                             }
                             if (comp.type === 'Card') {
                                 return <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded shadow border dark:border-slate-700"><h4 className="font-bold mb-2">{comp.label}</h4><div className="h-10 bg-slate-100 dark:bg-slate-700 rounded"></div></div>
                             }
                             if (comp.type === 'Image') {
                                 return <div key={idx} className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-slate-400">{comp.label}</div>
                             }
                             if (comp.type === 'Navigation') {
                                 return <div key={idx} className="flex justify-between border-b pb-2 mb-2 font-bold text-sm"><span>Logo</span><span>Menu</span></div>
                             }
                             return <div key={idx} className="p-2 border border-dashed border-slate-300 text-center text-xs text-slate-400">{comp.type}: {comp.label}</div>
                        })}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                        {screen.description}
                    </div>
                </div>
            ))}
        </div>
    );
};


// -- Main App Component --

export default function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<BlueprintTab>(BlueprintTab.OVERVIEW);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVoiceSession, setShowVoiceSession] = useState(false);
  
  // URL Import State
  const [importUrl, setImportUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Wizard State
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState<Partial<ProjectData>>({
    userActions: [],
    platforms: [],
    integrations: [],
    referenceLinks: [],
    screenshots: []
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleStartProject = () => {
    setView(AppView.WIZARD);
    setWizardStep(0);
    setWizardData({
      userActions: [],
      platforms: [],
      integrations: [],
      referenceLinks: [],
      screenshots: []
    });
  };

  const handleUrlAnalysis = async () => {
    if (!importUrl) return;
    setAnalyzing(true);
    try {
        const data = await gemini.analyzeProjectUrl(importUrl);
        
        // Reset and Merge with defaults
        setWizardData({
            userActions: [],
            platforms: [],
            integrations: [],
            screenshots: [],
            referenceLinks: [{ id: Date.now().toString(), url: importUrl, type: 'REQUIREMENTS', note: 'Source URL' }],
            ...data
        });
        
        // Jump to Wizard to review data
        setView(AppView.WIZARD);
        setWizardStep(0);
    } catch (e) {
        console.error(e);
        alert("Failed to analyze URL. Please try again or start manually.");
    } finally {
        setAnalyzing(false);
    }
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      data: wizardData as ProjectData,
      artifacts: {
        prd: '',
        wireframes: '',
        copyDeck: '',
        designSystem: '',
        policies: '',
        tickets: '',
        generatedAssets: [],
        insights: '',
        marketingPlan: ''
      },
      status: 'DRAFT',
      lastUpdated: Date.now()
    };
    setCurrentProject(newProject);
    setView(AppView.STUDIO);
  };

  const generateSection = async (type: 'PRD' | 'WIREFRAMES' | 'COPY' | 'POLICIES') => {
    if (!currentProject) return;
    setLoading(true);
    
    // Clear previous if regenerating to show streaming
    if (type !== 'WIREFRAMES') {
        setCurrentProject(prev => {
            if (!prev) return null;
            const key = type === 'COPY' ? 'copyDeck' : type === 'POLICIES' ? 'policies' : 'prd';
            return { ...prev, artifacts: { ...prev.artifacts, [key]: '' } };
        });
    }

    try {
      let instruction = "";
      switch (type) {
        case 'PRD': instruction = SYSTEM_INSTRUCTION_ARCHITECT; break;
        case 'WIREFRAMES': instruction = SYSTEM_INSTRUCTION_UX; break;
        case 'COPY': instruction = SYSTEM_INSTRUCTION_COPY; break;
        case 'POLICIES': instruction = SYSTEM_INSTRUCTION_POLICY; break;
      }
      
      const content = await gemini.generateArtifactStream(
          type, 
          currentProject.data, 
          currentProject.artifacts, // Pass existing artifacts for context awareness
          instruction,
          (chunk) => {
              // Streaming Update Callback
              if (type !== 'WIREFRAMES') {
                   setCurrentProject(prev => {
                        if (!prev) return null;
                        const key = type === 'COPY' ? 'copyDeck' : type === 'POLICIES' ? 'policies' : 'prd';
                        return { ...prev, artifacts: { ...prev.artifacts, [key]: chunk } };
                    });
              }
          }
      );
      
      // Final set for Wireframes (since they are JSON and not streamed to text directly)
      if (type === 'WIREFRAMES') {
           setCurrentProject(prev => prev ? { ...prev, artifacts: { ...prev.artifacts, wireframes: content } } : null);
      }

    } catch (e) {
      console.error(e);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const readAloud = async (text: string) => {
      try {
          // Chunk for TTS if long
          const audioBuffer = await gemini.generateSpeech(text.slice(0, 500)); 
          const ctx = new AudioContext();
          const source = ctx.createBufferSource();
          const audioData = await ctx.decodeAudioData(audioBuffer);
          source.buffer = audioData;
          source.connect(ctx.destination);
          source.start(0);
      } catch(e) {
          console.error(e);
      }
  };

  // -- Render Helpers --

  const renderDashboard = () => (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-primary dark:text-white mb-4">OrenGen Blueprint</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Transform your ideas into build-ready specs, wireframes, and design systems.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Start Fresh */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center hover:border-brand-accent transition-colors">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Icons.Sparkle />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Start from Scratch</h3>
              <p className="text-slate-500 mb-6 text-sm">Follow our wizard to define your product vision manually.</p>
              <button 
                onClick={handleStartProject}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105"
              >
                Create New Project
              </button>
          </div>

          {/* Card 2: Import from URL */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center hover:border-brand-accent transition-colors">
               <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-6">
                  <Icons.Document /> 
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Import from URL</h3>
              <p className="text-slate-500 mb-6 text-sm">Analyze an existing website or doc to auto-fill your blueprint.</p>
              <div className="w-full space-y-3">
                  <input 
                    type="text" 
                    placeholder="https://example.com"
                    className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalysis()}
                  />
                  <button 
                    onClick={handleUrlAnalysis}
                    disabled={analyzing || !importUrl}
                    className="w-full bg-brand-accent hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                        </>
                    ) : 'Analyze & Start'}
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
            { title: "Architect", desc: "Generates comprehensive PRDs & Scope" },
            { title: "UX Studio", desc: "Auto-renders UI Wireframes" },
            { title: "Content Studio", desc: "Create Ads, Presentations & Tutorials" }
        ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-2 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
        ))}
      </div>
    </div>
  );

  const renderWizard = () => (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {wizardStep === 0 && (
        <WizardStep title="Core Concept">
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-1 dark:text-slate-200">Product Name</label>
                <input 
                    type="text" 
                    className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    placeholder="e.g. FitTrack Pro"
                    value={wizardData.name || ''}
                    onChange={e => setWizardData({...wizardData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1 dark:text-slate-200">Core Promise</label>
                <textarea 
                    className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    placeholder="What problem does it solve?"
                    value={wizardData.corePromise || ''}
                    onChange={e => setWizardData({...wizardData, corePromise: e.target.value})}
                />
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={() => setWizardStep(1)} className="bg-brand-primary text-white px-6 py-2 rounded">Next: Users & Actions</button>
            </div>
          </div>
        </WizardStep>
      )}
      
      {wizardStep === 1 && (
        <WizardStep title="Target Audience & Behavior">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-slate-200">Target Users</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        placeholder="e.g. Busy parents, Freelance designers"
                        value={wizardData.targetUsers || ''}
                        onChange={e => setWizardData({...wizardData, targetUsers: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-slate-200">Top 3 User Actions (Jobs-to-be-done)</label>
                    <div className="space-y-2">
                        {[0, 1, 2].map(i => (
                            <input 
                                key={i}
                                type="text" 
                                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                placeholder={`Action ${i + 1}`}
                                value={wizardData.userActions?.[i] || ''}
                                onChange={e => {
                                    const newActions = [...(wizardData.userActions || [])];
                                    newActions[i] = e.target.value;
                                    setWizardData({...wizardData, userActions: newActions});
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between mt-6">
                    <button onClick={() => setWizardStep(0)} className="text-slate-500">Back</button>
                    <button onClick={() => setWizardStep(2)} className="bg-brand-primary text-white px-6 py-2 rounded">Next: Tech & Biz</button>
                </div>
            </div>
        </WizardStep>
      )}

      {wizardStep === 2 && (
          <WizardStep title="Tech, Business & References">
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-slate-200">Reference URL (Competitor/Inspiration)</label>
                    <input 
                        type="text" 
                        className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        placeholder="https://example.com"
                        onBlur={(e) => {
                            if(e.target.value) {
                                setWizardData({
                                    ...wizardData, 
                                    referenceLinks: [...(wizardData.referenceLinks || []), { id: Date.now().toString(), url: e.target.value, type: 'INSPIRATION', note: '' }]
                                })
                                e.target.value = '';
                            }
                        }}
                    />
                    <div className="mt-2 text-sm text-slate-500">
                        {wizardData.referenceLinks?.map(l => (
                            <div key={l.id} className="flex gap-2 items-center">
                                <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">{l.type}</span>
                                <span className="truncate">{l.url}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1 dark:text-slate-200">Screenshots (Optional)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    setWizardData({
                                        ...wizardData, 
                                        screenshots: [...(wizardData.screenshots || []), ev.target?.result as string]
                                    });
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-dark"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-slate-200">Brand Tone</label>
                    <select 
                        className="w-full p-3 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        onChange={e => setWizardData({...wizardData, brandTone: e.target.value})}
                        value={wizardData.brandTone || ''}
                    >
                        <option value="">Select Tone</option>
                        <option value="Professional & Corporate">Professional & Corporate</option>
                        <option value="Playful & Bold">Playful & Bold</option>
                        <option value="Minimalist & Clean">Minimalist & Clean</option>
                        <option value="Technical & Detailed">Technical & Detailed</option>
                    </select>
                </div>
                 <div className="flex justify-between mt-6">
                    <button onClick={() => setWizardStep(1)} className="text-slate-500">Back</button>
                    <button onClick={handleCreateProject} className="bg-brand-accent text-white px-6 py-2 rounded font-bold shadow-lg animate-pulse">Generate Blueprint</button>
                </div>
              </div>
          </WizardStep>
      )}
    </div>
  );

  const renderStudio = () => {
    if (!currentProject) return null;

    const TabButton = ({ id, label }: any) => (
      <button
        onClick={() => setActiveTab(id)}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === id 
            ? 'border-brand-accent text-brand-primary dark:text-white' 
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Utility Bar */}
        <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
            <h2 className="font-bold text-lg dark:text-white">{currentProject.data.name} <span className="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full ml-2">DRAFT</span></h2>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setShowVoiceSession(true)}
                    className="p-2 text-brand-accent bg-orange-50 dark:bg-orange-900/20 rounded hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors" 
                    title="Voice Brainstorm"
                 >
                    <Icons.Mic />
                 </button>
                 <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
                 <button className="text-sm font-medium text-brand-primary dark:text-slate-200">Export</button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <TabButton id={BlueprintTab.PRD} label="PRD & Scope" />
            <TabButton id={BlueprintTab.WIREFRAMES} label="Wireframes" />
            <TabButton id={BlueprintTab.COPY} label="UI Copy" />
            <TabButton id={BlueprintTab.POLICIES} label="Policies" />
            <TabButton id={BlueprintTab.ASSETS} label="Assets" />
            <TabButton id={BlueprintTab.CONTENT_STUDIO} label="Content Studio" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
            
            {/* Loading State Overlay */}
            {loading && activeTab !== BlueprintTab.CONTENT_STUDIO && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-accent mb-4"></div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">Generating...</p>
                    </div>
                </div>
            )}

            {activeTab === BlueprintTab.PRD && (
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold dark:text-white">Product Requirements</h3>
                        <div className="flex gap-2">
                             {currentProject.artifacts.prd && (
                                <button onClick={() => readAloud(currentProject.artifacts.prd)} className="text-sm text-brand-primary flex items-center gap-1 hover:underline">
                                    <Icons.Sparkle /> Listen
                                </button>
                             )}
                             <button 
                                onClick={() => generateSection('PRD')}
                                className="bg-brand-primary text-white px-4 py-2 rounded text-sm hover:bg-brand-dark"
                             >
                                {currentProject.artifacts.prd ? 'Regenerate PRD' : 'Generate PRD'}
                             </button>
                        </div>
                    </div>
                    {currentProject.artifacts.prd ? (
                        <article className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-8 rounded shadow-sm">
                            <pre className="whitespace-pre-wrap font-sans">{currentProject.artifacts.prd}</pre>
                        </article>
                    ) : (
                         <div className="text-center py-20 bg-white dark:bg-slate-900 rounded border border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500">No PRD generated yet. Ask the Architect to start.</p>
                        </div>
                    )}
                </div>
            )}

             {activeTab === BlueprintTab.WIREFRAMES && (
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold dark:text-white">Wireframes & Flows</h3>
                        <button 
                            onClick={() => generateSection('WIREFRAMES')}
                            className="bg-brand-primary text-white px-4 py-2 rounded text-sm hover:bg-brand-dark"
                        >
                            {currentProject.artifacts.wireframes ? 'Regenerate' : 'Generate Wireframes'}
                        </button>
                    </div>
                    {currentProject.artifacts.wireframes ? (
                        <WireframeRenderer data={currentProject.artifacts.wireframes} />
                    ) : (
                         <div className="text-center py-20 bg-white dark:bg-slate-900 rounded border border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500">No wireframes generated yet.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === BlueprintTab.ASSETS && (
                <AssetGenerator />
            )}

            {activeTab === BlueprintTab.CONTENT_STUDIO && (
                <ContentStudio 
                    project={currentProject} 
                    onUpdate={(text, grounding) => setCurrentProject(prev => prev ? {...prev, artifacts: {...prev.artifacts, marketingPlan: text, marketingGrounding: grounding}} : null)}
                />
            )}
            
            {(activeTab === BlueprintTab.COPY || activeTab === BlueprintTab.POLICIES) && (
                <div className="max-w-4xl mx-auto">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold dark:text-white">
                            {activeTab === BlueprintTab.COPY ? 'UI Copy Deck' : 'Policies & Compliance'}
                        </h3>
                        <button 
                            onClick={() => generateSection(activeTab === BlueprintTab.COPY ? 'COPY' : 'POLICIES')}
                            className="bg-brand-primary text-white px-4 py-2 rounded text-sm hover:bg-brand-dark"
                        >
                            Generate
                        </button>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded shadow-sm whitespace-pre-wrap dark:text-slate-300">
                        {activeTab === BlueprintTab.COPY ? currentProject.artifacts.copyDeck : currentProject.artifacts.policies}
                        {!((activeTab === BlueprintTab.COPY ? currentProject.artifacts.copyDeck : currentProject.artifacts.policies)) && (
                             <p className="text-slate-500 text-center italic">Content not generated yet.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>
    );
  };

  // Content Studio Sub-Component
  const ContentStudio = ({ project, onUpdate }: { project: Project, onUpdate: (t: string, g?: any[]) => void }) => {
      const [url, setUrl] = useState('');
      const [type, setType] = useState('Presentation');
      const [constraints, setConstraints] = useState('Professional tone, medium length');
      const [generating, setGenerating] = useState(false);
      const [videoPrompt, setVideoPrompt] = useState('');
      const [videoUrl, setVideoUrl] = useState('');
      const [videoStatus, setVideoStatus] = useState('');
      const [videoLoading, setVideoLoading] = useState(false);

      const handleGeneratePlan = async () => {
          setGenerating(true);
          onUpdate(''); // Clear previous
          try {
              // Streaming Update
              const result = await gemini.generateMarketingContent(
                  project.data, 
                  url, 
                  type, 
                  constraints, 
                  SYSTEM_INSTRUCTION_MARKETER,
                  (chunk) => onUpdate(chunk)
              );
              // Final update with grounding
              onUpdate(result.text, result.grounding);
          } catch(e) {
              console.error(e);
              alert("Error generating content plan");
          } finally {
              setGenerating(false);
          }
      };

      const handleGenerateVideo = async () => {
          if (!(window as any).aistudio) {
              alert("AI Studio global not found. Please ensure script is loaded or env is correct.");
              return;
          }
          setVideoLoading(true);
          setVideoStatus("Checking API Key...");
          try {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) {
                 await (window as any).aistudio.openSelectKey();
             }
             
             const url = await gemini.generateVideo(
                 videoPrompt || `A cinematic commercial for ${project.data.name}`,
                 (status) => setVideoStatus(status)
             );
             setVideoUrl(url);

          } catch(e) {
             console.error(e);
             alert("Video generation failed.");
             if ((e as any).message?.includes("Requested entity was not found")) {
                 await (window as any).aistudio.openSelectKey();
             }
          } finally {
              setVideoLoading(false);
              setVideoStatus('');
          }
      }

      return (
          <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded shadow-sm">
                      <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                          <Icons.Presentation /> Source & Config
                      </h3>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Source URL (Deep Analysis)</label>
                          <input 
                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                            placeholder="https://mysite.com or specific article"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Content Type</label>
                          <select 
                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            value={type}
                            onChange={e => setType(e.target.value)}
                          >
                              <option>Presentation Deck</option>
                              <option>Video Ad Script</option>
                              <option>Written Tutorial</option>
                              <option>One-Pager PDF</option>
                              <option>Product Demo Flow</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Style & Constraints</label>
                          <input 
                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                            value={constraints}
                            onChange={e => setConstraints(e.target.value)}
                          />
                      </div>
                      <button 
                        onClick={handleGeneratePlan}
                        disabled={generating}
                        className="w-full bg-brand-primary text-white py-2 rounded font-bold hover:bg-brand-dark disabled:opacity-50"
                      >
                          {generating ? 'Analyzing & Generating...' : 'Generate Content'}
                      </button>
                  </div>

                  {/* Video Section */}
                  <div className="space-y-4 bg-slate-900 text-white p-6 rounded shadow-sm">
                       <h3 className="font-bold text-lg flex items-center gap-2">
                           Video Studio (Veo)
                       </h3>
                       <p className="text-sm text-slate-400">Generate high-fidelity videos for ads or demos.</p>
                       <div>
                           <label className="block text-sm font-medium mb-1 text-slate-300">Video Prompt</label>
                           <textarea 
                              className="w-full p-2 border border-slate-700 rounded bg-slate-800 text-white h-24"
                              placeholder={`A futuristic commercial for ${project.data.name}...`}
                              value={videoPrompt}
                              onChange={e => setVideoPrompt(e.target.value)}
                           />
                       </div>
                       <button 
                          onClick={handleGenerateVideo}
                          disabled={videoLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-bold hover:opacity-90 disabled:opacity-50"
                        >
                            {videoLoading ? videoStatus : 'Generate Video (Veo)'}
                        </button>
                        {videoUrl && (
                            <div className="mt-4">
                                <video src={videoUrl} controls className="w-full rounded border border-slate-700" />
                            </div>
                        )}
                  </div>
              </div>

              {/* Result Area */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded shadow-sm min-h-[400px]">
                  <h3 className="font-bold text-xl mb-4 dark:text-white flex justify-between">
                      Generated Content Plan
                      {project.artifacts.marketingGrounding && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {project.artifacts.marketingGrounding.length} Sources Analyzed
                          </span>
                      )}
                  </h3>
                  
                  {project.artifacts.marketingGrounding && project.artifacts.marketingGrounding.length > 0 && (
                      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                          <strong className="block mb-2 text-slate-500">Sources Used:</strong>
                          <div className="flex flex-wrap gap-2">
                              {project.artifacts.marketingGrounding.map((g: any, i) => (
                                  <a key={i} href={g.web?.uri} target="_blank" rel="noreferrer" className="text-brand-accent hover:underline bg-white dark:bg-slate-700 px-2 py-1 rounded border dark:border-slate-600 truncate max-w-[200px]">
                                      {g.web?.title || 'Source ' + (i+1)}
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}

                  {project.artifacts.marketingPlan ? (
                       <article className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                           {project.artifacts.marketingPlan}
                       </article>
                  ) : (
                      <div className="text-center text-slate-500 py-10">
                          Content plan will appear here.
                      </div>
                  )}
              </div>
          </div>
      );
  };

  // Asset Generator Sub-Component (Isolated for clarity)
  const AssetGenerator = () => {
      const [prompt, setPrompt] = useState("");
      const [generatedImage, setGeneratedImage] = useState<string | null>(null);
      const [loadingImg, setLoadingImg] = useState(false);
      const [editMode, setEditMode] = useState(false);

      const handleGen = async () => {
          setLoadingImg(true);
          try {
              // 1K size by default as per UI
              const result = await gemini.generateImage(prompt, '1K');
              setGeneratedImage(result);
              setEditMode(false);
          } catch(e) {
              console.error(e);
          } finally {
              setLoadingImg(false);
          }
      };

      const handleEdit = async () => {
          if (!generatedImage) return;
          setLoadingImg(true);
          try {
            const result = await gemini.editImage(generatedImage, prompt);
            if(result) setGeneratedImage(result);
          } catch(e) { console.error(e); } finally { setLoadingImg(false); }
      }

      return (
          <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold dark:text-white">Asset Studio</h3>
              <div className="flex gap-4">
                  <input 
                    type="text" 
                    className="flex-1 p-3 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    placeholder={editMode ? "Describe edit (e.g. 'Add a retro filter')" : "Describe asset to generate (e.g. 'App Icon for fitness app')"}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                  <button 
                    onClick={editMode ? handleEdit : handleGen}
                    disabled={loadingImg}
                    className="bg-brand-accent text-white px-6 rounded font-bold hover:bg-orange-700 disabled:opacity-50"
                  >
                      {loadingImg ? 'Processing...' : editMode ? 'Edit Asset' : 'Generate'}
                  </button>
              </div>

              {generatedImage && (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded shadow flex flex-col items-center">
                      <img src={generatedImage} alt="Generated Asset" className="max-h-96 rounded shadow-lg mb-4" />
                      <div className="flex gap-4">
                          <button onClick={() => setEditMode(!editMode)} className="text-brand-primary underline text-sm">
                              {editMode ? 'Cancel Edit' : 'Edit this image'}
                          </button>
                          <a href={generatedImage} download="asset.png" className="text-brand-primary underline text-sm">Download</a>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black font-sans text-slate-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 bg-brand-primary rounded mr-3"></div>
            <span className="font-bold text-lg tracking-tight dark:text-white">OrenGen</span>
        </div>
        
        <div className="flex-1 py-6 space-y-1">
            <SidebarItem active={view === AppView.DASHBOARD} label="Dashboard" onClick={() => setView(AppView.DASHBOARD)} icon={<Icons.Sparkle />} />
            {currentProject && (
                <SidebarItem active={view === AppView.STUDIO} label="Project Studio" onClick={() => setView(AppView.STUDIO)} icon={<Icons.Document />} />
            )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-600 dark:text-slate-400"
            >
                Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {view === AppView.DASHBOARD && renderDashboard()}
        {view === AppView.WIZARD && renderWizard()}
        {view === AppView.STUDIO && renderStudio()}
      </div>

      {/* Voice Session Modal */}
      {showVoiceSession && (
          <LiveSession 
            onClose={() => setShowVoiceSession(false)} 
            context={currentProject ? `Project: ${currentProject.data.name}. Context: ${currentProject.data.corePromise}` : 'No project selected.'}
          />
      )}

    </div>
  );
}
