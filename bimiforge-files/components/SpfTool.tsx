import React, { useState } from 'react';
import { Shield, Copy, Check, Search, AlertCircle } from 'lucide-react';
import { resolveDns, copyToClipboard } from '../utils';

export const SpfTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'check'>('generate');
  
  // Generator State
  const [allowMx, setAllowMx] = useState(true);
  const [allowA, setAllowA] = useState(true);
  const [includes, setIncludes] = useState('');
  const [ipv4, setIpv4] = useState('');
  const [policy, setPolicy] = useState<'~all' | '-all' | '?all'>('~all');
  const [copied, setCopied] = useState(false);

  // Checker State
  const [domain, setDomain] = useState('');
  const [checkResult, setCheckResult] = useState<{status: string; record: string; msg: string} | null>(null);
  const [checking, setChecking] = useState(false);

  const generateRecord = () => {
    let parts = ['v=spf1'];
    if (allowA) parts.push('a');
    if (allowMx) parts.push('mx');
    if (ipv4) ipv4.split(',').forEach(ip => parts.push(`ip4:${ip.trim()}`));
    if (includes) includes.split(',').forEach(inc => parts.push(`include:${inc.trim()}`));
    parts.push(policy);
    return parts.join(' ');
  };

  const handleCopy = () => {
    copyToClipboard(generateRecord());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkSpf = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!domain) return;
    setChecking(true);
    setCheckResult(null);
    
    try {
        const records = await resolveDns(domain, 'TXT');
        const spf = records.find(r => r.data.includes('v=spf1'));
        
        if (spf) {
            setCheckResult({
                status: 'success',
                record: spf.data.replace(/"/g, ''),
                msg: 'Valid SPF record found.'
            });
        } else {
            setCheckResult({
                status: 'error',
                record: '',
                msg: 'No SPF record found.'
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SPF Tool</h1>
        <p className="text-gray-500 mb-8">Generate or Validate Sender Policy Framework records.</p>
        
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
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Authorized Senders</h3>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 text-sm">
                                <input type="checkbox" checked={allowMx} onChange={e => setAllowMx(e.target.checked)} className="rounded text-brand-orange focus:ring-brand-orange" />
                                <span className="text-gray-700 dark:text-gray-300">Allow Domain MX Servers</span>
                            </label>
                            <label className="flex items-center space-x-3 text-sm">
                                <input type="checkbox" checked={allowA} onChange={e => setAllowA(e.target.checked)} className="rounded text-brand-orange focus:ring-brand-orange" />
                                <span className="text-gray-700 dark:text-gray-300">Allow Domain A Record</span>
                            </label>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authorized IP Addresses (IPv4)</label>
                         <input 
                            type="text" 
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                            placeholder="e.g. 192.168.1.1, 10.0.0.1"
                            value={ipv4}
                            onChange={(e) => setIpv4(e.target.value)}
                         />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Include Domains (Third-Party Senders)</label>
                         <input 
                            type="text" 
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                            placeholder="e.g. _spf.google.com, sendgrid.net"
                            value={includes}
                            onChange={(e) => setIncludes(e.target.value)}
                         />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policy (Fail Mode)</label>
                        <select 
                            value={policy}
                            onChange={(e) => setPolicy(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                        >
                            <option value="~all">Soft Fail (~all) - Recommended for Transition</option>
                            <option value="-all">Hard Fail (-all) - Strict Security</option>
                            <option value="?all">Neutral (?all) - No Policy</option>
                        </select>
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
                        Add this as a TXT record to your root domain (@).
                    </p>
                </div>
            </div>
        ) : (
            <div className="max-w-xl mx-auto">
                <form onSubmit={checkSpf} className="flex gap-2 mb-8">
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