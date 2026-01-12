import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Settings, 
  Sparkles, 
  Palette,
  Video,
  Image as ImageIcon,
  Zap,
  Clock,
  LayoutTemplate,
  CalendarDays,
  Upload,
  Cookie,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Search,
  ChevronDown,
  BarChart2,
  Users,
  Globe,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { BrandProfile, GeneratedContent, Platform, ContentFormat, ScheduledPost, PostStatus } from './types';
import { generateAdContent, generateAdImage, generateAdVideo, enhanceBrandGuidelines, generateSpeech, rewritePostForPlatform } from './services/geminiService';
import { AdPreview } from './components/AdPreview';
import { ScheduleBoard } from './components/ScheduleBoard';
import { CampaignManager } from './components/CampaignManager';
import { OfferGenerator } from './components/OfferGenerator';

// --- Command Center (Sidebar) ---
const CommandCenter = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const [isSolutionsOpen, setSolutionsOpen] = useState(true);

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 shadow-2xl font-sans">
      {/* Brand Header */}
      <div className="p-6 flex items-center space-x-3 mb-2">
         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Sparkles size={18} className="text-white relative z-10" />
         </div>
         <span className="font-bold text-lg text-white tracking-tight">OrenGen AI</span>
      </div>

      {/* Search Bar (Cmd+K style) */}
      <div className="px-4 mb-8">
        <div className="relative group">
           <Search size={14} className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
           <input 
             type="text" 
             placeholder="Search..." 
             className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-200 placeholder-slate-600 shadow-inner"
           />
           <div className="absolute right-2 top-2 border border-slate-700 bg-slate-800/50 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500">⌘K</div>
        </div>
      </div>

      {/* Directory Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-8 custom-scrollbar">
        
        {/* Main Workspace */}
        <div>
           <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Workspace</h3>
           <nav className="space-y-1">
             <NavButton active={activeTab === 'create'} onClick={() => setActiveTab('create')} icon={PenTool} label="Creation Studio" />
             <NavButton active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} icon={Layers} label="Ad Campaigns" />
             <NavButton active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} icon={ShoppingBag} label="Offer Generator" badge="New" />
             <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={CalendarDays} label="Calendar" />
             <NavButton active={activeTab === 'brand'} onClick={() => setActiveTab('brand')} icon={LayoutTemplate} label="Brand Identity" />
           </nav>
        </div>

        {/* Solutions Accordion */}
        <div>
           <button 
             onClick={() => setSolutionsOpen(!isSolutionsOpen)}
             className="w-full px-3 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 hover:text-slate-300 transition-colors group"
           >
             <span>Solutions</span>
             <ChevronDown size={14} className={`text-slate-600 group-hover:text-slate-400 transition-transform duration-200 ${isSolutionsOpen ? '' : '-rotate-90'}`} />
           </button>
           
           <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isSolutionsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
              <NavButton icon={BarChart2} label="Analytics" disabled badge="Beta" />
              <NavButton icon={Users} label="Competitors" disabled badge="Pro" />
              <NavButton icon={Globe} label="Trend Watch" disabled badge="Pro" />
           </div>
        </div>

        {/* Resources */}
        <div>
           <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Resources</h3>
           <nav className="space-y-1">
             <NavButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={HelpCircle} label="Help & FAQ" />
             <NavButton icon={CreditCard} label="Billing" disabled />
             <NavButton icon={Settings} label="Settings" disabled />
           </nav>
        </div>

      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
         <div className="flex items-center space-x-3 hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-800 shadow-md"></div>
            <div className="flex-1 min-w-0">
               <div className="text-sm font-medium text-white truncate">Demo User</div>
               <div className="text-xs text-slate-500 truncate flex items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                 Pro Plan
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active?: boolean;
  onClick?: () => void;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
  badge?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label, disabled, badge }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : disabled 
          ? 'opacity-50 cursor-not-allowed text-slate-500' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center space-x-3 relative z-10">
       <Icon size={18} className={active ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-400'} />
       <span>{label}</span>
    </div>
    {badge && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 relative z-10">{badge}</span>}
    {active && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
  </button>
);

// --- FAQ Section ---
const FAQSection = () => (
  <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center space-y-4">
       <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
       <p className="text-slate-600 max-w-2xl mx-auto text-lg">Everything you need to know about OrenGen AI Branding, our features, billing, and supported platforms.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <FAQCard 
         q="How does the AI maintain my brand voice?" 
         a="OrenGen analyzes your Brand Guidelines (Tone, Visual Style, Description) and injects these parameters into every prompt sent to the Gemini 2.5 model, ensuring strict adherence to your persona." 
       />
       <FAQCard 
         q="Can I post directly to platforms?" 
         a="Currently, OrenGen operates as a content creation and scheduling planner. You can export your schedule to CSV or copy-paste content. Direct API publishing is coming in v2.0." 
       />
       <FAQCard 
         q="What is the 'Engagement Score' based on?" 
         a="Our AI analyzes current trends, keyword density, and historical data patterns for specific platforms to predict how likely your content is to generate interactions." 
       />
       <FAQCard 
         q="Do I need my own API Key?" 
         a="Yes. For advanced features like Veo Video Generation and high-volume text generation, using your own Google Gemini API key ensures you have full control over quotas and billing." 
       />
       <FAQCard 
         q="How do I use the Video Generation feature?" 
         a="Select 'Video Ad (Veo)' in the Creation Studio. You can optionally upload a reference image. Note: Video generation requires a paid Google Cloud project linked to your API key." 
       />
       <FAQCard 
         q="Is my data private?" 
         a="Absolutely. Your brand profiles and generated content are processed securely. We do not use your proprietary brand data to train our public models." 
       />
       <FAQCard 
         q="Which platforms are supported?" 
         a="We support all major platforms including Instagram, TikTok, LinkedIn, X, Facebook, YouTube, Pinterest, and emerging platforms like Bluesky and Lemon8." 
       />
       <FAQCard 
         q="How does the reschedule feature work?" 
         a="Simply drag and drop a post on the calendar view to a new date. The system automatically updates the schedule timestamp. Moving between platforms triggers an AI rewrite." 
       />
    </div>
    
    <div className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
       <h3 className="font-bold text-indigo-900 mb-2">Still have questions?</h3>
       <p className="text-indigo-700 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
       <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Contact Support</button>
    </div>
  </div>
);

const FAQCard = ({ q, a }: { q: string, a: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-indigo-100 group">
     <h3 className="font-bold text-slate-800 mb-3 flex items-start group-hover:text-indigo-600 transition-colors">
       <HelpCircle size={20} className="text-indigo-500 mr-3 flex-shrink-0 mt-0.5 bg-indigo-50 rounded-full p-0.5" />
       {q}
     </h3>
     <p className="text-slate-600 text-sm leading-relaxed pl-8">{a}</p>
  </div>
);

// --- Footer ---
const Footer = () => (
  <footer className="bg-white border-t border-slate-200 mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles size={18} className="text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-800">OrenGen AI</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Empowering brands with AI-driven content creation, strategic insights, and automated scheduling across every major platform.
          </p>
        </div>
        <div>
           <h4 className="font-bold text-slate-800 mb-4">Product</h4>
           <ul className="space-y-2 text-sm text-slate-500">
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">API</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
           </ul>
        </div>
        <div>
           <h4 className="font-bold text-slate-800 mb-4">Company</h4>
           <ul className="space-y-2 text-sm text-slate-500">
             <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
           </ul>
        </div>
        <div>
           <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
           <ul className="space-y-2 text-sm text-slate-500">
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
             <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
           </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} OrenGen AI Branding. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-slate-400">
           <a href="#" className="hover:text-slate-600 transition-colors"><Twitter size={20} /></a>
           <a href="#" className="hover:text-slate-600 transition-colors"><Github size={20} /></a>
           <a href="#" className="hover:text-slate-600 transition-colors"><Linkedin size={20} /></a>
           <a href="#" className="hover:text-slate-600 transition-colors"><Facebook size={20} /></a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Cookie Banner ---
const CookieBanner = ({ onAccept }: { onAccept: () => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-[60] flex flex-col sm:flex-row items-center justify-between gap-4 animate-[slideUp_0.5s_ease-out]">
    <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 flex-shrink-0">
             <Cookie size={24} />
        </div>
        <div className="max-w-2xl">
            <h4 className="font-bold text-slate-800 text-sm">We value your privacy</h4>
            <p className="text-sm text-slate-600 mt-1">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "OK", you consent to our use of cookies.
            </p>
        </div>
    </div>
    <button 
        onClick={onAccept}
        className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm active:scale-95 transform"
    >
        OK
    </button>
  </div>
);

// --- Brand Guidelines Page ---
const BrandForm = ({ brand, setBrand }: { brand: BrandProfile, setBrand: (b: BrandProfile) => void }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceBrandGuidelines(brand);
      setBrand(enhanced);
    } catch (e) {
      console.error(e);
      alert("AI Enhancement failed. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto">
       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white flex justify-between items-center shadow-xl">
         <div>
           <h2 className="text-2xl font-bold mb-2">Brand Guidelines Agent</h2>
           <p className="opacity-90 max-w-lg">Let our AI analyze and refine your brand identity to ensure consistency across all generated content.</p>
         </div>
         <button 
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center space-x-2"
          >
            {isEnhancing ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div> : <Zap size={20} />}
            <span>{isEnhancing ? "Refining..." : "Auto-Enhance Brand"}</span>
         </button>
       </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Name</label>
            <input name="name" value={brand.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Color</label>
            <div className="flex items-center space-x-2">
              <input type="color" name="primaryColor" value={brand.primaryColor} onChange={handleChange} className="h-12 w-12 rounded-lg border-0 cursor-pointer" />
              <input type="text" name="primaryColor" value={brand.primaryColor} onChange={handleChange} className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none uppercase font-mono" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Mission & Description</label>
          <textarea name="description" value={brand.description} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none h-32 resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone of Voice</label>
            <input name="tone" value={brand.tone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none" placeholder="e.g. Professional, Witty" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Visual Style</label>
            <input name="visualStyle" value={brand.visualStyle} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none" placeholder="e.g. Minimalist, Dark Mode" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  
  // State
  const [brand, setBrand] = useState<BrandProfile>({
    name: "Lumina",
    description: "Premium smart home lighting solutions.",
    tone: "Modern, Elegant, Innovative",
    primaryColor: "#4f46e5",
    visualStyle: "Sleek, Minimalist, High-Tech"
  });

  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Tech-savvy homeowners");
  const [platform, setPlatform] = useState<Platform>(Platform.Instagram);
  const [format, setFormat] = useState<ContentFormat>(ContentFormat.Image);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // Scheduling State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Cookie Consent State
  const [cookieConsent, setCookieConsent] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('orengen_cookie_consent') === 'true';
    }
    return false;
  });

  const handleAcceptCookies = () => {
    localStorage.setItem('orengen_cookie_consent', 'true');
    setCookieConsent(true);
  };

  const checkVideoKey = async () => {
    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) return true;

        await window.aistudio.openSelectKey();
        return true; // Assume success to handle race condition
      }
    } catch (e) {
      console.error("Key selection failed", e);
    }
    return false; // Fallback or fail safe
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;

    if (format === ContentFormat.Video) {
       const hasKey = await checkVideoKey();
       if (!hasKey) {
         alert("A paid API key is required for Veo video generation. Please select a key.");
         return;
       }
    }

    setIsGenerating(true);
    setGeneratedContent(null);
    setStatusMessage("Strategizing content...");

    try {
      const content = await generateAdContent(brand, topic, platform, audience, format);
      
      setGeneratedContent({
        ...content,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageData: undefined,
        videoUri: undefined
      });

      setStatusMessage(format === ContentFormat.Video ? "Directing video scene (this takes a moment)..." : "Designing visuals...");
      
      if (format === ContentFormat.Video) {
        const rawBase64 = uploadedImage ? uploadedImage.split(',')[1] : undefined;
        // Extract MIME type from data URL if present
        const mimeType = uploadedImage ? uploadedImage.split(';')[0].split(':')[1] : undefined;
        const videoUri = await generateAdVideo(content.imagePrompt, rawBase64, mimeType); 
        setGeneratedContent(prev => prev ? { ...prev, videoUri } : null);
      } else {
        const imageData = await generateAdImage(content.imagePrompt);
        setGeneratedContent(prev => prev ? { ...prev, imageData } : null);
      }

    } catch (error) {
      console.error(error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!generatedContent || isGeneratingAudio) return;
    setIsGeneratingAudio(true);
    try {
      const textToRead = `${generatedContent.headline}. ${generatedContent.body}`;
      const audioData = await generateSpeech(textToRead);
      setGeneratedContent(prev => prev ? { ...prev, audioData } : null);
    } catch (error) {
      console.error("Audio generation failed", error);
      alert("Audio generation failed.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSchedulePost = (content: GeneratedContent) => {
    const newPost: ScheduledPost = {
      ...content,
      scheduledDate: content.strategy.bestTime,
      status: 'Scheduled'
    };
    setScheduledPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleBulkDelete = (ids: string[]) => {
    setScheduledPosts(prev => prev.filter(p => !ids.includes(p.id)));
  };

  const handleBulkStatusChange = (ids: string[], status: PostStatus) => {
    setScheduledPosts(prev => prev.map(p => 
      ids.includes(p.id) ? { ...p, status } : p
    ));
  };

  const handlePostMovePlatform = async (id: string, newPlatform: Platform) => {
    const post = scheduledPosts.find(p => p.id === id);
    if (!post || post.platform === newPlatform) return;

    setScheduledPosts(prev => prev.map(p => 
      p.id === id 
        ? { ...p, platform: newPlatform, status: 'Draft', isRewriting: true } 
        : p
    ));

    try {
        const updatedFields = await rewritePostForPlatform(post, newPlatform, brand);
        setScheduledPosts(prev => prev.map(p => 
            p.id === id 
              ? { ...p, ...updatedFields, isRewriting: false } 
              : p
        ));
    } catch (error) {
        console.error("Rewrite failed", error);
        setScheduledPosts(prev => prev.map(p => 
            p.id === id ? { ...p, isRewriting: false } : p
        ));
    }
  };

  const handlePostMoveDate = (id: string, newDate: Date) => {
    setScheduledPosts(prev => prev.map(p => {
        if (p.id !== id) return p;
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateStr = newDate.toLocaleDateString('en-US', options);
        
        return { 
            ...p, 
            scheduledDate: `${dateStr} at 10:00 AM` 
        };
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CommandCenter activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
        <main className="flex-1 p-8 lg:p-12">
          {activeTab !== 'faq' && (
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  {activeTab === 'create' ? 'Creation Studio' : activeTab === 'schedule' ? 'Content Schedule' : activeTab === 'campaigns' ? 'Synchronous Campaign Manager' : activeTab === 'offers' ? 'Grand Slam Offer Generator' : 'Brand Identity'}
                </h1>
                <p className="text-slate-500 mt-1">
                  {activeTab === 'create' 
                    ? 'Generate high-converting content with AI.' 
                    : activeTab === 'schedule' 
                      ? 'Visualize and manage your multi-channel timeline.' 
                      : activeTab === 'campaigns'
                        ? 'Orchestrate multi-platform campaigns with a unified message.'
                        : activeTab === 'offers'
                        ? 'Build irresistible value stacks and high-converting landing pages.'
                        : 'Define your voice, tone, and visual style.'}
                </p>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center">
                <div className="relative w-2.5 h-2.5 mr-2.5">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                {brand.name} Agents Active
              </div>
            </header>
          )}

          {activeTab === 'faq' && <FAQSection />}

          {activeTab === 'brand' && (
            <BrandForm brand={brand} setBrand={setBrand} />
          )}

          {activeTab === 'schedule' && (
            <div className="h-[calc(100vh-220px)]">
               <ScheduleBoard 
                  posts={scheduledPosts} 
                  onDelete={handleDeletePost} 
                  onBulkDelete={handleBulkDelete}
                  onBulkStatusChange={handleBulkStatusChange}
                  onPostMovePlatform={handlePostMovePlatform}
                  onPostMoveDate={handlePostMoveDate}
               />
            </div>
          )}

          {activeTab === 'campaigns' && (
             <div className="h-[calc(100vh-220px)]">
                <CampaignManager 
                    brand={brand} 
                    onSchedule={handleSchedulePost}
                />
             </div>
          )}

          {activeTab === 'offers' && (
             <div className="h-[calc(100vh-220px)]">
                <OfferGenerator brand={brand} />
             </div>
          )}

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-220px)]">
              
              {/* Creation Panel */}
              <div className="flex flex-col space-y-6 overflow-y-auto pr-2 pb-20 custom-scrollbar">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  
                  {/* Format Selector */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-1 bg-slate-100 rounded-xl">
                    <button 
                      onClick={() => setFormat(ContentFormat.Image)}
                      className={`flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-bold transition-all ${format === ContentFormat.Image ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <ImageIcon size={18} /> <span>Image Ad</span>
                    </button>
                    <button 
                      onClick={() => setFormat(ContentFormat.Video)}
                      className={`flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-bold transition-all ${format === ContentFormat.Video ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Video size={18} /> <span>Video Ad (Veo)</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">What are we promoting?</label>
                      <input 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Launch of our new eco-friendly sneaker line"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-shadow focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Who is this for?</label>
                      <input 
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-shadow focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  {/* Optional Image Upload for Video */}
                  {format === ContentFormat.Video && (
                    <div className="mt-6 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <Upload size={16} className="mr-2"/>
                        Reference Image for Animation (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                        {uploadedImage && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                            <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Upload an image to bring it to life with Veo.
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Platform</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {Object.values(Platform).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`py-2 rounded-lg text-xs font-medium border transition-all truncate px-2 ${
                            platform === p 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          title={p}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic}
                    className={`w-full mt-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2 ${
                      isGenerating || !topic
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] hover:shadow-indigo-500/40'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Agents Working...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Generate Campaign</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Agent Logs */}
                {isGenerating && (
                   <div className="bg-[#1e293b] text-green-400 p-4 rounded-xl font-mono text-xs shadow-xl border border-slate-700">
                      <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-700">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-bold tracking-wider">LIVE AGENT LOGS</span>
                      </div>
                      <div className="space-y-1.5 opacity-90">
                        <div className="text-slate-400">&gt; Initializing brand context: <span className="text-white">{brand.name}</span>...</div>
                        <div className="text-slate-400">&gt; Analyzing platform trends for <span className="text-white">{platform}</span>...</div>
                        <div className="text-green-300">&gt; {statusMessage}</div>
                      </div>
                   </div>
                )}
              </div>

              {/* Preview Panel */}
              <div className="relative h-full min-h-[600px]">
                <div className="absolute inset-0 bg-slate-200 rounded-2xl transform rotate-1 opacity-50"></div>
                <div className="relative h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Preview</span>
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden bg-slate-100 relative">
                     <AdPreview 
                        content={generatedContent} 
                        brand={brand} 
                        platform={platform} 
                        loading={isGenerating}
                        statusMessage={statusMessage}
                        onSchedule={handleSchedulePost}
                        onGenerateAudio={handleGenerateAudio}
                        isGeneratingAudio={isGeneratingAudio}
                     />
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
        
        <Footer />
      </div>

      {!cookieConsent && <CookieBanner onAccept={handleAcceptCookies} />}
    </div>
  );
}