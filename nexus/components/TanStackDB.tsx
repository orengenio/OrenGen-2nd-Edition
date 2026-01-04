import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Database, RefreshCw, Trash2, Search } from 'lucide-react';

// This component acts as a "DB Viewer" for the frontend state managed by TanStack Query
const TanStackDB: React.FC = () => {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryCache();
  
  // Force re-render to show cache updates
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const unsubscribe = cache.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, [cache]);

  const queries = cache.getAll();

  return (
    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-700 font-mono text-sm h-96 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2 font-bold text-white">
                <Database size={16} className="text-brand-accent"/>
                <span>TanStack DB Viewer (Query Cache)</span>
            </div>
            <div className="text-xs text-slate-500">
                {queries.length} active records
            </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
            {queries.length === 0 ? (
                <div className="text-center py-10 text-slate-600">No active queries in cache.</div>
            ) : (
                queries.map((query) => (
                    <div key={query.queryHash} className="bg-slate-800/50 p-3 rounded border border-slate-700/50 hover:border-slate-600 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-green-400 break-all">{JSON.stringify(query.queryKey)}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                query.state.status === 'success' ? 'bg-green-900 text-green-300' :
                                query.state.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-red-900 text-red-300'
                            }`}>
                                {query.state.status}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-2">
                            Last Updated: {new Date(query.state.dataUpdatedAt).toLocaleTimeString()}
                        </div>
                        <div className="bg-black/30 p-2 rounded overflow-x-auto">
                            <pre className="text-xs text-slate-400">
                                {JSON.stringify(query.state.data, null, 2)?.slice(0, 200)}
                                {JSON.stringify(query.state.data)?.length > 200 ? '...' : ''}
                            </pre>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button 
                                onClick={() => query.fetch()} 
                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                                title="Refetch"
                            >
                                <RefreshCw size={12} />
                            </button>
                            <button 
                                onClick={() => queryClient.removeQueries({ queryKey: query.queryKey })}
                                className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400"
                                title="Delete Record"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default TanStackDB;