import React, { useState, useEffect } from 'react';
import {
  FileSignature,
  Upload,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Copy,
  LayoutTemplate,
  History,
  Settings,
  Mail,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Briefcase,
  Shield,
  BarChart3,
  Calendar,
  PenTool,
  Type,
  CheckSquare,
  List,
  Paperclip,
  ArrowRight,
  Building,
  User,
  Loader2,
} from 'lucide-react';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'viewer' | 'approver' | 'cc';
  order: number;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';
  signedAt?: string;
}

interface SigningDocument {
  id: string;
  name: string;
  templateId?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired' | 'voided';
  signers: Signer[];
  signingOrder: 'sequential' | 'parallel';
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'contract' | 'nda' | 'proposal' | 'agreement' | 'invoice' | 'custom';
  usageCount: number;
  tags: string[];
}

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

const SignStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates' | 'analytics'>('documents');
  const [documents, setDocuments] = useState<SigningDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SigningDocument | null>(null);
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingDocuments: 0,
    completedDocuments: 0,
    completionRate: 0,
    avgCompletionTime: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulated data - would connect to eSignatureService
    setTimeout(() => {
      setDocuments([
        {
          id: 'doc_1',
          name: 'NDA - Acme Corporation',
          templateId: 'tpl_nda_standard',
          status: 'completed',
          signers: [
            { id: 's1', name: 'John Smith', email: 'john@acme.com', role: 'signer', order: 1, status: 'signed', signedAt: '2024-01-10T14:30:00Z' },
            { id: 's2', name: 'Jane Doe', email: 'jane@orengen.io', role: 'signer', order: 2, status: 'signed', signedAt: '2024-01-10T15:45:00Z' },
          ],
          signingOrder: 'sequential',
          createdAt: '2024-01-10T10:00:00Z',
          completedAt: '2024-01-10T15:45:00Z',
        },
        {
          id: 'doc_2',
          name: 'Freelance Contract - Project Alpha',
          templateId: 'tpl_contract_freelance',
          status: 'in_progress',
          signers: [
            { id: 's1', name: 'Sarah Wilson', email: 'sarah@client.com', role: 'signer', order: 1, status: 'viewed' },
            { id: 's2', name: 'Mike Johnson', email: 'mike@orengen.io', role: 'signer', order: 2, status: 'pending' },
          ],
          signingOrder: 'sequential',
          expiresAt: '2024-01-20T23:59:59Z',
          createdAt: '2024-01-12T09:00:00Z',
        },
        {
          id: 'doc_3',
          name: 'Partnership Agreement - TechStart',
          templateId: 'tpl_agreement_partnership',
          status: 'pending',
          signers: [
            { id: 's1', name: 'David Chen', email: 'david@techstart.io', role: 'signer', order: 1, status: 'sent' },
            { id: 's2', name: 'Emily Brown', email: 'emily@orengen.io', role: 'signer', order: 2, status: 'pending' },
          ],
          signingOrder: 'parallel',
          expiresAt: '2024-01-25T23:59:59Z',
          createdAt: '2024-01-14T11:00:00Z',
        },
        {
          id: 'doc_4',
          name: 'Sales Proposal - Enterprise Plan',
          templateId: 'tpl_proposal_sales',
          status: 'declined',
          signers: [
            { id: 's1', name: 'Robert Taylor', email: 'robert@bigcorp.com', role: 'signer', order: 1, status: 'declined' },
          ],
          signingOrder: 'parallel',
          createdAt: '2024-01-08T14:00:00Z',
        },
      ]);

      setTemplates([
        { id: 'tpl_nda_standard', name: 'Standard NDA', description: 'Non-disclosure agreement for partnerships', category: 'nda', usageCount: 45, tags: ['nda', 'confidentiality'] },
        { id: 'tpl_contract_freelance', name: 'Freelance Contract', description: 'Standard freelance work contract', category: 'contract', usageCount: 32, tags: ['contract', 'freelance'] },
        { id: 'tpl_proposal_sales', name: 'Sales Proposal', description: 'Sales proposal with acceptance signature', category: 'proposal', usageCount: 28, tags: ['proposal', 'sales'] },
        { id: 'tpl_agreement_partnership', name: 'Partnership Agreement', description: 'Business partnership formation', category: 'agreement', usageCount: 15, tags: ['partnership', 'business'] },
        { id: 'tpl_invoice_payment', name: 'Invoice Acknowledgment', description: 'Invoice with payment terms', category: 'invoice', usageCount: 22, tags: ['invoice', 'payment'] },
      ]);

      setStats({
        totalDocuments: 156,
        pendingDocuments: 12,
        completedDocuments: 132,
        completionRate: 84.6,
        avgCompletionTime: 18.5,
      });

      setIsLoading(false);
    }, 500);
  };

  const getStatusColor = (status: SigningDocument['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'declined': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-gray-600 bg-gray-50';
      case 'voided': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: SigningDocument['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'in_progress': return <RefreshCw size={14} className="animate-spin" />;
      case 'pending': return <Clock size={14} />;
      case 'declined': return <XCircle size={14} />;
      case 'expired': return <AlertCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getCategoryIcon = (category: DocumentTemplate['category']) => {
    switch (category) {
      case 'contract': return <Briefcase size={16} />;
      case 'nda': return <Shield size={16} />;
      case 'proposal': return <FileText size={16} />;
      case 'agreement': return <Users size={16} />;
      case 'invoice': return <FileSignature size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.signers.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="text-indigo-600" size={28} />
              OrenSign
            </h1>
            <p className="text-slate-600 mt-1">Secure e-signatures powered by OpenSign</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <LayoutTemplate size={18} />
              Templates
            </button>
            <button
              onClick={() => setShowNewDocument(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={18} />
              New Document
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Total Documents</span>
            <FileText size={18} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalDocuments}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Pending</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{stats.pendingDocuments}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Completed</span>
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">{stats.completedDocuments}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Completion Rate</span>
            <BarChart3 size={18} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-2">{stats.completionRate}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Avg. Time</span>
            <Calendar size={18} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.avgCompletionTime}h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-slate-200 p-1 w-fit">
        {['documents', 'templates', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents or signers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Document List */}
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading documents...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No documents found</p>
                <button
                  onClick={() => setShowNewDocument(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create your first document
                </button>
              </div>
            ) : (
              filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileSignature size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{doc.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-500">
                            {doc.signers.length} signer{doc.signers.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-sm text-slate-500">
                            Created {formatDate(doc.createdAt)}
                          </span>
                          {doc.expiresAt && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="text-sm text-amber-600">
                                Expires {formatDate(doc.expiresAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Signer Avatars */}
                      <div className="flex -space-x-2">
                        {doc.signers.slice(0, 3).map((signer, idx) => (
                          <div
                            key={signer.id}
                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium ${
                              signer.status === 'signed'
                                ? 'bg-green-100 text-green-700'
                                : signer.status === 'viewed'
                                ? 'bg-blue-100 text-blue-700'
                                : signer.status === 'declined'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                            title={`${signer.name} - ${signer.status}`}
                          >
                            {signer.name.charAt(0)}
                          </div>
                        ))}
                        {doc.signers.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                            +{doc.signers.length - 3}
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status.replace('_', ' ')}
                      </span>
                      <button className="p-2 hover:bg-slate-100 rounded-lg">
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-3 gap-4">
          {/* Create New Template */}
          <div
            onClick={() => {}}
            className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors min-h-[200px]"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-slate-900">Create Template</h3>
            <p className="text-sm text-slate-500 text-center mt-1">Upload a document and add signature fields</p>
          </div>

          {/* Template Cards */}
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  template.category === 'nda' ? 'bg-purple-100 text-purple-600' :
                  template.category === 'contract' ? 'bg-blue-100 text-blue-600' :
                  template.category === 'proposal' ? 'bg-amber-100 text-amber-600' :
                  template.category === 'agreement' ? 'bg-green-100 text-green-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {getCategoryIcon(template.category)}
                </div>
                <span className="text-xs text-slate-500">{template.usageCount} uses</span>
              </div>
              <h3 className="font-medium text-slate-900">{template.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{template.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {template.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Use Template
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Completion Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Signing Completion Trend</h3>
            <div className="h-64 flex items-end gap-2">
              {[65, 48, 72, 80, 55, 90, 85, 78, 92, 88, 75, 95].map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${value * 2}px` }}
                  />
                  <span className="text-xs text-slate-500">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents by Category */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Documents by Category</h3>
            <div className="space-y-4">
              {[
                { category: 'Contracts', count: 45, color: 'bg-blue-500' },
                { category: 'NDAs', count: 38, color: 'bg-purple-500' },
                { category: 'Proposals', count: 28, color: 'bg-amber-500' },
                { category: 'Agreements', count: 22, color: 'bg-green-500' },
                { category: 'Invoices', count: 15, color: 'bg-slate-500' },
              ].map(item => (
                <div key={item.category} className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 w-24">{item.category}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.count / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signer Response Time */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Average Response Time</h3>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-5xl font-bold text-indigo-600">18.5</p>
                <p className="text-slate-500 mt-2">hours average</p>
                <p className="text-green-600 text-sm mt-1">12% faster than last month</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Document signed', user: 'John Smith', doc: 'NDA - Acme Corp', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
                { action: 'Document viewed', user: 'Sarah Wilson', doc: 'Freelance Contract', time: '4 hours ago', icon: Eye, color: 'text-blue-500' },
                { action: 'Document sent', user: 'You', doc: 'Partnership Agreement', time: '6 hours ago', icon: Send, color: 'text-indigo-500' },
                { action: 'Document declined', user: 'Robert Taylor', doc: 'Sales Proposal', time: '1 day ago', icon: XCircle, color: 'text-red-500' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <activity.icon size={18} className={activity.color} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                    </p>
                    <p className="text-xs text-slate-500">{activity.doc}</p>
                  </div>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{selectedDocument.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Created {formatDate(selectedDocument.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(selectedDocument.status)}`}>
                  {getStatusIcon(selectedDocument.status)}
                  {selectedDocument.status.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Signers */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-900 mb-3">Signers</h3>
                <div className="space-y-3">
                  {selectedDocument.signers.map((signer, idx) => (
                    <div key={signer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-slate-200 rounded-full text-xs font-medium">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{signer.name}</p>
                          <p className="text-sm text-slate-500">{signer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          signer.status === 'signed' ? 'bg-green-100 text-green-700' :
                          signer.status === 'viewed' ? 'bg-blue-100 text-blue-700' :
                          signer.status === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {signer.status}
                        </span>
                        {signer.signedAt && (
                          <span className="text-xs text-slate-500">
                            {formatDate(signer.signedAt)} at {formatTime(signer.signedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Signing Order</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedDocument.signingOrder}</p>
                </div>
                {selectedDocument.expiresAt && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Expires</p>
                    <p className="font-medium text-slate-900">{formatDate(selectedDocument.expiresAt)}</p>
                  </div>
                )}
                {selectedDocument.completedAt && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Completed</p>
                    <p className="font-medium text-green-600">{formatDate(selectedDocument.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                  <Download size={16} />
                  Download
                </button>
                <button className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                  <History size={16} />
                  Audit Log
                </button>
              </div>
              <div className="flex items-center gap-2">
                {selectedDocument.status === 'pending' || selectedDocument.status === 'in_progress' ? (
                  <>
                    <button className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 flex items-center gap-2">
                      <XCircle size={16} />
                      Void
                    </button>
                    <button className="px-4 py-2 text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 flex items-center gap-2">
                      <Mail size={16} />
                      Send Reminder
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {showNewDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Create New Document</h2>
              <p className="text-sm text-slate-500 mt-1">Upload a document or use a template</p>
            </div>

            <div className="p-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 hover:border-indigo-400 cursor-pointer transition-colors">
                <Upload size={40} className="text-slate-400 mx-auto mb-4" />
                <p className="font-medium text-slate-900">Drop your document here</p>
                <p className="text-sm text-slate-500 mt-1">or click to browse</p>
                <p className="text-xs text-slate-400 mt-2">Supports PDF, DOCX, DOC</p>
              </div>

              {/* Or use template */}
              <div className="text-center mb-6">
                <span className="text-sm text-slate-500">or</span>
              </div>

              {/* Quick Templates */}
              <div className="grid grid-cols-3 gap-3">
                {templates.slice(0, 3).map(template => (
                  <button
                    key={template.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(template.category)}
                      <span className="font-medium text-slate-900 text-sm">{template.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewDocument(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignStudio;
