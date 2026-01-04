import React from 'react';
import { 
  Rocket, Lock, Settings, BarChart3, Shield, Zap, RefreshCw, TrendingUp, 
  Check, ArrowRight, Server, Mail, Database, Globe, Cpu, Activity
} from 'lucide-react';
import CtaSection from '../components/CtaSection';

const SMTP: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  const features = [
    {
      title: "High-Speed Delivery",
      desc: "Send millions of emails with lightning-fast delivery speeds. Our infrastructure handles massive volumes without breaking a sweat.",
      icon: Rocket,
      color: "orange"
    },
    {
      title: "Government-Grade Security",
      desc: "Enterprise-level encryption, authentication protocols, and security measures that meet the highest compliance standards.",
      icon: Lock,
      color: "blue"
    },
    {
      title: "Universal Compatibility",
      desc: "Works seamlessly with cPanel, DirectAdmin, Postfix, SendGrid, Mailgun, and any custom-built email system you're running.",
      icon: Settings,
      color: "orange"
    },
    {
      title: "Real-Time Analytics",
      desc: "Comprehensive delivery reports, bounce management, and detailed analytics to optimize your email performance.",
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Reputation Protection",
      desc: "Advanced IP warming, domain reputation management, and automatic failover systems to protect your sender reputation.",
      icon: Shield,
      color: "orange"
    },
    {
      title: "Instant API Integration",
      desc: "RESTful APIs with comprehensive documentation, SDKs for popular languages, and webhooks for real-time event tracking.",
      icon: Zap,
      color: "blue"
    },
    {
      title: "Smart Routing",
      desc: "Intelligent email routing across multiple IPs and domains with automatic load balancing and failover capabilities.",
      icon: RefreshCw,
      color: "orange"
    },
    {
      title: "Scalable Architecture",
      desc: "From 1,000 to 100 million emails per day. Our infrastructure scales automatically to meet your growing needs.",
      icon: TrendingUp,
      color: "blue"
    }
  ];

  const platforms = [
    { label: "cP", name: "cPanel", desc: "Full integration with cPanel environments" },
    { label: "DA", name: "DirectAdmin", desc: "Native DirectAdmin compatibility" },
    { label: "Px", name: "Postfix", desc: "Advanced Postfix integration" },
    { label: "SG", name: "SendGrid", desc: "Drop-in SendGrid replacement" },
    { label: "MG", name: "Mailgun", desc: "Mailgun API compatibility" },
    { label: "Ex", name: "Exchange", desc: "Microsoft Exchange integration" },
    { label: "G", name: "G Suite", desc: "Google Workspace compatibility" },
    { label: "{ }", name: "Custom APIs", desc: "Any custom-built system" }
  ];

  const stats = [
    { val: "99.9%", label: "Uptime Guarantee" },
    { val: "98.0%", label: "Inbox Rate" },
    { val: "100M+", label: "Emails Daily" },
    { val: "<5s", label: "Average Delivery" },
    { val: "24/7", label: "Expert Support" },
    { val: "∞", label: "Scalability" }
  ];

  const whyChoose = [
    { title: "Cost-Effective Scale", desc: "Reduce email delivery costs while increasing performance. Pay for what you use with transparent, scalable pricing.", icon: Database },
    { title: "Lightning Fast Setup", desc: "Get up and running in minutes, not days. Our streamlined onboarding process gets you sending emails immediately.", icon: Zap },
    { title: "Maximum Deliverability", desc: "Advanced reputation management and intelligent routing ensure your emails reach the inbox, not the spam folder.", icon: Check },
    { title: "Unlimited Growth", desc: "Scale from thousands to millions of emails without changing providers. Our infrastructure grows with your business.", icon: TrendingUp },
    { title: "Smart Analytics", desc: "Deep insights into delivery performance, engagement metrics, and actionable recommendations to improve results.", icon: Activity },
    { title: "Enterprise Security", desc: "Government-grade security with SOC 2 compliance, advanced encryption, and comprehensive audit trails.", icon: Lock }
  ];

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
            <Mail size={12} /> Enterprise SMTP Infrastructure
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight uppercase tracking-tight">
            SMTP Systems That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Deliver Without Limits</span>
          </h1>
          
          <h2 className="text-xl md:text-3xl font-light text-gray-300 mb-8 max-w-4xl mx-auto uppercase tracking-wider">
            Scalable • Secure • No Boundaries
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-12 leading-relaxed">
            Take full control of your email delivery with OrenGen's custom-built SMTP infrastructure. Our systems are engineered for flexibility, built for scale, and designed to work with any platform — cPanel, DirectAdmin, Postfix, or custom-built mailers. Fast, secure, and limitless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(204,85,0,0.3)] hover:shadow-[0_0_50px_rgba(204,85,0,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Book SMTP Call <ArrowRight size={20} />
            </a>
            <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all text-white flex items-center justify-center"
            >
                Schedule Meeting
            </a>
          </div>
          
          <div className="mt-16 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center justify-center gap-2">
            <Rocket size={14} className="text-brand-orange" /> Trusted by Enterprise Leaders Worldwide
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#050505]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">Enterprise <span className="text-brand-orange">SMTP Features</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                 Every feature you need to dominate email delivery, from basic sending to advanced reputation management.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {features.map((feature, idx) => (
                 <div key={idx} className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-brand-orange/50 transition-all duration-300 hover:bg-white/10 flex flex-col h-full hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                      feature.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'
                    }`}>
                       <feature.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-brand-orange transition-colors">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Performance Stats */}
      <section className="py-24 bg-brand-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                 <h2 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-widest">Performance That Delivers</h2>
                 <p className="text-gray-400">Numbers that prove why enterprises trust OrenGen for their critical email infrastructure</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                        <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{stat.val}</div>
                        <div className="text-[10px] md:text-xs text-brand-orange font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="py-24 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Universal Platform <span className="text-brand-blue">Compatibility</span></h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Our infrastructure is engineered for flexibility. Whether you're running enterprise systems or custom solutions, we make it work seamlessly.
                  </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {platforms.map((platform, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
                          <div className="w-12 h-12 bg-brand-black border border-white/20 rounded-lg flex items-center justify-center font-mono font-bold text-brand-orange text-lg mb-4 group-hover:scale-110 transition-transform shadow-lg">
                              {platform.label}
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">{platform.name}</h3>
                          <p className="text-xs text-gray-500">{platform.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Why Choose */}
      <section className="py-24 bg-brand-black relative">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Why Choose <span className="text-brand-orange">OrenGen SMTP</span></h2>
                  <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                      Transform your email delivery with infrastructure that's built for performance, security, and scale.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {whyChoose.map((item, i) => (
                      <div key={i} className="flex gap-6 p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
                              <item.icon size={24} />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-orange/10 relative overflow-hidden border-t border-brand-orange/20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                  Ready to Dominate <br />Email Delivery?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light">
                  Stop losing money to bounced emails and poor deliverability. Join thousands of businesses who trust OrenGen's SMTP infrastructure to deliver their most important messages. Your emails don't just get sent — they get delivered.
              </p>
              
              <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-brand-orange px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform duration-300 flex items-center justify-center gap-2 mx-auto"
              >
                Book SMTP Consultation 📧
              </a>
              
              <div className="mt-12 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                SMTP SYSTEMS THAT SCALE • ENTERPRISE GRADE • 99.9% UPTIME
              </div>
          </div>
      </section>
      
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default SMTP;