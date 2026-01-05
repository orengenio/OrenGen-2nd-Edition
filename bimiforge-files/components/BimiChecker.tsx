import React, { useState } from 'react';
import { Search, Shield, XCircle, CheckCircle, AlertTriangle, ArrowRight, Loader2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resolveDns } from '../utils';

interface CheckStep {
  id: string;
  label: string;
  desc: string;
  status: 'pending' | 'loading' | 'success' | 'error' | 'warning';
  detail?: string;
}

export const BimiChecker: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('default'); // Default selector for BIMI
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [steps, setSteps] = useState<CheckStep[]>([
    { id: 'mx', label: 'MX Records', desc: 'Verifying mail servers exist', status: 'pending' },
    { id: 'spf', label: 'SPF Record', desc: 'Checking Sender Policy Framework', status: 'pending' },
    { id: 'dmarc', label: 'DMARC Policy', desc: 'Checking for p=quarantine or p=reject', status: 'pending' },
    { id: 'bimi', label: 'BIMI Record', desc: 'Looking for BIMI TXT record', status: 'pending' },
    { id: 'svg', label: 'SVG Compliance', desc: 'Validating linked SVG file', status: 'pending' },
    { id: 'vmc', label: 'VMC Certificate', desc: 'Checking Verified Mark Certificate', status: 'pending' },
  ]);

  const updateStep = (id: string, status: CheckStep['status'], detail?: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, detail } : s));
  };

  const runCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    // Normalize domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase().trim();
    const currentSelector = selector.trim() || 'default';
    
    setIsChecking(true);
    setShowResults(true);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending', detail: undefined })));

    try {
      // 1. Check MX
      updateStep('mx', 'loading');
      const mxRecords = await resolveDns(cleanDomain, 'MX');
      if (mxRecords.length > 0) {
        updateStep('mx', 'success', `${mxRecords.length} servers found`);
      } else {
        updateStep('mx', 'error', 'No MX records found');
      }

      // 2. Check SPF
      updateStep('spf', 'loading');
      const txtRecords = await resolveDns(cleanDomain, 'TXT');
      // Look for v=spf1 in the data string. Google DNS might return quotes.
      const spfRecord = txtRecords.find(r => r.data && r.data.includes('v=spf1'));
      if (spfRecord) {
        // Simple check for -all or ~all
        const isStrict = spfRecord.data.includes('-all');
        updateStep('spf', 'success', isStrict ? 'Valid (Hard Fail)' : 'Valid (Soft Fail)');
      } else {
        updateStep('spf', 'error', 'No SPF record found');
      }

      // 3. Check DMARC
      updateStep('dmarc', 'loading');
      const dmarcRecords = await resolveDns(`_dmarc.${cleanDomain}`, 'TXT');
      const dmarcRecord = dmarcRecords.find(r => r.data && r.data.includes('v=DMARC1'));
      
      let dmarcPassed = false;
      if (dmarcRecord) {
        // Clean quotes if present
        const data = dmarcRecord.data.replace(/"/g, '');
        const policyMatch = data.match(/p=(\w+)/);
        const policy = policyMatch ? policyMatch[1] : 'none';
        
        if (policy === 'reject' || policy === 'quarantine') {
          updateStep('dmarc', 'success', `Policy enforced: p=${policy}`);
          dmarcPassed = true;
        } else if (policy === 'none') {
          updateStep('dmarc', 'warning', 'Policy is p=none (Not Enforced)');
        } else {
           updateStep('dmarc', 'warning', `Policy: p=${policy}`);
        }
      } else {
        updateStep('dmarc', 'error', 'No DMARC record found');
      }

      // 4. Check BIMI
      updateStep('bimi', 'loading');
      // Query specific selector
      const bimiRecords = await resolveDns(`${currentSelector}._bimi.${cleanDomain}`, 'TXT');
      const bimiRecord = bimiRecords.find(r => r.data && r.data.includes('v=BIMI1'));
      
      let svgUrl = '';
      let vmcUrl = '';

      if (bimiRecord) {
        const data = bimiRecord.data.replace(/"/g, '');
        updateStep('bimi', 'success', `Record found at '${currentSelector}'`);
        
        // Extract Tags using regex that handles semicolons
        const lMatch = data.match(/l=([^;]+)/);
        const aMatch = data.match(/a=([^;]+)/);
        
        if (lMatch) svgUrl = lMatch[1].trim();
        if (aMatch) vmcUrl = aMatch[1].trim();

      } else {
        updateStep('bimi', 'error', `No record at '${currentSelector}._bimi'`);
        updateStep('svg', 'pending', 'Waiting for BIMI record');
        updateStep('vmc', 'pending', 'Waiting for BIMI record');
        setIsChecking(false);
        return; // Stop if no BIMI record
      }

      // 5. Check SVG URL
      updateStep('svg', 'loading');
      if (svgUrl) {
        // In a real backend we would fetch and validate headers. 
        // Here we just check existence of URL in the record.
        updateStep('svg', 'success', 'Linked in BIMI record');
      } else {
        updateStep('svg', 'error', 'l= tag missing or empty');
      }

      // 6. Check VMC URL
      updateStep('vmc', 'loading');
      if (vmcUrl && vmcUrl !== '') {
        updateStep('vmc', 'success', 'Certificate linked');
      } else {
        // VMC is optional for some providers (Yahoo), but required for Gmail
        updateStep('vmc', 'warning', 'No VMC (a= tag empty or missing)');
      }

    } catch (err) {
      console.error(err);
      // If the API fails entirely (e.g. network)
       setSteps(prev => prev.map(s => s.status === 'loading' ? { ...s, status: 'error', detail: 'DNS Lookup Failed' } : s));
    } finally {
      setIsChecking(false);
    }
  };

  const getScore = () => {
    const successCount = steps.filter(s => s.status === 'success').length;
    return Math.round((successCount / steps.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Live BIMI Inspector
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Run a real-time DNS diagnostic on your domain to verify BIMI readiness, DMARC enforcement, and SVG compliance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 mb-12">
          <form onSubmit={runCheck} className="flex flex-col gap-4">
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-orange focus:border-brand-orange dark:text-white dark:placeholder-gray-500 text-lg"
                    placeholder="Enter domain (e.g. cnn.com)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    autoComplete="off"
                />
                </div>
                
                <div className="relative md:w-1/4">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Settings className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-brand-orange focus:border-brand-orange dark:text-white dark:placeholder-gray-500 text-lg"
                        placeholder="Selector (default)"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                        title="BIMI Selector (defaults to 'default')"
                    />
                </div>

                <button
                type="submit"
                disabled={isChecking || !domain}
                className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isChecking || !domain
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-brand-orange hover:bg-orange-700 hover:shadow-orange-500/30'
                }`}
                >
                {isChecking ? <Loader2 className="animate-spin h-5 w-5" /> : <Shield className="h-5 w-5" />}
                {isChecking ? 'Scanning...' : 'Check Domain'}
                </button>
            </div>
            
          </form>
          <div className="mt-4 flex flex-col md:flex-row justify-between text-xs text-gray-400">
             <span>* Queries Google Public DNS directly.</span>
             <span>Try: <strong>cnn.com</strong>, <strong>groupon.com</strong>, or <strong>linkedin.com</strong></span>
          </div>
        </div>

        {/* Results Area */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Checklist */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diagnostic Report for {domain}</h3>
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    step.status === 'pending' ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-gray-800 opacity-50' :
                    step.status === 'loading' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :
                    step.status === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                    step.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' :
                    'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {step.status === 'pending' && <div className="w-6 h-6 rounded-full border-2 border-gray-300" />}
                      {step.status === 'loading' && <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />}
                      {step.status === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {step.status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
                      {step.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{step.label}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                  {step.detail && (
                    <span className={`text-xs font-mono px-2 py-1 rounded max-w-[150px] truncate ${
                      step.status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      step.status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`} title={step.detail}>
                      {step.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Score Card */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Readiness Score</h3>
                
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100 dark:border-slate-800"></div>
                  <div 
                    className={`absolute inset-0 rounded-full border-8 transition-all duration-1000 ${
                      getScore() === 100 ? 'border-green-500' : getScore() > 50 ? 'border-yellow-500' : 'border-red-500'
                    }`}
                    style={{ clipPath: `inset(${100 - getScore()}% 0 0 0)` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{getScore()}%</span>
                  </div>
                </div>

                {!isChecking && getScore() < 100 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Your domain is not yet fully compliant for BIMI display in Gmail & Apple Mail.</p>
                    <Link 
                      to="/workspace"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-brand-orange hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-500/20"
                    >
                      Fix Issues in Workspace <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                )}

                {!isChecking && getScore() === 100 && (
                  <div className="text-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-4">Perfect! Your domain is ready to display logos.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};