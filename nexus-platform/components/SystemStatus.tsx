import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Activity, CheckCircle2, AlertTriangle, Server, Database, Globe, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const data = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  latency: Math.floor(Math.random() * 20) + 40 // Random latency between 40-60ms
}));

const SystemStatus: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-green-500 selection:text-white">
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
                <span className="text-orange-500">ORENGEN</span>
                <span>STATUS</span>
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-white flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20">
        
        {/* Main Status Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse">
                    <CheckCircle2 size={32} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">All Systems Operational</h1>
                    <p className="text-green-400 font-medium">100% Uptime (Last 24h)</p>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-sm text-slate-400">Latest Check</div>
                <div className="text-white font-mono">{new Date().toLocaleTimeString()}</div>
            </div>
        </div>

        {/* System Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
                { name: 'Core API Gateway', icon: Server, status: 'Operational', latency: '42ms' },
                { name: 'Gemini Inference Engine', icon: Cpu, status: 'Operational', latency: '120ms' },
                { name: 'Vector Database (RAG)', icon: Database, status: 'Operational', latency: '15ms' },
                { name: 'Dashboard Frontend', icon: Globe, status: 'Operational', latency: '24ms' },
            ].map((sys, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <sys.icon size={24} className="text-slate-400" />
                        <div>
                            <div className="font-bold text-white">{sys.name}</div>
                            <div className="text-xs text-slate-500">Global Region (US-EAST-1)</div>
                        </div>
                    </div>
                    <div className="text-right">
                         <div className="text-green-400 text-sm font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 size={12}/> {sys.status}
                         </div>
                         <div className="text-xs text-slate-500 font-mono mt-1">{sys.latency}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Latency Chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={20} /> System Latency (24h)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#22c55e' }}
                        />
                        <Area type="monotone" dataKey="latency" stroke="#22c55e" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} />
                        <XAxis dataKey="time" hide />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Incident History */}
        <div>
            <h3 className="text-xl font-bold text-white mb-6">Incident History</h3>
            <div className="space-y-4">
                <div className="border-l-2 border-green-500 pl-6 pb-6 relative">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-green-500"></div>
                    <div className="text-sm text-slate-500 mb-1">{new Date().toLocaleDateString()}</div>
                    <div className="text-white font-medium">No incidents reported today.</div>
                </div>
                <div className="border-l-2 border-slate-800 pl-6 pb-6 relative opacity-50">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-700"></div>
                     <div className="text-sm text-slate-500 mb-1">{new Date(Date.now() - 86400000).toLocaleDateString()}</div>
                    <div className="text-white font-medium">Scheduled Maintenance: Database Optimization completed successfully.</div>
                </div>
            </div>
        </div>

      </main>

      <footer className="border-t border-white/10 py-12 text-center text-slate-500 text-sm">
         &copy; {new Date().getFullYear()} OrenGen Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default SystemStatus;