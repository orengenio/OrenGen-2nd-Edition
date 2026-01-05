import React from 'react';
import { ArrowRight, CheckCircle, Clock, Shield, Zap, TrendingUp, Globe, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageLayout: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800">
        {children}
      </div>
    </div>
  </div>
);

export const OurStory: React.FC = () => (
  <PageLayout title="Our Story" subtitle="Pioneering the Future of Email Identity">
    <div className="prose prose-xl prose-slate dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-8">
      <p>
        BIMI Forge was born from a simple frustration: <strong>Email authentication is too hard.</strong>
      </p>
      
      <p>
        In the early 2020s, as BIMI (Brand Indicators for Message Identification) began to gain traction, businesses faced a massive technical hurdle. The requirement for SVG Tiny 1.2 Portable/Secure profiles meant that standard designers using Adobe Illustrator or Canva were producing invalid files.
      </p>
      
      <div className="bg-brand-orange/5 dark:bg-brand-orange/10 border-l-4 border-brand-orange p-8 my-10 rounded-r-xl">
        <p className="italic text-gray-800 dark:text-gray-100 font-medium mb-6 text-2xl leading-normal">
          "For us personally, becoming BIMI compliant was so tough it took almost 3 months to get it right when we first started. We were technical experts, and it was still a nightmare. The technical barriers were absurd for the average business owner."
        </p>
        <p className="text-brand-blue dark:text-white font-bold text-lg">
           We made it our mission to take the sting out of increasing inbox credibility for other businesses.
        </p>
      </div>

      <p>
        Marketing teams were stuck. IT departments were confused. Brands were missing out on the coveted blue checkmark simply because the file format was so restrictive.
      </p>

      <p>
        OrenGen Worldwide, a leader in digital infrastructure, assembled a team of vector graphic engineers and email deliverability experts. Our goal was to create a "Black Box" engine—drop any image in, get a compliant SVG out.
      </p>
      <p>
        Today, BIMI Forge is the gold standard for automated BIMI compliance, trusted by thousands of domains worldwide to secure their brand identity in the inbox.
      </p>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4">
        <div>
            <p className="font-extrabold text-gray-900 dark:text-white text-2xl font-serif">Andre Mandel</p>
            <p className="text-brand-orange font-bold uppercase tracking-widest text-sm">CEO, OrenGen Worldwide LLC</p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export const InTheNews: React.FC = () => {
  const newsItems = [
    { 
      source: "Global Tech Wire", 
      date: "Dec 25, 2025", 
      title: "OrenGen Worldwide Unveils BIMI Forge: A Christmas Miracle for Email Security", 
      desc: "PRESS RELEASE: Breaking barriers in digital identity, OrenGen Worldwide announces the immediate availability of BIMI Forge, the world's first fully automated SVG Tiny 1.2 generator. Industry analysts are calling it 'the missing link' in DMARC adoption, predicting a 400% increase in VMC applications within Q1 2026.",
      slug: "orengen-makes-history-christmas-2025"
    },
    { 
      source: "TechCrunch", 
      date: "Dec 28, 2025", 
      title: "The End of Email Impersonation? OrenGen's AI Engine Solves the SVG Problem", 
      desc: "How a Texas-based startup's new AI engine is democratizing email authentication for small businesses. 'We wanted to give business owners something they actually needed,' says CEO Andre Mandel. 'The blue checkmark isn't just vanity; it's trust.'",
      slug: "svg-tiny-ps-technical-analysis"
    },
    { 
      source: "Forbes", 
      date: "Jan 04, 2026", 
      title: "Why The Blue Checkmark Matters for ROI: Insights from BIMI Forge", 
      desc: "Featuring exclusive data from BIMI Forge's launch week, demonstrating a direct correlation between VMC implementation and a 22% uplift in open rates for transactional email.",
      slug: "bimi-implementation-guide-2026"
    }
  ];

  return (
    <PageLayout title="In The News" subtitle="BIMI Forge making headlines">
      <div className="space-y-12">
        {newsItems.map((news, i) => (
          <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-10 last:border-0 last:pb-0 group">
            <div className="flex items-center gap-2 mb-3">
               <span className="text-xs font-bold text-white bg-brand-orange px-2 py-0.5 rounded uppercase tracking-wider">{news.source}</span>
               <span className="text-xs font-medium text-gray-400">• {news.date}</span>
            </div>
            <Link to={`/blog/${news.slug}`} className="block">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors leading-tight">
                {news.title}
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">{news.desc}</p>
            <div>
               <Link to={`/blog/${news.slug}`} className="inline-flex text-sm font-bold text-brand-blue dark:text-blue-400 items-center gap-1 hover:gap-2 transition-all">
                  Read Full Article <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export const WhyChooseUs: React.FC = () => (
  <PageLayout title="Why Choose BIMI Forge?" subtitle="The Enterprise Standard for Brand Indicators">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { icon: Zap, title: "Instant Conversion", desc: "No manual coding. No waiting. Our AI engine processes files in milliseconds." },
        { icon: Shield, title: "100% Compliance Guarantee", desc: "We guarantee our output meets the strict RFC specifications for SVG Tiny 1.2." },
        { icon: Globe, title: "Universal Compatibility", desc: "Works with Gmail, Apple Mail, Yahoo, and Fastmail out of the box." },
        { icon: TrendingUp, title: "ROI Focused", desc: "Our users see an average 20% increase in open rates after implementation." }
      ].map((item, i) => (
        <div key={i} className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl">
          <item.icon className="w-10 h-10 text-brand-orange mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 text-center">
      <Link to="/workspace" className="inline-flex items-center px-8 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">
        Start Forging Now <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  </PageLayout>
);

export const BimiHistory: React.FC = () => (
  <PageLayout title="History of BIMI" subtitle="The Evolution of Inbox Identity">
    <div className="relative border-l-4 border-brand-blue/20 ml-4 md:ml-8 space-y-12 py-4">
      {[
        { year: "2016", title: "The Concept", desc: "The BIMI Group is formed by MailChimp, SendGrid, LinkedIn, and Validity to create a standard for logo display." },
        { year: "2019", title: "Yahoo Pilot", desc: "Yahoo! Mail begins a beta pilot for BIMI, showing logos for select authenticated senders." },
        { year: "2020", title: "VMC Introduction", desc: "Entrust and DigiCert issue the first Verified Mark Certificates, adding a layer of trademark verification." },
        { year: "2021", title: "Gmail Adoption", desc: "Google announces official support for BIMI in Gmail, driving massive industry adoption." },
        { year: "2023", title: "The Blue Checkmark", desc: "Gmail expands BIMI to include a blue verified checkmark for senders with VMCs." },
        { year: "Dec 25, 2025", title: "BIMI Forge Launch", desc: "OrenGen launches BIMI Forge, the first automated platform to leverage the playing field, allowing any business to generate compliant assets instantly without technical debt.", highlight: true }
      ].map((event, i) => (
        <div key={i} className="relative pl-8 md:pl-12">
          <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 ${event.highlight ? 'bg-brand-orange border-brand-orange animate-pulse' : 'bg-white border-brand-blue'}`}></div>
          <span className={`inline-block px-3 py-1 rounded text-sm font-bold mb-2 ${event.highlight ? 'bg-brand-orange text-white' : 'bg-brand-blue/10 text-brand-blue'}`}>{event.year}</span>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{event.desc}</p>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const VmcCertification: React.FC = () => (
  <PageLayout title="VMC Certification" subtitle="The Gold Standard of Email Trust">
    <div className="space-y-12">
      
      {/* What is it */}
      <div className="bg-brand-blue/5 dark:bg-brand-blue/10 rounded-2xl p-8 border border-brand-blue/10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
          <Award className="w-8 h-8 text-brand-orange" /> What is a VMC?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          A Verified Mark Certificate (VMC) is a digital certificate issued by a Certificate Authority (like DigiCert or Entrust) that proves <strong>legal ownership</strong> of your logo. It is the bridge between your trademark and your email headers.
        </p>
      </div>

      {/* The Process Infographic */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">The Path to Certification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-t-4 border-gray-400 shadow-lg relative">
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center font-bold text-white">1</div>
            <h4 className="font-bold text-lg mb-2">Trademark</h4>
            <p className="text-sm text-gray-500">You must have a registered trademark with a recognized IP office (USPTO, EUIPO, etc.).</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-t-4 border-brand-blue shadow-lg relative">
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center font-bold text-white">2</div>
            <h4 className="font-bold text-lg mb-2">DMARC Enforcement</h4>
            <p className="text-sm text-gray-500">Your domain must be at <code>p=quarantine</code> or <code>p=reject</code>.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border-t-4 border-brand-orange shadow-lg relative">
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center font-bold text-white">3</div>
            <h4 className="font-bold text-lg mb-2">Verification</h4>
            <p className="text-sm text-gray-500">A Certificate Authority verifies your identity (can take 1-3 weeks).</p>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 rounded-2xl p-8 text-white">
        <div>
          <h3 className="text-2xl font-bold mb-2">The Investment</h3>
          <p className="text-gray-400 mb-4">VMCs are an enterprise trust signal. The cost reflects the rigorous manual verification required by legal teams.</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Annual Validity</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Gmail Blue Checkmark Eligible</li>
          </ul>
        </div>
        <div className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Estimated Cost</p>
          <p className="text-5xl font-extrabold text-brand-orange mb-2">$1,299</p>
          <p className="text-xs text-gray-400">per year / per logo</p>
        </div>
      </div>

    </div>
  </PageLayout>
);