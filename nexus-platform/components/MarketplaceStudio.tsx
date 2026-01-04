import React, { useState } from 'react';
import { 
  Search, ShoppingBag, CheckCircle, Plus, Settings, 
  MessageCircle, Phone, FileSpreadsheet, Mic, Globe, 
  ArrowRight, ShieldCheck, Zap, CreditCard
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Productivity' | 'AI & Voice' | 'Infrastructure';
  icon: React.ReactNode;
  installed: boolean;
  color: string;
}

const MarketplaceStudio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'gsheets', name: 'Google Sheets', description: 'Bi-directional sync for CRM and financial data.', category: 'Productivity', icon: <FileSpreadsheet size={24} />, installed: true, color: '#10B981' },
    { id: 'elevenlabs', name: 'ElevenLabs', description: 'Ultra-realistic AI voice synthesis for your agents.', category: 'AI & Voice', icon: <Mic size={24} />, installed: true, color: '#3B82F6' },
    { id: 'twilio', name: 'Twilio', description: 'SMS and Programmable Voice API for campaigns.', category: 'Communication', icon: <Phone size={24} />, installed: false, color: '#F97316' },
    { id: 'whatsapp', name: 'WhatsApp Business', description: 'Direct messaging integration for customer support.', category: 'Communication', icon: <MessageCircle size={24} />, installed: false, color: '#25D366' },
    { id: 'telegram', name: 'Telegram', description: 'Bot API integration for alerts and community.', category: 'Communication', icon: <Zap size={24} />, installed: false, color: '#0088cc' },
    { id: 'stripe', name: 'Stripe', description: 'Payment processing and subscription management.', category: 'Infrastructure', icon: <ShieldCheck size={24} />, installed: false, color: '#635BFF' },
    { id: 'paypal', name: 'PayPal', description: 'Accept payments globally via PayPal checkout.', category: 'Infrastructure', icon: <CreditCard size={24} />, installed: false, color: '#003087' },
  ]);

  const toggleInstall = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, installed: !item.installed } : item
    ));
  };

  const filtered = integrations.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-brand-accent" /> Integrations Hub
          </h1>
          <p className="text-slate-500">Connect your tools. Power up your operating system.</p>
        </div>
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="Search integrations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
            />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Communication', 'Productivity', 'AI & Voice', 'Infrastructure'].map(cat => (
              <button 
                key={cat}
                className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                  {cat}
              </button>
          ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filtered.map(app => (
              <div key={app.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: app.color }}>
                          {app.icon}
                      </div>
                      {app.installed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase rounded flex items-center gap-1">
                              <CheckCircle size={12} /> Installed
                          </span>
                      ) : (
                          <button 
                            onClick={() => toggleInstall(app.id)}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded transition-colors flex items-center gap-1"
                          >
                              <Plus size={12} /> Get
                          </button>
                      )}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{app.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">{app.description}</p>
                  
                  {app.installed ? (
                      <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                          <Settings size={16} /> Configure
                      </button>
                  ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                          <Globe size={12} /> API Access Required
                      </div>
                  )}
              </div>
          ))}

          {/* Request Card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-slate-400 min-h-[240px]">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Plus size={24} />
              </div>
              <h3 className="font-bold">Request Integration</h3>
              <p className="text-xs mt-1 text-center max-w-[200px]">Don't see what you need? Ask the developers.</p>
          </div>
      </div>
    </div>
  );
};

export default MarketplaceStudio;