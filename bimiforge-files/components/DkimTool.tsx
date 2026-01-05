import React, { useState } from 'react';
import { Shield, Copy, Check, Search, AlertCircle, Key, RefreshCcw, Loader2 } from 'lucide-react';
import { resolveDns, copyToClipboard } from '../utils';

export const DkimTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'check'>('generate');
  
  // Generator
  const [selector, setSelector] = useState('default');
  const [keys, setKeys] = useState<{privateKey: string, publicKey: string, record: string} | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(false);

  // Checker
  const [domain, setDomain] = useState('');
  const [checkSelector, setCheckSelector] = useState('default');
  const [checkResult, setCheckResult] = useState<{status: string; record: string; msg: string} | null>(null);
  const [checking, setChecking] = useState(false);

  // Generate 2048-bit RSA Keypair using Web Crypto API
  const generateKeys = async () => {
    setGenerating(true);
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["sign", "verify"]
        );

        // Export Public Key
        const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicBody = window.btoa(String.fromCharCode(...new Uint8Array(exportedPublic)));
        const formattedPublic = `-----BEGIN PUBLIC KEY-----\n${publicBody.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;

        // Export Private Key
        const exportedPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const privateBody = window.btoa(String.fromCharCode(...new Uint8Array(exportedPrivate)));
        const formattedPrivate = `-----BEGIN PRIVATE KEY-----\n${privateBody.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

        // Construct DNS Record (remove headers for DNS value typically)
        // Usually DKIM records are v=DKIM1; k=rsa; p=MII...
        const dnsP = publicBody; 
        const record = `v=DKIM1; k=rsa; p=${dnsP}`;

        setKeys({
            privateKey: formattedPrivate,
            publicKey: formattedPublic,
            record: record
        });

    } catch (e) {
        console.error("Key generation failed", e);
    }
    setGenerating(false);
  };

  const checkDkim = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!domain || !checkSelector) return;
    setChecking(true);
    setCheckResult(null);
    
    try {
        const queryName = `${checkSelector}._domainkey.${domain}`;
        const records = await resolveDns(queryName, 'TXT');
        const dkim = records.find(r => r.data.includes('v=DKIM1') || r.data.includes('p=')); // Some records omit v=DKIM1
        
        if (dkim) {
            setCheckResult({
                status: 'success',
                record: dkim.data.replace(/"/g, ''),
                msg: `Valid DKIM record found at ${queryName}`
            });
        } else {
            setCheckResult({
                status: 'error',
                record: '',
                msg: `No DKIM record found at ${queryName}`
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DKIM Tool</h1>
        <p className="text-gray-500 mb-8">Generate RSA-2048 key pairs or inspect existing DKIM records.</p>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('generate')}
                className={`pb-2 px-1 ${activeTab === 'generate' ? 'border-b-2 border-brand-orange text-brand-orange font-bold' : 'text-gray-500'}`}
            >
                Key Generator
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
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selector Name</label>
                         <input 
                            type="text" 
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white text-sm"
                            placeholder="e.g. google, default, mail"
                            value={selector}
                            onChange={(e) => setSelector(e.target.value)}
                         />
                         <p className="text-xs text-gray-500 mt-1">Arbitrary name to identify the key (e.g., 'default').</p>
                    </div>

                    <button 
                        onClick={generateKeys}
                        disabled={generating}
                        className="w-full py-3 bg-brand-blue hover:bg-blue-800 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        {generating ? <Loader2 className="animate-spin h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
                        {generating ? 'Generating 2048-bit RSA Keys...' : 'Generate New Key Pair'}
                    </button>

                    {keys && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Private Key (For Your Server)</label>
                                <div className="relative">
                                    <textarea 
                                        readOnly 
                                        value={keys.privateKey} 
                                        className="w-full h-32 p-3 text-[10px] font-mono bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800"
                                    />
                                    <button 
                                        onClick={() => { copyToClipboard(keys.privateKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}
                                        className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 rounded shadow hover:bg-gray-100"
                                    >
                                        {copiedKey ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-mono text-sm">Public DNS Record</h3>
                        <span className="text-xs text-gray-400">TXT Record</span>
                    </div>
                    
                    {keys ? (
                        <>
                            <div className="bg-black p-4 rounded-lg border border-gray-800 mb-4 overflow-hidden">
                                <code className="text-green-400 font-mono text-[10px] break-all block max-h-48 overflow-y-auto">
                                    {keys.record}
                                </code>
                            </div>
                            <button 
                                onClick={() => { copyToClipboard(keys.record); setCopiedRecord(true); setTimeout(() => setCopiedRecord(false), 2000); }}
                                className="w-full py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {copiedRecord ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copiedRecord ? 'Copied' : 'Copy Record'}
                            </button>
                            <p className="mt-4 text-xs text-gray-400">
                                Add this as a TXT record to: <strong>{selector}._domainkey.yourdomain.com</strong>
                            </p>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <Key className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Generate keys to see the DNS record.</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="max-w-xl mx-auto">
                <form onSubmit={checkDkim} className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        placeholder="Selector (e.g. default)"
                        className="w-1/3 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white"
                        value={checkSelector}
                        onChange={e => setCheckSelector(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Domain (e.g. google.com)"
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
                                    <div className="mt-2 bg-white/50 dark:bg-black/20 p-2 rounded text-sm font-mono break-all max-h-32 overflow-y-auto">
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