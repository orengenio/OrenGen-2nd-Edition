import React from 'react';
import { ChecklistItem, AgentType } from '../types';
import { CheckCircle2, Circle, Play, ArrowRight, FileText, Eye } from 'lucide-react';

interface Props {
  items: ChecklistItem[];
  onRunStep: (item: ChecklistItem) => void;
  onToggle: (id: string) => void;
  onPreview?: (item: ChecklistItem) => void;
}

const Checklist: React.FC<Props> = ({ items, onRunStep, onToggle, onPreview }) => {
  // Group by category
  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-6">
      {categories.map(cat => (
        <div key={cat} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300">
            {cat}
          </div>
          <div>
            {items.filter(i => i.category === cat).map(item => (
              <div key={item.id} className="group flex items-center p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                
                {/* Status Toggle */}
                <button onClick={() => onToggle(item.id)} className="mr-4 text-slate-300 hover:text-brand-primary transition-colors">
                  {item.status === 'done' 
                    ? <CheckCircle2 className="text-green-500" size={24} /> 
                    : <Circle size={24} />
                  }
                </button>

                {/* Details */}
                <div className="flex-1">
                  <h4 className={`font-medium ${item.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.title}
                  </h4>
                  <div className="flex gap-2 mt-1 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded ${item.owner === 'AI' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {item.owner}
                    </span>
                    {item.agentId && (
                        <span>via {item.agentId.replace('_', ' ')}</span>
                    )}
                  </div>
                </div>

                {/* Action */}
                {item.owner === 'AI' && item.status !== 'done' && (
                  <button 
                    onClick={() => onRunStep(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded text-xs font-medium flex items-center gap-1"
                  >
                    Run Step <Play size={12} fill="currentColor" />
                  </button>
                )}
                {item.output && (
                    <button 
                        onClick={() => onPreview?.(item)}
                        className="ml-2 text-slate-400 hover:text-brand-primary p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Preview Asset"
                    >
                        <Eye size={18} />
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;