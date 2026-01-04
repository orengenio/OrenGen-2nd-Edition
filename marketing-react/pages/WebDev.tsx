import React from 'react';
import { 
  Layout, ShoppingBag, Smartphone, Zap, ShieldCheck, Wrench, 
  Code, Search, Activity, Monitor, Globe, Check, X, ArrowRight,
  Cpu, Rocket, Database, Lock, ExternalLink
} from 'lucide-react';
import CtaSection from '../components/CtaSection';

interface WebDevProps {
  onOpenAudit: () => void;
  onNavigate: (page: string) => void;
}

const WebDev: React.FC<WebDevProps> = ({ onOpenAudit, onNavigate }) => {
  
  const features = [
    {
      title: "Custom Website Development",
      description: "Bespoke websites built with AI optimization that load in under 2 seconds and convert visitors into customers at unprecedented rates.",
      details: ["Custom design & development", "AI-powered user experience", "Conversion optimization built-in", "Mobile-first responsive design", "SEO-optimized architecture"],
      icon: Layout,
      color: "blue"
    },
    {
      title: "E-commerce Powerhouses",
      description: "Online stores that sell while you sleep with AI-driven product recommendations, checkout optimization, and revenue maximization.",
      details: ["AI product recommendation engines", "One-click checkout optimization", "Inventory management integration", "Payment gateway optimization", "Abandoned cart recovery"],
      icon: ShoppingBag,
      color: "orange"
    },
    {
      title: "Progressive Web Apps",
      description: "App-like experiences that work on any device with offline functionality, push notifications, and native performance.",
      details: ["Offline functionality", "Push notification systems", "Native app performance", "Cross-platform compatibility", "App store distribution ready"],
      icon: Smartphone,
      color: "blue"
    },
    {
      title: "Performance Optimization",
      description: "Blazing-fast loading speeds with AI-optimized code, image compression, and caching that destroys bounce rates.",
      details: ["Core Web Vitals optimization", "Image & video compression", "Advanced caching strategies", "CDN integration & optimization", "Database query optimization"],
      icon: Zap,
      color: "orange"
    },
    {
      title: "Enterprise Security",
      description: "Government-grade security with SSL encryption, penetration testing, and compliance that protects your business and customers.",
      details: ["SSL certificate implementation", "Penetration testing & audits", "GDPR & compliance ready", "DDoS protection systems", "Regular security updates"],
      icon: ShieldCheck,
      color: "blue"
    },
    {
      title: "Maintenance & Support",
      description: "24/7 monitoring and maintenance that keeps your website running perfectly with automatic updates and instant issue resolution.",
      details: ["24/7 uptime monitoring", "Automatic backup systems", "Security updates & patches", "Performance monitoring", "Emergency support response"],
      icon: Wrench,
      color: "orange"
    }
  ];

  const portfolio = [
    {
      title: "Nexus Financial",
      category: "FinTech Platform",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=2070",
      stats: "+450% User Retention",
      stack: ["Next.js", "AI Analytics", "Stripe Connect"],
      description: "A high-frequency trading dashboard with real-time AI market predictions and millisecond-latency data visualization."
    },
    {
      title: "Lumina Health",
      category: "Telemedicine Portal",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070",
      stats: "98% Patient Satisfaction",
      stack: ["React Native", "HIPAA Cloud", "WebRTC"],
      description: "Secure, compliant telehealth infrastructure featuring AI-driven patient triage and instant video consultations."
    },
    {
      title: "Aether Commerce",
      category: "Luxury Retail",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=2070",
      stats: "2.5s Avg Session Depth",
      stack: ["Shopify Plus", "3D Three.js", "AI Recommender"],
      description: "Immersive 3D shopping experience for a luxury fashion brand, utilizing AI to personalize product journeys."
    },
    {
      title: "Vanguard Logistics",
      category: "Enterprise SaaS",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070",
      stats: "$12M Processed/Mo",
      stack: ["Vue.js", "Python AI", "AWS Lambda"],
      description: "Global logistics command center automating route optimization and fleet management via predictive machine learning."
    },
    {
      title: "Echo Real Estate",
      category: "Property Marketplace",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1073",
      stats: "300% Lead Increase",
      stack: ["Next.js", "Mapbox", "AI Valuation"],
      description: "High-performance property platform with AI-driven valuation models, virtual tour integration, and instant bookings."
    },
    {
      title: "CyberSentinel",
      category: "Cybersecurity Dashboard",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
      stats: "0 Security Breaches",
      stack: ["React", "Rust", "Blockchain"],
      description: "Next-gen security dashboard monitoring threat vectors in real-time using decentralized node architecture."
    }
  ];

  const aiFeatures = [
    { title: "AI Code Generation", desc: "Machine learning writes clean, optimized code that's faster and more efficient than human developers.", icon: Code },
    { title: "Conversion Optimization", desc: "AI continuously tests and optimizes every element to maximize conversions.", icon: Activity },
    { title: "Performance Monitoring", desc: "Real-time AI monitoring detects and fixes performance issues before they impact users.", icon: Monitor },
    { title: "SEO Auto-Optimization", desc: "Built-in AI SEO that automatically optimizes meta tags and structure for rankings.", icon: Search },
    { title: "Threat Detection", desc: "AI security systems monitor for threats and vulnerabilities in real-time.", icon: ShieldCheck },
    { title: "Responsive Adaptation", desc: "AI automatically optimizes your website for every device and screen size.", icon: Smartphone }
  ];

  const timeline = [
    { day: "Day 1", title: "Strategy & Planning", desc: "AI analyzes your business needs and creates optimal website architecture." },
    { day: "Day 3", title: "Design & Prototyping", desc: "AI generates conversion-optimized designs with your brand identity." },
    { day: "Day 7", title: "Development & Coding", desc: "AI writes clean, optimized code with performance and SEO built-in." },
    { day: "Day 12", title: "Testing & Optimization", desc: "Comprehensive testing across devices and performance optimization." },
    { day: "Day 14", title: "Launch & Monitoring", desc: "Site goes live with continuous AI monitoring and optimization." }
  ];

  return (
    <div className="min-h-screen pt-20 bg-brand-black text-white font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up shadow-[0_0_15px_rgba(0,146,226,0.3)]">
             <Globe size={12} /> AI Web Development Revolution
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight uppercase tracking-tight">
            Websites That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600">Convert</span> While You Profit
          </h1>
          
          <h2 className="text-xl md:text-2xl font-light text-gray-300 mb-8 max-w-3xl mx-auto border-l-4 border-brand-orange pl-4 text-left md:text-center md:border-l-0 md:border-t-4 md:pt-4">
            AI-Powered Development That Crushes Competition
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            Deploy lightning-fast websites built with AI precision that convert visitors into customers automatically. 
            While your competitors struggle with slow, outdated sites, your AI-optimized web presence loads instantly, ranks higher, and scales infinitely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(204,85,0,0.3)] hover:shadow-[0_0_50px_rgba(204,85,0,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Book Web Strategy <ArrowRight size={20} />
            </a>
            <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all text-white flex items-center justify-center"
            >
                Meet The Team
            </a>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="bg-[#050505] border-y border-white/10 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-orange/5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
             <h3 className="text-center font-display font-bold text-2xl mb-8 uppercase tracking-widest text-gray-500">Performance That Dominates</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                {[
                    { label: "Avg Load Time", val: "<1.2s", color: "text-green-400" },
                    { label: "Conversion Incr.", val: "347%", color: "text-brand-orange" },
                    { label: "Uptime Guarantee", val: "99.9%", color: "text-brand-blue" },
                    { label: "PageSpeed Score", val: "95+", color: "text-green-400" },
                    { label: "Bounce Rate Red.", val: "73%", color: "text-brand-orange" },
                    { label: "Support Available", val: "24/7", color: "text-brand-blue" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`text-3xl md:text-4xl font-bold font-display ${stat.color} mb-1`}>{stat.val}</div>
                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{stat.label}</div>
                    </div>
                ))}
             </div>
          </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Complete Web Development <span className="text-brand-blue">Arsenal</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Every web service you need to dominate online with AI-powered development that delivers speed, conversions, and performance.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-brand-blue/50 transition-all duration-300 hover:bg-white/10 flex flex-col h-full">
                   <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                     feature.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'
                   }`}>
                      <feature.icon size={28} />
                   </div>
                   <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6">{feature.description}</p>
                   
                   <div className="mt-auto space-y-2">
                       {feature.details.map((detail, dIdx) => (
                           <div key={dIdx} className="flex items-start gap-2 text-xs text-gray-500">
                               <Check size={14} className="text-brand-blue mt-0.5 shrink-0" />
                               {detail}
                           </div>
                       ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* NEW: Robust Portfolio Section */}
      <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Digital <span className="text-brand-orange">Masterpieces</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    We don't just build websites. We architect digital ecosystems that define industry standards.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolio.map((project, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-brand-orange/30 transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden">
                            <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                                    {project.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 relative">
                             {/* Floating Stat - Mobile & Desktop */}
                             <div className="absolute -top-8 right-6 bg-brand-orange text-white w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-center p-1 shadow-xl z-20 group-hover:scale-110 transition-transform border-4 border-[#0a0a0a]">
                                <span className="text-sm leading-none">{project.stats.split(' ')[0]}</span>
                                <span className="text-[8px] uppercase">{project.stats.split(' ').slice(1).join(' ')}</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">{project.title}</h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6 h-12 overflow-hidden">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.stack.map((tech, i) => (
                                    <span key={i} className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-white/5 py-3 rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider group-hover:text-brand-orange">
                                View Case Study <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 text-center">
                <button 
                  onClick={() => onNavigate('portfolio')}
                  className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs flex items-center gap-2 mx-auto"
                >
                    View Full Portfolio Archive <ArrowRight size={14} />
                </button>
            </div>
        </div>
    </section>

      {/* AI That Builds Better */}
      <section className="py-24 bg-black relative">
         <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-orange/10 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="md:w-1/3">
                    <div className="sticky top-24">
                        <div className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4">AI Advantage</div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">AI That Builds <br />Better.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Advanced artificial intelligence that codes, optimizes, and improves your website automatically for maximum performance and conversions without human intervention.
                        </p>
                        <a 
                            href="https://api.orengen.io/widget/groups/coffeedate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors inline-block text-center"
                        >
                            Start Transformation
                        </a>
                    </div>
                </div>
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {aiFeatures.map((item, i) => (
                        <div key={i} className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-brand-orange/30 transition-colors">
                            <item.icon className="text-brand-orange mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-[#080808] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">AI Development vs. The Rest</h2>
                 <p className="text-gray-400">See why smart businesses are abandoning expensive web agencies.</p>
             </div>

             <div className="overflow-x-auto">
                 <div className="min-w-[1000px] bg-[#0f0f0f] rounded-2xl border border-white/10 p-8">
                     {/* Header */}
                     <div className="grid grid-cols-6 gap-4 mb-6 border-b border-white/10 pb-6 text-sm font-bold text-gray-400 uppercase tracking-wider">
                         <div className="col-span-1">Feature</div>
                         <div className="col-span-1 text-brand-orange">OrenGen AI</div>
                         <div className="col-span-1">Agency</div>
                         <div className="col-span-1">Freelancer</div>
                         <div className="col-span-1">In-House</div>
                         <div className="col-span-1">Builders</div>
                     </div>
                     
                     {/* Rows */}
                     {[
                         { feat: "Dev Speed", orengen: "7-14 Days", agency: "6-12 Weeks", free: "4-8 Weeks", house: "8-16 Weeks", build: "1-7 Days" },
                         { feat: "Customization", orengen: "Fully Custom", agency: "Custom", free: "Custom", house: "Custom", build: "Template Based" },
                         { feat: "Investment", orengen: "$3K-15K", agency: "$10K-50K", free: "$5K-20K", house: "$50K-200K", build: "$100-500" },
                         { feat: "Load Speed", orengen: "<1.2s", agency: "2-4s", free: "2-5s", house: "1-3s", build: "3-8s" },
                         { feat: "SEO Opt.", orengen: "AI-Powered", agency: "Professional", free: "Basic", house: "Advanced", build: "Basic" },
                         { feat: "Security", orengen: "Enterprise", agency: "Professional", free: "Basic", house: "Advanced", build: "Basic" },
                         { feat: "Support", orengen: "24/7 AI", agency: "Business Hrs", free: "Limited", house: "Internal", build: "Ticket Sys" },
                     ].map((row, i) => (
                         <div key={i} className="grid grid-cols-6 gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-sm items-center">
                             <div className="font-bold text-white">{row.feat}</div>
                             <div className="font-bold text-brand-orange flex items-center gap-2"><Check size={14} /> {row.orengen}</div>
                             <div className="text-gray-500">{row.agency}</div>
                             <div className="text-gray-500">{row.free}</div>
                             <div className="text-gray-500">{row.house}</div>
                             <div className="text-gray-500">{row.build}</div>
                         </div>
                     ))}
                 </div>
             </div>
         </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 bg-black relative">
          <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Your AI Development Process</h2>
                  <p className="text-gray-400">From concept to launch in record time that never sleeps.</p>
              </div>

              <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-orange via-brand-blue to-transparent md:left-1/2"></div>
                  
                  <div className="space-y-12">
                      {timeline.map((item, index) => (
                          <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                              <div className="ml-16 md:ml-0 md:w-1/2 p-6 bg-[#111] border border-white/10 rounded-2xl hover:border-brand-orange/50 transition-all group">
                                  <div className="text-brand-orange font-bold uppercase text-xs tracking-wider mb-2">{item.day}</div>
                                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-blue transition-colors">{item.title}</h3>
                                  <p className="text-sm text-gray-500">{item.desc}</p>
                              </div>
                              
                              {/* Dot */}
                              <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black border-2 border-brand-orange rounded-full -translate-x-1/2 mt-6 z-10 shadow-[0_0_10px_#CC5500]"></div>
                              
                              <div className="hidden md:block md:w-1/2"></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
               <h2 className="text-3xl font-display font-bold mb-12">Cutting-Edge Technologies</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                   {[
                       { name: "React & Next.js", icon: Code },
                       { name: "WordPress CMS", icon: Layout },
                       { name: "Shopify", icon: ShoppingBag },
                       { name: "Cloud Infra", icon: Database },
                       { name: "Enterprise Sec", icon: Lock },
                       { name: "Analytics", icon: Activity }
                   ].map((tech, i) => (
                       <div key={i} className="p-6 bg-white/5 rounded-xl flex flex-col items-center gap-4 hover:bg-white/10 transition-colors group">
                           <tech.icon className="text-gray-500 group-hover:text-white transition-colors" size={32} />
                           <span className="font-bold text-sm text-gray-400 group-hover:text-brand-orange transition-colors">{tech.name}</span>
                       </div>
                   ))}
               </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-orange/10 border-t border-brand-orange/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                  Stop Losing Customers to <span className="text-red-500">Slow Websites</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Every second of delay costs you customers and revenue. Deploy OrenGen AI Web Development today and launch a website that loads instantly, converts relentlessly, and dominates your competition.
              </p>
              
              <button 
                onClick={() => window.open('https://api.orengen.io/widget/groups/coffeedate', '_blank')}
                className="bg-white text-brand-orange px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors shadow-2xl hover:scale-105 transform duration-300"
              >
                Build Your Web Empire 🌐
              </button>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Websites That Convert</span>
                  <span className="text-brand-orange">•</span>
                  <span>Speed That Dominates</span>
                  <span className="text-brand-orange">•</span>
                  <span>Results Guaranteed</span>
              </div>
          </div>
      </section>
      
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default WebDev;