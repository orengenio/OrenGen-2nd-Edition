'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useWebSocket } from '@/lib/use-websocket';
import Link from 'next/link';

export default function LeadQueuePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const { socket, isConnected, notifications } = useWebSocket();

  useEffect(() => {
    loadLeads();
  }, [filter, sortBy]);

  // Real-time updates - reload leads when new notifications arrive
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      // Reload leads for relevant notification types
      if (
        latestNotification.type === 'new_lead' ||
        latestNotification.type === 'lead_assigned' ||
        latestNotification.type === 'lead_status_changed' ||
        latestNotification.type === 'high_value_lead'
      ) {
        loadLeads();
      }
    }
  }, [notifications]);

  const loadLeads = async () => {
    setLoading(true);
    const params: any = { limit: 100 };

    // Filter by score
    if (filter === 'hot') params.minScore = 80;
    else if (filter === 'warm') params.minScore = 60;
    else if (filter === 'cold') params.minScore = 0;

    const response = await apiClient.getLeads(params);
    if (response.success) {
      let sortedLeads = response.data.leads || [];

      // Sort
      if (sortBy === 'score') {
        sortedLeads.sort((a: any, b: any) => b.lead_score - a.lead_score);
      } else {
        sortedLeads.sort(
          (a: any, b: any) =>
            new Date(b.scraped_date).getTime() - new Date(a.scraped_date).getTime()
        );
      }

      setLeads(sortedLeads);
    }
    setLoading(false);
  };

  const handleSelect = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((lead) => lead.id));
    }
  };

  const handleBulkAssign = async (method: 'round_robin' | 'workload') => {
    if (selectedLeads.length === 0) {
      alert('Please select leads to assign');
      return;
    }

    const response = await fetch('/api/leads/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiClient.getToken()}`,
      },
      body: JSON.stringify({
        leadIds: selectedLeads,
        method,
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert(`Successfully assigned ${selectedLeads.length} leads`);
      setSelectedLeads([]);
      loadLeads();
    } else {
      alert(result.error);
    }
  };

  const getLeadTier = (score: number) => {
    if (score >= 80) return { label: '🔥 HOT', color: 'text-red-400', sla: '5 min' };
    if (score >= 60) return { label: '⚡ WARM', color: 'text-orange-400', sla: '30 min' };
    return { label: '❄️ COLD', color: 'text-blue-400', sla: '2 hr' };
  };

  const getTimeSinceCreated = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Queue</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-400">Speed-to-lead dashboard for instant action</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Real-time updates active' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/leads"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Leads
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4">
          <div className="text-red-400 text-sm font-medium">🔥 HOT LEADS</div>
          <div className="text-2xl font-bold text-white mt-1">
            {leads.filter((l) => l.lead_score >= 80).length}
          </div>
          <div className="text-xs text-red-300 mt-1">5 min SLA</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4">
          <div className="text-orange-400 text-sm font-medium">⚡ WARM LEADS</div>
          <div className="text-2xl font-bold text-white mt-1">
            {leads.filter((l) => l.lead_score >= 60 && l.lead_score < 80).length}
          </div>
          <div className="text-xs text-orange-300 mt-1">30 min SLA</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-blue-400 text-sm font-medium">❄️ COLD LEADS</div>
          <div className="text-2xl font-bold text-white mt-1">
            {leads.filter((l) => l.lead_score < 60).length}
          </div>
          <div className="text-xs text-blue-300 mt-1">2 hr SLA</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-purple-400 text-sm font-medium">📊 AVG SCORE</div>
          <div className="text-2xl font-bold text-white mt-1">
            {leads.length > 0
              ? Math.round(leads.reduce((acc, l) => acc + l.lead_score, 0) / leads.length)
              : 0}
          </div>
          <div className="text-xs text-purple-300 mt-1">Overall quality</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {['all', 'hot', 'warm', 'cold'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="score">Score (High to Low)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>
        {selectedLeads.length > 0 && (
          <div className="mt-4 flex gap-3 items-center">
            <span className="text-white font-medium">{selectedLeads.length} selected</span>
            <button
              onClick={() => handleBulkAssign('round_robin')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Assign Round Robin
            </button>
            <button
              onClick={() => handleBulkAssign('workload')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Assign by Workload
            </button>
            <button
              onClick={() => setSelectedLeads([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Lead Queue */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No leads in queue</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === leads.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leads.map((lead) => {
                  const tier = getLeadTier(lead.lead_score);
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-750 transition-colors ${
                        selectedLeads.includes(lead.id) ? 'bg-orange-500/10' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelect(lead.id)}
                          className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{lead.domain}</div>
                        {lead.enrichment_data?.emails?.[0] && (
                          <div className="text-sm text-gray-400">{lead.enrichment_data.emails[0]}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${tier.color}`}>{tier.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                lead.lead_score >= 80
                                  ? 'bg-red-500'
                                  : lead.lead_score >= 60
                                  ? 'bg-orange-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${lead.lead_score}%` }}
                            />
                          </div>
                          <span className="text-white font-bold text-sm">{lead.lead_score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {getTimeSinceCreated(lead.scraped_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{tier.sla}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => window.open(`mailto:${lead.enrichment_data?.emails?.[0]}`, '_blank')}
                            disabled={!lead.enrichment_data?.emails?.[0]}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                          >
                            📧 Email
                          </button>
                          <button
                            onClick={() => window.open(`https://${lead.domain}`, '_blank')}
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs"
                          >
                            🌐 Visit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
