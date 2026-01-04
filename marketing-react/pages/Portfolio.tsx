import React, { useState } from 'react';
import { 
  Bot, MessageSquare, BarChart3, Zap, Globe, Mail, Landmark, Stethoscope, Target,
  ArrowRight, Filter, Layers
} from 'lucide-react';
import CtaSection from '../components/CtaSection';

const Portfolio: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: "Projects Delivered", value: "500+" },
    { label: "Client Satisfaction", value: "98%" },
    { label: "Revenue Generated", value: "$50M+" },
    { label: "AI Systems Running", value: "24/7" },
  ];

  const categories = ["All", "AI Agents", "CRM Systems", "Automation", "Web Development", "Email Solutions", "Government"];

  const projects = [
    {
      title: "Enterprise AI Call Center",
      category: "AI Agents",
      subtitle: "Fortune 500 Telecommunications",
      description: "Deployed 100+ AI agents for Fortune 500 company, handling 50,000+ customer interactions daily with 95% satisfaction rates and 70% cost reduction.",
      tags: ["Natural Language Processing", "Voice AI", "CRM Integration", "Real-time Analytics"],
      stats: [
        { label: "Cost Reduction", value: "70%" },
        { label: "Satisfaction Rate", value: "95%" },
        { label: "Daily Interactions", value: "50K+" }
      ],
      icon: Bot,
      color: "orange"
    },
    {
      title: "E-commerce AI Sales Assistant",
      category: "AI Agents",
      subtitle: "Major Retail Brand",
      description: "Implemented AI sales chatbots that increased conversion rates by 340% and generated $2.3M in additional revenue within 6 months for major retailer.",
      tags: ["Machine Learning", "Recommendation Engine", "Multi-channel", "Behavioral Analytics"],
      stats: [
        { label: "Conversion Increase", value: "340%" },
        { label: "Revenue Generated", value: "$2.3M" },
        { label: "Available", value: "24/7" }
      ],
      icon: MessageSquare,
      color: "blue"
    },
    {
      title: "Predictive CRM Transformation",
      category: "CRM Systems",
      subtitle: "High-Growth SaaS",
      description: "Revolutionized sales pipeline with AI-powered CRM featuring predictive analytics, automated lead scoring, and intelligent follow-up sequences for SaaS company.",
      tags: ["Predictive Analytics", "Lead Scoring", "Automation", "API Integration"],
      stats: [
        { label: "Lead Quality", value: "250%" },
        { label: "Faster Sales Cycle", value: "60%" },
        { label: "Accuracy Rate", value: "85%" }
      ],
      icon: BarChart3,
      color: "orange"
    },
    {
      title: "End-to-End Process Automation",
      category: "Automation",
      subtitle: "FinTech Startup",
      description: "Automated entire customer journey from lead capture to onboarding, reducing manual work by 90% and improving customer experience for tech startup.",
      tags: ["Workflow Automation", "API Orchestration", "Data Integration", "Process Mining"],
      stats: [
        { label: "Manual Work Reduced", value: "90%" },
        { label: "Faster Processing", value: "5x" },
        { label: "Accuracy Rate", value: "99.2%" }
      ],
      icon: Zap,
      color: "blue"
    },
    {
      title: "AI-Powered Financial Platform",
      category: "Web Development",
      subtitle: "Global Investment Firm",
      description: "Built secure, scalable fintech platform with AI-driven insights, real-time analytics, and automated compliance monitoring for investment firm.",
      tags: ["React", "Node.js", "AI Analytics", "Security"],
      stats: [
        { label: "Users", value: "500K+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Compliance", value: "100%" }
      ],
      icon: Globe,
      color: "orange"
    },
    {
      title: "Enterprise Email Deliverability",
      category: "Email Solutions",
      subtitle: "Marketing Agency Network",
      description: "Cleaned and validated 50M+ email addresses with 98% accuracy, improving deliverability by 450% and saving $2M in bounced email costs.",
      tags: ["Human Verification", "AI Validation", "SMTP Testing", "Bulk Processing"],
      stats: [
        { label: "Accuracy Rate", value: "98%" },
        { label: "Deliverability Boost", value: "450%" },
        { label: "Emails Validated", value: "50M+" }
      ],
      icon: Mail,
      color: "blue"
    },
    {
      title: "Secure Government AI System",
      category: "Government",
      subtitle: "Federal Agency",
      description: "Developed FedRAMP-compliant AI system for federal agency, processing 1M+ documents daily with military-grade security and 99.7% accuracy.",
      tags: ["FedRAMP Compliance", "Document Processing", "Encryption", "Audit Trails"],
      stats: [
        { label: "Accuracy", value: "99.7%" },
        { label: "Documents/Day", value: "1M+" },
        { label: "Compliance", value: "100%" }
      ],
      icon: Landmark,
      color: "orange"
    },
    {
      title: "HIPAA-Compliant Medical AI",
      category: "AI Agents",
      subtitle: "National Healthcare Network",
      description: "Deployed AI agents for healthcare network handling 25K+ patient interactions monthly with full HIPAA compliance and 97% patient satisfaction.",
      tags: ["HIPAA Compliance", "Medical NLP", "Appointment Scheduling", "EHR Integration"],
      stats: [
        { label: "Patient Satisfaction", value: "97%" },
        { label: "Monthly Interactions", value: "25K+" },
        { label: "HIPAA Compliant", value: "100%" }
      ],
      icon: Stethoscope,
      color: "blue"
    },
    {
      title: "AI Lead Generation Engine",
      category: "Automation",
      subtitle: "B2B Enterprise",
      description: "Built intelligent lead generation system using AI to identify, qualify, and nurture prospects, increasing qualified leads by 400% for B2B company.",
      tags: ["Lead Scoring AI", "Behavioral Tracking", "Multi-channel Outreach", "Predictive Modeling"],
      stats: [
        { label: "More Qualified Leads", value: "400%" },
        { label: "ROI Increase", value: "180%" },
        { label: "Shorter Sales Cycle", value: "50%" }
      ],
      icon: Target,
      color: "orange"
    }
  ];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-20 bg-brand-black text-white font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
             <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
            <Layers size={12} /> Our Masterpieces
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight uppercase tracking-tight">
            Results That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Speak Volumes</span>
          </h1>
          
          <h2 className="text-xl md:text-3xl font-light text-gray-300 mb-8 max-w-4xl mx-auto uppercase tracking-wider">
            Transforming Businesses Across Industries
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-12 leading-relaxed">
            Explore our portfolio of successful AI implementations, automation solutions, and digital transformations. 
            Each project represents measurable results, innovative technology, and the power of AI to revolutionize business operations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
             {stats.map((stat, i) => (
               <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-xs text-brand-orange font-bold uppercase tracking-widest">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 bg-[#050505]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-3">
                   <Filter className="text-brand-orange" /> Explore Our Work
                </h2>
                
                <div className="flex flex-wrap justify-center gap-2">
                   {categories.map((cat) => (
                     <button
                       key={cat}
                       onClick={() => setFilter(cat)}
                       className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                         filter === cat
                           ? 'bg-brand-orange border-brand-orange text-white'
                           : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredProjects.map((project, idx) => (
                 <div key={idx} className="group bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-brand-orange/30 hover:shadow-[0_0_30px_rgba(204,85,0,0.1)] transition-all duration-300 flex flex-col">
                    <div className="p-8 flex flex-col h-full">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                            project.color === 'orange' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-blue/10 text-brand-blue'
                          }`}>
                             <project.icon size={28} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                            {project.category}
                          </span>
                       </div>

                       <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">{project.title}</h3>
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{project.subtitle}</div>
                       
                       <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                          {project.description}
                       </p>

                       <div className="flex flex-wrap gap-2 mb-8">
                          {project.tags.map((tag, tIdx) => (
                             <span key={tIdx} className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                {tag}
                             </span>
                          ))}
                       </div>

                       <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-6 mb-6">
                          {project.stats.map((stat, sIdx) => (
                             <div key={sIdx} className="text-center">
                                <div className={`font-bold text-lg ${project.color === 'orange' ? 'text-brand-orange' : 'text-brand-blue'}`}>{stat.value}</div>
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider leading-tight">{stat.label}</div>
                             </div>
                          ))}
                       </div>

                       <button onClick={onOpenAudit} className="w-full py-4 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group-hover:bg-brand-orange group-hover:border-brand-orange">
                          View Case Study <ArrowRight size={16} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default Portfolio;