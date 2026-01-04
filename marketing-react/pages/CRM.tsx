import React, { useState } from 'react';
import { 
  Phone, Globe, CreditCard, MessageSquare, Zap, Rocket, 
  Check, ArrowRight, ShieldCheck, Layout, Users, Briefcase
} from 'lucide-react';
import CtaSection from '../components/CtaSection';

const CRM: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const features = [
    {
      title: "AI-Powered Lead Capture",
      description: "Missed a call from a client? Our missed call text back captures leads for you, even when you're busy. Never lose another opportunity with intelligent automation that works 24/7.",
      icon: Phone,
      color: "orange"
    },
    {
      title: "Stunning Website Builder",
      description: "Create stunning websites & turn clicks into clients. Our AI-powered design tools help you build professional, conversion-optimized sites that grow your business automatically.",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Secure Payment Processing",
      description: "Need a secure way to request and receive payments? Send quick invoices to clients via text or email. We integrate with Stripe and PayPal for secure payments straight to your bank account.",
      icon: CreditCard,
      color: "orange"
    },
    {
      title: "Unified Communication Hub",
      description: "Tired of juggling different platforms to talk with clients? Reply to Facebook messages, Instagram DMs, SMS, WhatsApp conversations, and Emails from one integrated inbox.",
      icon: MessageSquare,
      color: "blue"
    },
    {
      title: "Intelligent Automation",
      description: "Sending appointment reminders, getting more Google reviews & more. Our workflow builder eliminates tedious manual tasks and takes the heavy lifting off your shoulders.",
      icon: Zap,
      color: "orange"
    },
    {
      title: "AI Virtual Employees",
      description: "Deploy AI call agents that talk, sell, and support customers around the clock. Our virtual employees handle thousands of conversations simultaneously with human-like intelligence.",
      icon: Rocket,
      color: "blue"
    }
  ];

  const plans = [
    {
      name: "Standard Plan",
      description: "Perfect for small businesses",
      monthly: 99,
      yearly: 999,
      features: [
        "10-Day Trial for $10",
        "$10 in Complimentary Credits",
        "2 Way Text & Email Conversation",
        "GMB Messaging",
        "Facebook Messenger",
        "Missed Call Text Back",
        "Text To Pay",
        "Basic Support"
      ],
      popular: false
    },
    {
      name: "Professional Plan",
      description: "Advanced tools for growing teams",
      monthly: 149,
      yearly: 1499,
      features: [
        "All features from Standard Plan",
        "$25 in Complimentary Credits",
        "CRM Integration",
        "Calendar Management",
        "Opportunity Tracking",
        "Email Marketing",
        "Advanced Analytics",
        "Priority Support"
      ],
      popular: false
    },
    {
      name: "Premium Plan",
      description: "For large-scale organizations",
      monthly: 249,
      yearly: 2499,
      features: [
        "All features from Pro Plan",
        "$100 in Complimentary Credits",
        "Website Builder",
        "Social Media Planner",
        "Sales Funnels",
        "Marketing Campaigns",
        "Automated Triggers",
        "SMS & Email Templates",
        "Custom Workflows",
        "Unlimited Users",
        "Dedicated Support"
      ],
      popular: true
    }
  ];

  const integrations = [
    { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "PayPal", url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    { name: "Facebook", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
    { name: "Instagram", url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" },
    { name: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Salesforce", url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "HubSpot", url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" }
  ];

  return (
    <div className="min-h-screen pt-20 bg-black text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
             🤖 State-of-the-Art AI Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            AI INFINITE <span className="text-brand-orange">CRM</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-8">
            The Only Platform You'll Ever Need
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            Replace all other platforms and tools with one AI-powered software that does it all. 
            As a business owner with lots to do, we're here to make your life easier.
          </p>
          <a 
            href="https://api.orengen.io/widget/groups/coffeedate"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(204,85,0,0.3)] hover:shadow-[0_0_50px_rgba(204,85,0,0.5)] transform hover:-translate-y-1 inline-block"
          >
            Book CRM Demo
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-display font-bold mb-4">Built for Business Domination</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Never let a prospect slip through the cracks again with our intelligent automation.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-brand-orange/50 transition-all duration-300 hover:bg-white/10">
                   <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                     feature.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/20 text-brand-blue'
                   }`}>
                      <feature.icon size={28} />
                   </div>
                   <h3 className="text-xl font-bold mb-4 group-hover:text-brand-orange transition-colors">{feature.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Seamlessly Connects With Your Favorite Tools</h2>
            <p className="text-gray-400 mb-12">Integrate with 3000+ platforms and eliminate the need to switch between multiple systems</p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {integrations.map((logo, i) => (
                    <img key={i} src={logo.url} alt={logo.name} className="h-8 md:h-12 w-auto object-contain invert" />
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#050505] relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-5xl font-display font-bold text-brand-orange mb-6">CRM PRICING</h2>
               <p className="text-white text-lg max-w-3xl mx-auto mb-8">
                 Select any plan. Try it for 10 days for $10. No hidden fees. No long-term contracts.
               </p>
               
               {/* Toggle */}
               <div className="flex items-center justify-center gap-4">
                  <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                  <button 
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="w-16 h-8 bg-brand-orange rounded-full p-1 relative transition-colors duration-300 shadow-inner"
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}></div>
                  </button>
                  <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
                    Annual <span className="bg-brand-blue text-white text-[10px] px-2 py-0.5 rounded-full">Save 17%</span>
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
               {plans.map((plan, i) => (
                 <div 
                    key={i} 
                    className={`relative bg-[#0F0F0F] rounded-2xl border p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 ${
                      plan.popular 
                        ? 'border-brand-orange shadow-[0_0_30px_rgba(204,85,0,0.15)] scale-105 z-10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                 >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-6">
                       <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                       <p className="text-sm text-gray-400">{plan.description}</p>
                    </div>

                    <div className="mb-8">
                       <div className="flex items-end gap-1">
                          <span className="text-4xl font-bold text-white">${isAnnual ? plan.yearly : plan.monthly}</span>
                          <span className="text-gray-500 mb-1">/{isAnnual ? 'year' : 'month'}</span>
                       </div>
                       {isAnnual && (
                         <div className="text-brand-orange text-xs font-bold mt-2">
                           ${plan.yearly} yearly (17% off)
                         </div>
                       )}
                    </div>

                    <div className="flex-grow space-y-4 mb-8">
                       {plan.features.map((feat, idx) => (
                         <div key={idx} className="flex items-start gap-3">
                            <Check size={16} className="text-brand-orange mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-300">{feat}</span>
                         </div>
                       ))}
                    </div>

                    <a 
                      href="https://api.orengen.io/widget/groups/coffeedate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                        plan.popular 
                          ? 'bg-white text-black hover:bg-gray-200' 
                          : 'bg-brand-orange text-white hover:bg-orange-600'
                      }`}
                    >
                      Book Demo & Trial
                    </a>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white/5 border-t border-white/10 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to Automate Your Success?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of elite businesses who trust OrenGen to catapult their efficiency and growth with AI-infused digital solutions. Transform your business into a profit weapon today.
            </p>
            <div className="flex flex-col items-center gap-6">
                <a 
                  href="https://api.orengen.io/widget/groups/coffeedate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-brand-orange px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors shadow-2xl flex items-center gap-3"
                >
                  Start Your Transformation 🎯
                </a>
                <p className="text-sm text-gray-400 font-medium">
                   Get your 10 DAY TRIAL for $10 | No hidden fees. No long-term contracts.
                </p>
            </div>
         </div>
      </section>

      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default CRM;