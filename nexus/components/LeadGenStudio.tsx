import React, { useEffect, useState } from 'react';
import {
  Search, Plus, RefreshCw, Download, Upload, Trash2, ChevronDown,
  CheckCircle, AlertCircle, Zap, Globe, Building2, Mail, Phone,
  BarChart3, Target, TrendingUp, Users, Filter, MoreHorizontal,
  ExternalLink, Play, Pause, ArrowUpDown
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  RowSelectionState
} from '@tanstack/react-table';
import { nexusApi, DomainLead, Campaign, LeadStats, EnrichmentStatus } from '../services/nexusApiService';

const LeadGenStudio: React.FC = () => {
  // Data state
  const [leads, setLeads] = useState<DomainLead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [enrichmentStatus, setEnrichmentStatus] = useState<EnrichmentStatus | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'campaigns' | 'stats'>('leads');
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [bulkDomains, setBulkDomains] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, campaignsRes, statsRes, enrichRes] = await Promise.all([
        nexusApi.getLeads({ status: statusFilter || undefined, limit: 100 }),
        nexusApi.getCampaigns({}),
        nexusApi.getLeadStats(30),
        nexusApi.getEnrichmentStatus(),
      ]);

      if (leadsRes.success && leadsRes.data) {
        setLeads(leadsRes.data.leads || []);
      }
      if (campaignsRes.success && campaignsRes.data) {
        setCampaigns(campaignsRes.data.campaigns || []);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (enrichRes.success && enrichRes.data) {
        setEnrichmentStatus(enrichRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Lead actions
  const handleAddLead = async () => {
    if (!newDomain.trim()) return;
    const res = await nexusApi.createLead(newDomain.trim());
    if (res.success) {
      setNewDomain('');
      setShowAddModal(false);
      fetchData();
    } else {
      alert(res.error || 'Failed to add lead');
    }
  };

  const handleBulkImport = async () => {
    const domains = bulkDomains.split('\n').map(d => d.trim()).filter(Boolean);
    if (domains.length === 0) return;

    const res = await nexusApi.bulkImportLeads({ domains, auto_enrich: true });
    if (res.success) {
      setBulkDomains('');
      setShowBulkModal(false);
      fetchData();
      alert(`Imported ${res.data?.imported || 0} leads. ${res.data?.duplicates || 0} duplicates skipped.`);
    } else {
      alert(res.error || 'Failed to import leads');
    }
  };

  const handleEnrichLead = async (id: string) => {
    const res = await nexusApi.enrichLead(id);
    if (res.success) {
      fetchData();
    } else {
      alert(res.error || 'Failed to enrich lead');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const res = await nexusApi.deleteLead(id);
    if (res.success) {
      fetchData();
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection).map(idx => leads[parseInt(idx)]?.id).filter(Boolean);
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} leads?`)) return;

    const res = await nexusApi.bulkDeleteLeads(selectedIds);
    if (res.success) {
      setRowSelection({});
      fetchData();
    }
  };

  const handleExport = () => {
    const selectedIds = Object.keys(rowSelection).map(idx => leads[parseInt(idx)]?.id).filter(Boolean);
    const url = nexusApi.getExportUrl({
      ids: selectedIds.length > 0 ? selectedIds : undefined,
      format: 'csv'
    });
    window.open(url, '_blank');
  };

  // Table setup
  const columnHelper = createColumnHelper<DomainLead>();

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-slate-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-slate-300"
        />
      ),
    }),
    columnHelper.accessor('domain', {
      header: 'Domain',
      cell: info => (
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-slate-400" />
          <a
            href={`https://${info.getValue()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-accent hover:underline font-medium"
          >
            {info.getValue()}
          </a>
        </div>
      ),
    }),
    columnHelper.accessor('lead_score', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Score <ArrowUpDown size={14} />
        </button>
      ),
      cell: info => {
        const score = info.getValue();
        let color = 'bg-slate-200 text-slate-600';
        if (score >= 70) color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        else if (score >= 50) color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        else if (score >= 30) color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
            {score}
          </span>
        );
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          enriched: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
          qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
          contacted: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
          converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
          rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] || ''}`}>
            {status}
          </span>
        );
      }
    }),
    columnHelper.accessor('tech_stack', {
      header: 'Tech Stack',
      cell: info => {
        const tech = info.getValue();
        if (!tech) return <span className="text-slate-400 text-sm">-</span>;
        const cms = tech.cms || tech.framework || 'Unknown';
        return <span className="text-sm text-slate-600 dark:text-slate-400">{cms}</span>;
      }
    }),
    columnHelper.accessor('enrichment_data', {
      header: 'Emails',
      cell: info => {
        const data = info.getValue();
        const emails = data?.emails || [];
        return (
          <div className="flex items-center gap-1">
            <Mail size={14} className="text-slate-400" />
            <span className="text-sm">{emails.length}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('scraped_date', {
      header: 'Scraped',
      cell: info => (
        <span className="text-sm text-slate-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEnrichLead(row.original.id)}
            className="p-1.5 text-slate-400 hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="Enrich Lead"
          >
            <Zap size={16} />
          </button>
          <button
            onClick={() => handleDeleteLead(row.original.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data: leads,
    columns,
    state: { globalFilter, sorting, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  // Stats cards
  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-slate-500">{title}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lead Generation Studio</h1>
          <p className="text-slate-500 dark:text-slate-400">Domain intelligence & enrichment pipeline (Super Admin)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Upload size={16} />
            Bulk Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Enrichment Status Banner */}
      {enrichmentStatus && (
        <div className={`p-4 rounded-xl border ${
          enrichmentStatus.health === 'excellent' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
          enrichmentStatus.health === 'good' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
          enrichmentStatus.health === 'fair' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
          'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {enrichmentStatus.health === 'excellent' ? <CheckCircle className="text-green-600" /> :
               enrichmentStatus.health === 'good' ? <CheckCircle className="text-blue-600" /> :
               <AlertCircle className={enrichmentStatus.health === 'fair' ? 'text-yellow-600' : 'text-red-600'} />}
              <div>
                <div className="font-medium">Enrichment Services: {enrichmentStatus.configuredCount}/{enrichmentStatus.totalServices} configured</div>
                <div className="text-sm text-slate-500">
                  {enrichmentStatus.recommendations.length > 0 ? enrichmentStatus.recommendations[0] : 'All systems operational'}
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
              enrichmentStatus.health === 'excellent' ? 'bg-green-100 text-green-700' :
              enrichmentStatus.health === 'good' ? 'bg-blue-100 text-blue-700' :
              enrichmentStatus.health === 'fair' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {enrichmentStatus.health}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {['leads', 'campaigns', 'stats'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Leads" value={stats.overview.totalLeads} icon={Target} color="bg-blue-500" />
            <StatCard title="New Leads" value={stats.overview.newLeads} icon={Plus} color="bg-green-500" />
            <StatCard title="Qualified" value={stats.overview.qualifiedLeads} icon={CheckCircle} color="bg-purple-500" />
            <StatCard title="Converted" value={stats.overview.convertedLeads} icon={TrendingUp} color="bg-orange-500" />
            <StatCard title="Avg Score" value={Math.round(stats.overview.avgScore)} icon={BarChart3} color="bg-indigo-500" />
            <StatCard title="High Value" value={stats.overview.highValueLeads} icon={Zap} color="bg-amber-500" />
            <StatCard title="Enriched" value={stats.overview.enrichedLeads} icon={Building2} color="bg-cyan-500" />
            <StatCard title="Rejected" value={stats.overview.rejectedLeads} icon={Trash2} color="bg-red-500" />
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold mb-4">Conversion Funnel</h3>
            <div className="flex items-center gap-2">
              {['Total', 'Enriched', 'Qualified', 'Contacted', 'Converted'].map((stage, i) => {
                const values = [
                  stats.conversionFunnel.total,
                  stats.conversionFunnel.enriched,
                  stats.conversionFunnel.qualified,
                  stats.conversionFunnel.contacted,
                  stats.conversionFunnel.converted,
                ];
                const rates = [
                  100,
                  parseFloat(stats.conversionFunnel.rates.enrichment as string) || 0,
                  parseFloat(stats.conversionFunnel.rates.qualification as string) || 0,
                  parseFloat(stats.conversionFunnel.rates.contact as string) || 0,
                  parseFloat(stats.conversionFunnel.rates.conversion as string) || 0,
                ];
                return (
                  <React.Fragment key={stage}>
                    <div className="flex-1 text-center">
                      <div className={`h-16 rounded-lg flex items-center justify-center text-white font-bold ${
                        i === 0 ? 'bg-blue-500' :
                        i === 1 ? 'bg-purple-500' :
                        i === 2 ? 'bg-green-500' :
                        i === 3 ? 'bg-orange-500' :
                        'bg-emerald-500'
                      }`} style={{ opacity: 0.5 + (rates[i] / 200) }}>
                        {values[i]}
                      </div>
                      <div className="text-sm mt-2 text-slate-600 dark:text-slate-400">{stage}</div>
                      {i > 0 && <div className="text-xs text-slate-400">{rates[i]}%</div>}
                    </div>
                    {i < 4 && <div className="text-slate-300">→</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No campaigns yet. Create one from the main CRM dashboard.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{campaign.name}</h3>
                      <p className="text-sm text-slate-500">{campaign.description || 'No description'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{campaign.leads_generated}</div>
                      <div className="text-xs text-slate-500">Generated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{campaign.leads_qualified}</div>
                      <div className="text-xs text-slate-500">Qualified</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{campaign.leads_contacted}</div>
                      <div className="text-xs text-slate-500">Contacted</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{campaign.leads_converted}</div>
                      <div className="text-xs text-slate-500">Converted</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <>
          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search domains..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="enriched">Enriched</option>
              <option value="qualified">Qualified</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{Object.keys(rowSelection).length} selected</span>
                <button onClick={handleExport} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  <Download size={18} />
                </button>
                <button onClick={handleBulkDelete} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">Make sure the backend is running at http://localhost:3000</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="animate-spin text-brand-accent" size={32} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && leads.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Globe size={48} className="mx-auto mb-4 opacity-50" />
              <p>No leads found. Add domains to start building your pipeline.</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && leads.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                        {headerGroup.headers.map(header => (
                          <th key={header.id} className="px-4 py-3 font-medium">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-500">
                  Showing {table.getRowModel().rows.length} of {leads.length} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <input
                  type="text"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLead}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Bulk Import Domains</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Domains (one per line)</label>
                <textarea
                  rows={10}
                  placeholder="example1.com&#10;example2.com&#10;example3.com"
                  value={bulkDomains}
                  onChange={(e) => setBulkDomains(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm"
                />
              </div>
              <p className="text-sm text-slate-500">
                {bulkDomains.split('\n').filter(d => d.trim()).length} domains ready to import
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
                >
                  Import All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenStudio;
