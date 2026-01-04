import React, { useState, useEffect } from 'react';
import { Project, ChecklistItem } from '../types';
import { DEFAULT_CHECKLIST_TEMPLATE } from '../constants';
import { Target, Users, Type, Sliders, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { generateAgentResponse } from '../services/geminiService';

interface Props {
  onComplete: (project: Project) => void;
}

const ProjectWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SaaS Launch',
    audience: '',
    tone: 'Bold',
    goal: ''
  });

  // AI Suggestion State
  const [suggestedAudiences, setSuggestedAudiences] = useState<string[]>([]);
  const [generatingAudiences, setGeneratingAudiences] = useState(false);

  const GOAL_OPTIONS = [
    "Acquire 100 beta users",
    "Generate $10k in pre-sales",
    "Build an email list of 1,000 subscribers",
    "Validate MVP core features",
    "Establish brand authority in a niche",
    "Secure seed funding round",
    "Launch on Product Hunt successfully"
  ];

  const handleNext = async () => {
    if (step === 1) {
        setStep(2);
        // Trigger AI suggestions if we have a name/type but no audience yet
        if (formData.name && formData.type && suggestedAudiences.length === 0) {
            generateAudiences();
        }
    } else if (step < 3) {
      setStep(step + 1);
    } else {
      finishSetup();
    }
  };

  const handleBack = () => {
      if (step > 1) setStep(step - 1);
  };

  const generateAudiences = async () => {
    setGeneratingAudiences(true);
    const prompt = `
      Based on the project name "${formData.name}" and type "${formData.type}", 
      suggest 4 distinct, specific Target Audiences (ICPs).
      Return ONLY a JSON array of strings. Example: ["Remote HR Managers", "Freelance Designers"].
    `;
    try {
        const response = await generateAgentResponse('master_strategist', prompt, '', true);
        const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const auds = JSON.parse(clean);
        if (Array.isArray(auds)) {
            setSuggestedAudiences(auds);
            // Optional: Auto-select first if empty
            if (!formData.audience) setFormData(prev => ({ ...prev, audience: auds[0] }));
        }
    } catch (e) {
        console.error("Audience Gen Error", e);
    } finally {
        setGeneratingAudiences(false);
    }
  };

  const finishSetup = async () => {
    setLoading(true);
    // Use Gemini to generate an initial summary or refine the checklist based on input
    const context = `Project: ${formData.name}, Type: ${formData.type}, Audience: ${formData.audience}, Goal: ${formData.goal}`;
    const initialStrategy = await generateAgentResponse('master_strategist', 'Create a 1-sentence executive summary for this project setup.', context, false);

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      audience: formData.audience,
      status: 'planning',
      progress: 0,
      readinessScore: 10,
      checklist: JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_TEMPLATE)), // Deep copy
      kpis: { "Launch Date": "TBD" },
      tone: formData.tone,
      language: "en"
    };
    
    // Mark first item done
    newProject.checklist[0].status = 'done';
    newProject.checklist[0].output = initialStrategy;

    setLoading(false);
    onComplete(newProject);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-2">Initialize New Project</h1>
      <p className="text-slate-500 mb-8">Define the parameters for the Orchestrator.</p>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8 text-sm font-medium">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
          <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-700">
            <div className={`h-full bg-brand-primary transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
           <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-700">
            <div className={`h-full bg-brand-primary transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
          </div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
        </div>

        {/* Forms */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Type size={20}/> Basics</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-brand-primary outline-none" 
                  placeholder="e.g. Operation Skyfall"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                   className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-brand-primary outline-none" 
                >
                  <option>SaaS Launch</option>
                  <option>Digital Product</option>
                  <option>Physical Good</option>
                  <option>Service Agency</option>
                  <option>Newsletter / Media</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-fadeIn">
               <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Target size={20}/> Audience & Goal</h3>
               
               <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Target Audience (ICP)</label>
                    {generatingAudiences && (
                        <span className="text-xs text-brand-accent flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin"/> AI Generating...
                        </span>
                    )}
                </div>
                
                {/* AI Dropdown */}
                {suggestedAudiences.length > 0 && (
                    <div className="mb-2">
                        <select
                            onChange={(e) => setFormData({...formData, audience: e.target.value})}
                            className="w-full p-2 text-sm bg-brand-primary/5 border border-brand-primary/20 rounded-lg text-slate-700 dark:text-slate-300 outline-none mb-2"
                            defaultValue=""
                        >
                            <option value="" disabled>✨ Select an AI Suggested Audience...</option>
                            {suggestedAudiences.map((aud, i) => (
                                <option key={i} value={aud}>{aud}</option>
                            ))}
                        </select>
                    </div>
                )}

                <textarea 
                  value={formData.audience}
                  onChange={e => setFormData({...formData, audience: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-brand-primary outline-none h-24 resize-none" 
                  placeholder="e.g. CMOs at Series B tech companies who struggle with..."
                />
              </div>

               <div>
                <label className="block text-sm font-medium mb-1">Primary Goal</label>
                <div className="relative">
                    <input 
                        value={formData.goal}
                        onChange={e => setFormData({...formData, goal: e.target.value})}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-brand-primary outline-none" 
                        placeholder="Select or type a goal..."
                        list="goal-options"
                    />
                    <datalist id="goal-options">
                        {GOAL_OPTIONS.map((g, i) => (
                            <option key={i} value={g} />
                        ))}
                    </datalist>
                </div>
              </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-4 animate-fadeIn">
               <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Sliders size={20}/> Tone & Vibe</h3>
                <div>
                <label className="block text-sm font-medium mb-1">Brand Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Corporate', 'Casual', 'Bold', 'Luxury', 'Technical'].map(t => (
                    <button
                      key={t}
                      onClick={() => setFormData({...formData, tone: t})}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.tone === t 
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
             </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
          {step > 1 ? (
              <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={18} /> Back
              </button>
          ) : (
              <div></div> // Spacer
          )}

          <button 
            onClick={handleNext}
            disabled={loading}
            className="bg-brand-primary hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Initializing...' : (step === 3 ? 'Launch Project' : 'Next Step')}
            {!loading && <ChevronRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectWizard;