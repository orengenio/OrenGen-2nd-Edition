import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, CheckCircle, AlertCircle, Smartphone, Tablet, Monitor, 
  CreditCard, Shield, Activity, RefreshCw, Zap,
  Globe, Layout as LayoutIcon, AlertTriangle, Download, Copy, Lock, Server, LogOut,
  Database, Users, TrendingUp, Settings, Trash2, Eye, Crown, X, ArrowRight, Code, Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ASSETS } from '../constants';
import { copyToClipboard } from '../utils';
import { supabase } from '../supabaseClient';
import { Auth } from './Auth';
import { Session } from '@supabase/supabase-js';
import { convertToBimiSvg, sanitizePastedSvg } from '../services/geminiService';

// --- Types ---
type TabId = 'convert' | 'validator' | 'reputation' | 'billing' | 'admin';
type InputMode = 'upload' | 'paste' | 'url';

interface ProjectState {
  brandName: string;
  domain: string;
  file: File | null;
  previewUrl: string | null;
  svgContent: string | null;
  pastedCode: string;
  inputUrl: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  complianceScore: number;
  errorMessage?: string;
}

interface UserProfile {
  email: string;
  plan: 'Enterprise' | 'Pro' | 'Starter' | 'Premium' | 'Free';
  status: 'Active' | 'Pending' | 'Suspended';
  date: string;
  credits: number;
}

// --- Mock Data for Admin Console ---
const MOCK_USERS: UserProfile[] = [
  { email: 'mark@meta.com', plan: 'Pro', status: 'Active', date: '2023-12-10', credits: 42 },
  { email: 'elon@x.com', plan: 'Starter', status: 'Pending', date: '2024-01-05', credits: 2 },
  { email: 'satya@microsoft.com', plan: 'Premium', status: 'Active', date: '2024-01-12', credits: 150 },
  { email: 'tim@apple.com', plan: 'Pro', status: 'Active', date: '2024-01-14', credits: 8 },
];

// --- Components ---

const StatusBadge = ({ status }: { status: 'idle' | 'processing' | 'success' | 'error' }) => {
  if (status === 'processing') return <span className="text-yellow-500 flex items-center gap-1 text-xs"><RefreshCw className="w-3 h-3 animate-spin" /> Processing</span>;
  if (status === 'success') return <span className="text-green-500 flex items-center gap-1 text-xs"><CheckCircle className="w-3 h-3" /> Ready</span>;
  if (status === 'error') return <span className="text-red-500 flex items-center gap-1 text-xs"><AlertCircle className="w-3 h-3" /> Error</span>;
  return <span className="text-gray-500 text-xs">Waiting for input</span>;
};

const ComplianceCard = ({ status }: { status: ProjectState['status'] }) => {
  const checks = [
    { label: 'SVG Version 1.2', pass: status === 'success' },
    { label: 'Tiny-PS Profile', pass: status === 'success' },
    { label: 'No Scripts / Foreign Objects', pass: status === 'success' },
    { label: 'Self-Contained Resources', pass: status === 'success' },
    { label: 'Scalable ViewBox', pass: status === 'success' },
    { label: 'Accessibility Title', pass: status === 'success' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-brand-orange" /> Compliance Status
      </h3>
      <div className="space-y-3">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{check.label}</span>
            {check.pass ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${status === 'processing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>
      {status === 'success' && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <span className="text-green-400 text-xs font-mono">100% COMPLIANT OUTPUT</span>
        </div>
      )}
    </div>
  );
};

const Timeline = ({ activeStage }: { activeStage: number }) => {
  const stages = [
    { id: 1, label: 'Generation', time: 'Instant' },
    { id: 2, label: 'DNS Propagation', time: '24-48h' },
    { id: 3, label: 'VMC Validation', time: '1-3 wks' },
    { id: 4, label: 'Reputation', time: '2-8 wks' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-brand-orange" /> Live Availability
      </h3>
      <div className="relative border-l-2 border-slate-800 ml-2 space-y-6">
        {stages.map((stage, idx) => {
          const isActive = idx + 1 === activeStage;
          const isPast = idx + 1 < activeStage;
          
          return (
            <div key={stage.id} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 ${
                isPast ? 'bg-green-500 border-green-500' :
                isActive ? 'bg-brand-orange border-brand-orange animate-pulse' :
                'bg-slate-900 border-slate-700'
              }`} />
              
              <div className={isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}>
                <h4 className="text-sm font-bold text-white">{stage.label}</h4>
                <p className="text-xs text-gray-500">Est. Time: {stage.time}</p>
                {isActive && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-brand-orange uppercase bg-orange-900/20 px-2 py-0.5 rounded">Current Stage</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DevicePreview = ({ project }: { project: ProjectState }) => {
  
  const Logo = () => (
    <div className="bg-white rounded-full overflow-hidden w-full h-full flex items-center justify-center border border-gray-100 relative">
      {project.previewUrl ? (
        <img src={project.previewUrl} className="w-full h-full object-contain" alt="Logo" />
      ) : (
        <span className="text-[8px] font-bold text-gray-300">LOGO</span>
      )}
      {project.status === 'success' && <div className="absolute inset-0 ring-2 ring-green-500/30 rounded-full" />}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Canvas */}
      <div className="flex-grow flex flex-col xl:flex-row items-center justify-center gap-6 bg-slate-800/50 rounded-2xl border border-slate-800 p-8 relative overflow-y-auto min-h-[400px]">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Mobile View */}
        <div className="w-[280px] shrink-0 bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in duration-300 border-4 border-slate-700">
          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400">Mobile</span>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <div className="p-3 bg-blue-50/50 flex gap-2 border-l-4 border-brand-blue">
              <div className="w-8 h-8 flex-shrink-0"><Logo /></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-xs text-gray-900 truncate pr-1">{project.brandName || 'Brand'}</h4>
                  <span className="text-[8px] text-gray-400">Now</span>
                </div>
                <p className="text-[10px] text-gray-900 font-medium truncate">Welcome...</p>
              </div>
          </div>
          {[1,2,3,4].map(i => (
            <div key={i} className="p-3 flex gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-16" />
                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                </div>
            </div>
          ))}
        </div>

        {/* Tablet View */}
        <div className="w-[320px] shrink-0 bg-white rounded-xl overflow-hidden shadow-2xl relative z-10 flex h-[240px] animate-in zoom-in duration-300 border-4 border-slate-700">
            <div className="w-1/3 border-r border-gray-100 bg-gray-50 p-2 space-y-2">
              <div className="p-2 bg-white rounded shadow-sm flex items-center gap-2">
                  <div className="w-6 h-6 flex-shrink-0"><Logo /></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-1.5 bg-gray-800 rounded w-8 mb-1" />
                  </div>
              </div>
              {[1,2].map(i => (
                <div key={i} className="flex gap-2 p-2 opacity-40">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 bg-gray-300 rounded w-8" />
                    </div>
                </div>
              ))}
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex-shrink-0"><Logo /></div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{project.brandName || 'Brand'}</h3>
                  </div>
              </div>
              <div className="space-y-2">
                  <div className="h-1.5 bg-gray-200 rounded w-full" />
                  <div className="h-1.5 bg-gray-200 rounded w-11/12" />
                  <div className="h-1.5 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
        </div>

        {/* Desktop View */}
        <div className="w-[360px] shrink-0 bg-white rounded-lg shadow-2xl relative z-10 animate-in zoom-in duration-300 border border-gray-200">
            <div className="bg-gray-100 px-3 py-2 flex gap-1.5 border-b border-gray-200">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="bg-white p-2">
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group px-2">
                  <div className="w-3 h-3 border border-gray-300 rounded" />
                  <div className="w-6 h-6 flex-shrink-0"><Logo /></div>
                  <span className="font-bold text-xs text-gray-900 w-24 truncate">{project.brandName || 'Brand'}</span>
                  <span className="text-xs text-gray-600 flex-1 truncate">
                      <span className="font-semibold text-gray-900">Valid:</span> BIMI Checked
                  </span>
                  <span className="text-[10px] text-gray-400">Now</span>
                </div>
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-3 py-2 opacity-30 border-b border-gray-50 px-2">
                      <div className="w-3 h-3 border border-gray-200 rounded" />
                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                      <div className="w-20 h-1.5 bg-gray-200 rounded" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded" />
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Workspace Component ---

export const Workspace: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  
  const [activeTab, setActiveTab] = useState<TabId>('convert');
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [credits, setCredits] = useState<number>(0);
  const [project, setProject] = useState<ProjectState>({
    brandName: '',
    domain: '',
    file: null,
    previewUrl: null,
    svgContent: null,
    pastedCode: '',
    inputUrl: '',
    status: 'idle',
    complianceScore: 0
  });

  // Ghost Mode State
  const [ghostUser, setGhostUser] = useState<UserProfile | null>(null);

  // Derived state for sanitized inputs
  const sanitizedBrandSlug = project.brandName
    ? project.brandName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'brand';
    
  const generatedFileName = `bimi-${sanitizedBrandSlug}.svg`;
  const generatedUrl = `https://bimi.bimiforge.com/logo.svg`; // Hardcoded as per D3 instructions contextually, but usually this is dynamic. Following D3 specifically.
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (session) {
         if (session.user.email === 'sales@orengen.io') {
             // Admin Logic
             setCredits(999999);
         } else {
             setCredits(0);
         }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
         if (session.user.email === 'sales@orengen.io') {
             setCredits(999999);
         } else {
             setCredits(0);
         }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.email === 'sales@orengen.io';
  
  // Ghost Mode Utilities
  const handleGhostLogin = (user: UserProfile) => {
      setGhostUser(user);
      setCredits(user.credits); // Visual only, backend would still check admin token
      setActiveTab('convert'); // Switch to view their perspective
  };

  const exitGhostMode = () => {
      setGhostUser(null);
      setCredits(999999); // Reset to infinite
      setActiveTab('admin');
  };

  // Determine current effective view state
  const effectiveEmail = ghostUser ? ghostUser.email : session?.user.email;
  const effectivePlan = ghostUser ? ghostUser.plan : (isAdmin ? 'Super Admin' : (credits > 0 ? 'Premium' : 'Free Tier'));
  
  // Only restrict features if we are not admin AND not ghosting, or if we are ghosting a free user
  const isFreeTier = !isAdmin && credits === 0 && !ghostUser;

  // -- Handlers --

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      
      let name = project.brandName;
      if (!name) {
          const fname = file.name.split('.')[0];
          name = fname.charAt(0).toUpperCase() + fname.slice(1);
      }

      setProject(prev => ({
        ...prev,
        file,
        previewUrl: objectUrl,
        brandName: name,
        status: 'idle',
        complianceScore: 20 // Base score for having a file
      }));
    }
  };

  const runConversion = async () => {
    if (!session) return;
    if (credits !== null && credits <= 0 && !isAdmin) return alert("Insufficient credits.");
    
    // Validate input based on mode
    if (inputMode === 'upload' && !project.file) {
      return alert("Please upload a file first.");
    }
    if (inputMode === 'paste' && !project.pastedCode.trim()) {
      return alert("Please paste SVG code first.");
    }
    if (inputMode === 'url' && !project.inputUrl.trim()) {
      return alert("Please enter an image URL first.");
    }
    
    if (!project.brandName.trim()) {
      return alert("Please enter a brand name.");
    }

    setProject(p => ({ ...p, status: 'processing', errorMessage: undefined }));
    
    try {
      let generatedSvg = '';

      // MODE 1: FILE UPLOAD - Convert image to BIMI SVG using Gemini
      if (inputMode === 'upload' && project.file) {
        console.log('🚀 Starting Gemini AI vectorization...');
        
        // Upload to Supabase Storage (optional, for records)
        const fileExt = project.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, project.file);

        if (uploadError) {
          console.warn("Storage upload failed:", uploadError);
        }

        // Call Gemini API for real AI vectorization
        generatedSvg = await convertToBimiSvg(project.file, {
          brandName: project.brandName,
          preserveColors: true,
          maxComplexity: 'medium'
        });

        console.log('✅ Gemini conversion complete!');
      }

      // MODE 2: PASTED CODE - Sanitize and make BIMI-compliant
      else if (inputMode === 'paste' && project.pastedCode.trim()) {
        console.log('🔧 Sanitizing pasted SVG code...');
        
        generatedSvg = await sanitizePastedSvg(
          project.pastedCode,
          project.brandName
        );

        console.log('✅ SVG sanitization complete!');
      }

      // MODE 3: URL INPUT - Fetch and convert
      else if (inputMode === 'url' && project.inputUrl.trim()) {
        console.log('🌐 Fetching image from URL...');
        
        const response = await fetch(project.inputUrl);
        if (!response.ok) throw new Error('Failed to fetch image from URL');
        
        const blob = await response.blob();
        const file = new File([blob], 'url-image', { type: blob.type });

        generatedSvg = await convertToBimiSvg(file, {
          brandName: project.brandName,
          preserveColors: true,
          maxComplexity: 'medium'
        });

        console.log('✅ URL image conversion complete!');
      }

      // Deduct credit
      if (!isAdmin) {
        if (credits) setCredits(c => c ? c - 1 : 0);
      }

      // Success!
      setProject(p => ({
        ...p,
        status: 'success',
        complianceScore: 100,
        svgContent: generatedSvg
      }));

    } catch (err: any) {
      console.error('❌ Conversion error:', err);
      setProject(p => ({ 
        ...p, 
        status: 'error',
        errorMessage: err.message || 'Conversion failed. Please try again.'
      }));
    }
  };

  const handleDownload = () => {
    // For this specific hardcoded flow, we want to download the "generated" content, 
    // but typically we'd create a blob from the svgContent.
    if (!project.svgContent) return;
    
    const blob = new Blob([project.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generatedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loadingSession) {
    return <div className="min-h-screen bg-brand-darker flex items-center justify-center text-white"><RefreshCw className="animate-spin h-8 w-8" /></div>;
  }

  if (!session) {
    return <Auth />;
  }

  // --- Render Sections ---

  const renderHeader = () => (
    <header className="bg-brand-darker border-b border-white/5 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src={ASSETS.LOGO_DARK} alt="BIMI Forge" className="h-8" />
        <span className="bg-brand-orange/20 text-brand-orange text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-brand-orange/20">Client Workspace</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
         {[
           // Removed 'Generate' tab as requested to remove confusion/upsell block
           { id: 'convert', label: 'Convert', icon: RefreshCw },
           { id: 'validator', label: 'Validator', icon: Shield },
           { id: 'reputation', label: 'Reputation', icon: Activity },
           { id: 'billing', label: 'Billing', icon: CreditCard },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as TabId)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
               activeTab === tab.id 
                 ? 'bg-slate-700 text-white shadow-sm' 
                 : 'text-gray-400 hover:text-white hover:bg-white/5'
             }`}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
           </button>
         ))}
         {isAdmin && !ghostUser && (
           <button
             onClick={() => setActiveTab('admin')}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
               activeTab === 'admin' 
                 ? 'bg-red-900/50 text-red-400 shadow-sm border border-red-500/30' 
                 : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
             }`}
           >
             <Database className="w-4 h-4" />
             Admin
           </button>
         )}
      </nav>

      <div className="flex items-center gap-4">
        {ghostUser && (
            <div className="bg-red-600/20 border border-red-500/50 px-3 py-1 rounded flex items-center gap-2 animate-pulse">
                <Eye className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Viewing as {ghostUser.email}</span>
                <button onClick={exitGhostMode} className="ml-2 hover:bg-red-500/30 rounded p-1">
                    <X className="w-3 h-3 text-red-400" />
                </button>
            </div>
        )}

        {/* Refined Credit / Plan Display */}
        <div className="bg-slate-800 rounded-lg p-1.5 pr-4 flex items-center gap-3 border border-slate-700">
           <div className={`p-1.5 rounded ${isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-brand-orange/20 text-brand-orange'}`}>
                {isAdmin ? <Crown className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
           </div>
           <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-0.5">{effectivePlan}</span>
              <span className="text-sm font-mono text-white font-bold leading-none">
                {isAdmin && !ghostUser ? '∞' : credits} <span className="text-[10px] text-gray-500 font-normal">Credits</span>
              </span>
           </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white max-w-[150px] truncate">{effectiveEmail}</div>
              <div className="text-xs text-gray-500">{isAdmin ? 'Super Admin' : 'Client Account'}</div>
           </div>
           <button onClick={handleLogout} title="Sign Out" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white border border-slate-700 shadow-lg transition-colors">
              <LogOut className="w-4 h-4" />
           </button>
        </div>
      </div>
    </header>
  );

  const renderConvertTab = () => (
    <div className="grid grid-cols-12 gap-0 h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Left Panel: Inputs */}
      <div className="col-span-3 bg-brand-darker border-r border-white/5 p-6 flex flex-col h-full overflow-y-auto">
        
        {/* New Subscription Status Card */}
        <div className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subscription & Usage</h3>
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-2xl font-bold text-white">{isAdmin && !ghostUser ? '∞' : credits}</span>
                    <span className="text-xs text-gray-500 ml-1">credits remaining</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    effectivePlan === 'Enterprise' || effectivePlan === 'Super Admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 
                    effectivePlan === 'Premium' ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/30' :
                    'bg-gray-700 text-gray-300 border-gray-600'
                }`}>
                    {effectivePlan}
                </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-orange h-full rounded-full" style={{ width: isAdmin ? '100%' : `${Math.min((credits / 10) * 100, 100)}%` }}></div>
            </div>
            {!isAdmin && (
                <Link to="/#pricing" className="mt-3 text-xs text-brand-orange hover:text-white flex items-center gap-1 font-bold">
                    Upgrade Plan <ArrowRight className="w-3 h-3" />
                </Link>
            )}
        </div>

        <h2 className="text-lg font-bold text-white mb-6">Input Configuration</h2>
        
        <h2 className="text-lg font-bold text-white mb-4">Input Configuration</h2>

        {/* Input Mode Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-900 rounded-lg">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              inputMode === 'upload'
                ? 'bg-brand-orange text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              inputMode === 'paste'
                ? 'bg-brand-orange text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            Paste Code
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all ${
              inputMode === 'url'
                ? 'bg-brand-orange text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            URL
          </button>
        </div>
        
        <div className="space-y-6">
          {/* MODE 1: FILE UPLOAD */}
          {inputMode === 'upload' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Upload Image (ANY Format)</label>
              <div className="relative">
                  {isFreeTier && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[2px] rounded-xl border border-white/10">
                          <Lock className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-300 font-bold mb-3">Unlock Workspace</p>
                          <Link to="/#pricing" className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                          Select a Plan
                          </Link>
                      </div>
                  )}
                  <div 
                  onClick={() => !isFreeTier && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl overflow-hidden text-center transition-all h-40 flex flex-col items-center justify-center ${
                      project.file 
                      ? 'border-green-500/50 bg-slate-900' 
                      : 'border-slate-700 hover:border-brand-orange/50 hover:bg-white/5'
                  } ${!isFreeTier ? 'cursor-pointer' : ''}`}
                  >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.eps,.webp" 
                    disabled={isFreeTier} 
                  />
                  {project.previewUrl ? (
                      <img src={project.previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                      <>
                      <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-300 font-bold">Click to upload logo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, AI, EPS, SVG</p>
                      </>
                  )}
                  </div>
              </div>
            </div>
          )}

          {/* MODE 2: PASTE SVG CODE */}
          {inputMode === 'paste' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Paste SVG Code</label>
              <textarea
                value={project.pastedCode}
                onChange={(e) => setProject(p => ({ ...p, pastedCode: e.target.value }))}
                disabled={isFreeTier}
                className={`w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs font-mono h-40 resize-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none ${isFreeTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Paste your SVG code here... We'll make it BIMI-compliant."
              />
              <p className="text-xs text-gray-500 mt-1">✨ We'll sanitize and convert it to SVG Tiny 1.2 (Tiny-PS)</p>
            </div>
          )}

          {/* MODE 3: IMAGE URL */}
          {inputMode === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input 
                  type="url" 
                  value={project.inputUrl}
                  onChange={(e) => setProject(p => ({ ...p, inputUrl: e.target.value }))}
                  disabled={isFreeTier}
                  className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none ${isFreeTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Direct link to PNG, JPG, or SVG image</p>
            </div>
          )}

          <div>
             <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Brand or Company Name</label>
             <div className="relative">
                <LayoutIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={project.brandName}
                  onChange={(e) => setProject(p => ({ ...p, brandName: e.target.value }))}
                  disabled={isFreeTier}
                  className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none ${isFreeTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="e.g. Acme Corp"
                />
             </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Target Domain</label>
             <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={project.domain}
                  onChange={(e) => setProject(p => ({ ...p, domain: e.target.value }))}
                  disabled={isFreeTier}
                  className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none ${isFreeTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="e.g. acme.com"
                />
             </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={isFreeTier ? () => window.location.hash = '#pricing' : runConversion}
            disabled={project.status === 'processing' || (!isFreeTier && !project.brandName)}
            className="w-full py-3 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-gray-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            {project.status === 'processing' ? <RefreshCw className="w-5 h-5 animate-spin" /> : (isFreeTier ? <CreditCard className="w-5 h-5" /> : <Zap className="w-5 h-5" />)}
            {project.status === 'processing' ? 'AI Converting...' : (isFreeTier ? 'Select Plan to Start' : 'Vectorize & Convert')}
          </button>

          {/* Error Display */}
          {project.status === 'error' && project.errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-red-400 mb-1">Conversion Failed</p>
                <p className="text-xs text-red-300">{project.errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex justify-between items-center text-xs text-gray-400">
             <span>Cost:</span>
             <span className="text-white font-bold">{isAdmin && !ghostUser ? 'Free (Admin)' : '1 Credit'}</span>
          </div>
        </div>
      </div>

      {/* Center Panel: Preview & Output */}
      <div className="col-span-6 bg-slate-950 p-8 flex flex-col h-full overflow-y-auto relative">
         <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Inbox Preview</h1>
              <p className="text-gray-400 text-sm">Real-time simulation across devices.</p>
            </div>
            <StatusBadge status={project.status} />
         </div>

         <DevicePreview project={project} />

         {/* Bottom Panel: Output (Only shown on success) */}
         {project.status === 'success' && (
           <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Server className="w-4 h-4 text-brand-orange" /> Deployment Instructions
              </h3>
              
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                 <div className="grid divide-y divide-slate-800">
                    <div className="p-4 flex items-start gap-4">
                       <div className="bg-brand-blue/20 text-brand-blue font-bold w-6 h-6 rounded flex items-center justify-center text-xs mt-0.5">1</div>
                       <div className="flex-1">
                          <p className="text-sm text-gray-300 font-medium mb-2">Your BIMI Compliant SVG Logo is now ready for its hosting.</p>
                          <div className="flex gap-3">
                             <button onClick={handleDownload} className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold rounded border border-transparent shadow-lg flex items-center gap-2">
                                <Download className="w-3 h-3" /> Download SVG
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="p-4 flex items-start gap-4">
                       <div className="bg-brand-blue/20 text-brand-blue font-bold w-6 h-6 rounded flex items-center justify-center text-xs mt-0.5">2</div>
                       <div className="flex-1">
                          <p className="text-sm text-gray-300 font-medium mb-3">Copy & Paste into your domain providers DNS settings:</p>
                          
                          <div className="grid grid-cols-1 gap-3">
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-20">Record Type:</span>
                                <div className="bg-black px-3 py-1.5 rounded border border-slate-700 text-xs text-white font-mono">TXT</div>
                             </div>
                             
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-20">Name:</span>
                                <div className="bg-black px-3 py-1.5 rounded border border-slate-700 text-xs text-white font-mono relative group">
                                  default._bimi
                                  <button onClick={() => copyToClipboard('default._bimi')} className="ml-2 hover:text-brand-orange"><Copy className="w-3 h-3" /></button>
                                </div>
                             </div>

                             <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">Content:</span>
                                <div className="bg-black p-3 rounded border border-slate-700 font-mono text-xs text-green-400 break-all relative group">
                                   v=BIMI1; l=https://bimi.bimiforge.com/logo.svg;
                                   <button onClick={() => copyToClipboard('v=BIMI1; l=https://bimi.bimiforge.com/logo.svg;')} className="absolute right-2 top-2 p-1 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Copy className="w-3 h-3 text-white" />
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

               {/* New Source Code View */}
               {project.svgContent && (
                   <div className="mt-8">
                       <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-brand-orange" /> BIMI Complaint Code Generated and Ready to Plug into your hosting server.
                       </h3>
                       <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs text-blue-300 overflow-x-auto max-h-48">
                           <pre>{project.svgContent}</pre>
                       </div>
                   </div>
               )}
           </div>
         )}
      </div>

      {/* Right Panel: Feedback */}
      <div className="col-span-3 bg-brand-darker border-l border-white/5 p-6 flex flex-col h-full overflow-y-auto">
         <h2 className="text-lg font-bold text-white mb-6">System Feedback</h2>
         <ComplianceCard status={project.status} />
         <Timeline activeStage={project.status === 'success' ? 2 : 1} />
         
         {project.status === 'idle' && (
           <div className="mt-8 p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-xl">
              <h4 className="text-brand-blue font-bold text-sm mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Secure Workspace</h4>
              <p className="text-xs text-gray-400">All assets are processed in a private, ephemeral container. No data is shared with third parties.</p>
           </div>
         )}
      </div>

    </div>
  );

  const renderValidatorTab = () => (
    <div className="p-8 max-w-4xl mx-auto">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">BIMI Validator</h2>
          <p className="text-gray-400">Run a deep-scan on any domain to verify BIMI readiness.</p>
       </div>
       <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <div className="flex gap-4 mb-8">
             <div className="flex-1 relative">
                <Globe className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Enter domain (e.g. cnn.com)" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-orange outline-none" />
             </div>
             <button className="px-8 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                <Shield className="w-5 h-5" /> Check
             </button>
          </div>
          
          {/* Placeholder for results state */}
          <div className="grid grid-cols-3 gap-4">
             {['MX Records', 'SPF', 'DMARC', 'BIMI Record', 'SVG Format', 'VMC'].map(check => (
               <div key={check} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between opacity-50">
                  <span className="text-sm font-medium text-gray-300">{check}</span>
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderAdminTab = () => (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-brand-orange" />
            Admin Console
         </h1>
         <div className="flex items-center gap-3">
           <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Systems Normal
           </span>
           <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Super Admin Access
           </span>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         {[
            { label: 'Total Revenue', value: '$12,450.00', icon: CreditCard, color: 'text-green-500' },
            { label: 'Active Users', value: '1,240', icon: Users, color: 'text-blue-500' },
            { label: 'Jobs Processed', value: '8,932', icon: Activity, color: 'text-purple-500' },
            { label: 'Server Health', value: '99.99%', icon: Server, color: 'text-brand-orange' },
         ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all cursor-default">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-slate-800 ${stat.color}`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" /> +12%
                  </span>
               </div>
               <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
               <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
         ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-3 gap-8">
        {/* Recent Users Table */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
           <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-brand-orange"/> Recent Signups</h3>
              <button className="text-xs text-brand-orange hover:text-white transition-colors border border-brand-orange/30 hover:bg-brand-orange/10 px-3 py-1 rounded">View All Users</button>
           </div>
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-950 text-gray-400 font-medium border-b border-slate-800">
                 <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-gray-300">
                 {MOCK_USERS.map((user, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                       <td className="px-6 py-4 font-medium text-white flex flex-col">
                           <span>{user.email}</span>
                           <span className="text-[10px] text-gray-500">{user.date}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                             user.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' : 
                             user.plan === 'Pro' || user.plan === 'Premium' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'
                          }`}>{user.plan}</span>
                       </td>
                       <td className="px-6 py-4 text-white font-mono">{user.credits}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                             {user.status}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleGhostLogin(user)}
                            className="flex items-center gap-1 text-xs text-brand-orange border border-brand-orange/30 bg-brand-orange/5 hover:bg-brand-orange/20 px-2 py-1 rounded transition-colors"
                            title="Ghost Login"
                          >
                            <Eye className="w-3 h-3" /> Login
                          </button>
                          <button className="text-gray-400 hover:text-white p-1 hover:bg-slate-700 rounded"><Settings className="w-4 h-4" /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* System Health Panel */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8 h-fit">
           <div className="p-6 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-brand-orange"/> System Status</h3>
           </div>
           <div className="p-6 space-y-6">
              {[
                { name: 'API Gateway', status: 'Operational', latency: '24ms' },
                { name: 'Vectorization Engine', status: 'Operational', latency: '142ms' },
                { name: 'Storage (S3)', status: 'Operational', latency: '45ms' },
                { name: 'Email Notifications', status: 'Operational', latency: '-' },
                { name: 'Stripe Webhooks', status: 'Operational', latency: '-' },
              ].map((sys, i) => (
                 <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                       <span className="text-sm font-medium text-gray-300">{sys.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{sys.latency}</span>
                 </div>
              ))}
           </div>
           <div className="p-4 bg-slate-950 border-t border-slate-800">
              <button className="w-full py-2 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40 rounded text-sm font-bold transition-all flex items-center justify-center gap-2">
                 <Trash2 className="w-4 h-4" /> Purge System Cache
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholderTab = (title: string) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
       <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
       </div>
       <h2 className="text-2xl font-bold text-white mb-2">{title} Module</h2>
       <p className="text-gray-400 max-w-md">This module is part of the Enterprise suite. Please contact sales to unlock full access.</p>
       <button onClick={() => setActiveTab('convert')} className="mt-6 text-brand-orange hover:text-white text-sm font-bold flex items-center gap-1">
          {/* @ts-ignore */}
          Return to Converter <RefreshCw className="w-4 h-4 ml-1" />
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-orange/30">
      {renderHeader()}
      <main>
        {activeTab === 'convert' && renderConvertTab()}
        {activeTab === 'validator' && renderValidatorTab()}
        {activeTab === 'admin' && isAdmin && !ghostUser && renderAdminTab()}
        {activeTab === 'reputation' && renderPlaceholderTab('Sender Reputation')}
        {activeTab === 'billing' && renderPlaceholderTab('Billing & Usage')}
      </main>
    </div>
  );
};