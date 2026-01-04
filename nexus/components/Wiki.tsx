import React, { useState } from 'react';
import { WIKI_ARTICLES, NAV_ITEMS, INITIAL_TOOLS } from '../constants';
import { useNexus } from './NexusContext';
import { Book, Search, Shield, Database, Lock, RefreshCw, Cpu, CheckCircle2, Play, Layout, Zap, Terminal, GitBranch, Code, Server, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  mode: 'user' | 'admin';
}

const Wiki: React.FC<Props> = ({ mode }) => {
  const { projects, contacts, opportunities, startTour, activeProject, federalProfile } = useNexus();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const articles = WIKI_ARTICLES.filter(a => {
    if (mode === 'user') return !a.isAdminOnly;
    return true; // Admin sees all
  }).filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fadeIn pb-12">
        {/* 1. Admin Header & Quick Actions */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl border border-slate-700 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-slate-800 opacity-50 rotate-12">
                <Shield size={200} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Shield className="text-red-500" size={32} /> 
                        Nexus Admin OS
                    </h2>
                    <p className="text-slate-400 max-w-xl">
                        System Level 0 access. View live state injection, active schemata, and architectural documentation.
                        This dashboard auto-updates with the codebase.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={startTour}
                        className="px-6 py-3 bg-brand-primary hover:bg-brand-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 border border-white/10"
                    >
                        <Play size={18} fill="currentColor" /> Initialize Admin Tour
                    </button>
                </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 relative z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Total Projects</div>
                    <div className="text-2xl font-bold">{projects.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">CRM Database</div>
                    <div className="text-2xl font-bold">{contacts.length} <span className="text-sm font-normal text-slate-400">Records</span></div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Pipeline Value</div>
                    <div className="text-2xl font-bold text-green-400">${(opportunities.length * 1.5).toFixed(1)}M</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* 2. Dynamic Feature Registry (Left Col) */}
            <div className="xl:col-span-1 space-y-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <Layout className="text-brand-accent" /> Module Registry
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                        Dynamically rendered from `NAV_ITEMS`. Represents currently mounted routes and studios.
                    </p>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {NAV_ITEMS.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 group hover:border-brand-primary/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-md text-slate-500 group-hover:text-brand-primary transition-colors shadow-sm">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{item.label}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                                    item.section === 'core' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                    item.section === 'growth' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                    item.section === 'federal' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                }`}>
                                    {item.section || 'System'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <Zap className="text-yellow-500" /> Integration Health
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {INITIAL_TOOLS.map((tool) => (
                            <div key={tool.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${tool.connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">{tool.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{tool.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. System State & README (Right Col) */}
            <div className="xl:col-span-2 space-y-8">
                {/* Live State Inspector */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700 shadow-sm font-mono text-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                        <Cpu size={120} />
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                        <Database className="text-green-400" /> Live State Inspector
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Active Project Context</div>
                                <div className="text-[10px] text-slate-600 bg-slate-800 px-2 py-1 rounded">Read-Only</div>
                            </div>
                            <div className="bg-black/50 p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto custom-scrollbar hover:border-slate-600 transition-colors">
                                <pre className="text-xs text-blue-300">
                                    {activeProject ? JSON.stringify({
                                        id: activeProject.id,
                                        name: activeProject.name,
                                        status: activeProject.status,
                                        kpis: activeProject.kpis,
                                        agentChecklistCount: activeProject.checklist.length,
                                        progress: `${Math.round((activeProject.checklist.filter(i => i.status === 'done').length / activeProject.checklist.length) * 100)}%`
                                    }, null, 2) : '// No Project Initialized'}
                                </pre>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Federal Identity Profile</div>
                                <div className="text-[10px] text-slate-600 bg-slate-800 px-2 py-1 rounded">Read-Only</div>
                            </div>
                            <div className="bg-black/50 p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto custom-scrollbar hover:border-slate-600 transition-colors">
                                <pre className="text-xs text-orange-300">
                                    {JSON.stringify(federalProfile, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded README */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="prose dark:prose-invert max-w-none">
                        <h2 className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                            <Terminal className="text-brand-primary" /> System Architecture & Developer Guide
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-500"><Code size={16}/> Core Stack</h3>
                                <ul className="text-sm space-y-2 mt-2">
                                    <li><strong>Frontend:</strong> React 19 (Latest)</li>
                                    <li><strong>Type System:</strong> TypeScript 5.0+ (Strict Mode)</li>
                                    <li><strong>Routing:</strong> TanStack Router (File-based route gen)</li>
                                    <li><strong>State:</strong> React Context + LocalStorage Persistence (`NexusContext`)</li>
                                    <li><strong>Styling:</strong> TailwindCSS + Lucide Icons</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-500"><Server size={16}/> AI Orchestration</h3>
                                <ul className="text-sm space-y-2 mt-2">
                                    <li><strong>Provider:</strong> Google Gemini 1.5 via Vertex AI</li>
                                    <li><strong>Reasoning:</strong> `gemini-1.5-pro` (RFPs, Strategy)</li>
                                    <li><strong>Speed:</strong> `gemini-1.5-flash` (Chat, UI Gen)</li>
                                    <li><strong>Service:</strong> `services/geminiService.ts` handles context injection</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                            <h3 className="flex items-center gap-2 text-lg font-bold mb-4"><GitBranch size={18}/> Workflow: Adding New Studios</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li><strong>Define Route:</strong> Add route entry in <code>App.tsx</code> using <code>createRoute</code>.</li>
                                <li><strong>Register Module:</strong> Add entry to <code>NAV_ITEMS</code> constant in <code>constants.ts</code> to appear in sidebar/registry.</li>
                                <li><strong>Create Component:</strong> Build the UI in <code>components/</code>.</li>
                                <li><strong>Define Agent (Optional):</strong> Add new `AgentType` in `types.ts` and persona in `geminiService.ts`.</li>
                            </ol>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h3 className="flex items-center gap-2 text-lg font-bold mb-4"><FileText size={18}/> Directory Structure</h3>
                            <pre className="bg-white dark:bg-black/50 p-4 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
{`/src
  ├── components/       # UI Widgets & Studio Views (WebStudio, BrandStudio...)
  ├── services/         # API Wrappers (geminiService.ts)
  ├── types.ts          # Global Type Definitions (Single Source of Truth)
  ├── constants.ts      # Config, Nav Items, Mock Data, Tour Steps
  ├── App.tsx           # Router Config & Root Layout
  └── index.tsx         # Entry Point`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {mode === 'admin' ? <Shield className="text-red-500" /> : <Book className="text-brand-accent" />}
            {mode === 'admin' ? 'Admin Knowledge Base' : 'Nexus Wiki'}
          </h1>
          <p className="text-slate-500">{mode === 'admin' ? 'System internals and auto-updating architecture docs.' : 'Guides and documentation for operators.'}</p>
        </div>
      </div>

      {mode === 'admin' ? (
          renderAdminDashboard()
      ) : (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full md:w-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search docs..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm outline-none focus:border-brand-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {articles.map(article => (
                        <button
                            key={article.id}
                            onClick={() => setSelectedArticleId(article.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                                (selectedArticle.id === article.id) 
                                ? 'bg-brand-primary text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {article.isAdminOnly && <Shield size={12} />}
                            <span className="truncate">{article.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold uppercase tracking-wider rounded">
                        {selectedArticle.category}
                    </span>
                    {selectedArticle.isAdminOnly && (
                         <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                            <Lock size={10} /> Admin Only
                        </span>
                    )}
                </div>
                <h1 className="text-3xl font-bold mb-6">{selectedArticle.title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Wiki;