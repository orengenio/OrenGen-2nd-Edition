import React, { useState } from 'react';
import {
  Box, ExternalLink, Power, RefreshCw, Server,
  Layout, MessageSquare, Database, GitBranch,
  FileText, Activity, Share2, PenTool, Users,
  Headphones, Search, AppWindow, BarChart3
} from 'lucide-react';

interface FOSSService {
  id: string;
  name: string;
  category: string;
  status: 'Running' | 'Stopped' | 'Updating' | 'Error';
  url: string;
  description: string;
  icon: React.ReactNode;
  version: string;
  port: number;
}

const OpenSourceRegistry: React.FC = () => {
  const [services, setServices] = useState<FOSSService[]>([
    { id: 'penpot', name: 'Penpot', category: 'Design', status: 'Running', url: 'http://localhost:9001', description: 'Open Source Design & Prototyping (Figma Alternative).', icon: <PenTool size={24} />, version: '1.19.0', port: 9001 },
    { id: 'mattermost', name: 'Mattermost', category: 'Collaboration', status: 'Running', url: 'http://localhost:8065', description: 'Secure collaboration and team messaging.', icon: <MessageSquare size={24} />, version: '9.5.0', port: 8065 },
    { id: 'nocodb', name: 'NocoDB', category: 'Data', status: 'Running', url: 'http://localhost:8080', description: 'Open Source Airtable alternative. Turns DBs into Spreadsheets.', icon: <Database size={24} />, version: '0.204.0', port: 8080 },
    { id: 'jenkins', name: 'Jenkins', category: 'DevOps', status: 'Stopped', url: 'http://localhost:8081', description: 'Open source automation server for CI/CD pipelines.', icon: <GitBranch size={24} />, version: '2.440', port: 8081 },
    { id: 'grafana', name: 'Grafana', category: 'Monitoring', status: 'Running', url: 'http://localhost:3000', description: 'The open observability platform.', icon: <Activity size={24} />, version: '10.3.3', port: 3000 },
    { id: 'paperless', name: 'Paperless-ngx', category: 'Productivity', status: 'Running', url: 'http://localhost:8000', description: 'Document management system that transforms physical docs to searchable text.', icon: <FileText size={24} />, version: '2.5.0', port: 8000 },
    { id: 'postiz', name: 'Postiz', category: 'Marketing', status: 'Updating', url: 'http://localhost:4200', description: 'The ultimate AI social media scheduling tool.', icon: <Share2 size={24} />, version: '1.1.0', port: 4200 },
    { id: 'pgbackweb', name: 'pgBackWeb', category: 'DevOps', status: 'Running', url: 'http://localhost:8085', description: 'Web interface for PostgreSQL backups.', icon: <Server size={24} />, version: '0.1.0', port: 8085 },
    { id: 'orangehrm', name: 'OrangeHRM', category: 'HR', status: 'Stopped', url: 'http://localhost:8090', description: 'Open source HR management system.', icon: <Users size={24} />, version: '5.6', port: 8090 },
    { id: 'chatwoot', name: 'OrenDesk (Chatwoot)', category: 'Support', status: 'Running', url: 'http://localhost:3100', description: 'Open source customer engagement platform. Live chat, email, and omnichannel support.', icon: <Headphones size={24} />, version: '3.5.0', port: 3100 },
    { id: 'serpbear', name: 'OrenSEO (SerpBear)', category: 'Marketing', status: 'Running', url: 'http://localhost:3200', description: 'Open source SEO rank tracking tool. Monitor keyword positions across search engines.', icon: <Search size={24} />, version: '2.1.0', port: 3200 },
    { id: 'appsmith', name: 'OrenApps (Appsmith)', category: 'Development', status: 'Running', url: 'http://localhost:8280', description: 'Low-code platform to build internal tools, admin panels, and dashboards rapidly.', icon: <AppWindow size={24} />, version: '1.9.60', port: 8280 },
    { id: 'matomo', name: 'OrenMetrics (Matomo)', category: 'Analytics', status: 'Running', url: 'http://localhost:8380', description: 'Privacy-focused web analytics platform. GDPR compliant alternative to Google Analytics.', icon: <BarChart3 size={24} />, version: '5.0.3', port: 8380 },
  ]);

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          status: s.status === 'Running' ? 'Stopped' : 'Running' 
        };
      }
      return s;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Stopped': return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
      case 'Updating': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Box className="text-brand-accent"/> FOSS Registry
        </h1>
        <p className="text-slate-500">
            Manage your self-hosted Open Source infrastructure. One-click deploy and monitor.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn pb-10">
          {services.map(service => (
              <div key={service.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* Status Indicator Dot */}
                  <div className={`absolute top-0 right-0 p-4`}>
                      <div className={`w-3 h-3 rounded-full ${service.status === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {service.icon}
                      </div>
                      <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <span className="text-xs text-slate-500 font-mono">v{service.version} : {service.port}</span>
                      </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">
                      {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                      <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(service.status)}`}>
                          {service.status}
                      </div>
                      
                      <div className="flex gap-2">
                          <button 
                            onClick={() => toggleStatus(service.id)}
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title={service.status === 'Running' ? 'Stop Container' : 'Start Container'}
                          >
                              <Power size={18} />
                          </button>
                          <a 
                            href={service.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${service.status !== 'Running' ? 'opacity-50 pointer-events-none' : 'text-brand-primary'}`}
                            title="Open Interface"
                          >
                              <ExternalLink size={18} />
                          </a>
                      </div>
                  </div>
              </div>
          ))}

          {/* Add New Card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/50 transition-colors cursor-pointer group min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layout size={24} />
              </div>
              <h3 className="font-bold">Deploy New Service</h3>
              <p className="text-xs mt-1">Docker Compose / Helm Chart</p>
          </div>
      </div>
    </div>
  );
};

export default OpenSourceRegistry;