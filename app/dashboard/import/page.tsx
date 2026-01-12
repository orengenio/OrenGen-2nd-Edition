'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  Download,
  RefreshCw,
  ArrowLeft,
  Table,
  Users,
  Building2,
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  preview: string[];
}

interface ImportRecord {
  data: Record<string, any>;
  status: 'pending' | 'success' | 'error' | 'duplicate';
  error?: string;
}

interface ImportStats {
  total: number;
  success: number;
  errors: number;
  duplicates: number;
}

type ImportType = 'contacts' | 'companies' | 'leads';

const FIELD_MAPPINGS: Record<ImportType, { field: string; label: string; required: boolean }[]> = {
  contacts: [
    { field: 'first_name', label: 'First Name', required: true },
    { field: 'last_name', label: 'Last Name', required: true },
    { field: 'email', label: 'Email', required: true },
    { field: 'phone', label: 'Phone', required: false },
    { field: 'job_title', label: 'Job Title', required: false },
    { field: 'company_name', label: 'Company', required: false },
    { field: 'status', label: 'Status', required: false },
    { field: 'notes', label: 'Notes', required: false },
  ],
  companies: [
    { field: 'name', label: 'Company Name', required: true },
    { field: 'industry', label: 'Industry', required: false },
    { field: 'website', label: 'Website', required: false },
    { field: 'phone', label: 'Phone', required: false },
    { field: 'address', label: 'Address', required: false },
    { field: 'city', label: 'City', required: false },
    { field: 'state', label: 'State', required: false },
    { field: 'country', label: 'Country', required: false },
    { field: 'size', label: 'Company Size', required: false },
    { field: 'status', label: 'Status', required: false },
  ],
  leads: [
    { field: 'domain', label: 'Domain', required: true },
    { field: 'source', label: 'Source', required: false },
    { field: 'campaign', label: 'Campaign', required: false },
    { field: 'notes', label: 'Notes', required: false },
  ],
};

const SAMPLE_DATA: Record<ImportType, string> = {
  contacts: `first_name,last_name,email,phone,job_title,company_name,status
John,Doe,john@example.com,555-0100,CEO,Acme Corp,prospect
Jane,Smith,jane@techstart.io,555-0101,CTO,TechStart Inc,customer
Bob,Johnson,bob@globaltech.com,555-0102,VP Sales,GlobalTech,lead`,
  companies: `name,industry,website,phone,size,status
Acme Corporation,Technology,https://acme.com,555-0100,51-200,prospect
TechStart Inc,SaaS,https://techstart.io,555-0101,11-50,active
GlobalTech Solutions,Enterprise Software,https://globaltech.com,555-0102,201-500,active`,
  leads: `domain,source,campaign,notes
example.com,organic,Q1 Outreach,High potential
techcompany.io,paid ads,LinkedIn Campaign,Demo requested
startup.co,referral,Partner Program,Hot lead`,
};

export default function CSVImportPage() {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'complete'>('upload');
  const [importType, setImportType] = useState<ImportType>('contacts');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [records, setRecords] = useState<ImportRecord[]>([]);
  const [stats, setStats] = useState<ImportStats>({ total: 0, success: 0, errors: 0, duplicates: 0 });
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    const text = await selectedFile.text();
    const parsed = parseCSV(text);

    if (parsed.length < 2) {
      alert('CSV must have at least a header row and one data row');
      return;
    }

    const headerRow = parsed[0];
    const dataRows = parsed.slice(1);

    setHeaders(headerRow);
    setCsvData(dataRows);

    // Auto-map columns
    const fields = FIELD_MAPPINGS[importType];
    const autoMappings: ColumnMapping[] = headerRow.map(header => {
      const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const matchedField = fields.find(f =>
        f.field === normalizedHeader ||
        f.label.toLowerCase().replace(/[^a-z0-9]/g, '_') === normalizedHeader ||
        header.toLowerCase().includes(f.label.toLowerCase())
      );

      return {
        sourceColumn: header,
        targetField: matchedField?.field || '',
        preview: dataRows.slice(0, 3).map(row => row[headerRow.indexOf(header)] || ''),
      };
    });

    setMappings(autoMappings);
    setStep('mapping');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      handleFile(droppedFile);
    }
  }, [importType]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const updateMapping = (index: number, targetField: string) => {
    const newMappings = [...mappings];
    newMappings[index].targetField = targetField;
    setMappings(newMappings);
  };

  const proceedToPreview = () => {
    // Convert CSV data to records using mappings
    const importRecords: ImportRecord[] = csvData.map(row => {
      const data: Record<string, any> = {};
      mappings.forEach((mapping, i) => {
        if (mapping.targetField) {
          data[mapping.targetField] = row[i] || '';
        }
      });

      // Validate required fields
      const fields = FIELD_MAPPINGS[importType];
      const missingRequired = fields
        .filter(f => f.required && !data[f.field])
        .map(f => f.label);

      return {
        data,
        status: missingRequired.length > 0 ? 'error' : 'pending',
        error: missingRequired.length > 0 ? `Missing: ${missingRequired.join(', ')}` : undefined,
      };
    });

    setRecords(importRecords);
    setStats({
      total: importRecords.length,
      success: 0,
      errors: importRecords.filter(r => r.status === 'error').length,
      duplicates: 0,
    });
    setStep('preview');
  };

  const startImport = async () => {
    setImporting(true);
    setStep('importing');

    const updatedRecords = [...records];
    let success = 0;
    let errors = stats.errors;
    let duplicates = 0;

    for (let i = 0; i < updatedRecords.length; i++) {
      const record = updatedRecords[i];

      if (record.status === 'error') continue;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate success/failure (90% success rate)
      const result = Math.random() > 0.1;

      if (result) {
        updatedRecords[i].status = 'success';
        success++;
      } else {
        updatedRecords[i].status = 'error';
        updatedRecords[i].error = 'API error: Failed to create record';
        errors++;
      }

      setRecords([...updatedRecords]);
      setStats({ total: records.length, success, errors, duplicates });
    }

    setImporting(false);
    setStep('complete');
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_DATA[importType]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setStep('upload');
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setMappings([]);
    setRecords([]);
    setStats({ total: 0, success: 0, errors: 0, duplicates: 0 });
  };

  const getTypeIcon = (type: ImportType) => {
    switch (type) {
      case 'contacts': return Users;
      case 'companies': return Building2;
      case 'leads': return Target;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-orange-500" />
            CSV Import
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Import contacts, companies, or leads from CSV files
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          {['Upload', 'Mapping', 'Preview', 'Import'].map((label, i) => {
            const stepIndex = ['upload', 'mapping', 'preview', 'importing'].indexOf(step);
            const isComplete = i < stepIndex || step === 'complete';
            const isCurrent = i === stepIndex;

            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    isComplete ? 'bg-emerald-500 text-white' :
                    isCurrent ? 'bg-orange-500 text-white' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {isComplete ? <Check className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`font-medium ${isCurrent ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          {/* Upload Step */}
          {step === 'upload' && (
            <div>
              {/* Import Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  What are you importing?
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['contacts', 'companies', 'leads'] as ImportType[]).map(type => {
                    const Icon = getTypeIcon(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setImportType(type)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          importType === type
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          importType === type ? 'text-orange-500' : 'text-slate-400'
                        }`} />
                        <div className={`font-medium capitalize ${
                          importType === type ? 'text-orange-600' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {type}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-orange-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${
                  dragActive ? 'text-orange-500' : 'text-slate-400'
                }`} />
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-slate-500">
                  Supports .csv files up to 10MB
                </p>
              </div>

              {/* Download Template */}
              <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Need a template? Download a sample CSV with the correct format.
                  </span>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
            </div>
          )}

          {/* Mapping Step */}
          {step === 'mapping' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Map Your Columns
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Match your CSV columns to the correct fields
                  </p>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>

              <div className="space-y-4">
                {mappings.map((mapping, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {mapping.sourceColumn}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        Preview: {mapping.preview.join(', ')}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                    <select
                      value={mapping.targetField}
                      onChange={(e) => updateMapping(i, e.target.value)}
                      className="w-48 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    >
                      <option value="">-- Skip this column --</option>
                      {FIELD_MAPPINGS[importType].map(field => (
                        <option key={field.field} value={field.field}>
                          {field.label} {field.required && '*'}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={proceedToPreview}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  Continue to Preview
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Review Import
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {stats.total} records ready to import
                  </p>
                </div>
                <button
                  onClick={() => setStep('mapping')}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                  <div className="text-sm text-slate-500">Total Records</div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.total - stats.errors}</div>
                  <div className="text-sm text-emerald-600">Ready</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.duplicates}</div>
                  <div className="text-sm text-yellow-600">Duplicates</div>
                </div>
              </div>

              {/* Records Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      {FIELD_MAPPINGS[importType].slice(0, 4).map(field => (
                        <th key={field.field} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {records.slice(0, 50).map((record, i) => (
                      <tr key={i} className={record.status === 'error' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                        <td className="px-4 py-3">
                          {record.status === 'error' ? (
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600">{record.error}</span>
                            </div>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </td>
                        {FIELD_MAPPINGS[importType].slice(0, 4).map(field => (
                          <td key={field.field} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                            {record.data[field.field] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={startImport}
                  disabled={stats.errors === stats.total}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  Start Import
                </button>
              </div>
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-orange-500 animate-spin" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Importing Records...
              </h2>
              <p className="text-slate-500 mb-6">
                {stats.success} of {stats.total} records processed
              </p>
              <div className="w-full max-w-md mx-auto h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(stats.success / stats.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Import Complete!
              </h2>
              <p className="text-slate-500 mb-8">
                Successfully imported {stats.success} {importType}
              </p>

              {/* Final Stats */}
              <div className="inline-grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{stats.success}</div>
                  <div className="text-sm text-slate-500">Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.errors}</div>
                  <div className="text-sm text-slate-500">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.duplicates}</div>
                  <div className="text-sm text-slate-500">Skipped</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
                >
                  <RefreshCw className="w-5 h-5" />
                  Import More
                </button>
                <a
                  href={`/dashboard/${importType}`}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  View {importType.charAt(0).toUpperCase() + importType.slice(1)}
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
