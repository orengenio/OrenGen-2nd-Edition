import React, { useState } from 'react';
import { 
  Search, Mail, Globe, Share2, Phone, Target, FileText, Users, 
  ArrowRight, Check, TrendingUp, Calculator, DollarSign, BarChart3,
  Zap, PieChart
} from 'lucide-react';
import CtaSection from '../components/CtaSection';

const LeadGen: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  const [leads, setLeads] = useState(100);
  const [convRate, setConvRate] = useState(5);
  const [val, setVal] = useState(1000);

  // Simple calculation logic: Assume AI triples lead volume
  const currentRevenue = leads * (convRate / 100) * val;
  const projectedRevenue = (leads * 4) * (convRate / 100) * val; // 4x leads
  const additionalRevenue = projectedRevenue - currentRevenue;

  const methods = [
    {
      title: "AI Prospect Research",
      desc: "Advanced AI algorithms scan millions of data points to identify ideal prospects that match your perfect customer profile.",
      stats: "340% increase in qualified leads",
      icon: Search,
      color: "blue"
    },
    {
      title: "Automated Email Outreach",
      desc: "Personalized email campaigns that reach thousands of prospects with AI-crafted messages that feel human.",
      stats: "67% open rates, 23% response rates",
      icon: Mail,
      color: "orange"
    },
    {
      title: "Website Lead Magnets",
      desc: "High-converting landing pages and lead magnets that capture visitor information and automatically qualify prospects.",
      stats: "156% increase in website conversions",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Social Media Automation",
      desc: "AI-powered social selling that engages prospects across LinkedIn, Facebook, and Twitter with personalized outreach.",
      stats: "245% increase in social leads",
      icon: Share2,
      color: "orange"
    },
    {
      title: "Cold Calling Automation",
      desc: "AI agents that make thousands of cold calls simultaneously, qualify prospects, and book appointments.",
      stats: "89% reduction in cost per lead",
      icon: Phone,
      color: "blue"
    },
    {
      title: "Paid Advertising Optimization",
      desc: "AI-optimized ad campaigns across Google & Social that automatically adjust for maximum lead generation ROI.",
      stats: "178% improvement in cost per lead",
      icon: Target,
      color: "orange"
    },
    {
      title: "Content Marketing Automation",
      desc: "AI-generated content that attracts prospects, establishes authority, and converts readers into qualified leads.",
      stats: "234% increase in organic leads",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Referral Program Automation",
      desc: "Automated referral systems that turn your existing customers into a lead generation machine.",
      stats: "167% increase in referral leads",
      icon: Users,
      color: "orange"
    }
  ];

  const process = [
    { step: 1, title: "AI Prospect Discovery", text: "AI scans millions of data points to identify companies matching your ICP with 94% accuracy." },
    { step: 2, title: "Intent Signal Analysis", text: "Algorithms analyze buying signals and behavior to determine when prospects are ready to purchase." },
    { step: 3, title: "Multi-Channel Outreach", text: "Simultaneous outreach via email, phone, and social with personalized messages that convert." },
    { step: 4, title: "Lead Qualification", text: "Leads are automatically qualified using BANT criteria and scored based on conversion probability." },
    { step: 5, title: "Automated Nurturing", text: "Qualified leads enter AI sequences that provide value and build trust automatically." },
    { step: 6, title: "Sales-Ready Handoff", text: "Ready-to-buy leads are scheduled for sales calls with pre-populated buying intelligence." }
  ];

  const testimonials = [
      { name: "Jennifer Martinez", role: "CEO, CloudTech Solutions", quote: "Our lead flow went from 30 per month to over 250 qualified prospects. The AI doesn't just find leads — it finds buyers.", stat: "847% Increase" },
      { name: "Thomas Park", role: "VP Sales, Industrial Innovations", quote: "We replaced our expensive marketing agency with OrenGen AI and tripled our lead volume while cutting costs by 60%.", stat: "$2.3M Pipeline" },
      { name: "Lisa Chen", role: "Founder, FinTech Dynamics", quote: "The AI lead generation paid for itself in the first month. By month three, we had generated over $400K in new revenue.", stat: "340% ROI" }
  ];

  return (
    <div className="min-h-screen pt-20 bg-brand-black text-white font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/10 to-transparent pointer-events-none"></div>
             <div className="absolute -left-20 top-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
             <Target size={12} /> AI-Powered Lead Generation
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight uppercase">
            Leads That Turn Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Customers</span> On Autopilot
          </h1>
          
          <h2 className="text-xl md:text-2xl font-light text-gray-300 mb-8 max-w-3xl mx-auto">
            AI Systems That Find, Qualify, and Convert
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            Deploy AI-powered lead generation systems that identify perfect prospects, capture their information, 
            qualify their intent, and nurture them through your sales funnel — automatically. 
            While your competitors chase dead leads, our AI finds customers ready to buy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(204,85,0,0.3)] hover:shadow-[0_0_50px_rgba(204,85,0,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Book Lead Strategy <ArrowRight size={20} />
            </a>
            <a href="#calculator" className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all text-white flex items-center justify-center gap-2">
                <Calculator size={20} /> Calculate ROI
            </a>
          </div>
        </div>
      </section>

      {/* Methods Grid */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <div className="text-brand-orange font-bold uppercase text-sm mb-2">Generating 50,000+ Qualified Leads Monthly</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">8 Proven Lead Generation Methods</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                 Our AI-powered system uses multiple channels and strategies to identify, attract, and capture high-quality leads that convert.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {methods.map((method, idx) => (
                <div key={idx} className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-orange/50 transition-all duration-300 hover:bg-white/10 flex flex-col h-full hover:-translate-y-1">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                     method.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'
                   }`}>
                      <method.icon size={24} />
                   </div>
                   <h3 className="text-lg font-bold mb-3 group-hover:text-white transition-colors">{method.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">{method.desc}</p>
                   <div className="pt-4 border-t border-white/5">
                       <div className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                           <TrendingUp size={12} /> {method.stats}
                       </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-24 bg-black relative">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Our AI Lead Generation Process</h2>
                  <p className="text-gray-400">See how our AI system automatically finds, qualifies, and converts prospects.</p>
              </div>

              <div className="relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden lg:block absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-brand-orange/20 via-brand-orange to-brand-orange/20 rounded-full"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                      {process.map((step, i) => (
                          <div key={i} className="relative flex flex-col items-center text-center group">
                              <div className="w-16 h-16 bg-[#111] border-4 border-brand-black rounded-full flex items-center justify-center text-2xl font-bold text-white relative z-10 group-hover:bg-brand-orange transition-colors duration-300 shadow-[0_0_20px_rgba(204,85,0,0.3)] mb-6">
                                  {step.step}
                              </div>
                              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.text}</p>
                              
                              {i < process.length - 1 && (
                                  <div className="lg:hidden absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-brand-orange/50">
                                      ↓
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-24 bg-[#080808] border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-4xl font-display font-bold mb-6">Calculate Your <br /><span className="text-brand-orange">Lead Generation ROI</span></h2>
                      <p className="text-gray-400 text-lg mb-8">
                          See how much revenue our AI lead generation system could generate for your business. The results will shock you.
                      </p>
                      
                      <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Monthly Leads</label>
                              <input 
                                type="number" 
                                value={leads} 
                                onChange={(e) => setLeads(Number(e.target.value))}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brand-orange focus:outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Conversion Rate (%)</label>
                              <input 
                                type="number" 
                                value={convRate} 
                                onChange={(e) => setConvRate(Number(e.target.value))}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brand-orange focus:outline-none"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Average Customer Value ($)</label>
                              <input 
                                type="number" 
                                value={val} 
                                onChange={(e) => setVal(Number(e.target.value))}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brand-orange focus:outline-none"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-orange to-red-600 rounded-3xl p-1 shadow-[0_0_50px_rgba(204,85,0,0.3)]">
                      <div className="bg-black rounded-[20px] p-8 md:p-12 text-center h-full flex flex-col justify-center">
                          <div className="text-gray-400 font-bold uppercase tracking-widest mb-4">Additional Monthly Revenue</div>
                          <div className="text-5xl md:text-7xl font-display font-bold text-white mb-2">
                              ${additionalRevenue.toLocaleString()}
                          </div>
                          <div className="text-green-400 font-bold text-sm mb-8 flex items-center justify-center gap-2">
                              <TrendingUp size={16} /> Based on 4x Lead Volume
                          </div>
                          
                          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
                              With OrenGen AI Lead Generation, you could generate <span className="text-white font-bold">{leads * 3} additional</span> qualified leads monthly.
                          </p>

                          <a 
                            href="https://api.orengen.io/widget/groups/coffeedate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-brand-orange font-bold py-4 px-8 rounded-full hover:bg-gray-200 transition-colors w-full inline-block text-center"
                          >
                              Schedule Revenue Call
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-[#050505]">
         <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Why OrenGen Crushes Traditional Lead Gen</h2>
                 <p className="text-gray-400">Smart businesses are abandoning expensive agencies for AI.</p>
             </div>

             <div className="overflow-x-auto">
                 <div className="min-w-[1000px] bg-[#0a0a0a] rounded-2xl border border-white/10 p-8">
                     <div className="grid grid-cols-7 gap-4 mb-6 border-b border-white/10 pb-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                         <div className="col-span-1 text-left">Feature</div>
                         <div className="col-span-1 text-brand-orange">OrenGen AI</div>
                         <div className="col-span-1">Agency</div>
                         <div className="col-span-1">In-House</div>
                         <div className="col-span-1">Freelancer</div>
                         <div className="col-span-1">HubSpot</div>
                         <div className="col-span-1">Salesforce</div>
                     </div>
                     
                     {[
                         { feat: "24/7 Operation", orengen: "Always Working", agency: "Business Hrs", house: "Limited", free: "Time Zones", hub: "Manual", sales: "Manual" },
                         { feat: "Setup Time", orengen: "24 Hours", agency: "30-60 Days", house: "60-90 Days", free: "1-2 Wks", hub: "2-4 Wks", sales: "1-3 Mos" },
                         { feat: "Monthly Cost", orengen: "$497", agency: "$5,000+", house: "$15,000+", free: "$2,000+", hub: "$3,200+", sales: "$1,250+" },
                         { feat: "Lead Volume", orengen: "Unlimited", agency: "Limited", house: "Capacity", free: "Limits", hub: "Plan Dept", sales: "License" },
                         { feat: "Lead Quality", orengen: "AI-Qualified", agency: "Varies", house: "Training", free: "Inconsistent", hub: "Manual", sales: "Rules" },
                         { feat: "Real-Time Opt", orengen: "AI-Powered", agency: "Monthly", house: "Manual", free: "Rare", hub: "Basic", sales: "Manual" },
                     ].map((row, i) => (
                         <div key={i} className="grid grid-cols-7 gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-sm items-center text-center">
                             <div className="font-bold text-white text-left">{row.feat}</div>
                             <div className="font-bold text-brand-orange flex items-center justify-center gap-1"><Check size={14} /> {row.orengen}</div>
                             <div className="text-gray-500">{row.agency}</div>
                             <div className="text-gray-500">{row.house}</div>
                             <div className="text-gray-500">{row.free}</div>
                             <div className="text-gray-500">{row.hub}</div>
                             <div className="text-gray-500">{row.sales}</div>
                         </div>
                     ))}
                 </div>
             </div>
         </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-display font-bold text-center mb-16">Real Results From Real Businesses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t, i) => (
                      <div key={i} className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-brand-orange/30 transition-all flex flex-col">
                          <div className="text-4xl font-bold text-white mb-2">{t.stat}</div>
                          <div className="text-xs text-brand-orange font-bold uppercase tracking-widest mb-6">Key Performance Indicator</div>
                          <p className="text-gray-400 italic mb-6 flex-grow">"{t.quote}"</p>
                          <div className="border-t border-white/10 pt-4">
                              <div className="font-bold text-white">{t.name}</div>
                              <div className="text-sm text-gray-500">{t.role}</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand-orange/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                  Transform Your <br />Lead Generation Today
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Stop wasting money on dead leads and expensive agencies. Deploy AI-powered lead generation that works 24/7 to fill your pipeline.
              </p>
              
              <a 
                href="https://api.orengen.io/widget/groups/coffeedate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-brand-orange px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors shadow-2xl hover:scale-105 transform duration-300 inline-block"
              >
                Book Lead Consultation 🎯
              </a>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>AI Lead Gen</span>
                  <span className="text-brand-orange">•</span>
                  <span>24/7 Prospecting</span>
                  <span className="text-brand-orange">•</span>
                  <span>Unlimited Scalability</span>
              </div>
          </div>
      </section>
      
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default LeadGen;