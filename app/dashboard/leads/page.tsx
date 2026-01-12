'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface Lead {
  id: string;
  domain: string;
  status: string;
  lead_score: number;
  assigned_to: string | null;
  assigned_to_name: string | null;
  whois_data: any;
  tech_stack: any;
  enrichment_data: any;
  notes: string | null;
  scraped_date: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
}

type ModalType = 'add' | 'import' | 'detail' | 'convert' | 'assign' | null;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [enriching, setEnriching] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [minScore, setMinScore] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });

  // Form data
  const [formData, setFormData] = useState({ domain: '', notes: '' });
  const [importData, setImportData] = useState({ domains: '', campaignId: '', autoEnrich: false });
  const [convertData, setConvertData] = useState({
    company_name: '',
    company_industry: '',
    company_size: 'small',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: '',
    contact_job_title: '',
    create_contact: true,
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    const response = await apiClient.getLeads({
      search,
      status: statusFilter,
      minScore: minScore ? parseInt(minScore) : undefined,
      page: pagination.page,
      limit: pagination.limit,
    });
    if (response.success) {
      setLeads(response.data.leads || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    }
    setLoading(false);
  }, [search, statusFilter, minScore, pagination.page, pagination.limit]);

  const loadCampaigns = async () => {
    const response = await apiClient.getCampaigns({ limit: 100 });
    if (response.success) {
      setCampaigns(response.data.campaigns || []);
    }
  };

  const loadStats = async () => {
    const response = await apiClient.getLeadStats(30);
    if (response.success) {
      setStats(response.data);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.createLead(formData.domain, formData.notes);
    if (response.success) {
      setModalType(null);
      setFormData({ domain: '', notes: '' });
      loadLeads();
    } else {
      alert(response.error);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const domains = importData.domains.split('\n').map(d => d.trim()).filter(Boolean);

    if (domains.length === 0) {
      alert('Please enter at least one domain');
      return;
    }

    const response = await apiClient.bulkImportLeads({
      domains,
      campaign_id: importData.campaignId || undefined,
      auto_enrich: importData.autoEnrich,
    });

    if (response.success) {
      setModalType(null);
      setImportData({ domains: '', campaignId: '', autoEnrich: false });
      loadLeads();
      loadStats();
      alert(`Imported ${response.data.imported} domains (${response.data.duplicates} duplicates skipped)`);
    } else {
      alert(response.error);
    }
  };

  const handleEnrich = async (id: string) => {
    setEnriching(id);
    const response = await apiClient.enrichLead(id);
    if (response.success) {
      loadLeads();
      loadStats();
    } else {
      alert(response.error);
    }
    setEnriching(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    const response = await apiClient.deleteLead(id);
    if (response.success) {
      loadLeads();
      loadStats();
    } else {
      alert(response.error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.size === 0) return;
    if (!confirm(`Delete ${selectedLeads.size} selected leads?`)) return;

    const response = await apiClient.bulkDeleteLeads(Array.from(selectedLeads));
    if (response.success) {
      setSelectedLeads(new Set());
      loadLeads();
      loadStats();
    } else {
      alert(response.error);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedLeads.size === 0) return;

    const response = await apiClient.bulkUpdateLeads({
      ids: Array.from(selectedLeads),
      status: newStatus,
    });

    if (response.success) {
      setSelectedLeads(new Set());
      loadLeads();
    } else {
      alert(response.error);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    const response = await apiClient.convertLead(selectedLead.id, convertData);
    if (response.success) {
      setModalType(null);
      setSelectedLead(null);
      loadLeads();
      loadStats();
      alert('Lead converted to CRM company successfully!');
    } else {
      alert(response.error);
    }
  };

  const handleExport = () => {
    const url = apiClient.exportLeads({
      status: statusFilter || undefined,
      minScore: minScore ? parseInt(minScore) : undefined,
      ids: selectedLeads.size > 0 ? Array.from(selectedLeads) : undefined,
    });
    window.open(url, '_blank');
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setModalType('detail');
  };

  const openConvertModal = (lead: Lead) => {
    setSelectedLead(lead);
    const whois = lead.whois_data || {};
    const enrichment = lead.enrichment_data || {};
    setConvertData({
      company_name: whois.registrantOrg || lead.domain,
      company_industry: enrichment.industry || '',
      company_size: enrichment.companySize?.includes('50') ? 'medium' : 'small',
      contact_first_name: '',
      contact_last_name: '',
      contact_email: enrichment.emails?.[0] || '',
      contact_job_title: '',
      create_contact: !!enrichment.emails?.[0],
    });
    setModalType('convert');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-gray-500/20 text-gray-400',
      enriched: 'bg-blue-500/20 text-blue-400',
      qualified: 'bg-green-500/20 text-green-400',
      contacted: 'bg-purple-500/20 text-purple-400',
      converted: 'bg-emerald-500/20 text-emerald-400',
      rejected: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Generation</h1>
          <p className="text-gray-400 mt-1">Discover, enrich, and manage domain leads</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalType('import')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Bulk Import
          </button>
          <button
            onClick={() => setModalType('add')}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
          >
            + Add Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Leads</p>
            <p className="text-2xl font-bold text-white">{stats.overview?.totalLeads || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">New</p>
            <p className="text-2xl font-bold text-gray-400">{stats.overview?.newLeads || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Enriched</p>
            <p className="text-2xl font-bold text-blue-400">{stats.overview?.enrichedLeads || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Qualified</p>
            <p className="text-2xl font-bold text-green-400">{stats.overview?.qualifiedLeads || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Converted</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.overview?.convertedLeads || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Avg Score</p>
            <p className="text-2xl font-bold text-orange-400">{stats.overview?.avgScore?.toFixed(0) || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="enriched">Enriched</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Any Score</option>
            <option value="80">80+ (Excellent)</option>
            <option value="60">60+ (Good)</option>
            <option value="40">40+ (Fair)</option>
            <option value="20">20+ (Low)</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
          <span className="text-orange-400">{selectedLeads.size} leads selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate('qualified')}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Mark Qualified
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('contacted')}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              Mark Contacted
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('rejected')}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Reject
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No leads found. Import domains or add manually!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.size === leads.length && leads.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded bg-gray-600 border-gray-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tech</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Emails</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Added</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leads.map((lead) => {
                  const tech = lead.tech_stack || {};
                  const enrichment = lead.enrichment_data || {};
                  const whois = lead.whois_data || {};

                  return (
                    <tr key={lead.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          className="rounded bg-gray-600 border-gray-500"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openLeadDetail(lead)}
                          className="text-left hover:text-orange-400 transition-colors"
                        >
                          <div className="text-sm font-medium text-white">{lead.domain}</div>
                          {whois.registrantOrg && (
                            <div className="text-xs text-gray-400">{whois.registrantOrg}</div>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-lg font-bold ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score || 0}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {tech.cms || tech.ecommerce || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {enrichment.emails?.length > 0 ? (
                          <span className="text-green-400">{enrichment.emails.length} found</span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(lead.scraped_date || lead.created_at)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {lead.status === 'new' && (
                            <button
                              onClick={() => handleEnrich(lead.id)}
                              disabled={enriching === lead.id}
                              className="text-orange-500 hover:text-orange-400 disabled:opacity-50 text-sm"
                            >
                              {enriching === lead.id ? 'Enriching...' : 'Enrich'}
                            </button>
                          )}
                          {lead.status !== 'converted' && (
                            <button
                              onClick={() => openConvertModal(lead)}
                              className="text-green-500 hover:text-green-400 text-sm"
                            >
                              Convert
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            Delete
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
            <span className="text-sm text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {modalType === 'add' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add Lead</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domain *</label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {modalType === 'import' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Bulk Import Domains</h2>
              <form onSubmit={handleBulkImport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Domains (one per line) *
                  </label>
                  <textarea
                    required
                    value={importData.domains}
                    onChange={(e) => setImportData({ ...importData, domains: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    rows={10}
                    placeholder="example.com&#10;another-domain.io&#10;company.net"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Enter up to 1000 domains, one per line
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign (optional)</label>
                  <select
                    value={importData.campaignId}
                    onChange={(e) => setImportData({ ...importData, campaignId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">No Campaign</option>
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoEnrich"
                    checked={importData.autoEnrich}
                    onChange={(e) => setImportData({ ...importData, autoEnrich: e.target.checked })}
                    className="rounded bg-gray-600 border-gray-500"
                  />
                  <label htmlFor="autoEnrich" className="text-sm text-gray-300">
                    Queue for auto-enrichment
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Import Domains
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {modalType === 'detail' && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLead.domain}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-2xl font-bold ${getScoreColor(selectedLead.lead_score)}`}>
                      Score: {selectedLead.lead_score || 0}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WHOIS Data */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">WHOIS Data</h3>
                  {selectedLead.whois_data ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Registrar:</span> <span className="text-white">{selectedLead.whois_data.registrar || '-'}</span></p>
                      <p><span className="text-gray-400">Organization:</span> <span className="text-white">{selectedLead.whois_data.registrantOrg || '-'}</span></p>
                      <p><span className="text-gray-400">Country:</span> <span className="text-white">{selectedLead.whois_data.registrantCountry || '-'}</span></p>
                      <p><span className="text-gray-400">Registered:</span> <span className="text-white">{formatDate(selectedLead.whois_data.registrationDate)}</span></p>
                      <p><span className="text-gray-400">Expires:</span> <span className="text-white">{formatDate(selectedLead.whois_data.expirationDate)}</span></p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Not enriched yet</p>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
                  {selectedLead.tech_stack ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">CMS:</span> <span className="text-white">{selectedLead.tech_stack.cms || '-'}</span></p>
                      <p><span className="text-gray-400">E-commerce:</span> <span className="text-white">{selectedLead.tech_stack.ecommerce || '-'}</span></p>
                      <p><span className="text-gray-400">Frameworks:</span> <span className="text-white">{selectedLead.tech_stack.frameworks?.join(', ') || '-'}</span></p>
                      <p><span className="text-gray-400">Analytics:</span> <span className="text-white">{selectedLead.tech_stack.analytics?.join(', ') || '-'}</span></p>
                      <p><span className="text-gray-400">Contact Form:</span> <span className={selectedLead.tech_stack.hasContactForm ? 'text-green-400' : 'text-gray-400'}>{selectedLead.tech_stack.hasContactForm ? 'Yes' : 'No'}</span></p>
                      <p><span className="text-gray-400">Live Chat:</span> <span className={selectedLead.tech_stack.hasLiveChat ? 'text-green-400' : 'text-gray-400'}>{selectedLead.tech_stack.hasLiveChat ? 'Yes' : 'No'}</span></p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Not detected yet</p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                  {selectedLead.enrichment_data?.emails?.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400 mb-2">Emails found:</p>
                      {selectedLead.enrichment_data.emails.map((email: string, i: number) => (
                        <a key={i} href={`mailto:${email}`} className="block text-blue-400 hover:text-blue-300">
                          {email}
                        </a>
                      ))}
                      {selectedLead.enrichment_data.socialMedia?.linkedin && (
                        <p className="mt-3"><span className="text-gray-400">LinkedIn:</span> <a href={selectedLead.enrichment_data.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View Profile</a></p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">No contact info found</p>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                  <p className="text-gray-300">{selectedLead.notes || 'No notes'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
                {selectedLead.status === 'new' && (
                  <button
                    onClick={() => { setModalType(null); handleEnrich(selectedLead.id); }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Enrich Lead
                  </button>
                )}
                {selectedLead.status !== 'converted' && (
                  <button
                    onClick={() => openConvertModal(selectedLead)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Convert to CRM
                  </button>
                )}
                <a
                  href={`https://${selectedLead.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Modal */}
      {modalType === 'convert' && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Convert Lead to CRM</h2>
              <p className="text-gray-400 mb-6">Create a company and optionally a contact from {selectedLead.domain}</p>

              <form onSubmit={handleConvert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={convertData.company_name}
                    onChange={(e) => setConvertData({ ...convertData, company_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                    <input
                      type="text"
                      value={convertData.company_industry}
                      onChange={(e) => setConvertData({ ...convertData, company_industry: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                    <select
                      value={convertData.company_size}
                      onChange={(e) => setConvertData({ ...convertData, company_size: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="startup">Startup</option>
                      <option value="small">Small (1-50)</option>
                      <option value="medium">Medium (50-200)</option>
                      <option value="enterprise">Enterprise (200+)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="createContact"
                      checked={convertData.create_contact}
                      onChange={(e) => setConvertData({ ...convertData, create_contact: e.target.checked })}
                      className="rounded bg-gray-600 border-gray-500"
                    />
                    <label htmlFor="createContact" className="text-sm font-medium text-gray-300">
                      Also create a contact
                    </label>
                  </div>

                  {convertData.create_contact && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            value={convertData.contact_first_name}
                            onChange={(e) => setConvertData({ ...convertData, contact_first_name: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={convertData.contact_last_name}
                            onChange={(e) => setConvertData({ ...convertData, contact_last_name: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                        <input
                          type="email"
                          required={convertData.create_contact}
                          value={convertData.contact_email}
                          onChange={(e) => setConvertData({ ...convertData, contact_email: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                        <input
                          type="text"
                          value={convertData.contact_job_title}
                          onChange={(e) => setConvertData({ ...convertData, contact_job_title: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setModalType(null); setSelectedLead(null); }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    Convert to CRM
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
