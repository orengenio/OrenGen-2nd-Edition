import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { Project } from '../types';
import { ArrowRight, Activity, Calendar, Zap, Bot, Trash2 } from 'lucide-react';
import { useNexus } from './NexusContext';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 700 },
];

const Dashboard: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const { deleteProject } = useNexus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Nexus Control Room</h1>
          <p className="text-slate-500 dark:text-slate-400">Intent to Infrastructure pipeline active.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Agents Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-medium">System Health</span>
            <Activity className="text-brand-accent" size={20} />
          </div>
          <div className="text-3xl font-bold">98%</div>
          <div className="text-sm text-green-500 mt-1">Optimization Active</div>
        </div>
        
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
           <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-medium">Deployed Assets</span>
            <Zap className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold">24</div>
          <div className="text-sm text-slate-500 mt-1">Across 3 Channels</div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
           <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-medium">Active Agents</span>
            <Bot className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold">8</div>
          <div className="text-sm text-slate-500 mt-1">Orchestrating</div>
        </div>

         <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
           <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-medium">Pending Tasks</span>
            <Calendar className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-sm text-slate-500 mt-1">Requires Approval</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6">Traffic & Engagement Velocity</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-auto h-96">
          <h3 className="text-lg font-semibold mb-4">Active Operations</h3>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <div>
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-slate-500">{project.type} • {project.status}</div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                    >
                        <Trash2 size={16} />
                    </button>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-accent transition-colors" />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500">No active operations initialized.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;