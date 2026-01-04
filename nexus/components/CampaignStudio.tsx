import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import AgentWorkspace from './AgentWorkspace';
import Checklist from './Checklist';
import { 
  Download, Image as ImageIcon, FileText, ExternalLink, Rocket, 
  Package, Loader2, Mail, RefreshCw, MessageCircle, Phone, Send,
  Target, MapPin, Search, Layout, CreditCard, MousePointerClick, Map, Sparkles,
  Plus, Edit, Trash2, X, Save, Filter
} from 'lucide-react';
import { Navigate } from '@tanstack/react-router';
import JSZip from 'jszip';
import { MOCK_EMAILS } from '../constants';
import { generateAgentResponse, generateImage } from '../services/geminiService';
import { AdCampaign, Template } from '../types';

const CampaignStudio: React.FC = () => {
  const { activeProject, setPreviewItem } = useNexus();
  const [activeTab, setActiveTab] = useState<'launch' | 'ads' | 'templates' | 'email'>('launch');
  const [isExporting, setIsExporting] = useState(false);
  
  // Ad Gen State
  const [adInputs, setAdInputs] = useState({ product: '', goal: 'Sales', location: '', radius: 10 });
  const [generatedAds, setGeneratedAds] = useState<AdCampaign[]>([]);
  const [generatingAds, setGeneratingAds] = useState(false);

  // Template State
  const [templates, setTemplates] = useState<Template[]>([
      { id: 't1', title: 'SaaS Launch Sequence', category: 'Newsletter', description: '7-day nurture sequence for new signups.', previewColor: 'bg-blue-500', structure: 'Launch' },
      { id: 't2', title: 'Black Friday Blast', category: 'Ad', description: 'High-urgency promotional copy.', previewColor: 'bg-red-500', structure: 'Promo' },
      { id: 't3', title: 'Viral Thread', category: 'Social', description: 'Storytelling framework for X/LinkedIn.', previewColor: 'bg-slate-800', structure: 'Viral' },
      { id: 't4', title: 'Webinar Invite', category: 'Email', description: 'Registration drive for events.', previewColor: 'bg-purple-500', structure: 'Event' },
  ]);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('All');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({});

  if (!activeProject) return <Navigate to="/new-project" />;

  const assets = activeProject.checklist.filter(item => item.output && item.status === 'done');

  const handleDownload = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateAds = async () => {
      setGeneratingAds(true);
      try {
          const prompt = `
            Create an Ad Campaign for: ${adInputs.product || activeProject.name}.
            Goal: ${adInputs.goal}.
            Targeting: ${adInputs.location} (+${adInputs.radius} miles).
            Context: ${activeProject.audience}.
            
            Return JSON with:
            - name (Campaign Name)
            - platform (Meta)
            - variants (Array of 3 objects: { headline, primaryText, cta, imagePrompt })
            - targeting (Object: { locations: [${adInputs.location}], radius: ${adInputs.radius}, interests: [3-5 keywords], ageRange })
            - metaTags (Object: { title, description, keywords })
          `;
          
          const response = await generateAgentResponse('ad_specialist', prompt, '', true);
          const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
          const campaign: AdCampaign = JSON.parse(cleanJson);
          campaign.id = Date.now().toString();
          campaign.status = 'draft';
          
          setGeneratedAds([campaign, ...generatedAds]);
      } catch (e) {
          alert('Ad generation failed. Try again.');
          console.error(e);
      } finally {
          setGeneratingAds(false);
      }
  };

  // Template Handlers
  const handleSaveTemplate = () => {
      if (!editingTemplate.title || !editingTemplate.description) return;
      
      if (editingTemplate.id) {
          setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...editingTemplate } as Template : t));
      } else {
          const newTemplate: Template = {
              id: Date.now().toString(),
              title: editingTemplate.title!,
              category: editingTemplate.category || 'Custom',
              description: editingTemplate.description!,
              previewColor: 'bg-brand-primary',
              structure: editingTemplate.structure || ''
          };
          setTemplates(prev => [...prev, newTemplate]);
      }
      setIsTemplateModalOpen(false);
      setEditingTemplate({});
  };

  const handleDeleteTemplate = (id: string) => {
      if (confirm('Are you sure you want to delete this template?')) {
          setTemplates(prev => prev.filter(t => t.id !== id));
      }
  };

  const openNewTemplateModal = () => {
      setEditingTemplate({ category: 'Custom' });
      setIsTemplateModalOpen(true);
  };

  const openEditTemplateModal = (template: Template) => {
      setEditingTemplate(template);
      setIsTemplateModalOpen(true);
  };

  const filteredTemplates = templates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(templateSearch.toLowerCase()) || t.description.toLowerCase().includes(templateSearch.toLowerCase());
      const matchesCategory = templateCategory === 'All' || t.category === templateCategory;
      return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const renderAdsTab = () => (
      <div className="h-full flex flex-col gap-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-fit">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={20} className="text-red-500"/> Ad Configurator</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaign Goal</label>
                          <select 
                            value={adInputs.goal} onChange={e => setAdInputs({...adInputs, goal: e.target.value})}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                          >
                              <option>Sales / Conversions</option>
                              <option>Traffic</option>
                              <option>Leads</option>
                              <option>Brand Awareness</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Geofencing Target</label>
                          <div className="flex gap-2">
                              <div className="relative flex-1">
                                  <MapPin size={14} className="absolute left-2 top-3 text-slate-400"/>
                                  <input 
                                    placeholder="City, Zip, or Address"
                                    value={adInputs.location}
                                    onChange={e => setAdInputs({...adInputs, location: e.target.value})}
                                    className="w-full pl-8 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                  />
                              </div>
                              <input 
                                type="number" 
                                value={adInputs.radius}
                                onChange={e => setAdInputs({...adInputs, radius: parseInt(e.target.value)})}
                                className="w-16 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-center"
                              />
                              <span className="text-xs text-slate-500 self-center">mi</span>
                          </div>
                      </div>
                      <button 
                        onClick={handleGenerateAds}
                        disabled={generatingAds}
                        className="w-full py-2 bg-brand-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                          {generatingAds ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
                          Generate Campaign
                      </button>
                  </div>
              </div>

              {/* Map Visualization (Mock) */}
              <div className="md:col-span-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="text-center z-10">
                      <div className="w-24 h-24 bg-blue-500/20 border-2 border-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                          <MapPin size={32} className="text-blue-500" />
                      </div>
                      <h3 className="font-bold text-slate-600 dark:text-slate-300">Geofence Active</h3>
                      <p className="text-sm text-slate-500">{adInputs.location ? `${adInputs.location} (+${adInputs.radius}mi)` : 'Global Targeting'}</p>
                  </div>
              </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 gap-6">
              {generatedAds.map(campaign => (
                  <div key={campaign.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                      <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded">Meta Ads</span>
                                  <h3 className="text-lg font-bold">{campaign.name}</h3>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex gap-4">
                                  <span>Interests: {campaign.targeting.interests.join(', ')}</span>
                                  <span>Age: {campaign.targeting.ageRange}</span>
                              </div>
                          </div>
                          <button className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1">
                              <Download size={14}/> Export JSON
                          </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {campaign.variants.map((variant, i) => (
                              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Variant {String.fromCharCode(65+i)}</div>
                                  <div className="font-bold text-sm mb-2">{variant.headline}</div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{variant.primaryText}</p>
                                  <div className="bg-slate-200 dark:bg-slate-800 h-32 rounded mb-3 flex items-center justify-center text-xs text-slate-500 text-center p-2">
                                      Prompt: {variant.imagePrompt.slice(0, 50)}...
                                  </div>
                                  <button className="w-full py-1.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                      {variant.cta}
                                  </button>
                              </div>
                          ))}
                      </div>
                      
                      {campaign.metaTags && (
                          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-400">
                              <div className="mb-1"><span className="text-purple-500">&lt;title&gt;</span>{campaign.metaTags.title}<span className="text-purple-500">&lt;/title&gt;</span></div>
                              <div className="mb-1"><span className="text-purple-500">&lt;meta name="description" content="</span>{campaign.metaTags.description}<span className="text-purple-500">" /&gt;</span></div>
                              <div><span className="text-purple-500">&lt;meta name="keywords" content="</span>{campaign.metaTags.keywords.join(', ')}<span className="text-purple-500">" /&gt;</span></div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderTemplatesTab = () => (
      <div className="animate-fadeIn">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                  <h3 className="text-xl font-bold mb-1">Template Hub</h3>
                  <p className="text-slate-500 text-sm">Manage and deploy reusable marketing frameworks.</p>
              </div>
              <button 
                  onClick={openNewTemplateModal}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors"
              >
                  <Plus size={18} /> New Template
              </button>
          </div>

          {/* Filtering */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                      type="text" 
                      placeholder="Search templates..."
                      value={templateSearch}
                      onChange={e => setTemplateSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
                  />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                  <Filter size={16} className="text-slate-400" />
                  {categories.map(cat => (
                      <button
                          key={cat}
                          onClick={() => setTemplateCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                              templateCategory === cat 
                              ? 'bg-brand-primary text-white' 
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map(t => (
                  <div key={t.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group relative">
                      <div className={`h-32 ${t.previewColor} flex items-center justify-center relative`}>
                          <FileText className="text-white opacity-50 group-hover:scale-110 transition-transform" size={48} />
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); openEditTemplateModal(t); }} className="p-1.5 bg-white/20 hover:bg-white/40 rounded text-white backdrop-blur-sm">
                                  <Edit size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }} className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded text-white backdrop-blur-sm">
                                  <Trash2 size={14} />
                              </button>
                          </div>
                      </div>
                      <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                  {t.category}
                              </span>
                          </div>
                          <h4 className="font-bold text-lg mb-1 truncate" title={t.title}>{t.title}</h4>
                          <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{t.description}</p>
                          <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                              <Sparkles size={14} /> Auto-Fill with AI
                          </button>
                      </div>
                  </div>
              ))}
              {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400">
                      No templates found matching your criteria.
                  </div>
              )}
          </div>

          {/* Modal */}
          {isTemplateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-in zoom-in-95">
                      <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                          <h3 className="text-lg font-bold">{editingTemplate.id ? 'Edit Template' : 'New Template'}</h3>
                          <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              <X size={20} />
                          </button>
                      </div>
                      <div className="p-6 space-y-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <input 
                                  value={editingTemplate.title || ''}
                                  onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                  placeholder="e.g. Cold Email Sequence"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <div className="relative">
                                  <input 
                                      value={editingTemplate.category || ''}
                                      onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value})}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                      list="category-suggestions"
                                      placeholder="Select or type..."
                                  />
                                  <datalist id="category-suggestions">
                                      {['Newsletter', 'Ad', 'Social', 'Email', 'Custom'].map(c => <option key={c} value={c} />)}
                                  </datalist>
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea 
                                  value={editingTemplate.description || ''}
                                  onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none resize-none h-20"
                                  placeholder="What is this template used for?"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Structure / Prompt</label>
                              <textarea 
                                  value={editingTemplate.structure || ''}
                                  onChange={e => setEditingTemplate({...editingTemplate, structure: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none resize-none h-32 font-mono text-xs"
                                  placeholder="Enter the prompt structure or framework details..."
                              />
                          </div>
                      </div>
                      <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                          <button onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
                          <button onClick={handleSaveTemplate} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
                              <Save size={16} /> Save Template
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Left Column: Agent & Context */}
      <div className="xl:col-span-2 h-full flex flex-col gap-6">
        
        {/* Header / Launch Bay Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2"><Rocket className="text-brand-accent"/> Campaign Studio</h1>
                <p className="text-sm text-slate-500">Orchestrate ads, emails, and templates.</p>
            </div>
            
             <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg flex gap-1 overflow-x-auto max-w-full">
                 <button 
                    onClick={() => setActiveTab('launch')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'launch' ? 'bg-white dark:bg-slate-800 shadow text-brand-primary' : 'text-slate-500'}`}
                 >
                    <Package size={16} /> Assets
                 </button>
                 <button 
                    onClick={() => setActiveTab('ads')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'ads' ? 'bg-white dark:bg-slate-800 shadow text-brand-primary' : 'text-slate-500'}`}
                 >
                    <MousePointerClick size={16} /> Paid Ads
                 </button>
                 <button 
                    onClick={() => setActiveTab('templates')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'templates' ? 'bg-white dark:bg-slate-800 shadow text-brand-primary' : 'text-slate-500'}`}
                 >
                    <Layout size={16} /> Templates
                 </button>
                 <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'email' ? 'bg-white dark:bg-slate-800 shadow text-brand-primary' : 'text-slate-500'}`}
                 >
                    <Mail size={16} /> Email
                 </button>
            </div>
        </div>

        {/* Content Area */}
        {activeTab === 'launch' && (
            <>
                <div className="flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <ImageIcon size={18} /> Deployable Assets Preview
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assets.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center text-slate-400 h-40 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <p>No assets generated yet.</p>
                                <p className="text-sm">Use the Agent to generate copy or images.</p>
                            </div>
                        )}

                        {assets.map(asset => (
                            <div key={asset.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm group hover:shadow-md transition-all">
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                                        {(asset.output!.startsWith('data:image') || asset.output!.startsWith('http')) ? <ImageIcon size={12}/> : <FileText size={12}/>}
                                        <span className="truncate max-w-[150px]">{asset.category}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setPreviewItem(asset)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="View Full"><ExternalLink size={14} className="text-slate-400"/></button>
                                        <button onClick={() => handleDownload(asset.output!, asset.title)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="Download"><Download size={14} className="text-slate-400"/></button>
                                    </div>
                                </div>
                                <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-black/20 group cursor-pointer" onClick={() => setPreviewItem(asset)}>
                                    {(asset.output!.startsWith('data:image') || asset.output!.startsWith('http')) ? (
                                        <img src={asset.output} alt={asset.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="p-3 text-xs text-slate-600 dark:text-slate-400 font-mono overflow-hidden h-full whitespace-pre-wrap">{asset.output!.slice(0, 300)}...</div>
                                    )}
                                </div>
                                <div className="p-3"><h4 className="font-bold text-sm truncate" title={asset.title}>{asset.title}</h4></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-[400px]">
                    <AgentWorkspace project={activeProject} agentType={'campaign_orchestrator'} title={'Campaign Commander'} />
                </div>
            </>
        )}

        {activeTab === 'ads' && renderAdsTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        
        {activeTab === 'email' && (
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex h-[600px] overflow-hidden animate-fadeIn items-center justify-center text-slate-400">
                 <div className="text-center">
                     <Mail size={48} className="mx-auto mb-4 opacity-50"/>
                     <h3 className="font-bold">Email Studio</h3>
                     <p>Connect MailWizz or Mailpit to view campaigns.</p>
                 </div>
             </div>
        )}

      </div>

      {/* Right Column: Checklist */}
      <div className="hidden xl:block overflow-y-auto">
        <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-300">Campaign Checklist</h3>
        <Checklist items={activeProject.checklist} onRunStep={() => {}} onToggle={() => {}} onPreview={setPreviewItem} />
      </div>
    </div>
  );
};

export default CampaignStudio;