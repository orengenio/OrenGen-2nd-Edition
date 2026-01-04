import React, { useState } from 'react';
import { Opportunity } from '../types';
import { Radar, Filter, Plus, ArrowRight, ShieldCheck, Search, Building, Calendar, DollarSign, Activity, PieChart, TrendingUp, Users } from 'lucide-react';
import { generateAgentResponse } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunities: (opps: Opportunity[]) => void;
}

const FederalDashboard: React.FC<Props> = ({ opportunities, onSelectOpportunity, onUpdateOpportunities }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'intel'>('pipeline');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [scoutPrompt, setScoutPrompt] = useState('');

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-slate-400';
  };

  const handleScout = async () => {
    if(!scoutPrompt) return;
    setLoading(true);
    // Simulate finding a new opportunity via AI
    const result = await generateAgentResponse('opportunity_scout', `Find opportunities related to: ${scoutPrompt}. Return a summary.`, '', false);
    
    // In a real app, this would parse JSON and add to state. For demo, we alert or add a mock based on prompt.
    const newOpp: Opportunity = {
        id: Date.now().toString(),
        title: `AI Scout Result: ${scoutPrompt}`,
        agency: 'Pending AI Analysis',
        value: 'TBD',
        deadline: '2024-12-31',
        type: 'Federal',
        status: 'New',
        matchScore: 85,
        description: result.slice(0, 150) + '...'
    };
    
    onUpdateOpportunities([newOpp, ...opportunities]);
    setLoading(false);
    setScoutPrompt('');
  };

  const filtered = opportunities.filter(o => filter === 'All' || o.type === filter);

  // Mock Market Intel Data
  const spendingData = [
      { name: 'DOE', value: 450 },
      { name: 'DOD', value: 890 },
      { name: 'HHS', value: 320 },
      { name: 'NASA', value: 210 },
      { name: 'DHS', value: 500 },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radar className="text-brand-accent" />
            Opportunity Studio
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Autonomous funding intelligence and qualification.</p>
        </div>
        
        {/* Toggle & Scout */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1">
                <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pipeline' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    Pipeline
                </button>
                <button onClick={() => setActiveTab('intel')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'intel' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    Market Intel
                </button>
            </div>

            <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        value={scoutPrompt}
                        onChange={(e) => setScoutPrompt(e.target.value)}
                        placeholder="Scout funding (e.g. 'Cyber grants')..." 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-accent"
                        onKeyDown={(e) => e.key === 'Enter' && handleScout()}
                    />
                </div>
                <button 
                    onClick={handleScout}
                    disabled={loading}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? 'Scouting...' : 'Scout'}
                </button>
            </div>
        </div>
      </div>

      {activeTab === 'pipeline' ? (
          <>
            {/* Pipeline KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Total Pipeline Value</div>
                    <div className="text-2xl font-bold">$12.5M</div>
                    <div className="text-xs text-green-500 flex items-center gap-1"><Activity size={12}/> +$2.5M this week</div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Win Probability (Avg)</div>
                    <div className="text-2xl font-bold">42%</div>
                    <div className="text-xs text-slate-400">Based on historic performance</div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Open Proposals</div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-orange-500">2 Due this week</div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Compliance Score</div>
                    <div className="text-2xl font-bold">98/100</div>
                    <div className="text-xs text-green-500">Ready for audit</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                {['All', 'Federal', 'Grant'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            filter === f 
                            ? 'border-brand-accent text-brand-accent' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Opportunity List */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(opp => (
                        <div key={opp.id} className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onSelectOpportunity(opp)}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-brand-primary hover:text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                                >
                                    Launch Workstation <ArrowRight size={12} />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Score */}
                                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-700">
                                    <span className={`text-lg font-bold ${getMatchColor(opp.matchScore)}`}>{opp.matchScore}</span>
                                    <span className="text-[10px] uppercase text-slate-400 font-bold">Match</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            opp.type === 'Federal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {opp.type}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500">
                                            {opp.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{opp.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{opp.description}</p>
                                    
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Building size={16} className="text-slate-400"/>
                                            {opp.agency}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign size={16} className="text-slate-400"/>
                                            {opp.value}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-slate-400"/>
                                            Due: {opp.deadline}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={16} className="text-slate-400"/>
                                            NAICS: {opp.naics || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </>
      ) : (
          <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><PieChart size={20}/> Agency Spending (FY2024)</h3>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spendingData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={50} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Users size={20}/> Competitor Watchlist</h3>
                  <div className="space-y-4">
                      {[
                          { name: 'Acme GovCon', status: 'Incumbent', winRate: '68%', recentWin: '$4.2M DOE Contract' },
                          { name: 'CyberDyne Systems', status: 'Challenger', winRate: '45%', recentWin: 'Subcontract @ Navy' },
                          { name: 'Globex Corp', status: 'Threat', winRate: '22%', recentWin: 'None recently' }
                      ].map((comp, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700">
                              <div>
                                  <div className="font-bold text-sm">{comp.name}</div>
                                  <div className="text-xs text-slate-500">Recent: {comp.recentWin}</div>
                              </div>
                              <div className="text-right">
                                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${comp.status === 'Incumbent' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                                      {comp.status}
                                  </span>
                                  <div className="text-xs font-mono mt-1 text-slate-400">Win Rate: {comp.winRate}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="col-span-1 lg:col-span-2 bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-green-400"/> AI Forecast</h3>
                  <p className="text-slate-300 text-sm mb-4">
                      Based on current spending trends for NAICS 541511 (Custom Computer Programming), Q4 is projected to see a **35% increase** in solicitations from the Department of Energy.
                  </p>
                  <div className="flex gap-4">
                      <div className="p-4 bg-white/10 rounded-lg flex-1">
                          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Hot Keywords</div>
                          <div className="font-medium text-sm">Zero Trust, Cloud Migration, AI Governance</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-lg flex-1">
                          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Upcoming Vehicles</div>
                          <div className="font-medium text-sm">CIO-SP4, OASIS+ (On-Ramp)</div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FederalDashboard;