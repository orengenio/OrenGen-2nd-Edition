import React, { useState, useRef, useEffect } from 'react';
import { Opportunity, AgentType } from '../types';
import AgentWorkspace from './AgentWorkspace';
import { useNexus } from './NexusContext';
import { 
  FileSearch, ScrollText, ShieldCheck, ArrowLeft, CheckCircle2, 
  PenTool, Eraser, Download, Lock, FileSignature, Hash, AlertTriangle, Scale, Target, Sword
} from 'lucide-react';

interface Props {
  opportunity: Opportunity;
  onBack: () => void;
  defaultTab?: 'rfp' | 'proposal' | 'compliance' | 'signing';
}

const ProposalWorkstation: React.FC<Props> = ({ opportunity, onBack, defaultTab = 'rfp' }) => {
  const { federalProfile } = useNexus();
  const [activeTab, setActiveTab] = useState<'rfp' | 'proposal' | 'compliance' | 'signing'>(defaultTab);

  // Mock Compliance Matrix Data (Simulating an "RFP Shred")
  const [matrixRows, setMatrixRows] = useState([
      { id: '1', section: 'L.2.1', text: 'Offeror must have active SAM.gov registration.', type: 'Mandatory', status: 'Compliant', strategy: 'Reference UEI ' + federalProfile.uei },
      { id: '2', section: 'L.4.5', text: 'Page Limit: Technical Volume shall not exceed 25 pages.', type: 'Formatting', status: 'Pending', strategy: 'Enforce in Agent prompt' },
      { id: '3', section: 'M.3.1', text: 'Evaluation: Past Performance with similar size/scope.', type: 'Evaluation', status: 'Risk', strategy: 'Use DOE Grid project as primary ref' },
      { id: '4', section: 'C.1.2', text: 'System must utilize Zero Trust Architecture.', type: 'Technical', status: 'Compliant', strategy: 'Highlight Cloud Native credentials' },
      { id: '5', section: 'H.5', text: 'Key Personnel must have TS/SCI Clearance.', type: 'Personnel', status: 'Non-Compliant', strategy: 'Need teaming partner?' },
  ]);

  // Construct the rich context string including company credentials
  const complianceContext = `
    OPPORTUNITY: ${opportunity.title} (Agency: ${opportunity.agency}, Due: ${opportunity.deadline})
    DESCRIPTION: ${opportunity.description || 'No description provided.'}
    
    CORPORATE PROFILE (MUST USE FOR COMPLIANCE):
    - Legal Name: ${federalProfile.legalName}
    - UEI: ${federalProfile.uei}
    - CAGE: ${federalProfile.cageCode}
    - NAICS: ${federalProfile.naics.join(', ')}
    - SIC: ${federalProfile.sic.join(', ')}
    - Set-Asides: ${federalProfile.setAsides.join(', ')}
    - Capabilities: ${federalProfile.capabilities}
  `;

  // Fake project wrapper to reuse AgentWorkspace but with injected federal context
  const mockProject = {
    id: opportunity.id,
    name: opportunity.title,
    type: opportunity.type,
    // audience removed here to avoid duplicate key error
    status: 'active' as const,
    progress: 50,
    readinessScore: opportunity.matchScore,
    checklist: [],
    kpis: { "Deadline": opportunity.deadline },
    tone: opportunity.type === 'Federal' ? 'Formal, Compliant, Technical, Shipley-Style' : 'Persuasive, Impact-Driven',
    language: 'en',
    audience: `${opportunity.agency} | STRICT COMPLIANCE REQUIRED | \n${complianceContext}` 
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-2xl font-bold">{opportunity.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-semibold">{opportunity.agency}</span>
                <span>•</span>
                <span>Due: {opportunity.deadline}</span>
                <span>•</span>
                <span className="text-brand-accent">{opportunity.status}</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit overflow-x-auto">
        {[
            { id: 'rfp', label: 'RFP Intel (Shredder)', icon: FileSearch },
            { id: 'compliance', label: 'Compliance Matrix', icon: ShieldCheck },
            { id: 'proposal', label: 'Proposal Writer', icon: ScrollText },
            { id: 'signing', label: 'Sign & Seal', icon: FileSignature },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-primary dark:text-white' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'rfp' && (
             <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-full">
                    <AgentWorkspace 
                        project={mockProject} 
                        agentType="rfp_analyst" 
                        title="RFP Intelligence Analyst" 
                    />
                </div>
                <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18}/> Evaluation Criteria (Section M)</h3>
                    <div className="space-y-4 mb-8">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">Weighting</div>
                            <div className="font-medium text-sm">Technical (40%) > Past Performance (30%) > Price (30%)</div>
                        </div>
                        <div className="space-y-2">
                            {['Technical Approach', 'Management Plan', 'Key Personnel', 'Transition Plan'].map((factor, i) => (
                                <div key={i} className="flex items-center justify-between text-sm p-2 border-b border-slate-100 dark:border-slate-700">
                                    <span>{factor}</span>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Vol. 1</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h3 className="font-bold mb-4 flex items-center gap-2"><Sword size={18}/> Ghosting Strategy</h3>
                    <div className="space-y-3">
                        <div className="text-xs text-slate-500">
                            Competitor weaknesses to highlight (subtly) in our response:
                        </div>
                        <textarea 
                            className="w-full h-32 p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none outline-none focus:border-brand-primary"
                            placeholder="e.g. Competitor X lacks FedRAMP High authorization. We should emphasize our ready-to-deploy ATO status..."
                        ></textarea>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'compliance' && (
             <div className="h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <div>
                        <h3 className="font-bold flex items-center gap-2"><Scale size={18} className="text-brand-accent"/> Requirement Matrix</h3>
                        <p className="text-xs text-slate-500">Automated "Shred" of RFP Documents</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium hover:bg-slate-50">Export Excel</button>
                        <button className="px-3 py-1.5 bg-brand-primary text-white rounded text-xs font-medium hover:bg-slate-700">Run Validation</button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-semibold w-24">ID</th>
                                <th className="px-6 py-3 font-semibold">Requirement Text</th>
                                <th className="px-6 py-3 font-semibold w-32">Type</th>
                                <th className="px-6 py-3 font-semibold w-32">Status</th>
                                <th className="px-6 py-3 font-semibold">Strategy / Assignment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {matrixRows.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{row.section}</td>
                                    <td className="px-6 py-3">{row.text}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                            row.type === 'Mandatory' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>{row.type}</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        {row.status === 'Compliant' && <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 size={14}/> Compliant</span>}
                                        {row.status === 'Non-Compliant' && <span className="flex items-center gap-1 text-red-600 font-medium"><AlertTriangle size={14}/> Non-Comp</span>}
                                        {row.status === 'Risk' && <span className="flex items-center gap-1 text-yellow-600 font-medium"><AlertTriangle size={14}/> Risk</span>}
                                        {row.status === 'Pending' && <span className="text-slate-400">Pending</span>}
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">{row.strategy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'proposal' && (
            <div className="h-full">
                <AgentWorkspace 
                    project={mockProject} 
                    agentType="proposal_writer" 
                    title="Proposal Generator" 
                />
            </div>
        )}

        {activeTab === 'signing' && <SigningInterface opportunity={opportunity} />}
      </div>
    </div>
  );
};

// --- Custom Signing Component ---
const SigningInterface: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [isSealed, setIsSealed] = useState(false);

    // Drawing Logic
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            setSignature(canvasRef.current.toDataURL());
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
                offsetY: (e as React.MouseEvent).nativeEvent.offsetY
            };
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
        setIsSealed(false);
    };

    const handleSeal = () => {
        if (!signature) return;
        setIsSealed(true);
    };

    useEffect(() => {
        // Init Canvas Styles
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000';
            }
        }
    }, []);

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 animate-fadeIn">
            {/* Document Preview */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 overflow-y-auto relative">
                <div className="max-w-2xl mx-auto bg-white text-black p-10 shadow-lg min-h-[800px] flex flex-col">
                    <div className="flex justify-between items-start mb-8 border-b pb-4">
                        <div className="text-xl font-serif font-bold uppercase tracking-widest">Proposal Submission</div>
                        <div className="text-right text-xs text-gray-500">
                            <div>Ref: {opportunity.id}</div>
                            <div>Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="flex-1 font-serif space-y-6">
                        <h2 className="text-2xl font-bold">{opportunity.title}</h2>
                        <p><strong>Prepared For:</strong> {opportunity.agency}</p>
                        <p><strong>Value:</strong> {opportunity.value}</p>
                        
                        <div className="my-8 p-4 bg-gray-50 border-l-4 border-gray-300 italic">
                            "This proposal represents a binding offer to perform the services described in the attached Technical Volume in accordance with RFP requirements."
                        </div>

                        <p className="text-justify text-sm leading-relaxed text-gray-600">
                            By signing below, the authorized representative certifies that all representations and certifications contained herein are accurate, current, and complete. The offeror acknowledges the terms of the solicitation and agrees to perform the work for the price specified.
                        </p>
                    </div>

                    {/* Signature Block on Doc */}
                    <div className="mt-12 pt-8 border-t-2 border-black">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="h-16 border-b border-black mb-2 relative flex items-end">
                                    {isSealed && signature && (
                                        <img src={signature} alt="Signature" className="h-full object-contain absolute bottom-0 left-0" />
                                    )}
                                </div>
                                <div className="text-xs uppercase font-bold tracking-wider">Authorized Signature</div>
                            </div>
                            <div>
                                <div className="h-16 border-b border-black mb-2 flex items-end pb-1 font-mono">
                                    {isSealed ? new Date().toLocaleDateString() : ''}
                                </div>
                                <div className="text-xs uppercase font-bold tracking-wider">Date</div>
                            </div>
                        </div>
                    </div>

                    {isSealed && (
                        <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
                            <div className="border-4 border-red-700 text-red-700 rounded-full w-40 h-40 flex items-center justify-center transform -rotate-12">
                                <div className="text-center font-bold uppercase">
                                    <div>Official</div>
                                    <div className="text-sm">Sealed</div>
                                    <div className="text-[10px]">{new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><PenTool size={18}/> Digital Signature</h3>
                    
                    {!isSealed ? (
                        <>
                            <div className="bg-white border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden touch-none mb-4">
                                <canvas 
                                    ref={canvasRef}
                                    width={250}
                                    height={150}
                                    className="w-full h-auto cursor-crosshair bg-white"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={endDrawing}
                                    onMouseLeave={endDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={endDrawing}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={clearCanvas} className="flex-1 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1">
                                    <Eraser size={14}/> Clear
                                </button>
                                <button onClick={handleSeal} disabled={!signature} className="flex-1 py-2 text-xs font-bold bg-brand-primary text-white rounded hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-1">
                                    <Lock size={14}/> Seal Doc
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="font-bold text-green-700 mb-1">Document Sealed</h4>
                            <p className="text-xs text-slate-500 mb-4">Cryptographic hash generated.</p>
                            <button onClick={() => {setIsSealed(false); setSignature(null); setTimeout(clearCanvas, 100);}} className="text-xs text-slate-400 hover:text-brand-accent underline">Reset</button>
                        </div>
                    )}
                </div>

                {isSealed && (
                    <div className="bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-green-400"/> Security Audit</h3>
                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Status</span>
                                <span className="text-green-400 font-bold">SIGNED & LOCKED</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-500">IP Address</span>
                                <span>192.168.1.XX</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Timestamp</span>
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">SHA-256 Hash</span>
                                <span className="text-[10px] break-all text-slate-400">8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                            <Download size={16} /> Download Signed PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalWorkstation;