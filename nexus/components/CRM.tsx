import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import {
  Search, Plus, Mail, ArrowUpDown,
  Building2, Users, RefreshCw, Trash2, Edit2, X, Briefcase
} from 'lucide-react';
import { nexusApi, Contact, Company } from '../services/nexusApiService';

type ViewMode = 'contacts' | 'companies';

const CRM: React.FC = () => {
  // Data state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('contacts');
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form state
  const [formData, setFormData] = useState<any>({});

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        nexusApi.getContacts({ limit: 100 }),
        nexusApi.getCompanies({ limit: 100 }),
      ]);

      if (contactsRes.success && contactsRes.data) {
        setContacts(contactsRes.data.contacts || []);
      }
      if (companiesRes.success && companiesRes.data) {
        setCompanies(companiesRes.data.companies || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Contact CRUD
  const handleAddContact = async () => {
    const res = await nexusApi.createContact({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      job_title: formData.job_title,
      company_id: formData.company_id,
      status: formData.status || 'lead',
    });
    if (res.success) {
      setShowAddModal(false);
      setFormData({});
      fetchData();
    } else {
      alert(res.error || 'Failed to create contact');
    }
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;
    const res = await nexusApi.updateContact(editingContact.id, formData);
    if (res.success) {
      setEditingContact(null);
      setFormData({});
      fetchData();
    } else {
      alert(res.error || 'Failed to update contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    const res = await nexusApi.deleteContact(id);
    if (res.success) {
      fetchData();
    }
  };

  // Company CRUD
  const handleAddCompany = async () => {
    const res = await nexusApi.createCompany({
      name: formData.name,
      industry: formData.industry,
      website: formData.website,
      size: formData.size,
      status: formData.status || 'prospect',
    });
    if (res.success) {
      setShowAddModal(false);
      setFormData({});
      fetchData();
    } else {
      alert(res.error || 'Failed to create company');
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany) return;
    const res = await nexusApi.updateCompany(editingCompany.id, formData);
    if (res.success) {
      setEditingCompany(null);
      setFormData({});
      fetchData();
    } else {
      alert(res.error || 'Failed to update company');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Delete this company?')) return;
    const res = await nexusApi.deleteCompany(id);
    if (res.success) {
      fetchData();
    }
  };

  // Contact columns
  const contactColumnHelper = createColumnHelper<Contact>();
  const contactColumns = useMemo(() => [
    contactColumnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
      id: 'name',
      header: 'Contact Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
            {info.row.original.first_name?.[0]}{info.row.original.last_name?.[0]}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</div>
            <div className="text-xs text-slate-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    contactColumnHelper.accessor('company_name', {
      header: 'Company',
      cell: info => (
        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{info.getValue() || '-'}</div>
          <div className="text-xs text-slate-500">{info.row.original.job_title || ''}</div>
        </div>
      )
    }),
    contactColumnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          prospect: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
          customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
          churned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] || ''}`}>
            {status}
          </span>
        );
      }
    }),
    contactColumnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => <span className="text-slate-500 text-sm">{info.getValue() || '-'}</span>
    }),
    contactColumnHelper.accessor('created_at', {
      header: 'Added',
      cell: info => (
        <span className="text-slate-500 text-sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      )
    }),
    contactColumnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditingContact(row.original);
              setFormData(row.original);
            }}
            className="p-1.5 text-slate-400 hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteContact(row.original.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    })
  ], []);

  // Company columns
  const companyColumnHelper = createColumnHelper<Company>();
  const companyColumns = useMemo(() => [
    companyColumnHelper.accessor('name', {
      header: 'Company',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
            <Building2 size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</div>
            {info.row.original.website && (
              <a href={info.row.original.website} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline">
                {info.row.original.website.replace(/https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      ),
    }),
    companyColumnHelper.accessor('industry', {
      header: 'Industry',
      cell: info => <span className="text-slate-600 dark:text-slate-400">{info.getValue() || '-'}</span>
    }),
    companyColumnHelper.accessor('size', {
      header: 'Size',
      cell: info => <span className="text-slate-600 dark:text-slate-400">{info.getValue() || '-'}</span>
    }),
    companyColumnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          prospect: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
          inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] || ''}`}>
            {status}
          </span>
        );
      }
    }),
    companyColumnHelper.accessor('created_at', {
      header: 'Added',
      cell: info => (
        <span className="text-slate-500 text-sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      )
    }),
    companyColumnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditingCompany(row.original);
              setFormData(row.original);
            }}
            className="p-1.5 text-slate-400 hover:text-brand-accent hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteCompany(row.original.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    })
  ], []);

  // Tables
  const contactTable = useReactTable({
    data: contacts,
    columns: contactColumns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const companyTable = useReactTable({
    data: companies,
    columns: companyColumns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const activeTable = viewMode === 'contacts' ? contactTable : companyTable;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nexus CRM</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time customer & company management (Super Admin)</p>
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
            onClick={() => {
              setShowAddModal(true);
              setFormData({});
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add {viewMode === 'contacts' ? 'Contact' : 'Company'}</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <div className="text-sm text-slate-500">Contacts</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{companies.length}</div>
              <div className="text-sm text-slate-500">Companies</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'customer').length}</div>
              <div className="text-sm text-slate-500">Customers</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'lead').length}</div>
              <div className="text-sm text-slate-500">Leads</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
          <button
            onClick={() => setViewMode('contacts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'contacts'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users size={16} className="inline mr-2" />
            Contacts
          </button>
          <button
            onClick={() => setViewMode('companies')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'companies'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 size={16} className="inline mr-2" />
            Companies
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={`Search ${viewMode}...`}
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-accent transition-colors"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">Make sure the backend is running at http://localhost:3000</p>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-brand-accent" size={32} />
        </div>
      )}

      {/* Table View */}
      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {activeTable.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 font-medium">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {activeTable.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={100} className="px-6 py-12 text-center text-slate-400">
                      No {viewMode} found. Add your first {viewMode === 'contacts' ? 'contact' : 'company'} to get started.
                    </td>
                  </tr>
                ) : (
                  activeTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500">
              Showing {activeTable.getRowModel().rows.length} of {viewMode === 'contacts' ? contacts.length : companies.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => activeTable.previousPage()}
                disabled={!activeTable.getCanPreviousPage()}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => activeTable.nextPage()}
                disabled={!activeTable.getCanNextPage()}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add {viewMode === 'contacts' ? 'Contact' : 'Company'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            {viewMode === 'contacts' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name || ''}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name || ''}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.job_title || ''}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status || 'lead'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <select
                    value={formData.size || ''}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status || 'prospect'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={viewMode === 'contacts' ? handleAddContact : handleAddCompany}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
              >
                Add {viewMode === 'contacts' ? 'Contact' : 'Company'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Contact</h2>
              <button onClick={() => setEditingContact(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status || 'lead'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingContact(null)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContact}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Company</h2>
              <button onClick={() => setEditingCompany(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status || 'prospect'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCompany(null)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCompany}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
