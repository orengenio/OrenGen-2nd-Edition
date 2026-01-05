import React, { useState } from 'react';
import { Shield, Copy, Check, Search, AlertCircle } from 'lucide-react';
import { resolveDns, copyToClipboard } from '../utils';

export const DmarcTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'check'>('generate');
  
  // Generator
  const [policy, setPolicy] = useState<'none' | 'quarantine' | 'reject'>('none');
  const [rua, setRua] = useState('');
  const [subPolicy, setSubPolicy] = useState<'none' | 'quarantine' | 'reject' | ''>('');
  const [pct, setPct] = useState(100);
  const [copied, setCopied] = useState(false);

  // Checker
  const [domain, setDomain] = useState('');
  const [checkResult, setCheckResult] = useState<{status: string; record: string; msg: string} | null>(null);
  const [checking, setChecking] = useState(false);

  const generateRecord = () => {
    let parts = ['v=DMARC1', `p=${policy}`];
    if (rua) parts.push(`rua=mailto:${rua}`);
    if (subPolicy) parts.push(`sp=${subPolicy}`);
    if (pct < 100) parts.push(`pct=${pct}`);
    return parts.join('; ');
  };

  const handleCopy = () => {
    copyToClipboard(generateRecord());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkDmarc = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!domain) return;
    setChecking(true);
    setCheckResult(null);
    
    try {
        const records = await resolveDns(`_dmarc.${domain}`, 'TXT');
        const dmarc = records.find(r => r.data.includes('v=DMARC1'));
        
        if (dmarc) {
            setCheckResult({
                status: 'success',
                record: dmarc.data.replace(/"/g, ''),
                msg: 'Valid DMARC record found.'
            });
        } else {
            setCheckResult({
                status: 'error',
                record: '',
                msg: 'No DMARC record found at _dmarc selector.'
            });
        }
    } catch (e) {
        setCheckResult({ status: 'error', record: '', msg: 'Lookup failed.' });
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DMARC Tool</h1>
        <p className="text-gray-500 mb-8">Protect your domain from spoofing with DMARC policies.</p>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('generate')}
                className={`pb-2 px-1 ${activeTab === 'generate' ? 'border-b-2 border-brand-orange text-brand-orange font-bold' : 'text-gray-500'}`}
            >
                Generator
            </button>
            <button 
                onClick={() => setActiveTab('check')}
                className={`pb-2 px-1 ${activeTab === 'check' ? 'border-b-2 border-brand-orange text-brand-orange font-bold' : 'text-gray-500'}`}
            >
                Inspector
            </button>
        </div>

        {activeTab === 'generate' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policy (p)</label>
                        <select 
                            value={policy}
                            onChange={(e) => setPolicy(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                        >
                            <option value="none">None (Monitoring Mode)</option>
                            <option value="quarantine">Quarantine (Send to Spam)</option>
                            <option value="reject">Reject (Block Email)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Start with 'None' to monitor traffic before enforcing 'Reject'.</p>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aggregate Reports Email (rua)</label>
                         <input 
                            type="email" 
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                            placeholder="e.g. dmarc-reports@yourdomain.com"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                         />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subdomain Policy (sp) - Optional</label>
                        <select 
                            value={subPolicy}
                            onChange={(e) => setSubPolicy(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                        >
                            <option value="">Same as Domain</option>
                            <option value="none">None</option>
                            <option value="quarantine">Quarantine</option>
                            <option value="reject">Reject</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Percentage (pct) - {pct}%</label>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={pct}
                            onChange={(e) => setPct(parseInt(e.target.value))}
                            className="w-full accent-brand-orange"
                        />
                        <p className="text-xs text-gray-500 mt-1">Percentage of messages to subject to filtering.</p>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-mono text-sm">Output DNS Record</h3>
                        <span className="text-xs text-gray-400">TXT Record</span>
                    </div>
                    <div className="bg-black p-4 rounded-lg border border-gray-800 mb-4">
                        <code className="text-green-400 font-mono text-sm break-all">{generateRecord()}</code>
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="w-full py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy Record'}
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        Add this as a TXT record to <strong>_dmarc.yourdomain.com</strong>
                    </p>
                </div>
            </div>
        ) : (
            <div className="max-w-xl mx-auto">
                <form onSubmit={checkDmarc} className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        placeholder="Enter domain (e.g. google.com)"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                    />
                    <button 
                        type="submit"
                        disabled={checking}
                        className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 disabled:opacity-50"
                    >
                        {checking ? '...' : <Search className="h-5 w-5" />}
                    </button>
                </form>

                {checkResult && (
                    <div className={`p-6 rounded-xl border ${checkResult.status === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                        <div className="flex items-start gap-3">
                            {checkResult.status === 'success' ? <Shield className="h-6 w-6 text-green-600" /> : <AlertCircle className="h-6 w-6 text-red-600" />}
                            <div>
                                <h4 className={`font-bold ${checkResult.status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                    {checkResult.msg}
                                </h4>
                                {checkResult.record && (
                                    <div className="mt-2 bg-white/50 dark:bg-black/20 p-2 rounded text-sm font-mono break-all">
                                        {checkResult.record}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};