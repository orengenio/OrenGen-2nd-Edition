import React, { useState, useRef, useEffect } from 'react';
import { AgentType, AgentMessage, Project } from '../types';
import { generateAgentResponse, generateImage } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNexus } from './NexusContext';

interface Props {
  project: Project;
  agentType: AgentType;
  title: string;
}

const AgentWorkspace: React.FC<Props> = ({ project, agentType, title }) => {
  const { agentMemory } = useNexus();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'init',
      role: 'system',
      content: `I am ready to assist with **${title}** for project "${project.name}". How can I help?`,
      timestamp: Date.now()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Build context with global memory injection
    const context = `
      Project: ${project.name}
      Audience: ${project.audience}
      Tone: ${project.tone}
      Goal: ${project.kpis['Launch Date']}
      
      GLOBAL SYSTEM MEMORY & RULES:
      ${agentMemory || 'No global rules set.'}
    `;
    
    // Generate Response
    const responseText = await generateAgentResponse(agentType, userMsg.content, context, agentType === 'master_strategist');
    
    // Mock image generation trigger if explicitly asked or if it's the design agent
    let attachments = undefined;
    if ((agentType === 'design_mockup' || input.toLowerCase().includes('generate image')) && !input.toLowerCase().includes('no image')) {
        const imagePrompt = `High quality professional mockup for ${project.type}: ${input}`;
        const imageUrl = await generateImage(imagePrompt, "16:9");
        if (imageUrl) {
            attachments = [{ type: 'image' as const, url: imageUrl }];
        }
    }

    const aiMsg: AgentMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: Date.now(),
      attachments
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
        <h2 className="font-semibold flex items-center gap-2">
            <Bot className="text-brand-accent" size={20} />
            {title}
        </h2>
        <span className="text-xs font-mono px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-slate-500">
            {agentType.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-brand-primary text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tr-none' 
                : 'bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
            }`}>
              <div className="prose dark:prose-invert prose-sm">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.attachments && (
                  <div className="mt-3">
                      {msg.attachments.map((att, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                              {att.type === 'image' && (
                                  <img src={att.url} alt="Generated asset" className="w-full h-auto max-h-64 object-cover" />
                              )}
                              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                  Generated by Gemini
                              </div>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center">
               <Sparkles size={16} />
             </div>
             <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-2xl p-4 rounded-tl-none flex items-center gap-2 text-sm text-slate-500">
               <Loader2 className="animate-spin" size={16} />
               Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${title}... (Shift+Enter for new line)`}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none max-h-32"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-2 p-2 bg-brand-primary text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:hover:bg-brand-primary transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Sparkles size={10}/> Gemini Pro 1.5</span>
            {agentType === 'design_mockup' && <span className="flex items-center gap-1"><ImageIcon size={10}/> Image Gen Active</span>}
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspace;