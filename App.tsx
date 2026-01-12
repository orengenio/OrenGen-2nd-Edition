
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Cloud, 
  Mail, 
  Activity, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Globe,
  Lock,
  Server,
  Zap,
  Terminal,
  Play,
  Pause,
  StopCircle,
  X,
  ClipboardList,
  Cpu,
  Layers,
  Database,
  Eye,
  Settings
} from 'lucide-react';
import { CloudflareService } from './services/cloudflareService';
import { analyzeDNSCompliance, extractISPData } from './services/geminiService';
import { Tab, DomainInfo, DNSRecord, VerificationResult, ISPProvider, AutomationTask } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [cfToken, setCfToken] = useState<string>(localStorage.getItem('cf_token') || '');
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  
  // Bulk & ISP Session States
  const [bulkDomains, setBulkDomains] = useState('');
  const [bulkISPToken, setBulkISPToken] = useState('');
  const [rawISPData, setRawISPData] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Automation Core
  const [automationQueue, setAutomationQueue] = useState<AutomationTask[]>([]);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const cfService = cfToken ? new CloudflareService(cfToken) : null;

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-150));
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const fetchDomains = useCallback(async () => {
    if (!cfService) return;
    setLoading(true);
    try {
      const fetched = await cfService.listZones();
      setDomains(fetched);
      addLog(`Core: Synchronized ${fetched.length} domain nodes from Cloudflare API.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cfService]);

  useEffect(() => {
    if (cfToken) fetchDomains();
  }, [cfToken, fetchDomains]);

  // Handle manual bulk domain list input
  const processBulkInput = () => {
    if (!bulkDomains.trim()) return;
    const list = bulkDomains.split('\n').map(d => d.trim()).filter(d => d.includes('.'));
    const tasks: AutomationTask[] = list.map(domain => ({
      id: Math.random().toString(36).substr(2, 9),
      domain,
      token: bulkISPToken, // Shared token if provided, otherwise can be updated via Neural Sync
      status: 'idle'
    }));
    setAutomationQueue(prev => [...prev, ...tasks]);
    setBulkDomains('');
    addLog(`Bulk: Queued ${tasks.length} domains for autonomous processing.`);
    setActiveTab(Tab.Automation);
  };

  // The "State of the Art" Neural Sync - Pulls domains and tokens from raw ISP dashboard text
  const handleNeuralISPSync = async () => {
    if (!rawISPData.trim()) return;
    setIsExtracting(true);
    addLog("Neural Agent: Analyzing ISP session data...");
    try {
      const extracted = await extractISPData(rawISPData);
      if (extracted && extracted.length > 0) {
        const tasks: AutomationTask[] = extracted.map((item: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          domain: item.domain,
          token: item.token,
          status: 'idle',
          isp: 'generic'
        }));
        setAutomationQueue(prev => [...prev, ...tasks]);
        setRawISPData('');
        addLog(`Neural Agent: Discovered ${extracted.length} valid domain/token pairs from ISP source.`);
        setActiveTab(Tab.Automation);
      } else {
        addLog("Neural Agent: Source data was insufficient or contained no valid patterns.");
      }
    } catch (err) {
      addLog("Neural Agent: Error parsing source data.");
    } finally {
      setIsExtracting(false);
    }
  };

  const startAutonomousAgent = async () => {
    if (!cfService || isAutomationRunning || automationQueue.length === 0) return;
    setIsAutomationRunning(true);
    addLog("Agent: Commencing Autonomous Validation Sequence...");

    const queue = [...automationQueue];
    for (let i = 0; i < queue.length; i++) {
      if (!isAutomationRunning) break; // Allow pausing
      const task = queue[i];
      if (task.status === 'completed') continue;

      // Stage 1: Discovery
      queue[i] = { ...task, status: 'searching' };
      setAutomationQueue([...queue]);
      addLog(`Agent: Locating ${task.domain} in network inventory...`);
      
      const zone = domains.find(d => d.name.toLowerCase() === task.domain.toLowerCase());
      
      if (!zone) {
        queue[i] = { ...task, status: 'failed', error: 'Domain node missing from Cloudflare' };
        addLog(`Agent: [FAILURE] ${task.domain} not found in this account.`);
        setAutomationQueue([...queue]);
        continue;
      }

      // Stage 2: DNS Injection
      queue[i] = { ...task, status: 'injecting' };
      setAutomationQueue([...queue]);
      addLog(`Agent: Injecting TXT validation record for ${task.domain}...`);

      try {
        const result = await cfService.createTXTRecord(zone.id, '@', task.token);
        if (result.success) {
          queue[i] = { ...task, status: 'completed' };
          addLog(`Agent: [SUCCESS] ${task.domain} is now pending ISP verification.`);
        } else {
          queue[i] = { ...task, status: 'failed', error: result.message };
          addLog(`Agent: [ERROR] Injection failed for ${task.domain}: ${result.message}`);
        }
      } catch (e: any) {
        queue[i] = { ...task, status: 'failed', error: e.message };
      }
      setAutomationQueue([...queue]);
      
      // Safety throttle
      await new Promise(r => setTimeout(r, 1000));
    }
    setIsAutomationRunning(false);
    addLog("Agent: Sequence finalized.");
  };

  const handleSelectDomain = async (domain: DomainInfo) => {
    setSelectedDomain(domain);
    if (!cfService) return;
    setLoading(true);
    try {
      const records = await cfService.listDNSRecords(domain.id);
      setDnsRecords(records);
    } catch (err: any) {
      addLog(`Inspector: Error reading ${domain.name} - ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-slate-900 border-r border-slate-800 p-8 flex flex-col gap-8 sticky top-0 h-auto md:h-screen z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/30">
            <Cpu size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white italic uppercase">Validator<span className="text-indigo-400 italic">X</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Autonomous Sync</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Network Map" active={activeTab === Tab.Dashboard} onClick={() => setActiveTab(Tab.Dashboard)} />
          <SidebarItem icon={<Layers size={18} />} label="Bulk Onboard" active={activeTab === Tab.Bulk} onClick={() => setActiveTab(Tab.Bulk)} />
          <SidebarItem icon={<Zap size={18} />} label="Neural Sync" active={activeTab === Tab.ISPCenter} onClick={() => setActiveTab(Tab.ISPCenter)} />
          <SidebarItem icon={<Terminal size={18} />} label="Agent HUD" active={activeTab === Tab.Automation} onClick={() => setActiveTab(Tab.Automation)} />
          <SidebarItem icon={<Settings size={18} />} label="API Config" active={activeTab === Tab.Cloudflare} onClick={() => setActiveTab(Tab.Cloudflare)} />
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
             <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase">System Status</span>
               <div className={`w-2 h-2 rounded-full ${cfToken ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
             </div>
             <p className="text-xs font-mono text-slate-400 truncate">{isAutomationRunning ? 'AGENT_EXECUTING' : 'IDLE_READY'}</p>
          </div>
        </div>
      </nav>

      {/* Main Command Console */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white capitalize italic tracking-tighter">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-1">Cross-ISP Cloudflare Automation Engine</p>
          </div>
          <div className="flex items-center gap-4">
             {cfToken && <button onClick={fetchDomains} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>}
             <div className="bg-indigo-600/10 px-6 py-3 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
                <Globe size={16} className="text-indigo-400" />
                <span className="text-xs font-black text-indigo-400 uppercase tracking-tighter">{domains.length} Nodes Online</span>
             </div>
          </div>
        </header>

        <section className="space-y-10">
          {activeTab === Tab.Dashboard && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Database size={150} /></div>
                   <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tighter">Network Inventory</h3>
                   <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                     {domains.map(d => (
                       <div key={d.id} onClick={() => handleSelectDomain(d)} className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${selectedDomain?.id === d.id ? 'bg-indigo-600/20 border-indigo-500 shadow-xl translate-x-1' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-xl ${selectedDomain?.id === d.id ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                               <Globe size={20} className="text-white" />
                             </div>
                             <div>
                               <p className="font-bold text-white tracking-tight">{d.name}</p>
                               <p className="text-[10px] font-black text-slate-500 uppercase">{d.status}</p>
                             </div>
                          </div>
                          <ChevronRight size={18} className={selectedDomain?.id === d.id ? 'text-indigo-400' : 'text-slate-800'} />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl h-fit">
                <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tighter">Live Inspector</h3>
                {selectedDomain ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30">
                       <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Target Node</p>
                       <p className="text-sm font-bold text-indigo-400 italic">{selectedDomain.name}</p>
                    </div>
                    <div className="space-y-2">
                       {dnsRecords.map(r => (
                         <div key={r.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 font-mono text-[10px] truncate">
                            <span className="text-indigo-500 font-bold mr-2">{r.type}</span>
                            <span className="text-slate-300">{r.name}</span>
                            <p className="text-slate-600 truncate mt-1">{r.content}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 opacity-20"><Eye size={64} className="mx-auto" /></div>
                )}
              </div>
            </div>
          )}

          {activeTab === Tab.Bulk && (
            <div className="max-w-4xl mx-auto">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
                  <div className="flex items-center gap-6 mb-10">
                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-600/20">
                      <Layers size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Bulk Domain Onboarding</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-2">Load up to 1,000 domains into the queue instantly.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Domains (One per line)</label>
                      <textarea 
                        className="w-full h-64 bg-slate-950 border border-slate-800 rounded-3xl p-8 text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                        placeholder="example.com&#10;my-store.net&#10;business.io"
                        value={bulkDomains}
                        onChange={(e) => setBulkDomains(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Shared Token (Optional)</label>
                         <input 
                           type="text" 
                           className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                           placeholder="google-site-verification=..."
                           value={bulkISPToken}
                           onChange={(e) => setBulkISPToken(e.target.value)}
                         />
                       </div>
                       <div className="flex items-end">
                         <button 
                           onClick={processBulkInput}
                           className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter"
                         >
                           <Plus size={20} /> Load to Queue
                         </button>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === Tab.ISPCenter && (
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none"></div>
                  <div className="flex items-center gap-6 mb-10">
                    <div className="bg-purple-600 p-4 rounded-2xl shadow-xl shadow-purple-600/20">
                      <Zap size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Neural ISP Bridge</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-2">Connect your ISP dashboard via Autonomous Synchronisation.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-indigo-950/20 border border-indigo-500/10 p-6 rounded-3xl flex gap-6">
                       <div className="p-3 bg-indigo-500/10 rounded-2xl h-fit"><Info className="text-indigo-400" /></div>
                       <div>
                         <h4 className="font-bold text-white mb-2 italic uppercase tracking-tighter">Instructions for Sync</h4>
                         <p className="text-xs text-slate-400 leading-relaxed font-medium">
                           1. Open your ISP Dashboard (Google Postmaster, MS SNDS, Bing, etc) in a new tab.<br/>
                           2. Log in as you normally would.<br/>
                           3. Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono">CTRL+A</kbd> then <kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono">CTRL+C</kbd> to copy everything.<br/>
                           4. Paste the raw content below. Our Neural Agent will extract unverified domains and tokens.
                         </p>
                       </div>
                    </div>

                    <textarea 
                      className="w-full h-80 bg-slate-950 border border-slate-800 rounded-3xl p-8 text-sm font-mono text-purple-300/80 focus:outline-none focus:border-purple-500/50 transition-all resize-none shadow-inner"
                      placeholder="Paste raw content from your ISP portal here..."
                      value={rawISPData}
                      onChange={(e) => setRawISPData(e.target.value)}
                    />

                    <button 
                      onClick={handleNeuralISPSync}
                      disabled={!rawISPData || isExtracting}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 text-lg italic tracking-tight uppercase"
                    >
                      {isExtracting ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={24} />}
                      {isExtracting ? 'DECODING ISP CONTENT...' : 'DECODE & SYNC SESSIONS'}
                    </button>
                  </div>
                </div>
             </div>
          )}

          {activeTab === Tab.Automation && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                     <div className="flex justify-between items-center mb-12">
                        <div>
                           <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Agent HUD</h3>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Tasks: {automationQueue.length}</p>
                        </div>
                        <div className="flex gap-4">
                           {!isAutomationRunning ? (
                             <button onClick={startAutonomousAgent} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl flex items-center gap-3 font-black italic tracking-tight shadow-xl shadow-green-600/20">
                               <Play size={20} /> START AGENT
                             </button>
                           ) : (
                             <button onClick={() => setIsAutomationRunning(false)} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl flex items-center gap-3 font-black italic tracking-tight">
                               <Pause size={20} /> PAUSE CORE
                             </button>
                           )}
                           <button onClick={() => setAutomationQueue([])} className="bg-slate-800 text-slate-500 p-3 rounded-2xl hover:text-red-500 border border-slate-700 transition-all">
                              <StopCircle size={22} />
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {automationQueue.map(task => (
                          <div key={task.id} className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl flex items-center justify-between transition-all group">
                             <div className="flex items-center gap-6">
                                <div className={`w-3 h-3 rounded-full ${
                                  task.status === 'completed' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' :
                                  task.status === 'failed' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' :
                                  task.status === 'idle' ? 'bg-slate-700' : 'bg-indigo-500 animate-pulse'
                                }`}></div>
                                <div>
                                   <p className="font-bold text-white text-sm">{task.domain}</p>
                                   <p className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-xs">{task.token || 'Awaiting Sync'}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'text-green-500' : 'text-slate-500'}`}>{task.status}</span>
                                {task.status === 'injecting' && <RefreshCw size={14} className="animate-spin text-indigo-400" />}
                                {task.status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                                {task.status === 'failed' && <AlertCircle size={18} className="text-red-500" title={task.error} />}
                             </div>
                          </div>
                        ))}
                        {automationQueue.length === 0 && (
                          <div className="text-center py-32 bg-slate-950/20 rounded-3xl border-2 border-dashed border-slate-800">
                             <Terminal size={48} className="mx-auto mb-4 opacity-10" />
                             <p className="text-slate-600 font-black uppercase tracking-widest text-sm italic">Queue Empty. Load data via Bulk or Neural Sync.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
               
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col h-[760px] shadow-2xl">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                     <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                        <Terminal size={18} className="text-indigo-400" /> Kernel Logs
                     </h4>
                     <button onClick={() => setLogs([])} className="text-[10px] font-bold text-slate-700 hover:text-slate-400 transition-all uppercase">Flush</button>
                  </div>
                  <div className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-indigo-300/80 overflow-y-auto custom-scrollbar border border-slate-800/50 leading-relaxed shadow-inner">
                     {logs.map((log, i) => (
                       <div key={i} className="mb-2 hover:bg-indigo-500/5 transition-colors p-1 rounded">
                          <span className="text-slate-700 mr-2">[{i.toString().padStart(3, '0')}]</span>
                          {log}
                       </div>
                     ))}
                     {logs.length === 0 && <p className="text-slate-800 italic uppercase">Kernel idle...</p>}
                     <div ref={logEndRef} />
                  </div>
               </div>
            </div>
          )}

          {activeTab === Tab.Cloudflare && (
            <div className="max-w-xl mx-auto py-12">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Cloud size={100} /></div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4">
                     <Lock size={24} className="text-indigo-400" /> Network Auth
                  </h3>
                  <div className="space-y-8">
                     <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Global API Token</label>
                        <input 
                          type="password" 
                          value={cfToken}
                          onChange={(e) => setCfToken(e.target.value)}
                          placeholder="••••••••••••••••••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-mono focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                        />
                     </div>
                     <button 
                       onClick={() => { localStorage.setItem('cf_token', cfToken); fetchDomains(); }}
                       className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase italic tracking-tighter"
                     >
                       Authorize Network Session
                     </button>
                     <div className="p-5 bg-indigo-950/20 rounded-2xl border border-indigo-500/10 flex gap-4">
                        <Info size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">Requires: Zone:Read, DNS:Edit. Tokens are localized and never shared.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 translate-x-1' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;
