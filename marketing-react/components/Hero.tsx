import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, MousePointerClick } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const words = ["SUPPORT", "SELL", "SCALE"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trustLogos = [
    { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Oracle", url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
    { name: "Salesforce", url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Adobe", url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" }
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-brand-black pt-20 md:pt-16 pb-16 md:pb-20 transition-colors duration-300 w-full">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-20 opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        
        {/* SEO Mastermind: Floating Orb with Alt Text */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16 relative z-20">
             <div 
                className="relative flex flex-col items-center cursor-pointer group"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
             >
                <div className="animate-float flex flex-col items-center relative">
                    {/* Interactive Glow Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-brand-blue/20 rounded-full blur-[60px] group-hover:bg-brand-orange/30 group-hover:blur-[90px] group-hover:w-[160%] group-hover:h-[160%] transition-all duration-700 pointer-events-none"></div>
                    
                    {/* Image Container - Size Increased by ~75% */}
                    <div className="relative z-10 w-56 h-56 md:w-80 md:h-80 transition-transform duration-500 group-hover:scale-105 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                        <img 
                            src="https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/68d98e6aa1d2dc7524d916e4.png" 
                            alt="Orengen Buy-Lingual AI Voice Assistant Visualization"
                            className="w-full h-full object-cover animate-orb-breathe relative drop-shadow-2xl"
                        />
                    </div>

                    <div className="mt-[-20px] md:mt-[-30px] relative z-30 w-[240px] md:w-64 bg-white/90 dark:bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg group-hover:border-brand-orange/50 transition-colors duration-300">
                        <div className="flex items-center gap-2 justify-center text-[10px] md:text-xs font-bold text-brand-black dark:text-white uppercase tracking-wide">
                            <MousePointerClick size={14} className="text-brand-orange group-hover:animate-bounce" />
                            Click to Talk To AI Live!
                        </div>
                    </div>
                </div>
             </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6 backdrop-blur-sm animate-fade-in-up">
          <span className="w-2 h-2 shrink-0 rounded-full bg-brand-orange animate-pulse"></span>
          <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Global Leader in AI Business Automation</span>
          <ChevronRight size={14} className="text-gray-400 shrink-0" />
        </div>

        {/* SEO Mastermind: Primary H1 Keyword Optimization - Single flowing line structure */}
        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-7xl tracking-tight leading-tight mb-8 dark:text-white text-gray-900 max-w-7xl mx-auto uppercase">
          <span className="inline-flex flex-wrap justify-center items-center gap-x-[0.2em] gap-y-2">
            <span className="whitespace-nowrap">AI SYSTEMS THAT</span>
            <span className="inline-grid [grid-template-areas:'stack'] text-left">
              {words.map((word, i) => (
                <span 
                  key={i} 
                  className={`[grid-area:stack] bg-gradient-to-r from-[#CC5500] to-[#003366] bg-clip-text text-transparent transition-all duration-1000 ease-in-out ${
                    i === currentWord 
                      ? 'opacity-100 transform translate-y-0 blur-0 scale-100' 
                      : 'opacity-0 transform translate-y-4 blur-sm scale-95'
                  }`}
                >
                  {word}
                </span>
              ))}
              <span className="invisible [grid-area:stack]">SUPPORT</span>
            </span>
            <span className="whitespace-nowrap">YOUR BUSINESS AUTOMATICALLY!</span>
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 leading-relaxed px-2">
          Orengen.io is your <strong>AI tech powerhouse</strong>. Automate your growth with proprietary 
          Buy-Lingual™ AI Voice Agents, intelligent lead generation systems, and custom software architecture.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 md:px-0 w-full">
          <a 
            href="https://api.orengen.io/widget/groups/coffeedate" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-brand-black dark:bg-white text-white dark:text-brand-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
          >
            Book AI Strategy Call
          </a>
          <a 
            href="https://api.orengen.io/widget/groups/coffeedate" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center"
          >
            Schedule Coffee Chat
          </a>
        </div>
        
        <div className="mt-16 md:mt-24 mb-8">
            <h2 className="font-display font-bold text-xs md:text-sm tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">Trusted by Global Enterprise Leaders</h2>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 md:[&_li]:mx-12 [&_img]:max-w-none animate-infinite-scroll">
                {trustLogos.map((logo, idx) => (
                    <li key={idx}>
                        <img src={logo.url} alt={`${logo.name} Trust Logo - Orengen Partnership`} className="h-6 md:h-12 w-auto object-contain grayscale opacity-50 dark:invert" />
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;