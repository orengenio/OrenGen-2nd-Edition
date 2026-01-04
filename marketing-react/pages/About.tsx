import React from 'react';
import CtaSection from '../components/CtaSection';
import { 
  Target, Rocket, Sparkles, Bot, Mail, Zap, Landmark, 
  Users, Clock, Award, Globe, Infinity, DollarSign, Briefcase, 
  TrendingUp, ShieldCheck, ArrowRight
} from 'lucide-react';

const About: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  const whatWeDo = [
    {
      title: "AI Virtual Employees",
      desc: "Virtual employees and AI call agents that talk, sell, and support customers around the clock with human-like intelligence and precision.",
      icon: Bot,
      color: "orange"
    },
    {
      title: "Enterprise Email Systems",
      desc: "Email systems that safely reach millions of inboxes with advanced deliverability technology that ensures your message gets where it needs to go.",
      icon: Mail,
      color: "blue"
    },
    {
      title: "Secure Automation",
      desc: "Secure websites and automation that handle marketing, leads, and daily tasks automatically with enterprise-grade security and performance.",
      icon: Zap,
      color: "orange"
    },
    {
      title: "Government-Ready Solutions",
      desc: "Government-ready tech solutions designed for big scale with compliance standards that meet the highest security and operational requirements.",
      icon: Landmark,
      color: "blue"
    }
  ];

  const foundation = [
    {
      title: "Our Purpose",
      desc: "To automate the future — so people can focus on what matters. We exist to eliminate complexity and build intelligent solutions that do the work for you.",
      icon: Target
    },
    {
      title: "Our Mission",
      desc: "To empower businesses, governments, and entrepreneurs with cutting-edge AI systems that automate growth, enhance security, and deliver scalable results — faster, smarter, and with zero compromise.",
      icon: Rocket
    },
    {
      title: "Our Vision",
      desc: "To become the world's most trusted provider of AI-driven innovations — reshaping how organizations communicate, operate, and grow — one automated system at a time.",
      icon: Sparkles
    }
  ];

  const impactGoals = [
    {
      label: "Entities Transformed",
      val: "1M+",
      desc: "Businesses, governments, and entrepreneurs transformed through our AI systems",
      icon: Users
    },
    {
      label: "New Client Revenue",
      val: "$30B",
      desc: "In new revenue generated for our clients through automated systems and optimization",
      icon: DollarSign
    },
    {
      label: "Sustainable Jobs",
      val: "1M",
      desc: "Sustainable jobs created across industries, borders, and generations",
      icon: Briefcase
    },
    {
      label: "Inefficiencies Eliminated",
      val: "∞",
      desc: "Inefficiencies eliminated through intelligent automation and AI-powered solutions",
      icon: Infinity
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-brand-black text-white font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-orange/20 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-orange text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in-up">
            🚀 AI Innovation Leaders
          </div>
          
          <h1 className="text-4xl md:text-8xl font-display font-bold mb-6 leading-tight uppercase tracking-tight">
            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">OrenGen</span>
          </h1>
          
          <h2 className="text-xl md:text-3xl font-bold text-gray-300 mb-8 max-w-4xl mx-auto uppercase tracking-wider">
            Architects of the AI Revolution
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-light">
            We build AI systems that sell, support, and scale your business — automatically. 
            With a team of 10 experts and 50 years of combined experience, we're transforming how businesses operate in the digital age.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                <span className="text-brand-orange font-bold text-lg">Built to Disrupt.</span>
             </div>
             <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                <span className="text-brand-blue font-bold text-lg">Designed to Deliver.</span>
             </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">What <span className="text-brand-orange">We Do</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                 OrenGen builds smart, AI-powered systems that help businesses grow faster, work automatically, and stay secure.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whatWeDo.map((item, idx) => (
                <div key={idx} className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-brand-orange/50 transition-all duration-300 hover:bg-white/10 flex flex-col h-full">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                     item.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'
                   }`}>
                      <item.icon size={28} />
                   </div>
                   <h3 className="text-xl font-bold mb-4 text-white group-hover:text-brand-orange transition-colors">{item.title}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Our Foundation */}
      <section className="py-24 bg-brand-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">Our <span className="text-brand-blue">Foundation</span></h2>
              <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                Everything we do is guided by our core purpose, mission, and vision for the future of AI-powered business automation.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {foundation.map((item, idx) => (
                <div key={idx} className="text-center group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                   <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,146,226,0.2)]">
                      <item.icon size={36} />
                   </div>
                   <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">{item.title}</h3>
                   <p className="text-gray-400 leading-relaxed text-sm md:text-base">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#080808] border-y border-white/10">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-16 uppercase tracking-tight">Our <span className="text-brand-orange">Expert Team</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: "Expert Team Members", val: "10", icon: Users },
                 { label: "Combined Experience", val: "50+", icon: Award },
                 { label: "AI Solutions Offered", val: "17", icon: CpuIcon },
                 { label: "Support & Automation", val: "24/7", icon: Clock },
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center p-8 bg-white/5 border border-white/5 rounded-3xl group hover:border-brand-orange/30 transition-all">
                    <stat.icon className="text-brand-orange/40 group-hover:text-brand-orange transition-colors mb-4" size={32} />
                    <div className="text-5xl font-display font-bold text-white mb-2">{stat.val}</div>
                    <div className="text-xs uppercase font-bold text-gray-500 tracking-[0.2em]">{stat.label}</div>
                 </div>
               ))}
            </div>
            <p className="mt-16 text-gray-500 max-w-2xl mx-auto italic font-light">
              A powerhouse team of 10 AI specialists with 50 years of combined experience, bringing together decades of expertise in artificial intelligence, automation, and enterprise solutions.
            </p>
         </div>
      </section>

      {/* 2030 Impact Goals */}
      <section className="py-24 bg-brand-black relative">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">Our <span className="text-brand-blue">2030 Impact Goals</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We're not just building AI solutions — we're driving global transformation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {impactGoals.map((goal, i) => (
                 <div key={i} className="bg-[#0f0f0f] border border-white/5 p-10 rounded-3xl hover:-translate-y-2 transition-all flex flex-col items-center text-center group">
                    <div className="p-4 bg-brand-blue/10 text-brand-blue rounded-2xl mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                       <goal.icon size={32} />
                    </div>
                    <div className="text-5xl font-display font-bold text-white mb-4">{goal.val}</div>
                    <div className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4">{goal.label}</div>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">{goal.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-orange/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 uppercase tracking-tighter">
                  Ready to Join the <br />AI Revolution?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                  We're building the future of business automation, one intelligent system at a time. Partner with OrenGen and experience what happens when cutting-edge AI meets unwavering commitment to results.
              </p>
              
              <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-brand-orange px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform duration-300"
              >
                Start Your Transformation <Sparkles size={20} className="fill-brand-orange" />
              </a>
              
              <div className="mt-12 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                Maximizing Human Potential Through AI Automation
              </div>
          </div>
      </section>
      
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

// Internal Helper Icon
function CpuIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </svg>
    )
  }

export default About;