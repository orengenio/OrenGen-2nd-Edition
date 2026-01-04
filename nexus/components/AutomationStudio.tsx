import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import { Workflow as WorkflowIcon, Play, AlertTriangle, CheckCircle2, Clock, Activity, Webhook, Plus } from 'lucide-react';
import AgentWorkspace from './AgentWorkspace';
import { MOCK_WORKFLOWS } from '../constants';

const AutomationStudio: React.FC = () => {
  const { activeProject } = useNexus();
  const [activeTab, setActiveTab] = useState<'workflows' | 'agent'>('workflows');

  // Mock n8n logic for demo
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS);

  const triggerWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => {
        if (w.id === id) {
            return { ...w, lastRun: 'Running...', status: 'active' };
        }
        return w;
    }));
    setTimeout(() => {
        setWorkflows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, lastRun: 'Just now', status: 'active' };
            }
            return w;
        }));
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <WorkflowIcon className="text-brand-accent"/> Automation Studio
            </h1>
            <p className="text-slate-500">n8n Workflow Monitoring & Event Bus.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1">
             <button 
                onClick={() => setActiveTab('workflows')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'workflows' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
                <Activity size={16} /> Monitor
             </button>
             <button 
                onClick={() => setActiveTab('agent')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'agent' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
                <BotIcon /> Architect
             </button>
        </div>
      </div>

      {activeTab === 'workflows' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Workflow List */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-slate-700 dark:text-slate-300">Active Pipelines</h3>
                      <button className="text-sm text-brand-primary font-medium flex items-center gap-1 hover:underline">
                          <Plus size={14} /> New Workflow
                      </button>
                  </div>
                  {workflows.map(wf => (
                      <div key={wf.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between group">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${
                                      wf.status === 'active' ? 'bg-green-500 animate-pulse' :
                                      wf.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                                  }`}></span>
                                  <span className="font-bold">{wf.name}</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                  <span>{wf.nodes} Nodes</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Clock size={10} /> {wf.lastRun}</span>
                              </div>
                          </div>
                          
                          <div className="flex gap-2">
                              {wf.webhookUrl && (
                                  <div className="hidden group-hover:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs font-mono text-slate-500 mr-2">
                                      <Webhook size={10} /> {wf.webhookUrl.split('/').pop()}
                                  </div>
                              )}
                              <button 
                                onClick={() => triggerWorkflow(wf.id)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-brand-accent transition-colors" title="Manual Trigger"
                              >
                                  <Play size={16} />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Stats & Health */}
              <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={20} className="text-green-400"/> Execution Health</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-white/5 rounded-lg">
                              <div className="text-2xl font-bold">4.2k</div>
                              <div className="text-xs text-slate-400">Runs (24h)</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                              <div className="text-2xl font-bold text-green-400">99.8%</div>
                              <div className="text-xs text-slate-400">Success Rate</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                              <div className="text-2xl font-bold text-yellow-400">210ms</div>
                              <div className="text-xs text-slate-400">Avg Latency</div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h3 className="font-bold mb-4">Recent Errors</h3>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-start gap-3">
                          <AlertTriangle className="text-red-500 shrink-0" size={18} />
                          <div>
                              <div className="text-sm font-bold text-red-700 dark:text-red-400">SAM.gov Scraper Failed</div>
                              <div className="text-xs text-red-600 dark:text-red-300 mt-1">Timeout error on node: "HTTP Request 2". Retrying in 15m.</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      ) : (
          <div className="flex-1">
              <AgentWorkspace 
                  project={activeProject || { id: 'sys', name: 'System', type: 'Infra', audience: 'Internal', status: 'active', progress: 0, readinessScore: 0, checklist: [], kpis: {}, tone: '', language: 'en' }} 
                  agentType="automation_engineer" 
                  title="Workflow Architect" 
              />
          </div>
      )}
    </div>
  );
};

const BotIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

export default AutomationStudio;