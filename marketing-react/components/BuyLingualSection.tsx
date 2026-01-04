import React, { useState, useEffect } from 'react';
import { 
  Mic, PhoneIncoming, Globe, User, 
  Building2, Stethoscope, ShoppingCart, Gavel, 
  Sun, TrendingUp, Car, Home as HomeIcon,
  ChevronRight
} from 'lucide-react';

const BuyLingualSection: React.FC = () => {
  const [activeLang, setActiveLang] = useState(0);
  
  const agents = [
      { name: "Sarah B.", role: "Outbound Sales", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42eac0a8438ef0e206.png" },
      { name: "John Q.", role: "Customer Service", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42eac0a8b86cf0e203.png" },
      { name: "Emily R.", role: "Tech Support", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42eac0a81ae1f0e204.png" },
      { name: "Michael T.", role: "Account Manager", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42acebf72ffb237a68.png" },
      { name: "Jessica L.", role: "Virtual Assistant", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42b263274751bc5a81.png" },
      { name: "David K.", role: "Lead Specialist", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42169a4231f83f7130.png" },
      { name: "Amanda P.", role: "Client Success", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42acebf7f939237a67.png" },
      { name: "Robert M.", role: "Data Analyst", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42e03e9de4eacdf863.png" },
      { name: "Michelle S.", role: "Scheduling", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42eac0a88e6bf0e208.png" },
      { name: "James W.", role: "Operations", img: "https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7e42169a4243313f7132.png" },
  ];

  const industries = [
    { name: "Real Estate", icon: Building2, desc: "ISA agents that qualify buyers, follow up on Zillow leads, and book showings 24/7." },
    { name: "Solar Energy", icon: Sun, desc: "High-volume prospecting agents that qualify homeowners based on utility spend and roof type." },
    { name: "Healthcare", icon: Stethoscope, desc: "HIPAA-compliant agents for patient intake, appointment reminders, and insurance verification." },
    { name: "Financial Services", icon: TrendingUp, desc: "SDRs for mortgage, insurance, and debt relief that pre-qualify prospects before live transfers." },
    { name: "Legal Firms", icon: Gavel, desc: "Automated client intake that filters for high-value cases and schedules initial consultations." },
    { name: "E-Commerce", icon: ShoppingCart, desc: "Outbound agents for abandoned cart recovery, upsells, and personalized customer support." },
    { name: "Home Services", icon: HomeIcon, desc: "HVAC, plumbing, and roofing dispatch agents that handle emergency calls and book jobs." },
    { name: "Automotive", icon: Car, desc: "Dealership assistants that follow up on internet leads and schedule test drives instantly." },
  ];

  const conversationStates = [
    {
      lang: 'English',
      flag: '🇺🇸',
      user: "Hi, I'm interested in lead gen services.",
      agent: "Absolutely! I can help you with that. When is a good time to chat?",
      status: "Active"
    },
    {
      lang: 'Español',
      flag: '🇲🇽',
      user: "Hola, me interesan sus servicios de clientes potenciales.",
      agent: "¡Por supuesto! Puedo ayudarle con eso. ¿Cuándo es un buen momento para hablar?",
      status: "Detecting: Spanish"
    },
    {
      lang: 'Français',
      flag: '🇫🇷',
      user: "Bonjour, je suis intéressé par vos services.",
      agent: "Absolument ! Je peux vous aider. Quand seriez-vous disponible ?",
      status: "Switching: French"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLang((prev) => (prev + 1) % conversationStates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = conversationStates[activeLang];

  return (
    <section id="buylingual" className="py-16 md:py-24 bg-gray-50 dark:bg-brand-gray relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-gradient-to-l from-brand-orange/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          
          {/* Left Content */}
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-bold text-sm mb-6 uppercase tracking-wider">
              Flagship Technology
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900 dark:text-white mb-6">
              Buy-Lingual™ <span className="text-brand-orange">AI Agents</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
              Stop losing leads to language barriers and missed calls. Our proprietary Buy-Lingual™ AI Agents handle both 
              <strong> Inbound Support</strong> and <strong>Outbound Sales</strong> with human-like fluency in multiple languages.
            </p>

            <div className="space-y-4 md:space-y-6">
              {[
                { 
                  title: "Seamless Language Switching", 
                  desc: "Agents detect language instantly and switch between English, Spanish, and more in real-time.",
                  icon: Globe,
                  animation: "animate-[spin_12s_linear_infinite]"
                },
                { 
                  title: "24/7 Availability", 
                  desc: "Never miss a lead. Our agents work around the clock, scheduling appointments and qualifying prospects.",
                  icon: PhoneIncoming,
                  animation: "animate-[pulse_3s_ease-in-out_infinite]"
                },
                { 
                  title: "Hyper-Realistic Voice", 
                  desc: "Indistinguishable from human agents, ensuring trust and high conversion rates.",
                  icon: Mic,
                  animation: "animate-orb-breathe"
                }
              ].map((item, idx) => (
                <div key={idx} className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-brand-orange/30 shadow-sm dark:shadow-none transition-all hover:bg-gray-50 dark:hover:bg-white/10">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-brand-orange to-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={20} className={`md:w-6 md:h-6 ${item.animation}`} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-base md:text-lg group-hover:text-brand-orange transition-colors">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Interactive Interface */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-blue rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white dark:bg-brand-black border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl min-h-[400px] md:min-h-[500px] flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-300">
                    ORENGEN_AGENT_V4.0
                    <span className="text-lg md:text-xl">{current.flag}</span>
                </div>
              </div>

              {/* Dynamic Chat */}
              <div className="space-y-6 font-mono text-xs md:text-sm flex-grow">
                {/* User Message */}
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <span className="text-xs text-gray-700 dark:text-white">USR</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-800 p-3 md:p-4 rounded-r-lg rounded-bl-lg text-gray-800 dark:text-gray-300 max-w-[85%] md:max-w-[80%] shadow-sm">
                    {current.user}
                  </div>
                </div>

                {/* AI Processing Status */}
                <div className="flex items-center gap-2 pl-12 text-xs text-gray-400 dark:text-gray-500">
                    <span className="w-2 h-2 bg-brand-orange rounded-full animate-ping"></span>
                    <span className="uppercase">{current.status}</span>
                </div>

                {/* Agent Message */}
                <div className="flex gap-3 flex-row-reverse animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                    <span className="text-xs text-white">AI</span>
                  </div>
                  <div className="bg-brand-orange/10 dark:bg-brand-orange/20 border border-brand-orange/30 p-3 md:p-4 rounded-l-lg rounded-br-lg text-gray-800 dark:text-white max-w-[85%] md:max-w-[80%] relative shadow-sm">
                    <Mic size={12} className="absolute -top-2 -left-2 text-brand-orange bg-white dark:bg-brand-black rounded-full p-0.5" />
                    {current.agent}
                  </div>
                </div>
              </div>

              {/* Visual Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0.3s</div>
                  <div className="text-[10px] md:text-xs text-gray-500 uppercase">Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-brand-orange">99.9%</div>
                  <div className="text-[10px] md:text-xs text-gray-500 uppercase">Accuracy</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* NEW: Industries Section */}
        <div className="mb-24 md:mb-32">
            <div className="text-center mb-16">
                <h3 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">Industries Transformed <br className="md:hidden" /> by Buy-Lingual™</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Our AI agents are pre-trained on specialized datasets to dominate these competitive sectors.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {industries.map((industry, i) => (
                    <div key={i} className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:border-brand-orange/50 transition-all hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4 group-hover:bg-brand-orange/20 group-hover:text-brand-orange transition-colors">
                            <industry.icon size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{industry.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{industry.desc}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-brand-orange uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            View Snapshot <ChevronRight size={10} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Agents Team Grid */}
        <div>
            <div className="text-center mb-8 md:mb-12">
                <h3 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-2">Meet Your New Workforce</h3>
                <p className="text-gray-600 dark:text-gray-400">Deploy these specialized agents instantly. No training required.</p>
            </div>
            
            {/* Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 md:grid md:grid-cols-5 md:overflow-visible px-2 snap-x snap-mandatory custom-scrollbar">
                {agents.map((agent, index) => (
                    <div key={index} className="flex-shrink-0 w-40 md:w-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-lg transition-all group hover:-translate-y-1 snap-center">
                        <div className="aspect-[3/4] overflow-hidden relative">
                             <img 
                                src={agent.img} 
                                alt={`${agent.name} - ${agent.role}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                             <div className="absolute bottom-3 left-3 right-3 text-white">
                                 <div className="font-bold text-base md:text-lg">{agent.name}</div>
                                 <div className="text-[10px] md:text-xs text-brand-orange font-bold uppercase tracking-wide">{agent.role}</div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default BuyLingualSection;