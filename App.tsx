import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Shield, LayoutGrid, Globe, HardDrive, Terminal, 
  Settings, PlayCircle, StopCircle, Mic, Bot, FileText, ShieldAlert,
  Lock, Unlock, Zap, Puzzle
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { PlanViewer } from './components/PlanViewer';
import { FileSystem } from './components/FileSystem';
import { LiveVoice } from './components/LiveVoice';
import { ChatInterface } from './components/ChatInterface';
import { ExtensionsView } from './components/ExtensionsView';
import { 
  generateOperationalPlan, 
  sendMessageToChat, 
  generateSpeech,
  analyzePageContent,
  generateTechAnalysis
} from './services/geminiService';
import { AgentMode, PlanStep, StepStatus, FileNode, LogEntry, ChatMessage, Extension } from './types';
import { MOCK_FILE_SYSTEM, MOCK_BROWSER_DOM } from './constants';

const MOCK_EXTENSIONS: Extension[] = [
    { id: 'ext_auth_bridge', name: 'Agent Auth Bridge', description: 'Securely injects session cookies and handles 2FA challenges automatically.', version: '2.1.0', author: 'Antigravity Labs', installed: false },
    { id: 'ext_captcha_solver', name: 'CaptchaSolver Pro', description: 'AI-powered visual recognition to bypass standard captcha challenges.', version: '1.4.2', author: 'DeepMind', installed: false },
    { id: 'ext_dom_xray', name: 'DOM X-Ray', description: 'Exposes hidden form fields and shadow DOM elements for deep automation.', version: '3.0.1', author: 'OpenAI', installed: true },
    { id: 'ext_net_intercept', name: 'Network Interceptor', description: 'Monitors and modifies socket connections for advanced debugging.', version: '0.9.8', author: 'Ghost Protocol', installed: false },
    { id: 'ext_vpn_agent', name: 'Proxy/VPN Switcher', description: 'Rotates IP addresses per request to prevent rate limiting.', version: '1.1.0', author: 'Nord Security', installed: false },
];

function App() {
  // State: App Navigation
  const [showLanding, setShowLanding] = useState(true);

  // State: Core
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<AgentMode>(AgentMode.WEB);
  
  // State: Execution
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [godMode, setGodMode] = useState(false);
  
  // State: Data
  const [files, setFiles] = useState<FileNode[]>(MOCK_FILE_SYSTEM);
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [browserContent, setBrowserContent] = useState<string | null>(null);

  // State: UI
  const [activeTab, setActiveTab] = useState<'PLANNER' | 'CHAT'>('PLANNER');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Helper: Logging
  const addLog = (msg: string, type: LogEntry['type'] = 'info', agent: LogEntry['agent'] = 'ORCHESTRATOR') => {
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: msg,
      type,
      agent
    }]);
  };

  // Scroll logs
  useEffect(() => {
    if (!showLanding) {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLanding]);

  // Handler: Analyze & Plan
  const handleAnalyze = async () => {
    if (!url && mode === AgentMode.WEB) return;
    
    setIsPlanning(true);
    setActiveTab('PLANNER');
    addLog(`Starting analysis for ${mode === AgentMode.WEB ? url : 'Local System'}`, 'info', 'ANALYST');
    
    // Simulate web analysis / Context building
    let context = '';
    if (mode === AgentMode.WEB) {
        // Dynamic Mock Generation based on URL to avoid confusing the AI
        let simulatedDom = MOCK_BROWSER_DOM;
        if (url && !url.includes('stripe')) {
             simulatedDom = `
             <html>
                <head><title>${url} - Analysis Mode</title></head>
                <body>
                    <div id="root">
                        <header><h1>${url}</h1></header>
                        <main>
                            <p>Remote content loaded from ${url}...</p>
                            <!-- The Analyst Agent will infer tech stack from the URL itself since live scraping is restricted -->
                        </main>
                    </div>
                </body>
             </html>`;
        }
        
        setBrowserContent(simulatedDom);
        context = `Target URL: ${url}. \nSimulated DOM Snapshot: ${simulatedDom}`;
        addLog(`Connecting to ${url}...`, 'info', 'WEB_OP');
        await new Promise(r => setTimeout(r, 800)); // Fake network delay
        addLog('DOM Snapshot captured. Running heuristics...', 'success', 'WEB_OP');
    } else {
        context = `Root Dir: Project Alpha. Files: src/App.tsx, package.json...`;
        addLog('File system index built.', 'success', 'FILE_OP');
    }

    try {
        // 1. Generate Operational Plan
        const generatedPlanPromise = generateOperationalPlan(
            `Analyze and map the environment at ${url || 'root'}. Check for sensitive data.`, 
            context, 
            mode
        );
        
        // 2. Generate Tech Recon Report (Parallel)
        const techReportPromise = generateTechAnalysis(context);

        const [generatedPlan, techReport] = await Promise.all([generatedPlanPromise, techReportPromise]);
        
        // Handle Tech Report
        if (techReport) {
            const analysisMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'model',
                content: `🔍 **Technical Reconnaissance Report**\n\n${techReport}`,
                timestamp: Date.now()
            };
            setChatHistory(prev => [...prev, analysisMsg]);
            addLog('Tech stack analysis complete. Report sent to Chat.', 'success', 'ANALYST');
            // Optional: Switch to chat to show report immediately if user prefers, 
            // but usually we keep them on Planner to see execution steps.
        }

        // Handle Plan
        setPlan(generatedPlan);
        if (generatedPlan.length > 0) {
            addLog(`Plan generated with ${generatedPlan.length} steps. Waiting for approval.`, 'warning', 'ORCHESTRATOR');
            // Speak alert
            const audio = await generateSpeech("Analysis complete. Tech report and execution plan ready.");
            if (audio) {
                const ctx = new AudioContext();
                const source = ctx.createBufferSource();
                ctx.decodeAudioData(audio, (buffer) => {
                    source.buffer = buffer;
                    source.connect(ctx.destination);
                    source.start();
                });
            }
        } else {
            addLog('No actionable steps found or plan failed.', 'error', 'ANALYST');
        }
    } catch (e) {
        addLog('Planning failed critically.', 'error', 'ORCHESTRATOR');
    } finally {
        setIsPlanning(false);
    }
  };

  // Handler: Execute Step
  const executeNextStep = async () => {
    const nextStepIdx = plan.findIndex(s => s.status === StepStatus.PENDING || s.status === StepStatus.WAITING_APPROVAL);
    if (nextStepIdx === -1) return;

    const step = plan[nextStepIdx];
    
    // Safety Guard (Bypassed in God Mode)
    if (step.riskLevel === 'HIGH' && step.status !== StepStatus.WAITING_APPROVAL && !godMode) {
        const newPlan = [...plan];
        newPlan[nextStepIdx].status = StepStatus.WAITING_APPROVAL;
        setPlan(newPlan);
        addLog(`Safety Guard paused execution. Step '${step.description}' requires explicit approval.`, 'warning', 'GUARD');
        return;
    }

    if (godMode && step.riskLevel === 'HIGH') {
        addLog(`Safety Guard BYPASSED by Admin Override for: ${step.description}`, 'warning', 'GUARD');
    }

    setIsExecuting(true);
    setCurrentStepId(step.id);
    
    // Update status to RUNNING
    const runningPlan = [...plan];
    runningPlan[nextStepIdx].status = StepStatus.RUNNING;
    setPlan(runningPlan);

    // Determine executing agent
    let agent: LogEntry['agent'] = 'WEB_OP';
    if (step.tool.startsWith('FILE')) agent = 'FILE_OP';
    if (step.tool === 'WEBHOOK_TRIGGER') agent = 'AUTOMATION';

    addLog(`Executing: ${step.description}`, 'info', agent);

    // Execution Logic
    if (step.tool === 'WEBHOOK_TRIGGER') {
        try {
            // Mock fetch execution
            addLog(`POST ${step.params.target || 'https://api.n8n.io/webhook/...'}`, 'info', 'AUTOMATION');
            await new Promise(r => setTimeout(r, 1500)); // Simulate network latency
        } catch (e) {
            addLog('Webhook trigger failed.', 'error', 'AUTOMATION');
        }
    } else if (step.tool === 'BROWSER_INSTALL_EXTENSION') {
        // Mock installation
        const extName = step.params.value || step.params.extensionId || 'Security Extension';
        addLog(`Installing extension: ${extName}...`, 'info', 'WEB_OP');
        await new Promise(r => setTimeout(r, 2000));
        
        setExtensions(prev => prev.map(e => {
            if (e.name.toLowerCase().includes(extName.toLowerCase()) || e.id === step.params.extensionId) {
                return { ...e, installed: true };
            }
            return e;
        }));
        addLog(`Extension installed successfully into Agent Browser.`, 'success', 'WEB_OP');
    } else {
        // Standard Simulation Delay
        await new Promise(r => setTimeout(r, 1500));
    }

    // Success Logic
    const completedPlan = [...plan];
    completedPlan[nextStepIdx].status = StepStatus.COMPLETED;
    completedPlan[nextStepIdx].evidence = `Exec_ID_${Date.now().toString().slice(-4)}`; // Mock evidence
    setPlan(completedPlan);
    
    addLog(`Step completed. Evidence captured.`, 'success', 'GUARD');
    setIsExecuting(false);
    setCurrentStepId(null);
  };

  const handleApprove = () => {
      const pendingIdx = plan.findIndex(s => s.status === StepStatus.WAITING_APPROVAL);
      if (pendingIdx === -1) return;
      
      const newPlan = [...plan];
      newPlan[pendingIdx].status = StepStatus.PENDING; // Reset to pending so executeNext picks it up immediately or manually
      setPlan(newPlan);
      addLog('User approved high-risk action.', 'success', 'GUARD');
      executeNextStep(); 
  };

  // Handler: Chat
  const handleChatMessage = async (msg: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: Date.now()
    };
    
    const newHistory = [...chatHistory, newUserMsg];
    setChatHistory(newHistory);
    setIsChatProcessing(true);

    try {
      const response = await sendMessageToChat(newHistory, msg);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || "I'm having trouble connecting right now.",
        timestamp: Date.now()
      };
      setChatHistory([...newHistory, newAiMsg]);
    } catch (e) {
      console.error(e);
      addLog('Chat service failed.', 'error', 'ORCHESTRATOR');
    } finally {
      setIsChatProcessing(false);
    }
  };

  if (showLanding) {
      return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP BAR */}
      <header className={`h-14 border-b flex items-center px-4 gap-4 backdrop-blur transition-colors duration-500 ${godMode ? 'bg-red-950/20 border-red-900/30' : 'bg-slate-900/50 border-slate-800'}`}>
        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${godMode ? 'bg-red-600' : 'bg-blue-600'}`}>
                {godMode ? <Zap size={18} className="text-white fill-current" /> : <LayoutGrid size={18} className="text-white" />}
            </div>
            Antigravity OS
        </div>

        <div className="flex-1 max-w-2xl mx-auto flex items-center bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
             <div className="pr-3 border-r border-slate-700 mr-3 flex gap-2">
                 <button 
                    onClick={() => setMode(AgentMode.WEB)}
                    className={`p-1 rounded ${mode === AgentMode.WEB ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Web Browser Mode"
                 >
                     <Globe size={16} />
                 </button>
                 <button 
                    onClick={() => setMode(AgentMode.LOCAL)}
                    className={`p-1 rounded ${mode === AgentMode.LOCAL ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Local File Mode"
                 >
                     <HardDrive size={16} />
                 </button>
             </div>
             <input 
                type="text" 
                className="bg-transparent border-none outline-none flex-1 text-sm placeholder-slate-500"
                placeholder={mode === AgentMode.WEB ? "Enter URL to analyze..." : "Select local directory or search files..."}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
             />
             <button 
                onClick={handleAnalyze}
                disabled={isPlanning}
                className="ml-2 text-blue-400 hover:text-blue-300 disabled:opacity-50"
             >
                 {isPlanning ? <span className="animate-spin">⟳</span> : <PlayCircle size={18} />}
             </button>
        </div>

        <div className="flex items-center gap-3">
             <button
                onClick={() => {
                    setGodMode(!godMode);
                    addLog(godMode ? 'Safety protocols re-engaged.' : 'WARNING: Unfettered Access Enabled. Safety protocols disabled.', 'warning', 'GUARD');
                }}
                className={`p-2 rounded-full border transition-all ${godMode ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'}`}
                title={godMode ? "Disable God Mode" : "Enable God Mode"}
             >
                 {godMode ? <Unlock size={18} /> : <Lock size={18} />}
             </button>

             <button 
                onClick={() => setIsVoiceOpen(true)}
                className="p-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-full hover:bg-red-500/20 transition-all"
             >
                 <Mic size={18} />
             </button>
             <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                 <Settings size={16} className="text-slate-400" />
             </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (Icons) */}
        <div className="w-14 border-r border-slate-800 flex flex-col items-center py-4 gap-4 bg-slate-900">
            <button onClick={() => setMode(AgentMode.EXTENSIONS)} className={`p-2 rounded-lg ${mode === AgentMode.EXTENSIONS ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`} title="Extensions Store">
                <Puzzle size={20} />
            </button>
            <button className="p-2 rounded-lg bg-blue-600/20 text-blue-400"><Terminal size={20} /></button>
            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500"><HardDrive size={20} /></button>
            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500"><ShieldAlert size={20} /></button>
        </div>

        {/* CENTER PANEL (Operator View) */}
        <div className="flex-1 flex flex-col bg-black relative">
            {/* Status Bar */}
            <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 text-xs font-mono text-slate-500 justify-between">
                <span>MODE: {mode}</span>
                <span>AGENT STATUS: {isExecuting ? 'ACTIVE' : 'IDLE'}</span>
            </div>
            
            <div className="flex-1 overflow-auto relative">
                {mode === AgentMode.WEB ? (
                    <div className="p-8 h-full">
                        {browserContent ? (
                            <div className="bg-white rounded-lg shadow-xl h-full overflow-hidden text-black font-sans relative">
                                <div className="bg-gray-100 border-b p-2 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="ml-4 text-xs text-gray-500 flex-1 text-center bg-white rounded px-2">{url || 'stripe.com/dashboard'}</div>
                                </div>
                                <div className="p-6" dangerouslySetInnerHTML={{ __html: browserContent }} />
                                
                                {/* Overlay for Agent Actions */}
                                {isExecuting && (
                                    <div className="absolute inset-0 bg-blue-500/10 z-10 pointer-events-none flex items-center justify-center">
                                        <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-pulse font-mono text-sm">
                                            Agent Operating Mouse...
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                <Globe size={64} className="mb-4 opacity-20" />
                                <p>No Active Session</p>
                            </div>
                        )}
                    </div>
                ) : mode === AgentMode.LOCAL ? (
                    <FileSystem 
                        nodes={files} 
                        onSelect={(node) => {
                            setSelectedFile(node);
                            addLog(`User selected ${node.name}`, 'info', 'ORCHESTRATOR');
                        }} 
                    />
                ) : (
                    <ExtensionsView extensions={extensions} />
                )}
            </div>
            
            {/* LOGS PANEL (Bottom of center) */}
            <div className="h-48 border-t border-slate-800 bg-slate-950 flex flex-col">
                <div className="px-4 py-2 border-b border-slate-800 text-xs font-bold text-slate-500 flex justify-between">
                    <span>SYSTEM LOGS</span>
                    <button onClick={() => setLogs([])} className="hover:text-slate-300">CLEAR</button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
                    {logs.map(log => (
                        <div key={log.id} className="flex gap-2">
                            <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span className={`font-bold w-24 shrink-0 ${
                                log.agent === 'GUARD' ? 'text-orange-500' :
                                log.agent === 'ANALYST' ? 'text-purple-400' :
                                log.agent === 'WEB_OP' ? 'text-blue-400' :
                                log.agent === 'AUTOMATION' ? 'text-cyan-400' :
                                'text-slate-400'
                            }`}>{log.agent}</span>
                            <span className={`${
                                log.type === 'error' ? 'text-red-500' :
                                log.type === 'success' ? 'text-green-400' :
                                log.type === 'warning' ? 'text-yellow-500' :
                                'text-slate-300'
                            }`}>{log.message}</span>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>

        {/* RIGHT PANEL (Intelligence) */}
        <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col">
            <div className="flex border-b border-slate-800">
                <button 
                    onClick={() => setActiveTab('PLANNER')}
                    className={`flex-1 py-3 text-xs font-bold ${activeTab === 'PLANNER' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    PLANNER
                </button>
                <button 
                    onClick={() => setActiveTab('CHAT')}
                    className={`flex-1 py-3 text-xs font-bold ${activeTab === 'CHAT' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    CHAT
                </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'PLANNER' ? (
                    <PlanViewer 
                        plan={plan} 
                        onApprove={handleApprove} 
                        onExecuteNext={executeNextStep} 
                        isExecuting={isExecuting}
                        godMode={godMode}
                    />
                ) : (
                    <ChatInterface 
                        messages={chatHistory} 
                        onSendMessage={handleChatMessage} 
                        isProcessing={isChatProcessing}
                    />
                )}
            </div>
        </div>
      </div>

      {/* LIVE VOICE OVERLAY */}
      <LiveVoice isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
}

export default App;