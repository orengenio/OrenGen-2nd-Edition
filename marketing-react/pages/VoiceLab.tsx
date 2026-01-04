import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Mic, Settings, Play, Square, Volume2, Save, 
  Terminal, Activity, Wifi, Phone, Key, Cpu, Sparkles,
  Layout, MessageSquare, Database, Share2, Globe, Server,
  Code, Shield, Zap, Rocket
} from 'lucide-react';

// Speech Recognition Type Definition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface AgentConfig {
  name: string;
  type: 'sales' | 'support' | 'custom';
  systemPrompt: string;
  twilioSid: string;
  twilioAuth: string;
  twilioPhone: string;
  elevenLabsKey: string;
  elevenLabsVoiceId: string;
  geminiKey: string;
  firstMessage: string;
}

const VoiceLab: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'behavior' | 'voice' | 'telephony' | 'deploy'>('behavior');
  
  // Configuration State
  const [config, setConfig] = useState<AgentConfig>({
    name: "Orengen Sales Rep 01",
    type: 'sales',
    systemPrompt: "You are a top-tier sales representative for Orengen.io. Your goal is to qualify leads for our AI automation services. Be professional, concise, and persuasive. Focus on pain points like efficiency and cost reduction.",
    twilioSid: "",
    twilioAuth: "",
    twilioPhone: "",
    elevenLabsKey: "",
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Default Rachel
    geminiKey: "",
    firstMessage: "Hi, this is [Name] from Orengen. I noticed you were interested in AI automation. Do you have a minute?"
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState<'OFFLINE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING'>('OFFLINE');
  const [logs, setLogs] = useState<{timestamp: string, source: 'SYSTEM' | 'USER' | 'AI' | 'TOOL', message: string}[]>([]);
  
  // Audio Refs
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to add logs
  const addLog = (source: 'SYSTEM' | 'USER' | 'AI' | 'TOOL', message: string) => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), source, message }]);
  };

  // --- Templates ---
  const applyTemplate = (type: 'sales' | 'support') => {
    if (type === 'sales') {
      setConfig(prev => ({
        ...prev,
        type: 'sales',
        name: "Outbound SDR - Sarah",
        systemPrompt: `Role: Senior Sales Development Representative (SDR)
Company: Orengen.io
Objective: Qualify inbound leads and book a strategy call.
Personality: Professional, energetic, persistent but polite.
Key Selling Points: 24/7 Availability, 90% Cost Reduction, Instant Scalability.
Objection Handling: If they say "too expensive", mention the ROI calculator. If they say "not interested", ask about their current automation stack.`,
        firstMessage: "Hi! This is Sarah calling from Orengen. I saw you checked out our AI solutions online. Did you have any specific questions I can answer?"
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        type: 'support',
        name: "Support Agent - Mike",
        systemPrompt: `Role: Tier 1 Technical Support
Company: Orengen.io
Objective: Resolve account access issues and billing inquiries.
Personality: Empathetic, patient, technical.
Process: 1. Verify user email. 2. Ask for error code. 3. Check knowledge base.
Escalation: If unable to resolve, offer to create a ticket #8942.`,
        firstMessage: "Hello, thanks for calling Orengen Support. My name is Mike. How can I help you today?"
      }));
    }
  };

  // --- Simulation Logic ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setSimStatus('LISTENING');
      };

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        addLog('USER', text);
        handleAIResponse(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        addLog('SYSTEM', `Mic Error: ${event.error}`);
        setSimStatus('OFFLINE');
        setIsSimulating(false);
      };

      recognitionRef.current.onend = () => {
        if (isSimulating && simStatus !== 'SPEAKING' && simStatus !== 'PROCESSING') {
          recognitionRef.current.start();
        }
      };
    }
  }, [isSimulating, simStatus, config]); // Re-bind if config changes

  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setSimStatus('OFFLINE');
      recognitionRef.current?.stop();
      if (audioRef.current) audioRef.current.pause();
      addLog('SYSTEM', 'Simulation stopped.');
    } else {
      setIsSimulating(true);
      setSimStatus('LISTENING');
      addLog('SYSTEM', `Starting simulation for agent: ${config.name}`);
      addLog('AI', config.firstMessage);
      speakText(config.firstMessage).then(() => {
         recognitionRef.current?.start();
      });
    }
  };

  const handleAIResponse = async (userText: string) => {
    setSimStatus('PROCESSING');
    
    try {
      // Use provided key or fallback to env for demo purposes if available (simulating backend)
      const apiKey = config.geminiKey || process.env.API_KEY || '';
      
      if (!apiKey) {
        throw new Error("Missing Gemini API Key in 'Intelligence' tab.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Using fast model

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: config.systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am ready to act as the agent." }] },
        ],
      });

      const result = await chat.sendMessage(userText);
      const response = result.response.text();
      
      addLog('AI', response);
      await speakText(response);
      
      setSimStatus('LISTENING');
      recognitionRef.current?.start();

    } catch (e: any) {
      addLog('SYSTEM', `AI Error: ${e.message}`);
      setSimStatus('OFFLINE');
      setIsSimulating(false);
    }
  };

  const speakText = async (text: string) => {
    setSimStatus('SPEAKING');
    
    // Check for ElevenLabs
    if (config.elevenLabsKey && config.elevenLabsVoiceId) {
       try {
        addLog('TOOL', 'Synthesizing audio via ElevenLabs API...');
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.elevenLabsVoiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': config.elevenLabsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        });

        if (!response.ok) throw new Error("ElevenLabs API failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        return new Promise<void>((resolve) => {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => resolve();
          audio.play();
        });
       } catch (e) {
         addLog('SYSTEM', 'ElevenLabs failed, falling back to browser TTS.');
       }
    }

    // Fallback
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-[#050505] text-white font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT PANEL: Builder / Configuration */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 gap-6 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('behavior')}
             className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all whitespace-nowrap ${activeTab === 'behavior' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Cpu size={14} /> Intelligence
           </button>
           <button 
             onClick={() => setActiveTab('voice')}
             className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all whitespace-nowrap ${activeTab === 'voice' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Volume2 size={14} /> Voice Model
           </button>
           <button 
             onClick={() => setActiveTab('telephony')}
             className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all whitespace-nowrap ${activeTab === 'telephony' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Phone size={14} /> Telephony
           </button>
           <button 
             onClick={() => setActiveTab('deploy')}
             className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all whitespace-nowrap ${activeTab === 'deploy' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
           >
             <Rocket size={14} /> Deploy
           </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           
           {activeTab === 'behavior' && (
             <div className="space-y-8 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-display font-bold mb-2">Agent Identity</h2>
                   <p className="text-gray-400 text-sm mb-6">Define the role and cognitive parameters of your backend agent.</p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <button onClick={() => applyTemplate('sales')} className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${config.type === 'sales' ? 'bg-brand-orange/10 border-brand-orange text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                         <Activity size={24} />
                         <span className="text-xs font-bold uppercase">Sales SDR</span>
                      </button>
                      <button onClick={() => applyTemplate('support')} className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${config.type === 'support' ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                         <Shield size={24} />
                         <span className="text-xs font-bold uppercase">Support Agent</span>
                      </button>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Internal Agent Name</label>
                        <input 
                          type="text" 
                          value={config.name}
                          onChange={(e) => setConfig({...config, name: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gemini API Key (LLM)</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            value={config.geminiKey}
                            onChange={(e) => setConfig({...config, geminiKey: e.target.value})}
                            placeholder="sk-..."
                            className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-brand-orange focus:outline-none"
                          />
                          <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">System Prompt / Instructions</label>
                        <textarea 
                          value={config.systemPrompt}
                          onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                          className="w-full h-64 bg-black border border-white/10 rounded-lg p-4 text-sm font-mono leading-relaxed focus:border-brand-orange focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Greeting Message</label>
                        <input 
                          type="text" 
                          value={config.firstMessage}
                          onChange={(e) => setConfig({...config, firstMessage: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'voice' && (
             <div className="space-y-8 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-display font-bold mb-2">Neural Voice Engine</h2>
                   <p className="text-gray-400 text-sm mb-6">Configure the TTS (Text-to-Speech) pipeline using ElevenLabs.</p>

                   <div className="bg-brand-orange/5 border border-brand-orange/20 p-6 rounded-xl mb-6">
                      <div className="flex items-center gap-3 mb-2">
                         <Volume2 size={20} className="text-brand-orange" />
                         <h3 className="font-bold text-brand-orange">ElevenLabs Configuration</h3>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        To achieve <span className="text-white">latency under 800ms</span>, we recommend using the Turbo v2 model. Ensure your API key has sufficient characters.
                      </p>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ElevenLabs API Key</label>
                        <input 
                          type="password" 
                          value={config.elevenLabsKey}
                          onChange={(e) => setConfig({...config, elevenLabsKey: e.target.value})}
                          placeholder="xi-..."
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Voice ID</label>
                        <input 
                          type="text" 
                          value={config.elevenLabsVoiceId}
                          onChange={(e) => setConfig({...config, elevenLabsVoiceId: e.target.value})}
                          placeholder="21m00Tcm4TlvDq8ikWAM"
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:border-brand-orange focus:outline-none"
                        />
                        <div className="mt-2 flex gap-2">
                           <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-white border border-white/5">Rachel (Default)</span>
                           <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-white border border-white/5">Domi (Strong)</span>
                           <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-white border border-white/5">Bella (Soft)</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'telephony' && (
             <div className="space-y-8 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-display font-bold mb-2">Telephony Backend</h2>
                   <p className="text-gray-400 text-sm mb-6">Link your Twilio account to deploy this agent to a live phone number.</p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-1">Inbound Webhook</div>
                          <div className="font-mono text-xs text-brand-orange truncate">https://api.orengen.io/v1/webhooks/voice/inbound</div>
                      </div>
                      <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
                          <div className="text-xs font-bold text-gray-500 uppercase mb-1">Status Callback</div>
                          <div className="font-mono text-xs text-brand-orange truncate">https://api.orengen.io/v1/webhooks/voice/status</div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Twilio Account SID</label>
                        <input 
                          type="text" 
                          value={config.twilioSid}
                          onChange={(e) => setConfig({...config, twilioSid: e.target.value})}
                          placeholder="AC..."
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Auth Token</label>
                        <input 
                          type="password" 
                          value={config.twilioAuth}
                          onChange={(e) => setConfig({...config, twilioAuth: e.target.value})}
                          placeholder="••••••••••••••••"
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assigned Phone Number</label>
                        <input 
                          type="text" 
                          value={config.twilioPhone}
                          onChange={(e) => setConfig({...config, twilioPhone: e.target.value})}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'deploy' && (
             <div className="space-y-8 animate-fade-in">
                <div className="text-center py-12">
                   <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                      <div className="absolute inset-0 border-2 border-brand-orange/30 rounded-full animate-ping"></div>
                      <Rocket size={40} className="text-brand-orange" />
                   </div>
                   <h2 className="text-3xl font-display font-bold mb-4">Ready to Launch?</h2>
                   <p className="text-gray-400 max-w-md mx-auto mb-8">
                     This will provision the serverless functions, bind the Twilio webhooks, and activate the neural voice pipeline.
                   </p>
                   
                   <button className="bg-brand-orange text-white font-bold px-12 py-4 rounded-full hover:bg-orange-600 transition-all shadow-[0_0_40px_rgba(204,85,0,0.3)]">
                      Deploy Agent to Production
                   </button>
                </div>
                
                <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                   <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Deployment Checklist</h3>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${config.geminiKey ? 'bg-green-500 text-black' : 'bg-gray-700'}`}><CheckIcon /></div>
                         LLM Intelligence Configured
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${config.elevenLabsKey ? 'bg-green-500 text-black' : 'bg-gray-700'}`}><CheckIcon /></div>
                         Voice Synthesis Ready
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${config.twilioSid ? 'bg-green-500 text-black' : 'bg-gray-700'}`}><CheckIcon /></div>
                         Telephony Bindings Set
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>

      {/* RIGHT PANEL: Simulation / Logs */}
      <div className="w-full lg:w-1/2 bg-[#020202] flex flex-col h-[50vh] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/5">
         
         {/* Sim Header */}
         <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${simStatus === 'OFFLINE' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Backend Simulator</span>
            </div>
            <div className="text-[10px] text-gray-600 font-mono">LATENCY: {simStatus === 'PROCESSING' ? 'CALCULATING...' : '14ms'}</div>
         </div>

         {/* Visualizer */}
         <div className="flex-1 flex flex-col items-center justify-center relative p-8">
            {/* Dynamic Orb */}
            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 relative ${
               simStatus === 'SPEAKING' ? 'scale-110' : 'scale-100'
            }`}>
               <div className={`absolute inset-0 rounded-full opacity-20 blur-2xl transition-colors duration-300 ${
                 simStatus === 'OFFLINE' ? 'bg-gray-800' :
                 simStatus === 'SPEAKING' ? 'bg-brand-orange' :
                 simStatus === 'PROCESSING' ? 'bg-brand-blue' :
                 'bg-green-500'
               }`}></div>
               
               <div className="relative z-10 w-32 h-32 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center shadow-2xl">
                  {simStatus === 'OFFLINE' ? <Volume2 className="text-gray-700" size={32} /> : 
                   simStatus === 'PROCESSING' ? <Cpu className="text-brand-blue animate-spin" size={32} /> :
                   <Activity className={`${simStatus === 'SPEAKING' ? 'text-brand-orange' : 'text-green-500'}`} size={32} />
                  }
               </div>

               {/* Ripple Effects */}
               {simStatus === 'SPEAKING' && (
                 <>
                   <div className="absolute inset-0 border border-brand-orange/30 rounded-full animate-ping"></div>
                   <div className="absolute inset-[-20px] border border-brand-orange/10 rounded-full animate-ping delay-100"></div>
                 </>
               )}
            </div>
            
            <div className="mt-12 w-full max-w-md flex justify-center">
               <button 
                 onClick={toggleSimulation}
                 className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${
                   isSimulating 
                   ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                   : 'bg-white hover:bg-gray-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                 }`}
               >
                 {isSimulating ? <><Square size={14} fill="currentColor" /> Stop Test</> : <><Play size={14} fill="currentColor" /> Test Agent Flow</>}
               </button>
            </div>
         </div>

         {/* Server Logs */}
         <div className="h-64 bg-[#080808] border-t border-white/5 font-mono text-[10px] p-4 overflow-y-auto">
            <div className="text-gray-500 uppercase tracking-widest mb-2 sticky top-0 bg-[#080808] pb-2 border-b border-white/5 flex justify-between">
               <span>Server Logs</span>
               <span onClick={() => setLogs([])} className="cursor-pointer hover:text-white">Clear</span>
            </div>
            <div className="space-y-1.5">
               {logs.length === 0 && <div className="text-gray-700 italic">Waiting for connection...</div>}
               {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                     <span className="text-gray-600">[{log.timestamp}]</span>
                     <span className={`font-bold w-12 text-right ${
                        log.source === 'SYSTEM' ? 'text-red-500' :
                        log.source === 'USER' ? 'text-green-500' :
                        log.source === 'AI' ? 'text-brand-orange' :
                        'text-blue-500'
                     }`}>{log.source}</span>
                     <span className="text-gray-300 flex-1">{log.message}</span>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

// Icon Helper
function CheckIcon() {
  return <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default VoiceLab;