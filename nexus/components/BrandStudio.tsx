import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import { BrandIdentity, PressRelease, MarketingAsset, Review } from '../types';
import { generateAgentResponse } from '../services/geminiService';
import { 
  PenTool, Globe, Image as ImageIcon, Loader2, Sparkles, 
  Megaphone, Copy, Layout, Palette, Type, Share2, Printer, 
  Download, ArrowRight, RefreshCw, PlusCircle, MessageSquare, Star, Reply, ThumbsUp, AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from '@tanstack/react-router';

const BrandStudio: React.FC = () => {
  const { activeProject, setProjects, activeProjectId } = useNexus();
  const [activeTab, setActiveTab] = useState<'identity' | 'press' | 'assets' | 'reputation'>('identity');
  const [loading, setLoading] = useState(false);
  
  // Inputs for generation
  const [websiteInput, setWebsiteInput] = useState('');
  const [logoInput, setLogoInput] = useState('');
  const [descInput, setDescInput] = useState('');

  // Mock Reviews
  const [reviews, setReviews] = useState<Review[]>([
      { id: 'r1', platform: 'Google', author: 'Alice M.', rating: 5, content: 'Absolutely game-changing platform. The AI agents are incredibly smart.', date: '2 days ago', sentiment: 'positive', status: 'unanswered' },
      { id: 'r2', platform: 'Yelp', author: 'Bob D.', rating: 3, content: 'Good concept but the UI is a bit overwhelming at first.', date: '5 days ago', sentiment: 'neutral', status: 'unanswered' },
      { id: 'r3', platform: 'Facebook', author: 'Charlie K.', rating: 1, content: 'Customer support never replied to my ticket. Frustrating.', date: '1 week ago', sentiment: 'negative', status: 'unanswered' }
  ]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  if (!activeProject) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <PenTool size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Brand & Press Center</h1>
            <p className="text-slate-500 max-w-md mb-8">
                Access your Press Center, Brand Identity Generator, and Marketing Assets. 
                Please select an active project from the Dashboard or create a new one to begin.
            </p>
            <div className="flex gap-4">
                 <Link to="/" className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Go to Dashboard
                 </Link>
                 <Link to="/new-project" className="px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <PlusCircle size={20} /> Create New Project
                 </Link>
            </div>
        </div>
      );
  }

  const updateProject = (updates: Partial<typeof activeProject>) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates } : p));
  };

  const handleAutoBrand = async () => {
    setLoading(true);
    
    const context = `
      Project Name: ${activeProject.name}
      Website/Context: ${websiteInput}
      Description: ${descInput}
    `;

    // 1. Generate Identity Schema
    const identityPrompt = `
      Analyze the provided context and generate a complete Brand Identity Schema. 
      Return ONLY a JSON object with these keys: 
      primaryColor (hex), secondaryColor (hex), fontPairing (e.g. "Inter + Merriweather"), 
      tagline (catchy, under 10 words), voiceDescription (e.g. "Professional, Authoritative"), 
      missionStatement (1 sentence).
    `;
    
    try {
      const identityRaw = await generateAgentResponse('brand_guardian', identityPrompt, context);
      const cleanJson = identityRaw.replace(/```json/g, '').replace(/```/g, '').trim();
      const identityData = JSON.parse(cleanJson);
      
      const newIdentity: BrandIdentity = {
        logoUrl: logoInput || 'https://placehold.co/150x150/0f172a/ffffff?text=LOGO',
        websiteUrl: websiteInput,
        ...identityData
      };

      // 2. Generate Initial Press Release
      const pressPrompt = `
         Using the brand voice "${newIdentity.voiceDescription}", write a Press Release announcing the launch of ${activeProject.name}.
         Includes: Headline, Dateline, Body, About Company boilerplate, and Media Contact placeholder.
      `;
      const pressContent = await generateAgentResponse('press_secretary' as any, pressPrompt, context);
      
      const newPress: PressRelease = {
        id: Date.now().toString(),
        title: `Launch Announcement: ${activeProject.name}`,
        date: new Date().toLocaleDateString(),
        content: pressContent,
        status: 'draft',
        distributionChannels: ['PR Newswire', 'Business Wire', 'TechCrunch']
      };

      // 3. Generate Marketing Assets
      const socialPrompt = `Write 3 catchy social media posts (LinkedIn, Twitter, Instagram) for this brand launch. Use the tagline: "${newIdentity.tagline}".`;
      const socialContent = await generateAgentResponse('campaign_orchestrator', socialPrompt, context);
      
      const newAssets: MarketingAsset[] = [
        { id: '1', type: 'social_post', content: socialContent, platform: 'Social Suite' },
        { id: '2', type: 'banner_mockup', content: 'Hero Banner', imageUrl: newIdentity.logoUrl, platform: 'Web' }
      ];

      updateProject({
        brandIdentity: newIdentity,
        pressReleases: [newPress, ...(activeProject.pressReleases || [])],
        marketingAssets: newAssets
      });

      setActiveTab('identity');
    } catch (e) {
      console.error("Branding Error", e);
      alert("AI Analysis failed. Please try again with more description.");
    } finally {
      setLoading(false);
    }
  };

  const generateReply = async (review: Review) => {
      setReplyingTo(review.id);
      setReplyDraft('Thinking...');
      const prompt = `Write a polite, professional, and brand-aligned reply to this review on ${review.platform}: "${review.content}". Rating: ${review.rating}/5. Address specific points.`;
      const reply = await generateAgentResponse('reputation_manager', prompt, `Brand Voice: ${activeProject.brandIdentity?.voiceDescription || 'Professional'}`);
      setReplyDraft(reply);
  };

  const submitReply = (reviewId: string) => {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'replied', reply: replyDraft } : r));
      setReplyingTo(null);
      setReplyDraft('');
  };

  const renderIdentityTab = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="text-brand-accent"/> Auto-Branding Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">Logo URL (Optional)</label>
                <div className="flex gap-2">
                    <input 
                        value={logoInput}
                        onChange={e => setLogoInput(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                    />
                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {logoInput ? <img src={logoInput} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon size={16} className="text-slate-400"/>}
                    </div>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Website or Reference URL</label>
                <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                    <Globe size={16} className="text-slate-400" />
                    <input 
                        value={websiteInput}
                        onChange={e => setWebsiteInput(e.target.value)}
                        placeholder="www.yourstartup.com"
                        className="flex-1 bg-transparent outline-none"
                    />
                </div>
             </div>
          </div>
          <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1">Brand Description / Mission</label>
              <textarea 
                  value={descInput}
                  onChange={e => setDescInput(e.target.value)}
                  placeholder="Describe what you do. The AI will extract the voice, tone, and visual direction from this."
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none resize-none"
              />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
             <button 
                onClick={handleAutoBrand}
                disabled={loading}
                className="bg-brand-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 transition-colors"
             >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {loading ? 'Analyzing & Generating...' : 'Generate Brand System'}
             </button>
        </div>
      </div>

      {/* Results Section */}
      {activeProject.brandIdentity && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visuals */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent to-brand-primary"></div>
                <h3 className="font-bold mb-4 flex items-center gap-2"><Palette size={18}/> Visual Identity</h3>
                
                <div className="flex flex-col items-center mb-6">
                    <img src={activeProject.brandIdentity.logoUrl} alt="Brand Logo" className="h-24 object-contain mb-4" />
                    <div className="text-center">
                        <div className="font-bold text-lg">{activeProject.brandIdentity.tagline}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Official Tagline</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: activeProject.brandIdentity.primaryColor }}></div>
                        <div>
                            <div className="font-mono text-sm">{activeProject.brandIdentity.primaryColor}</div>
                            <div className="text-xs text-slate-500">Primary Brand</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: activeProject.brandIdentity.secondaryColor }}></div>
                        <div>
                             <div className="font-mono text-sm">{activeProject.brandIdentity.secondaryColor}</div>
                            <div className="text-xs text-slate-500">Secondary Accent</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography & Voice */}
             <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold mb-4 flex items-center gap-2"><Type size={18}/> Voice & Typography</h3>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Typography Pair</div>
                        <div className="text-xl font-serif">{activeProject.brandIdentity.fontPairing}</div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            The quick brown fox jumps over the lazy dog.
                        </p>
                     </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Brand Voice</div>
                        <div className="font-medium">{activeProject.brandIdentity.voiceDescription}</div>
                     </div>
                 </div>

                 <div className="mt-6">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Mission Statement</div>
                    <blockquote className="border-l-4 border-brand-accent pl-4 italic text-slate-700 dark:text-slate-300">
                        "{activeProject.brandIdentity.missionStatement}"
                    </blockquote>
                 </div>
             </div>
        </div>
      )}
    </div>
  );

  const renderPressCenter = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Megaphone className="text-brand-accent" /> Press Center</h2>
                <p className="text-slate-500">Manage press releases and media distribution.</p>
            </div>
            <button 
                onClick={handleAutoBrand}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90"
            >
                <PlusIcon /> New Release
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {activeProject.pressReleases?.map(pr => (
                    <div key={pr.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase rounded">{pr.status}</span>
                            <span className="text-sm text-slate-400">{pr.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4">{pr.title}</h3>
                        <div className="prose dark:prose-invert prose-sm max-w-none line-clamp-3 mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                            <ReactMarkdown>{pr.content}</ReactMarkdown>
                        </div>
                        <div className="flex gap-2 border-t border-slate-100 dark:border-slate-700 pt-4">
                            <button className="text-sm font-medium text-brand-primary flex items-center gap-1 hover:underline">
                                <PenTool size={14}/> Edit
                            </button>
                            <button className="text-sm font-medium text-slate-500 flex items-center gap-1 hover:underline">
                                <Printer size={14}/> PDF
                            </button>
                             <button className="text-sm font-medium text-slate-500 flex items-center gap-1 hover:underline ml-auto">
                                <Share2 size={14}/> Distribute
                            </button>
                        </div>
                    </div>
                ))}
                 {!activeProject.pressReleases?.length && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Megaphone className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-500">No Press Releases Yet</h3>
                        <p className="text-sm text-slate-400">Use the Auto-Branding Engine to generate your first draft.</p>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 className="font-bold mb-4">Distribution Channels</h4>
                    <ul className="space-y-2 text-sm">
                        {['PR Newswire', 'Business Wire', 'Associated Press', 'TechCrunch', 'Forbes'].map(ch => (
                            <li key={ch} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                {ch}
                            </li>
                        ))}
                    </ul>
                 </div>
            </div>
        </div>
    </div>
  );

  const renderAssets = () => (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Layout className="text-brand-accent" /> Marketing Assets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProject.marketingAssets?.map(asset => (
                <div key={asset.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {asset.imageUrl && (
                        <div className="h-48 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-8">
                            <div className="absolute inset-0 opacity-10 bg-repeat space-x-4 space-y-4" style={{ backgroundImage: `url(${asset.imageUrl})`, backgroundSize: '50px' }}></div>
                            <div className="z-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl flex flex-col items-center">
                                <img src={asset.imageUrl} className="h-12 object-contain mb-2" />
                                <span className="font-bold text-brand-primary dark:text-white text-lg">{activeProject.brandIdentity?.tagline}</span>
                                <button className="mt-2 px-3 py-1 bg-brand-accent text-white text-xs rounded">Learn More</button>
                            </div>
                        </div>
                    )}
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold uppercase text-slate-400">{asset.type.replace('_', ' ')}</span>
                             <button className="text-slate-400 hover:text-brand-accent"><Copy size={14}/></button>
                        </div>
                        <div className="prose dark:prose-invert prose-sm line-clamp-4">
                            <ReactMarkdown>{asset.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
             {!activeProject.marketingAssets?.length && (
                <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <Layout className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-slate-500">No Assets Generated</h3>
                    <p className="text-sm text-slate-400">Run the Branding Engine to create social posts and banners.</p>
                </div>
            )}
        </div>
      </div>
  );

  const renderReputation = () => (
      <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">4.2</div>
                  <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />)}
                  </div>
                  <div className="text-sm text-slate-500">Average Rating</div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
                  <div className="text-4xl font-bold text-green-500 mb-2">85%</div>
                  <div className="text-sm text-slate-500">Positive Sentiment</div>
              </div>
              <div className="col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold mb-4">Platform Breakdown</h3>
                  <div className="space-y-3">
                      {[
                          { name: 'Google', count: 124, score: 4.8, color: 'bg-blue-500' },
                          { name: 'Facebook', count: 85, score: 4.1, color: 'bg-blue-600' },
                          { name: 'Yelp', count: 42, score: 3.5, color: 'bg-red-500' }
                      ].map(p => (
                          <div key={p.name} className="flex items-center gap-4 text-sm">
                              <span className="w-20 font-medium">{p.name}</span>
                              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${p.color}`} style={{ width: `${(p.score/5)*100}%` }}></div>
                              </div>
                              <span className="font-mono">{p.score}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold flex items-center gap-2">
                  <MessageSquare size={18} className="text-brand-accent"/> Recent Reviews
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {reviews.map(review => (
                      <div key={review.id} className="p-6">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <div className="font-bold text-slate-900 dark:text-white">{review.author}</div>
                                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                      review.platform === 'Google' ? 'bg-blue-100 text-blue-700' : 
                                      review.platform === 'Yelp' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                                  }`}>
                                      {review.platform}
                                  </span>
                                  <span className="text-xs text-slate-400">{review.date}</span>
                              </div>
                              <div className="flex gap-1">
                                  {Array.from({length: 5}).map((_, i) => (
                                      <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                                  ))}
                              </div>
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-300 mb-4">{review.content}</p>
                          
                          {review.status === 'replied' ? (
                              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border-l-4 border-brand-primary text-sm">
                                  <div className="font-bold text-brand-primary mb-1 flex items-center gap-2"><Reply size={14}/> Reply Sent</div>
                                  <div className="text-slate-600 dark:text-slate-400">{review.reply}</div>
                              </div>
                          ) : (
                              replyingTo === review.id ? (
                                  <div className="space-y-2">
                                      <textarea 
                                          value={replyDraft}
                                          onChange={e => setReplyDraft(e.target.value)}
                                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary text-sm"
                                          rows={3}
                                      />
                                      <div className="flex gap-2">
                                          <button onClick={() => submitReply(review.id)} className="px-4 py-2 bg-brand-primary text-white rounded text-sm font-medium hover:bg-slate-700">Send Reply</button>
                                          <button onClick={() => setReplyingTo(null)} className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm">Cancel</button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="flex gap-2">
                                      <button onClick={() => generateReply(review)} className="text-sm font-medium text-brand-primary hover:text-brand-accent flex items-center gap-1">
                                          <Sparkles size={14}/> Generate AI Reply
                                      </button>
                                      {review.sentiment === 'negative' && (
                                          <span className="text-xs text-red-500 flex items-center gap-1 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                              <AlertTriangle size={12}/> Negative Sentiment
                                          </span>
                                      )}
                                  </div>
                              )
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold">Brand & Reputation</h1>
            <p className="text-slate-500">Identity management, press, and reviews.</p>
         </div>
         
         <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1 shadow-sm overflow-x-auto max-w-full">
            {[
                { id: 'identity', label: 'Identity', icon: PenTool },
                { id: 'reputation', label: 'Reputation', icon: MessageSquare },
                { id: 'press', label: 'Press Center', icon: Megaphone },
                { id: 'assets', label: 'Assets', icon: Layout }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-brand-primary text-white' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
         {activeTab === 'identity' && renderIdentityTab()}
         {activeTab === 'reputation' && renderReputation()}
         {activeTab === 'press' && renderPressCenter()}
         {activeTab === 'assets' && renderAssets()}
      </div>
    </div>
  );
};

export default BrandStudio;