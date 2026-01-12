'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    isPrimary: false,
    linkedInUrl: '',
    status: 'lead',
  });

  useEffect(() => {
    loadContacts();
    loadCompanies();
  }, [search]);

  const loadContacts = async () => {
    setLoading(true);
    const response = await apiClient.getContacts({ search, limit: 50 });
    if (response.success) {
      setContacts(response.data.contacts || []);
    }
    setLoading(false);
  };

  const loadCompanies = async () => {
    const response = await apiClient.getCompanies({ limit: 100 });
    if (response.success) {
      setCompanies(response.data.companies || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = currentContact
      ? await apiClient.updateContact(currentContact.id, formData)
      : await apiClient.createContact(formData);

    if (response.success) {
      setShowModal(false);
      resetForm();
      loadContacts();
    } else {
      alert(response.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    const response = await apiClient.deleteContact(id);
    if (response.success) {
      loadContacts();
    } else {
      alert(response.error);
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      isPrimary: false,
      linkedInUrl: '',
      status: 'lead',
    });
    setCurrentContact(null);
  };

  const handleEdit = (contact: any) => {
    setCurrentContact(contact);
    setFormData({
      companyId: contact.company_id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email || '',
      phone: contact.phone || '',
      jobTitle: contact.job_title || '',
      department: contact.department || '',
      isPrimary: contact.is_primary || false,
      linkedInUrl: contact.linkedin_url || '',
      status: contact.status || 'lead',
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Contacts</h1>
          <p className="text-gray-400 mt-1">Manage your contact database</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
        >
          + Add Contact
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No contacts found. Create your first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {contact.first_name} {contact.last_name}
                          {contact.is_primary && (
                            <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">Primary</span>
                          )}
                        </div>
                        {contact.email && <div className="text-sm text-gray-400">{contact.email}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{contact.company_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{contact.job_title || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.status === 'customer' ? 'bg-green-500/20 text-green-400' :
                        contact.status === 'qualified' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(contact)} className="text-orange-500 hover:text-orange-400 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-400">
                        Delete
                      </button>
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
              <h2 className="text-2xl font-bold text-white mb-6">
                {currentContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedInUrl}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="lead">Lead</option>
                      <option value="qualified">Qualified</option>
                      <option value="customer">Customer</option>
                      <option value="partner">Partner</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                      className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Primary Contact</label>
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
                    {currentContact ? 'Update' : 'Create'} Contact
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
