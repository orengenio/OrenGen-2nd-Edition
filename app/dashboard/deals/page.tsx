'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyId: '',
    contactId: '',
    title: '',
    value: '',
    currency: 'USD',
    stage: 'prospecting',
    probability: '10',
    expectedCloseDate: '',
  });

  useEffect(() => {
    loadDeals();
    loadCompanies();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    const response = await apiClient.getDeals({ limit: 50 });
    if (response.success) {
      setDeals(response.data.deals || []);
    }
    setLoading(false);
  };

  const loadCompanies = async () => {
    const response = await apiClient.getCompanies({ limit: 100 });
    if (response.success) {
      setCompanies(response.data.companies || []);
    }
  };

  const loadContactsForCompany = async (companyId: string) => {
    const response = await apiClient.getContacts({ companyId, limit: 50 });
    if (response.success) {
      setContacts(response.data.contacts || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      value: parseFloat(formData.value),
      probability: parseInt(formData.probability),
    };

    const response = await apiClient.createDeal(data);

    if (response.success) {
      setShowModal(false);
      resetForm();
      loadDeals();
    } else {
      alert(response.error);
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      contactId: '',
      title: '',
      value: '',
      currency: 'USD',
      stage: 'prospecting',
      probability: '10',
      expectedCloseDate: '',
    });
    setCurrentDeal(null);
    setContacts([]);
  };

  const getStageColor = (stage: string) => {
    const colors: any = {
      prospecting: 'bg-gray-500/20 text-gray-400',
      qualification: 'bg-blue-500/20 text-blue-400',
      proposal: 'bg-purple-500/20 text-purple-400',
      negotiation: 'bg-orange-500/20 text-orange-400',
      'Closed Won': 'bg-green-500/20 text-green-400',
      'Closed Lost': 'bg-red-500/20 text-red-400',
    };
    return colors[stage] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Deals</h1>
          <p className="text-gray-400 mt-1">Manage your sales pipeline</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
        >
          + Add Deal
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No deals found. Create your first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Close Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{deal.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deal.company_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      ${deal.value?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{deal.probability}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add Deal</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => {
                      setFormData({ ...formData, companyId: e.target.value });
                      loadContactsForCompany(e.target.value);
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact</label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Q1 Enterprise Deal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Value *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="prospecting">Prospecting</option>
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Probability (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expected Close Date</label>
                  <input
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
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
                    Create Deal
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
