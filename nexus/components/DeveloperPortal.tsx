import React, { useState } from 'react';
import { Terminal, Database, Server, Copy, CheckCircle, Shield, Globe, Cloud, Code } from 'lucide-react';
import TanStackDB from './TanStackDB';

const DeveloperPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'mcp' | 'db' | 'cloud'>('api');
  const [apiKey] = useState('nx_live_8f492...39a');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="text-brand-accent"/> Developer Portal
          </h1>
          <p className="text-slate-500">API Keys, MCP Server Config, and Database Connections.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1">
             <button onClick={() => setActiveTab('api')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'api' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Globe size={16} /> API Keys
             </button>
             <button onClick={() => setActiveTab('mcp')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'mcp' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Server size={16} /> MCP Servers
             </button>
             <button onClick={() => setActiveTab('db')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'db' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Database size={16} /> Data Sources
             </button>
             <button onClick={() => setActiveTab('cloud')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'cloud' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Cloud size={16} /> Cloud IDE
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
          {activeTab === 'api' && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Production API Key</h3>
                      <div className="flex gap-2">
                          <input type="text" value={apiKey} readOnly className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm" />
                          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                              <Copy size={18} />
                          </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Use this key to authenticate requests to <code>https://api.orengen.nexus/v1</code>.</p>
                  </div>

                   <div className="bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700 font-mono text-sm">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                            <span className="font-bold text-white">Example Request</span>
                            <span className="text-xs text-green-400">cURL</span>
                        </div>
<pre className="whitespace-pre-wrap">
{`curl -X POST https://api.orengen.nexus/v1/agents/run \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "web_architect",
    "prompt": "Analyze this URL for SEO gaps",
    "context": { "url": "example.com" }
  }'`}
</pre>
                   </div>
              </div>
          )}

          {activeTab === 'mcp' && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex gap-4">
                      <Server className="text-blue-600 dark:text-blue-400 shrink-0" size={24} />
                      <div>
                          <h3 className="font-bold text-blue-800 dark:text-blue-300">Model Context Protocol (MCP)</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                              Connect your agents to external tools (Filesystem, GitHub, Slack) securely using standard MCP servers.
                          </p>
                      </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold">Active Servers</h3>
                          <button className="text-sm text-brand-primary font-medium">+ Add Server</button>
                      </div>
                      <div className="space-y-3">
                          {[
                              { name: 'FileSystem Access', status: 'Connected', url: 'ws://localhost:3000/mcp' },
                              { name: 'GitHub Integration', status: 'Connected', url: 'wss://mcp.github.com' },
                              { name: 'Brave Search', status: 'Disconnected', url: 'wss://mcp.brave.com' }
                          ].map((s, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${s.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <div>
                                          <div className="font-medium">{s.name}</div>
                                          <div className="text-xs text-slate-500 font-mono">{s.url}</div>
                                      </div>
                                  </div>
                                  <button className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded hover:bg-slate-100">
                                      Config
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'db' && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <h3 className="font-bold mb-4 flex items-center gap-2"><Database size={18}/> Persistent Storage</h3>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                              <div className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 text-sm">
                                  <CheckCircle size={16} /> Supabase (PostgreSQL) Connected
                              </div>
                              <p className="text-xs text-green-600 dark:text-green-500 mt-1">Region: us-east-1</p>
                          </div>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                  <span className="text-slate-500">Schema</span>
                                  <span className="font-mono">public</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                  <span className="text-slate-500">Tables</span>
                                  <span className="font-mono">12</span>
                              </div>
                              <div className="flex justify-between py-2">
                                  <span className="text-slate-500">Size</span>
                                  <span className="font-mono">42 MB</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col">
                           <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-400">Frontend State (Cache)</h3>
                           <div className="flex-1">
                               <TanStackDB />
                           </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'cloud' && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-20">
                          <Code size={120} />
                      </div>
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Replit_logo.png" className="w-6 h-6 invert" alt="Replit"/>
                          Replit Integration
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-lg">
                          This Nexus instance is running on Replit's cloud infrastructure. Use Replit Agent to modify code, deploy agents, and scale backend services instantly.
                      </p>
                      
                      <div className="flex gap-4">
                          <a href="https://replit.com/~/dashboard" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors">
                              Open Replit IDE
                          </a>
                          <button className="px-6 py-2 border border-slate-600 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors">
                              View Deployment Logs
                          </button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <h4 className="font-bold mb-4">Environment Variables</h4>
                          <div className="space-y-2 text-sm font-mono text-slate-600 dark:text-slate-400">
                              <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                  <span>NODE_ENV</span>
                                  <span className="text-green-600 dark:text-green-400">production</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                  <span>REPLIT_DEPLOYMENT</span>
                                  <span className="text-blue-600 dark:text-blue-400">true</span>
                              </div>
                              <div className="flex justify-between pb-2">
                                  <span>API_KEY</span>
                                  <span>••••••••</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default DeveloperPortal;