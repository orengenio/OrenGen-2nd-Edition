'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  filters: any;
  status: 'draft' | 'active' | 'paused' | 'completed';
  total_leads: number;
  enriched_leads: number;
  qualified_leads: number;
  contacted_leads: number;
  converted_leads: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as Campaign['status'],
    filters: {
      tlds: [] as string[],
      technologies: [] as string[],
      excludeTechnologies: [] as string[],
      hasContactForm: undefined as boolean | undefined,
      hasLiveChat: undefined as boolean | undefined,
      countries: [] as string[],
      minLeadScore: undefined as number | undefined,
      keywords: [] as string[],
    },
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const response = await apiClient.getCampaigns({ limit: 100 });
    if (response.success) {
      setCampaigns(response.data.campaigns || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFilters = {
      ...formData.filters,
      tlds: formData.filters.tlds.filter(Boolean),
      technologies: formData.filters.technologies.filter(Boolean),
      excludeTechnologies: formData.filters.excludeTechnologies.filter(Boolean),
      countries: formData.filters.countries.filter(Boolean),
      keywords: formData.filters.keywords.filter(Boolean),
    };

    if (editingCampaign) {
      const response = await apiClient.updateCampaign(editingCampaign.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        filters: cleanFilters,
      });

      if (response.success) {
        setShowModal(false);
        setEditingCampaign(null);
        resetForm();
        loadCampaigns();
      } else {
        alert(response.error);
      }
    } else {
      const response = await apiClient.createCampaign({
        name: formData.name,
        description: formData.description,
        filters: cleanFilters,
      });

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadCampaigns();
      } else {
        alert(response.error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    const response = await apiClient.deleteCampaign(id);
    if (response.success) {
      loadCampaigns();
    } else {
      alert(response.error);
    }
  };

  const handleStatusChange = async (id: string, status: Campaign['status']) => {
    const response = await apiClient.updateCampaign(id, { status });
    if (response.success) {
      loadCampaigns();
    } else {
      alert(response.error);
    }
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    const filters = campaign.filters || {};
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      status: campaign.status,
      filters: {
        tlds: filters.tlds || [],
        technologies: filters.technologies || [],
        excludeTechnologies: filters.excludeTechnologies || [],
        hasContactForm: filters.hasContactForm,
        hasLiveChat: filters.hasLiveChat,
        countries: filters.countries || [],
        minLeadScore: filters.minLeadScore,
        keywords: filters.keywords || [],
      },
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'draft',
      filters: {
        tlds: [],
        technologies: [],
        excludeTechnologies: [],
        hasContactForm: undefined,
        hasLiveChat: undefined,
        countries: [],
        minLeadScore: undefined,
        keywords: [],
      },
    });
    setEditingCampaign(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500/20 text-gray-400',
      active: 'bg-green-500/20 text-green-400',
      paused: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-blue-500/20 text-blue-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateConversionRate = (campaign: Campaign) => {
    if (campaign.total_leads === 0) return '0%';
    return ((campaign.converted_leads / campaign.total_leads) * 100).toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Campaigns</h1>
          <p className="text-gray-400 mt-1">Organize and filter leads by campaign</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
        >
          + New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400">No campaigns yet. Create your first one!</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                {campaign.description && (
                  <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">Total Leads</p>
                    <p className="text-xl font-bold text-white">{campaign.total_leads}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Conversion</p>
                    <p className="text-xl font-bold text-green-400">{calculateConversionRate(campaign)}</p>
                  </div>
                </div>

                {/* Funnel */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Enriched</span>
                    <span className="text-blue-400">{campaign.enriched_leads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Qualified</span>
                    <span className="text-green-400">{campaign.qualified_leads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Contacted</span>
                    <span className="text-purple-400">{campaign.contacted_leads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Converted</span>
                    <span className="text-emerald-400">{campaign.converted_leads}</span>
                  </div>
                </div>

                {/* Filters Preview */}
                {campaign.filters && Object.keys(campaign.filters).some(k => {
                  const v = campaign.filters[k];
                  return Array.isArray(v) ? v.length > 0 : v !== undefined;
                }) && (
                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <p className="text-xs text-gray-400 mb-2">Filters:</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.filters.tlds?.map((tld: string) => (
                        <span key={tld} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                          {tld}
                        </span>
                      ))}
                      {campaign.filters.technologies?.map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                      {campaign.filters.minLeadScore && (
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">
                          Score {campaign.filters.minLeadScore}+
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-4">
                  Created {formatDate(campaign.created_at)} by {campaign.created_by_name}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-700 p-4 flex justify-between">
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Activate
                    </button>
                  )}
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'paused')}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                    >
                      Pause
                    </button>
                  )}
                  {campaign.status === 'paused' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Resume
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(campaign)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., New WordPress Sites Q1 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                    placeholder="Describe the campaign goal..."
                  />
                </div>

                {editingCampaign && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Lead Filters</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">TLDs</label>
                      <input
                        type="text"
                        value={formData.filters.tlds.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            tlds: e.target.value.split(',').map(s => s.trim()),
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder=".com, .io, .net"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Technologies</label>
                      <input
                        type="text"
                        value={formData.filters.technologies.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            technologies: e.target.value.split(',').map(s => s.trim()),
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="WordPress, Shopify"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Countries</label>
                      <input
                        type="text"
                        value={formData.filters.countries.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            countries: e.target.value.split(',').map(s => s.trim().toUpperCase()),
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="US, CA, UK"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Min Score</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.filters.minLeadScore || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            minLeadScore: e.target.value ? parseInt(e.target.value) : undefined,
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Keywords</label>
                      <input
                        type="text"
                        value={formData.filters.keywords.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            keywords: e.target.value.split(',').map(s => s.trim()),
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="shop, store, buy"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Exclude Tech</label>
                      <input
                        type="text"
                        value={formData.filters.excludeTechnologies.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            excludeTechnologies: e.target.value.split(',').map(s => s.trim()),
                          },
                        })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="Wix, Squarespace"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 mt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.filters.hasContactForm === true}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            hasContactForm: e.target.checked ? true : undefined,
                          },
                        })}
                        className="rounded bg-gray-600 border-gray-500"
                      />
                      Has Contact Form
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.filters.hasLiveChat === true}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: {
                            ...formData.filters,
                            hasLiveChat: e.target.checked ? true : undefined,
                          },
                        })}
                        className="rounded bg-gray-600 border-gray-500"
                      />
                      Has Live Chat
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
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
