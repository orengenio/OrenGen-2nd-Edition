import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Copy, Plus, Shield, Key, Database, Globe, Search, Trash2 } from 'lucide-react';

interface Secret {
  id: string;
  name: string;
  value: string;
  category: 'API Key' | 'Database' | 'SSH' | 'Password';
  lastAccessed: string;
  visible: boolean;
}

const VaultStudio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [secrets, setSecrets] = useState<Secret[]>([
    { id: '1', name: 'OpenAI Production Key', value: 'sk-proj-49f9...k39a', category: 'API Key', lastAccessed: '2 mins ago', visible: false },
    { id: '2', name: 'AWS Access Key ID', value: 'AKIAIOSFODNN7EXAMPLE', category: 'API Key', lastAccessed: '1 hour ago', visible: false },
    { id: '3', name: 'Postgres Master Pass', value: 'Sup3rS3cr3tDB!', category: 'Database', lastAccessed: '2 days ago', visible: false },
    { id: '4', name: 'Jenkins Admin', value: 'admin_user_2024', category: 'Password', lastAccessed: '5 days ago', visible: false },
    { id: '5', name: 'Bastion Host SSH', value: 'ssh-rsa AAAAB3Nz...', category: 'SSH', lastAccessed: '1 week ago', visible: false },
  ]);

  const toggleVisibility = (id: string) => {
    setSecrets(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    alert('Copied to clipboard (Encrypted in memory)');
  };

  const filteredSecrets = secrets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="text-brand-accent" /> Vault Studio
          </h1>
          <p className="text-slate-500">Secure credential storage and secrets management.</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
            <Plus size={18} /> Add Secret
        </button>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400">
                  <Shield size={24} />
              </div>
              <div>
                  <div className="font-bold text-green-800 dark:text-green-300">Vault Sealed</div>
                  <div className="text-xs text-green-600 dark:text-green-400">AES-256 Encryption Active</div>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-slate-700 rounded-full text-blue-600 dark:text-blue-400">
                  <Key size={24} />
              </div>
              <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{secrets.length} Secrets</div>
                  <div className="text-xs text-slate-500">Managed Keys</div>
              </div>
          </div>
           <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-slate-700 rounded-full text-purple-600 dark:text-purple-400">
                  <Globe size={24} />
              </div>
              <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Rotation Policy</div>
                  <div className="text-xs text-slate-500">90 Days Default</div>
              </div>
          </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
             type="text" 
             placeholder="Search secrets by name or category..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-primary"
          />
      </div>

      {/* Secrets Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1">
          <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Last Accessed</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredSecrets.map(secret => (
                      <tr key={secret.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                             {secret.category === 'Database' ? <Database size={16} className="text-slate-400" /> : <Key size={16} className="text-slate-400" />}
                             {secret.name}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                  <span>{secret.visible ? secret.value : '••••••••••••••••••••'}</span>
                                  <button onClick={() => toggleVisibility(secret.id)} className="text-slate-400 hover:text-brand-accent">
                                      {secret.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                  secret.category === 'API Key' ? 'bg-blue-100 text-blue-700' :
                                  secret.category === 'Database' ? 'bg-orange-100 text-orange-700' :
                                  secret.category === 'SSH' ? 'bg-slate-200 text-slate-700' :
                                  'bg-purple-100 text-purple-700'
                              }`}>
                                  {secret.category}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{secret.lastAccessed}</td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => copyToClipboard(secret.value)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-green-500" title="Copy">
                                      <Copy size={16} />
                                  </button>
                                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500" title="Delete">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {filteredSecrets.length === 0 && (
              <div className="p-12 text-center text-slate-400">No secrets found matching your search.</div>
          )}
      </div>

      {/* Mock Add Modal */}
      {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold mb-4">Store New Secret</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" placeholder="e.g. Stripe Secret Key" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Value</label>
                          <input type="password" class="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" placeholder="sk_live_..." />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700">
                              <option>API Key</option>
                              <option>Database</option>
                              <option>SSH</option>
                              <option>Password</option>
                          </select>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-brand-primary text-white rounded">Save Securely</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default VaultStudio;