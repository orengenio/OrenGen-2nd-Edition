import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, Lock, AlertCircle, Scale, 
  MessageSquare, UserCheck, Zap, CreditCard, 
  Copyright, Globe, HelpCircle, ChevronRight,
  BookOpen, Terminal, ShieldAlert, Gavel, X
} from 'lucide-react';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('terms');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const toc = [
    "Acceptance of Terms", "Service Description", "AI Communications Policy",
    "User Account & Registration", "Acceptable Use Policy", "Payment Terms",
    "Intellectual Property Rights", "Privacy & Data Protection", "Service Availability",
    "Limitation of Liability", "Indemnification", "Termination",
    "Dispute Resolution", "Governing Law", "Changes to Terms", "Contact Information"
  ];

  const content = {
    terms: {
      title: "Terms of Service",
      icon: FileText,
      subtitle: "Effective Date: January 1, 2025",
      intro: "Welcome to OrenGen Worldwide LLC. These Terms of Service govern your use of our AI-powered digital solutions and services. By accessing or using any OrenGen service, you agree to be bound by these terms.",
      sections: [
        {
          id: 1,
          title: "Acceptance of Terms",
          icon: UserCheck,
          body: "By using any OrenGen service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. Your continued use of our services constitutes acceptance of these terms and any future modifications. If you do not agree to these terms, you must immediately cease using all OrenGen services."
        },
        {
          id: 2,
          title: "Service Description",
          icon: Zap,
          body: "OrenGen Worldwide LLC provides AI-powered digital solutions including: AI Infinite CRM, AI Agents & Chatbots, AI Call Center, Bulk Email Validation, Marketing Automation, Website Development, SEO Services, SMTP Systems, Digital Downloads, Consulting Services, and Custom AI Development."
        },
        {
          id: 3,
          title: "AI Communications Policy",
          icon: MessageSquare,
          highlight: "🤖 100% AI-Powered Communications",
          body: "All communications from OrenGen Worldwide are powered by artificial intelligence systems. By using our services, you automatically consent to receive AI-generated communications including customer support, sales, marketing, and technical notifications. You may opt out at any time by contacting support@orengen.io."
        },
        {
          id: 4,
          title: "User Account & Registration",
          icon: Lock,
          body: "You must be at least 18 years old to create an account and provide accurate registration information. You are responsible for maintaining account security. OrenGen reserves the right to verify account information and may require additional documentation for business verification and compliance."
        },
        {
          id: 5,
          title: "Acceptable Use Policy",
          icon: ShieldAlert,
          body: "Permitted for legitimate business, educational, and personal use. Strictly prohibited activities include illegal fraud, spam, hacking, reverse engineering, distributing malware, violating IP rights, harassment, and adult content."
        },
        {
          id: 6,
          title: "Payment Terms",
          icon: CreditCard,
          highlight: "No Refund Policy: All Sales are Final.",
          body: "All fees are due in advance. Subscriptions auto-renew. Overdue payments incur late fees of 1.5% per month. OrenGen does not offer refunds except where legally required under applicable rights of rescission."
        },
        {
          id: 7,
          title: "Intellectual Property Rights",
          icon: Copyright,
          body: "All software, algorithms, trademarks ('OrenGen', 'When Digital Met AI'), and training data are protected property of OrenGen Worldwide LLC. You grant us a non-exclusive license to process your content solely for providing services."
        },
        {
          id: 8,
          title: "Privacy & Data Protection",
          icon: Shield,
          body: "We process data in accordance with applicable privacy laws and implement enterprise-grade security. AI systems may use anonymized data for improvements. Full details are in our Privacy Policy."
        },
        {
          id: 9,
          title: "Service Availability & Performance",
          icon: Globe,
          body: "We target 99.9% monthly uptime. Scheduled maintenance requires 24-hour notice. We reserve the right to modify or discontinue services with reasonable notice."
        },
        {
          id: 10,
          title: "Limitation of Liability",
          icon: AlertCircle,
          body: "OrenGen's total liability is limited to amounts paid in the 12 months prior to a claim. We are not liable for indirect, incidental, or consequential damages. Services are provided 'as is'."
        },
        {
          id: 11,
          title: "Indemnification",
          icon: Scale,
          body: "You agree to indemnify OrenGen from claims arising from your violation of these terms, your use of services in violation of laws, or any negligent acts."
        },
        {
          id: 12,
          title: "Termination",
          icon: X,
          body: "Users may cancel at any time (no refunds). OrenGen may terminate for violations of terms, non-payment, or illegal activities."
        },
        {
          id: 13,
          title: "Dispute Resolution",
          icon: Gavel,
          body: "Parties agree to attempt good-faith informal resolution. Unresolved disputes will be handled through binding arbitration under AAA rules, except IP and small claims."
        },
        {
          id: 14,
          title: "Governing Law",
          icon: BuildingOpenIcon,
          body: "Governed by the laws of the State of Texas. Legal actions must be brought in the courts of Fort Worth, Texas."
        },
        {
          id: 15,
          title: "Changes to Terms",
          icon: Zap,
          body: "OrenGen reserves the right to modify terms at any time. Changes are effective immediately upon posting. 30-day notice for material changes."
        },
        {
          id: 16,
          title: "Contact Information",
          icon: HelpCircle,
          body: "Legal: legal@orengen.io | Support: support@orengen.io. All communications may be handled by AI systems."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: Lock,
      subtitle: "Effective Date: January 1, 2025",
      intro: "At OrenGen, your privacy is a core priority. This policy outlines how we handle and protect your data across our AI ecosystem.",
      sections: [
        {
          id: 1,
          title: "Data We Collect",
          icon: DatabaseIcon,
          body: "We collect account information, communication history, and usage data to provide and improve our services. We do not sell your personal information."
        },
        {
          id: 2,
          title: "AI Data Usage",
          icon: BotIcon,
          body: "Our AI systems process data to personalize experiences. Anonymized data may be used to train models for global performance improvements."
        }
      ]
    }
  };

  // Internal icons
  function DatabaseIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>; }
  function BotIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>; }
  function BuildingOpenIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M3 20V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16"/><rect width="4" height="4" x="7" y="12" rx="1"/><rect width="4" height="4" x="13" y="12" rx="1"/></svg>; }

  // @ts-ignore
  const currentContent = content[activeTab] || content.terms;

  return (
    <div className="min-h-screen pt-20 bg-brand-black text-white selection:bg-brand-orange selection:text-white">
      
      {/* Dynamic Header */}
      <section className="relative py-24 bg-[#050505] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/20 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
             <div className="p-4 bg-brand-orange/10 rounded-2xl border border-brand-orange/20 animate-orb-breathe">
                <currentContent.icon size={48} className="text-brand-orange" />
             </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tight mb-4">
             {currentContent.title}
          </h1>
          <p className="text-brand-orange font-bold uppercase tracking-[0.2em] text-sm mb-6">{currentContent.subtitle}</p>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">{currentContent.intro}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-8">
            
            {/* Tab Selection */}
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-2">Legal Documents</div>
                {Object.keys(content).map((key) => {
                    // @ts-ignore
                    const item = content[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${
                                activeTab === key 
                                ? 'bg-brand-orange border-brand-orange text-white shadow-[0_0_20px_rgba(204,85,0,0.3)]' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                {item.title}
                            </div>
                            <ChevronRight size={16} className={activeTab === key ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    )
                })}
            </div>

            {/* Table of Contents - Only for Terms */}
            {activeTab === 'terms' && (
                <div className="hidden lg:block bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-6">
                        <BookOpen size={14} className="text-brand-orange" /> Table of Contents
                    </h3>
                    <ul className="space-y-4">
                        {toc.map((item, i) => (
                            <li key={i}>
                                <a 
                                    href={`#section-${i+1}`} 
                                    className="text-[11px] text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-2"
                                >
                                    <span className="text-brand-orange font-mono font-bold w-4">{i+1}</span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Support Card */}
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-3xl p-6">
                <h4 className="font-bold text-sm mb-2 text-white">Need Clarification?</h4>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">Our legal team is available for any questions regarding our AI implementation and data policies.</p>
                <a href="mailto:legal@orengen.io" className="text-brand-blue font-bold text-xs hover:underline">legal@orengen.io</a>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-12">
            
            {/* TOC Grid (Mobile only) */}
            {activeTab === 'terms' && (
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 mb-12">
                    <h3 className="col-span-full font-bold text-sm mb-2">Jump to Section</h3>
                    {toc.map((item, i) => (
                        <a key={i} href={`#section-${i+1}`} className="text-xs text-gray-400 hover:text-brand-orange">
                            {i+1}. {item}
                        </a>
                    ))}
                </div>
            )}

            {/* Detailed Sections */}
            <div className="space-y-12">
                {currentContent.sections?.map((section: any) => (
                    <section 
                        key={section.id} 
                        id={`section-${section.id}`} 
                        className="group bg-[#080808] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-brand-orange/20 transition-all scroll-mt-24"
                    >
                        <div className="flex items-start gap-6 mb-8">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-orange border border-white/10 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                                <section.icon size={24} />
                             </div>
                             <div>
                                <div className="text-brand-orange font-mono font-bold text-sm mb-1">{section.id.toString().padStart(2, '0')}</div>
                                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">{section.title}</h2>
                             </div>
                        </div>

                        {section.highlight && (
                            <div className="mb-6 bg-brand-orange/10 border border-brand-orange/20 p-5 rounded-2xl">
                                <span className="font-bold text-brand-orange text-sm md:text-base">{section.highlight}</span>
                            </div>
                        )}

                        <p className="text-gray-400 leading-loose text-base md:text-lg font-light">
                            {section.body}
                        </p>
                    </section>
                ))}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Legal;