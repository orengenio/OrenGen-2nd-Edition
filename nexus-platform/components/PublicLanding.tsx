import React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Rocket, ShieldCheck, Zap, Bot, ArrowRight, LayoutDashboard, 
  BarChart3, Globe, CheckCircle2, ChevronRight 
} from 'lucide-react';

const PublicLanding: React.FC = () => {
  const buttonText = "Initialize Nexus";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500 selection:text-white">
      <style>{`
        /* From Uiverse.io by dexter-st */ 
        .btn-wrapper {
          position: relative;
          display: inline-block;
        }

        .btn {
          --border-radius: 1.5rem; /* rounded-3xl to match neighbor */
          --padding: 4px;
          --transition: 0.4s;
          --button-color: #cc5500; /* New Background Color */
          --highlight-color-hue: 28deg; /* Orange Brand Color */

          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem; /* Matching px-8 horizontal */
          height: 58px; /* Matching h-[58px] */
          font-family: "Inter", sans-serif;
          font-size: 1.125rem; /* Matching text-lg */
          font-weight: 700; /* Matching font-bold */

          background-color: var(--button-color);

          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.2),
            inset 0px 2px 2px rgba(255, 255, 255, 0.15),
            inset 0px 4px 4px rgba(255, 255, 255, 0.1),
            inset 0px 8px 8px rgba(255, 255, 255, 0.05),
            inset 0px 16px 16px rgba(255, 255, 255, 0.05),
            0px -1px 1px rgba(0, 0, 0, 0.02),
            0px -2px 2px rgba(0, 0, 0, 0.03),
            0px -4px 4px rgba(0, 0, 0, 0.05),
            0px -8px 8px rgba(0, 0, 0, 0.06),
            0px -16px 16px rgba(0, 0, 0, 0.08);

          border: solid 1px rgba(255,255,255,0.2);
          border-radius: var(--border-radius);
          cursor: pointer;
          position: relative;
          z-index: 10;
          text-decoration: none;
          min-width: 200px; /* Ensure visual balance */

          transition:
            box-shadow var(--transition),
            border var(--transition),
            background-color var(--transition);
        }
        
        .btn::before {
          content: "";
          position: absolute;
          top: calc(0px - var(--padding));
          left: calc(0px - var(--padding));
          width: calc(100% + var(--padding) * 2);
          height: calc(100% + var(--padding) * 2);
          border-radius: calc(var(--border-radius) + var(--padding));
          pointer-events: none;
          background-image: linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
          z-index: -1;
          transition: box-shadow var(--transition), filter var(--transition);
          box-shadow:
            0 -8px 8px -6px rgba(0,0,0,0) inset,
            0 -16px 16px -8px rgba(0,0,0,0) inset,
            1px 1px 1px rgba(255,255,255,0.1),
            2px 2px 2px rgba(255,255,255,0.05),
            -1px -1px 1px rgba(0,0,0,0.1),
            -2px -2px 2px rgba(0,0,0,0.05);
        }
        
        .btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          pointer-events: none;
          background-image: linear-gradient(
            0deg,
            #fff,
            hsl(var(--highlight-color-hue), 100%, 70%),
            hsla(var(--highlight-color-hue), 100%, 70%, 50%),
            8%,
            transparent
          );
          background-position: 0 0;
          opacity: 0;
          transition: opacity var(--transition), filter var(--transition);
        }

        .btn-letter {
          position: relative;
          display: inline-block;
          color: rgba(255,255,255,0.8);
          animation: letter-anim 3s ease-in-out infinite;
          transition: color var(--transition), text-shadow var(--transition), opacity var(--transition);
        }

        @keyframes letter-anim {
          0%, 100% { text-shadow: none; color: rgba(255,255,255,0.8); }
          50% { text-shadow: 0 0 10px rgba(255,255,255,1); color: #fff; }
        }

        .btn-svg {
          height: 24px;
          width: 24px;
          margin-right: 0.75rem;
          fill: #fff;
          animation: flicker 3s linear infinite;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.8));
          transition: fill var(--transition), filter var(--transition), opacity var(--transition);
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1)); }
        }

        /* Focus & Hover State Effects */
        .btn:hover {
          border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 60%);
          box-shadow: 0 0 25px rgba(204, 85, 0, 0.6); /* Bigger glow on container */
        }

        .btn:hover::before {
          box-shadow:
            0 -8px 8px -6px rgba(255,255,255,0.6) inset,
            0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 30%) inset,
            1px 1px 1px rgba(255,255,255,0.1),
            2px 2px 2px rgba(255,255,255,0.05);
        }

        .btn:hover::after {
          opacity: 0.3;
        }

        .btn:hover .btn-svg {
          fill: #fff;
          filter: drop-shadow(0 0 15px hsl(var(--highlight-color-hue), 100%, 90%));
        }
        
        .btn:hover .btn-letter {
            color: #fff;
            text-shadow: 0 0 8px rgba(255,255,255,1);
            animation: none;
        }

        /* Animation Delays for Letters */
        ${Array.from({length: 20}).map((_, i) => `
          .btn-letter:nth-child(${i + 1}) { animation-delay: ${i * 0.1}s; }
        `).join('')}
      `}</style>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-orange-500">ORENGEN</span>
            <span className="text-white">NEXUS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#agents" className="hover:text-white transition-colors">AI Workforce</a>
            <a href="#federal" className="hover:text-white transition-colors">Federal Intel</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden md:block text-sm font-medium hover:text-white text-slate-300">Log In</Link>
            <Link to="/dashboard" className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-orange-400 mb-6 backdrop-blur-sm">
            <Zap size={12} fill="currentColor" /> v4.1 Enterprise Release Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            The Operating System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Hyper-Growth Scaling</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Orchestrate AI agents, automate federal contracting, and deploy marketing campaigns from a single mission control center.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* NEW BUTTON IMPLEMENTATION */}
            <div className="btn-wrapper w-full sm:w-auto">
              <Link to="/dashboard" className="btn w-full sm:w-auto">
                <svg className="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {buttonText.split('').map((char, index) => (
                  <span key={index} className="btn-letter">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </Link>
            </div>

            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-3xl font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto h-[58px]">
              View Architecture
            </button>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
            <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl">
              <div className="rounded-lg bg-slate-900 aspect-video overflow-hidden border border-white/5 flex items-center justify-center relative">
                 {/* Abstract UI representation */}
                 <div className="absolute inset-0 flex">
                    <div className="w-64 border-r border-white/5 bg-slate-900/50 p-4 space-y-4">
                        <div className="h-8 bg-white/5 rounded w-32"></div>
                        <div className="space-y-2">
                            <div className="h-8 bg-white/5 rounded w-full"></div>
                            <div className="h-8 bg-orange-500/20 border border-orange-500/30 rounded w-full"></div>
                            <div className="h-8 bg-white/5 rounded w-full"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 grid grid-cols-2 gap-6">
                        <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                        <div className="col-span-2 h-64 bg-white/5 rounded-xl border border-white/5"></div>
                    </div>
                 </div>
                 <div className="z-20 text-center">
                    <LayoutDashboard size={48} className="mx-auto text-orange-500 mb-4 opacity-50" />
                    <p className="text-slate-500 font-mono text-sm">Interactive Dashboard Preview</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { label: 'Active Agents', value: '15+' },
                { label: 'Federal Opportunities', value: '$2.5B' },
                { label: 'Uptime Guarantee', value: '99.9%' },
                { label: 'Deployments/Day', value: '10k+' }
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Command Center Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Replacing 10+ disconnected SaaS tools with one unified operating system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors group">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                    <Bot size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Autonomous Agents</h3>
                <p className="text-slate-400 leading-relaxed">
                    Deploy specialized AI workers for branding, web design, and outreach. They don't just chat; they execute workflows.
                </p>
            </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Federal Intelligence</h3>
                <p className="text-slate-400 leading-relaxed">
                    Scout SAM.gov opportunities, analyze RFPs for compliance traps, and generate winning proposals automatically.
                </p>
            </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                    <Rocket size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Growth Orchestration</h3>
                <p className="text-slate-400 leading-relaxed">
                    Manage multi-channel campaigns, CRM pipelines, and marketing assets from a single Launch Bay.
                </p>
            </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-24 bg-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-xs font-medium text-green-400 mb-6">
                    <Globe size={12} /> Web Studio
                 </div>
                 <h2 className="text-4xl font-bold mb-6">Build Funnels at the Speed of Thought</h2>
                 <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                     Forget drag-and-drop. Just describe your audience and goal. The Web Architect Agent generates high-conversion landing pages, writes the copy, and exports React code instantly.
                 </p>
                 <ul className="space-y-4 mb-8">
                     {['Conversion-optimized layouts', 'Auto-generated copywriting', 'React/Tailwind Code Export', 'Mobile-Responsive Preview'].map(item => (
                         <li key={item} className="flex items-center gap-3 text-slate-300">
                             <CheckCircle2 size={20} className="text-orange-500" /> {item}
                         </li>
                     ))}
                 </ul>
                 <Link to="/dashboard" className="text-orange-400 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                     Try Web Studio <ChevronRight size={20} />
                 </Link>
            </div>
            <div className="flex-1">
                 <div className="bg-slate-900 rounded-xl border border-white/10 p-6 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         <div className="ml-auto text-xs text-slate-500 font-mono">Web_Architect.tsx</div>
                     </div>
                     <div className="space-y-3 font-mono text-sm">
                         <div className="text-blue-400">import <span className="text-white">WebStudio</span> from <span className="text-green-400">'@nexus/core'</span>;</div>
                         <div className="text-slate-500">// AI generating structure...</div>
                         <div className="pl-4 border-l-2 border-white/10">
                             <div className="text-purple-400">const <span className="text-yellow-400">LandingPage</span> = () ={'>'} (</div>
                             <div className="pl-4 text-slate-300">
                                 {'<Hero headline="Scale Faster" />'}
                             </div>
                              <div className="pl-4 text-slate-300">
                                 {'<Features count={3} />'}
                             </div>
                             <div className="text-purple-400">);</div>
                         </div>
                     </div>
                 </div>
            </div>
         </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Transparent Pricing</h2>
        <p className="text-slate-400 mb-16 max-w-2xl mx-auto">No hidden fees. Full access to the operating system.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
             <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/10">
                 <h3 className="font-bold text-xl mb-2">Starter</h3>
                 <div className="text-4xl font-bold mb-4">$99<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                 <p className="text-slate-400 text-sm mb-8">For solo founders and freelancers.</p>
                 <Link to="/dashboard" className="block w-full py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors font-medium">Get Started</Link>
             </div>
             
             <div className="p-10 bg-gradient-to-b from-orange-900/20 to-slate-900 rounded-2xl border border-orange-500/50 relative shadow-2xl scale-105">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                 <h3 className="font-bold text-xl mb-2 text-white">Agency</h3>
                 <div className="text-5xl font-bold mb-4 text-white">$299<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                 <p className="text-slate-300 text-sm mb-8">Full access to all Studios and Agents.</p>
                 <ul className="text-left space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Unlimited Projects</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Federal Intelligence Module</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500"/> Team Collaboration</li>
                 </ul>
                 <Link to="/dashboard" className="block w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold transition-colors shadow-lg">Start Free Trial</Link>
             </div>

             <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/10">
                 <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                 <div className="text-4xl font-bold mb-4">Custom</div>
                 <p className="text-slate-400 text-sm mb-8">For large organizations requiring security.</p>
                 <Link to="/dashboard" className="block w-full py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors font-medium">Contact Sales</Link>
             </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <span className="text-orange-500">ORENGEN</span>
                <span className="text-white">NEXUS</span>
            </div>
            <div className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} OrenGen Nexus. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/status" className="hover:text-white transition-colors">Status</Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;