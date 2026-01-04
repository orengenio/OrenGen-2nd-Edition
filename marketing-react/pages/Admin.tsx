import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Terminal, 
  Activity, 
  Cpu, 
  LogOut, 
  LayoutDashboard, 
  Database, 
  Share2, 
  CheckCircle2, 
  Circle,
  Lock,
  Mail,
  Fingerprint
} from 'lucide-react';
import AdminAIAgent from '../components/AdminAIAgent';

interface AdminProps {
  onExit: () => void;
}

const Admin: React.FC<AdminProps> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isError, setIsError] = useState(false);

  // Persistence check (Session only)
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('orengen_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized Credentials as requested
    if (email === 'sales@orengen.io' && password === 'GodPromised2526!') {
      setIsAuthenticated(true);
      setIsError(false);
      sessionStorage.setItem('orengen_admin_auth', 'true');
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('orengen_admin_auth');
    onExit();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202] p-4 font-mono relative overflow-hidden">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CC5500 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-[#0a0a0a] border border-brand-orange/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,1)] relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20 animate-pulse-fast">
                <Fingerprint size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">Orengen <span className="text-brand-orange">OS</span></h1>
            <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest border-t border-white/10 pt-2">Encrypted Terminal Interface</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Access ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full bg-black border ${isError ? 'border-red-500' : 'border-white/10'} rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-orange transition-all text-sm`}
                    placeholder="sales@orengen.io"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-1">Security Keypath</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full bg-black border ${isError ? 'border-red-500' : 'border-white/10'} rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-orange transition-all text-sm`}
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {isError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-3 rounded-lg text-center animate-fade-in">
                Unauthorized: Access Denied
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest text-sm shadow-xl shadow-orange-500/10"
            >
              Authorize Session
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 flex justify-center">
             <button onClick={onExit} className="text-gray-600 text-[10px] hover:text-white transition-colors uppercase tracking-widest font-bold">Terminate to Root</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">O</div>
            <div className="font-display font-bold text-lg uppercase tracking-tight">Orengen <span className="text-brand-orange">OS</span></div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
           {[
             { id: 'dashboard', label: 'Command Hub', icon: LayoutDashboard },
             { id: 'ai', label: 'Site Architect', icon: Cpu },
             { id: 'config', label: 'System Config', icon: Settings },
             { id: 'logs', label: 'Network Logs', icon: Terminal },
             { id: 'db', label: 'Asset Database', icon: Database },
           ].map((item) => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                  ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shadow-[0_0_15px_rgba(204,85,0,0.1)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
             >
               <item.icon size={18} />
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-xs font-bold py-3 uppercase tracking-widest"
          >
            <LogOut size={14} /> Exit Terminal
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#050505] px-8 flex items-center justify-between">
           <div className="flex items-center gap-6 text-[10px] font-mono uppercase text-gray-500 tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Status: Alpha-X Stable
              </div>
              <span className="opacity-20 text-xs">|</span> 
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-brand-orange" />
                Auth Level: S-Tier Administrator
              </div>
           </div>
           <div className="flex gap-4">
              <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase">
                v2.5.0-Dev
              </button>
           </div>
        </header>

        {/* Dynamic View Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#020202]">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-4xl font-display font-bold uppercase tracking-tight">System <span className="text-brand-orange">Control</span></h2>
                    <p className="text-gray-500 mt-1 font-mono text-xs uppercase tracking-widest">Global platform analytics & real-time telemetry.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Active Sessions', val: '1,402', change: '+12%', icon: Activity },
                     { label: 'Neural Queries', val: '8,242', change: '+5.2%', icon: Cpu },
                     { label: 'Deployment Hub', val: '14 Active', change: 'Stable', icon: LayoutDashboard },
                     { label: 'Security Shield', val: 'Optimal', change: '100%', icon: ShieldCheck },
                   ].map((stat, i) => (
                     <div key={i} className="bg-[#080808] border border-white/5 p-6 rounded-2xl group hover:border-brand-orange/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                           <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange group-hover:scale-110 transition-transform"><stat.icon size={20} /></div>
                           <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">{stat.label}</div>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-[#080808] border border-white/5 rounded-2xl p-8">
                      <h3 className="font-bold text-lg mb-8 flex items-center gap-3 uppercase tracking-[0.15em] text-white">
                        <Terminal size={20} className="text-brand-orange" /> Dev Roadmap Checklist
                      </h3>
                      <div className="space-y-3">
                         {[
                           { task: 'Neural Core Connectivity', done: true },
                           { task: 'Admin Console Authorization', done: true },
                           { task: 'Dynamic Hero Text Logic', done: true },
                           { task: 'Stripe Asset Checkout V2', done: false },
                           { task: 'Buy-Lingual Audio Samples', done: false },
                           { task: 'SEO Mastermind Schema Root', done: true },
                         ].map((t, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default">
                              <span className={`text-xs uppercase tracking-wider ${t.done ? 'text-gray-500 line-through' : 'text-gray-300 font-bold'}`}>{t.task}</span>
                              {t.done ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-gray-700" />}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
                      <div className="absolute top-0 right-0 p-6">
                         <div className="w-3 h-3 bg-brand-orange rounded-full animate-ping"></div>
                      </div>
                      <div className="w-24 h-24 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mb-6"></div>
                      <h4 className="font-bold text-xl mb-3 uppercase tracking-wider">Site Rebuilding...</h4>
                      <p className="text-gray-500 text-xs max-w-xs leading-relaxed uppercase tracking-widest font-mono">Indexing assets and proprietary neural scripts for the Digital Arsenal Marketplace.</p>
                   </div>
                </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-full flex flex-col animate-fade-in">
               <div className="mb-8">
                  <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Site <span className="text-brand-orange">Architect</span></h2>
                  <p className="text-gray-500 mt-1 font-mono text-xs uppercase tracking-widest">Direct interface with the Gemini-3 Neural Core for platform automation.</p>
               </div>
               <div className="flex-1 bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                  <AdminAIAgent />
               </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-8 animate-fade-in max-w-4xl">
               <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Global <span className="text-brand-orange">Parameters</span></h2>
               
               <div className="bg-[#080808] border border-white/5 rounded-2xl p-10 space-y-10">
                  <div className="flex items-center justify-between py-6 border-b border-white/5">
                     <div>
                        <div className="font-bold text-lg">Maintenance Mode</div>
                        <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">Redirect traffic to 'In Production' terminal.</div>
                     </div>
                     <button className="w-14 h-7 bg-white/10 rounded-full relative p-1 transition-colors">
                        <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                     </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 gap-4">
                     <div>
                        <div className="font-bold text-lg">Ticker Communication</div>
                        <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">Active message broadcast in global header.</div>
                     </div>
                     <input type="text" defaultValue="Live AI Voice Demo Initialized" className="bg-black border border-white/10 rounded-xl px-6 py-3 text-sm w-full md:w-80 text-brand-orange font-mono focus:border-brand-orange focus:outline-none" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 gap-4">
                     <div>
                        <div className="font-bold text-lg">Flagship AI Agent</div>
                        <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">Designate primary agent for hero interaction.</div>
                     </div>
                     <select className="bg-black border border-white/10 rounded-xl px-6 py-3 text-sm w-full md:w-80 text-white font-mono focus:border-brand-orange focus:outline-none appearance-none cursor-pointer">
                        <option>Sarah B. (Sales Architecture)</option>
                        <option>John Q. (Support Network)</option>
                        <option>Emily R. (Neural Tech)</option>
                     </select>
                  </div>
                  
                  <div className="pt-6">
                    <button className="bg-brand-orange text-white font-bold px-10 py-4 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest text-xs shadow-xl shadow-orange-500/10">
                      Write to Global Core
                    </button>
                  </div>
               </div>
            </div>
          )}

          {(activeTab === 'logs' || activeTab === 'db') && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 py-20">
               <Terminal size={64} className="mb-6 opacity-10" />
               <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-widest">Interface Lock</h3>
               <p className="max-w-md text-xs font-mono uppercase tracking-widest leading-loose">Database nodes and Network Log listeners are in encrypted standby. Request Architect to build persistent listeners.</p>
               <button onClick={() => setActiveTab('ai')} className="mt-8 text-brand-orange font-bold uppercase text-xs hover:tracking-[0.2em] transition-all border-b border-brand-orange/30 pb-1">Consult Architect Core</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;