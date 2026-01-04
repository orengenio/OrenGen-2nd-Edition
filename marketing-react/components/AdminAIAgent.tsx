import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Loader2, Sparkles, Terminal } from 'lucide-react';

const AdminAIAgent: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Systems online. I am the Orengen Site Architect. How can I assist with your deployment today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the Orengen.io Site Architect, an advanced AI designed to assist the administrator of orengen.io. 
          Orengen.io is an AI & Tech company specializing in Buy-Lingual AI Voice Agents, high-end lead generation, and bespoke business automation.
          
          Your goal is to help the user configure the site, write marketing copy, suggest code improvements for the React/Tailwind stack, and plan future features.
          Maintain a professional, highly intelligent, and slightly futuristic tone.
          
          Current Tech Stack: React, Tailwind CSS, Lucide Icons, Gemini API.
          Current Roadmap: Launch of the Digital Arsenal marketplace, expansion of voice agent languages, and CRM integration features.`,
        }
      });

      const aiText = response.text || "I encountered a processing error in the neural link. Please re-initiate command.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Neural link unstable. Check API key status or network connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono bg-[#0a0a0a]">
      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                m.role === 'ai' 
                  ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' 
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                {m.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'ai' 
                  ? 'bg-white/5 border border-white/10 text-gray-300 shadow-xl' 
                  : 'bg-brand-orange text-white font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-sm text-gray-500 italic">
              Architect is calculating site modifications...
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 py-3 flex flex-wrap gap-2 border-t border-white/5">
         {[
           "Suggest new SEO keywords",
           "Draft a LinkedIn post for launch",
           "Help me configure the CRM module",
           "Plan a new AI agent for Legal firms"
         ].map((suggest, i) => (
           <button 
             key={i}
             onClick={() => setInput(suggest)}
             className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full hover:border-brand-orange/50 hover:text-white transition-all"
           >
             {suggest}
           </button>
         ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-[#111] border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Architect..."
            className="w-full bg-black border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-orange text-white rounded-lg flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-brand-orange transition-colors"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
           <Sparkles size={10} className="text-brand-orange" />
           Integrated Gemini-3 Neural Core
           <Sparkles size={10} className="text-brand-orange" />
        </div>
      </form>
    </div>
  );
};

export default AdminAIAgent;