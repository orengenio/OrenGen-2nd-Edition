import React, { useState, useEffect } from 'react';
import { ASSETS } from '../constants';
import { ShieldCheck, Zap, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const target = 60;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing function for smoother effect (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
      <style>{`
        .btn-forge {
          display: block;
          cursor: pointer;
          color: white;
          margin: 0 auto;
          position: relative;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          overflow: hidden;
          padding: 3px;
          isolation: isolate;
          width: 20rem;
          max-width: 90vw;
        }

        .btn-forge::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 400%;
          height: 100%;
          background: linear-gradient(115deg, #cc5500, #ffdb3b, #ff4500, #cc5500, #ffdb3b);
          background-size: 25% 100%;
          animation: border-animation .4s linear infinite;
          animation-play-state: paused;
          translate: -5% 0%;
          transition: translate 0.25s ease-out;
        }

        .btn-forge:hover::before {
          animation-play-state: running;
          transition-duration: 0.75s;
          translate: 0% 0%;
        }

        @keyframes border-animation {
          to {
            transform: translateX(-25%);
          }
        }

        .btn-forge span {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1rem;
          font-size: 1.1rem;
          background: #020617;
          border-radius: 3px;
          height: 100%;
          font-weight: 800;
          letter-spacing: 1px;
          transition: background 0.3s ease;
        }
        
        .btn-forge:hover span {
          background: #0f172a;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CC5500]/30 bg-[#CC5500]/10 text-[#CC5500] font-bold text-xs tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(204,85,0,0.3)]">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          Enterprise Grade BIMI Generator
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-6">
          <span className="block">
            Authenticate <br className="block sm:hidden" /> Your Brand.
          </span>
          <span className="block mt-2 sm:mt-0">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">
              BIMI-Ready in{' '}
            </span>
            <br className="block sm:hidden" />
            <span className="whitespace-nowrap">
              <span className="text-brand-blue dark:text-white inline-block w-[1.3em] text-center">
                {count}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">
                {' '}Seconds.
              </span>
            </span>
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10">
          Our affordable proprietary software both vectorizes and converts any image format into a 100% compliant SVG Tiny 1.2 (Tiny-PS) logo for branded emails.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 items-center">
          <Link to="/workspace" className="btn-forge group">
            <span>
              Forge Your Logo Now <Zap className="h-5 w-5 text-brand-orange group-hover:fill-brand-orange transition-colors" />
            </span>
          </Link>
        </div>

        {/* Trust Indicators - Marquee */}
        <div className="pt-12 border-t border-gray-200 dark:border-white/5 w-full overflow-hidden">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Optimized for all major inboxes</p>
          
          <div className="w-full inline-flex flex-nowrap overflow-hidden">
            {[...Array(4)].map((_, setIndex) => (
              <ul key={setIndex} className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
                {Object.values(ASSETS.PROVIDERS).map((url, idx) => (
                  <li key={idx}>
                    <img src={url} alt="Provider" className="h-12 md:h-16 w-auto object-contain opacity-100" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative BG */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl mix-blend-multiply filter opacity-50 animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl mix-blend-multiply filter opacity-50"></div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // 0 = Pause
    // 1 = Blink 1
    // 2 = Blink 2
    // 3 = Blink 3
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === 3) return 0; // After 3, go to 0 (pause/reset)
        if (prev === 0) return 1; // After pause, start at 1
        return prev + 1; // 1->2, 2->3
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      num: 1,
      title: "Upload or Paste",
      desc: "Your brand's logo in ANY format — PNG, JPG, PDF, AI, WebP. We accept them all.",
      icon: <Upload className="h-6 w-6 md:h-8 md:w-8" />,
      badges: ['.png', '.jpg', '.pdf', '.ai'],
      theme: {
        borderColor: 'border-red-500/20',
        hoverBorder: 'group-hover:border-red-500',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]',
        numColor: 'text-red-500',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-500',
        badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20'
      }
    },
    {
      num: 2,
      title: "Click Convert",
      desc: "Our AI engine processes your logo and generates compliant SVG code automatically.",
      icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
      highlightBadge: { text: '60 SECONDS', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
      theme: {
        borderColor: 'border-amber-500/20',
        hoverBorder: 'group-hover:border-amber-500',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
        numColor: 'text-amber-500',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      }
    },
    {
      num: 3,
      title: "100% BIMI Compliant",
      desc: "Download your SVG Tiny 1.2 logo. Global ISP profile met. Instant brand recognition.",
      icon: <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" />,
      highlightBadge: { text: 'Verified', color: 'text-green-500 border-green-500/30 bg-green-500/10' },
      theme: {
        borderColor: 'border-green-500/20',
        hoverBorder: 'group-hover:border-green-500',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]',
        numColor: 'text-green-500',
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-500',
        badgeBg: 'bg-green-500/10 text-green-400 border-green-500/20'
      }
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-brand-darker scroll-mt-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
           <div className="inline-block px-4 py-1 rounded-full bg-orange-900/30 border border-brand-orange/30 text-brand-orange text-xs font-bold tracking-wider uppercase mb-6">
             SELECT YOUR PLAN AND FOLLOW SIMPLE STEPS
           </div>

           <h3 className="font-black tracking-widest text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-2xl text-white">
             <span className="text-white">Easy As </span>
             <span className={`text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all ${activeStep === 1 ? 'animate-blink-once' : ''}`}>1</span>
             <span className="text-gray-700 mx-2 text-2xl md:text-4xl align-middle"> - </span>
             <span className={`text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all ${activeStep === 2 ? 'animate-blink-once' : ''}`}>2</span>
             <span className="text-gray-700 mx-2 text-2xl md:text-4xl align-middle"> - </span>
             <span className={`text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all ${activeStep === 3 ? 'animate-blink-once' : ''}`}>3</span>
           </h3>
           <div className="h-1 w-24 md:w-32 bg-brand-orange mx-auto rounded-full opacity-80"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {steps.map((step) => (
            <div 
              key={step.num} 
              className={`
                relative group p-6 md:p-8 rounded-3xl transition-all duration-500 ease-out 
                transform hover:-translate-y-2 md:hover:-translate-y-4 active:scale-95 md:active:scale-100
                bg-slate-900/80 backdrop-blur-xl
                border ${step.theme.borderColor} ${step.theme.hoverBorder} ${step.theme.glow}
                flex flex-col h-full overflow-hidden
              `}
            >
              {/* Huge Background Number */}
              <div className={`
                absolute -right-4 -top-4 text-7xl md:text-9xl font-black opacity-5 
                transition-all duration-500 group-hover:scale-110 group-hover:opacity-10
                select-none pointer-events-none ${step.theme.numColor}
              `}>
                {step.num}
              </div>

              {/* Header: Number & Icon */}
              <div className="flex items-center justify-between mb-6 md:mb-8 relative">
                 <div className={`
                   w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center 
                   text-xl md:text-2xl font-bold transition-transform duration-500 group-hover:rotate-12
                   ${step.theme.iconBg} ${step.theme.iconColor}
                 `}>
                   {step.icon}
                 </div>
                 <div className={`text-3xl md:text-4xl font-black ${step.theme.numColor} transition-all ${activeStep === step.num ? 'animate-blink-once' : ''}`}>
                   0{step.num}
                 </div>
              </div>

              {/* Text Content */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 relative">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6 md:mb-8 flex-grow text-sm md:text-base relative">
                {step.desc}
              </p>
              
              {/* Footer Badges */}
              <div className="mt-auto relative">
                {step.badges && (
                  <div className="flex flex-wrap gap-2">
                    {step.badges.map(b => (
                      <span key={b} className={`px-2 py-1 md:px-2.5 md:py-1 text-[10px] md:text-xs font-mono font-semibold rounded-md border ${step.theme.badgeBg}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}
                
                {step.highlightBadge && (
                  <span className={`inline-block px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-md border ${step.highlightBadge.color}`}>
                    {step.highlightBadge.text}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};