import React from 'react';
import { BarChart3, Database, FileSpreadsheet, RefreshCw, ExternalLink } from 'lucide-react';
import TanStackDB from './TanStackDB';

const DataStudio: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="text-brand-accent"/> Data & Sheets Studio
        </h1>
        <p className="text-slate-500">System intelligence, Google Sheets sync, and persistence layer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          <div className="flex flex-col gap-6">
              {/* Google Sheets Sync */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          <FileSpreadsheet size={20} className="text-green-500" /> 
                          Google Sheets Sync
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-500">Connected Sheet:</span>
                          <span className="font-medium truncate max-w-[200px]">Nexus_Master_CRM_v4</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-500">Last Sync:</span>
                          <span className="font-medium">Just now</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Rows Synced:</span>
                          <span className="font-medium">1,240</span>
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                          <RefreshCw size={14} /> Sync Now
                      </button>
                      <button className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                          <ExternalLink size={14} /> Open Sheet
                      </button>
                  </div>
              </div>

              {/* Analytics Placeholder */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
                  <h3 className="font-bold text-lg mb-4">Engagement Analytics</h3>
                  <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-lg">
                      Chart Placeholder (Recharts)
                  </div>
              </div>
          </div>

          {/* TanStack DB Viewer */}
          <div className="flex flex-col">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Database size={18}/> Frontend Database (TanStack Cache)</h3>
              <div className="flex-1">
                  <TanStackDB />
              </div>
          </div>
      </div>
    </div>
  );
};

export default DataStudio;