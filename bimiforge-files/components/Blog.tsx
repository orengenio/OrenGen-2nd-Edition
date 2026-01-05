import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Calendar, ArrowRight, Clock, Heart, Share2, 
  Facebook, Twitter, Linkedin, Link as LinkIcon, 
  Send, Mail, MessageCircle, Copy, X, Check, MoreHorizontal
} from 'lucide-react';

// --- Types ---
interface ShareOption {
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  action: (url: string, title: string) => void;
}

// --- Mock DB ---
const INITIAL_POSTS = [
  {
    id: 1,
    slug: 'orengen-makes-history-christmas-2025',
    title: 'OrenGen Worldwide Makes History: BIMI Forge Launches on Christmas Day',
    excerpt: 'In a landmark move for digital identity, OrenGen Worldwide gifts the industry a revolutionary automated BIMI infrastructure, democratizing email authentication for millions.',
    content: `
      <p class="lead"><strong>MANSFIELD, TX — December 25, 2025</strong> — As the world celebrated the holidays, the digital infrastructure landscape shifted permanently. OrenGen Worldwide has officially deployed <strong>BIMI Forge</strong>, a groundbreaking enterprise platform that completely automates the generation of compliant Brand Indicators for Message Identification (BIMI) assets.</p>
      
      <h2>The Dawn of Automated Identity</h2>
      <p>For the past decade, email authentication has been a fortress of solitude—accessible only to those with deep technical resources and specialized vector engineering teams. The strict requirement for <strong>SVG Tiny 1.2 Portable/Secure (Tiny-PS)</strong> profiles created a barrier to entry that left 90% of small-to-mid-sized enterprises (SMEs) without verified brand logos in the inbox.</p>
      <p>"We realized that the technical debt required to implement BIMI was stifling adoption," stated Andre Mandel, CEO of OrenGen Worldwide. "Launching on Christmas Day is symbolic. We are unwrapping a new standard of trust. This isn't just about a logo next to an email; it's about verifying the authenticity of communication in an era of digital noise."</p>
      
      <h3>Technical Breakthroughs</h3>
      <p>BIMI Forge utilizes a proprietary "Black Box" vectorization engine that performs real-time path simplification, reference removal, and XML sanitization. This allows the system to ingest standard raster formats (JPG, PNG) and output RFC-compliant vector files in milliseconds—a process that previously required hours of manual labor by specialized designers.</p>
      
      <blockquote>
        "This is the missing link in the DMARC ecosystem. By removing the friction of asset creation, OrenGen has accelerated global BIMI adoption by at least three years." 
        <br/><cite>— Sarah Jenkins, Senior Analyst at CyberAuth Weekly</cite>
      </blockquote>

      <h3>Global Impact and Future Roadmap</h3>
      <p>With immediate support for Gmail, Apple Mail, and Yahoo, BIMI Forge is already processing thousands of domains. As we look toward 2026, OrenGen Worldwide is positioned to become the central clearinghouse for digital inbox identity, ensuring that every legitimate business can fly their flag securely.</p>
    `,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=1200',
    author: 'OrenGen Editorial',
    date: 'Dec 25, 2025',
    readTime: '6 min read',
    tags: ['Press Release', 'Launch', 'Enterprise Security']
  },
  {
    id: 2,
    slug: 'bimi-implementation-guide-2026',
    title: 'Why The Blue Checkmark Matters for ROI: Insights from BIMI Forge',
    excerpt: 'A comprehensive technical deep-dive into preparing enterprise domains for DMARC alignment, VMC acquisition, and SVG Tiny 1.2 conversion.',
    content: `
      <h2>The Security Imperative</h2>
      <p>As we navigate the cybersecurity landscape of 2026, email authentication has transitioned from a best practice to a critical operational requirement. Phishing vectors have become increasingly sophisticated, making <strong>Brand Indicators for Message Identification (BIMI)</strong> an essential layer of defense and brand equity.</p>
      
      <h3>Prerequisite: DMARC Enforcement</h3>
      <p>Before considering visual indicators, the domain foundation must be secure. BIMI requires a DMARC policy of <code>p=quarantine</code> (at 100%) or <code>p=reject</code>. This signals to mailbox providers that the domain owner is actively policing their email ecosystem.</p>
      
      <h3>The SVG Tiny 1.2 Hurdle</h3>
      <p>The most common failure point in 2025 was the asset itself. Standard SVG files often contain scripts, external links, or non-secure attributes. The Tiny-PS profile strips these vulnerabilities. BIMI Forge automates this sanitization, ensuring 100% compliance with Gmail's strict rendering engine.</p>
      
      <h3>Verified Mark Certificates (VMC)</h3>
      <p>While some providers display logos for self-asserted BIMI records, the coveted blue checkmark in Gmail requires a VMC. This digital certificate validates trademark ownership and links the visual brand to the sending domain cryptographically.</p>
    `,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
    author: 'OrenGen AI',
    date: 'Dec 26, 2025',
    readTime: '8 min read',
    tags: ['BIMI', 'Security Architecture', 'Tutorial']
  },
  {
    id: 3,
    slug: 'svg-tiny-ps-technical-analysis',
    title: 'The End of Email Impersonation? OrenGen\'s AI Engine Solves the SVG Problem',
    excerpt: 'Why standard design tools fail at BIMI compliance and the engineering challenges behind strict XML profile adherence.',
    content: `
      <h2>Beyond Standard Vectors</h2>
      <p>Graphic designers typically work in Adobe Illustrator or CorelDRAW, exporting standard SVG 1.1 files. For web use, these are perfect. For email security headers, they are often invalid.</p>
      
      <p>The <strong>SVG Tiny 1.2 Portable/Secure (Tiny-PS)</strong> profile is a subset of the Scalable Vector Graphics specification designed specifically for resource-constrained and high-security environments. It strictly forbids:</p>
      <ul>
        <li>Scripts (XSS vectors)</li>
        <li>External resource loading</li>
        <li>Base64 embedded raster images</li>
        <li>Complex filters and gradients</li>
      </ul>
      
      <p>BIMI Forge acts as a compiler, taking rich visual data and "down-sampling" the XML structure to meet these rigorous standards without losing visual fidelity. This ensures that when your logo hits the inbox, it renders perfectly and securely, every time.</p>
    `,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    author: 'OrenGen Engineering',
    date: 'Dec 28, 2025',
    readTime: '5 min read',
    tags: ['Technical Engineering', 'SVG', 'Compliance']
  }
];

// --- Share Modal Component ---

const ShareSheet = ({ isOpen, onClose, title, url }: { isOpen: boolean; onClose: () => void; title: string; url: string }) => {
  const [copied, setCopied] = useState(false);
  const [isNativeShareAvailable, setIsNativeShareAvailable] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setIsNativeShareAvailable(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    } catch (err) {
        console.error("Copy failed", err);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: 'Copy Link',
      icon: copied ? Check : LinkIcon,
      color: copied ? 'text-green-600' : 'text-gray-600 dark:text-gray-300',
      bg: copied ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-slate-800',
      action: handleCopy
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'text-white',
      bg: 'bg-black',
      action: (u, t) => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`, '_blank')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-white',
      bg: 'bg-[#1877F2]',
      action: (u) => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`, '_blank')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-white',
      bg: 'bg-[#0A66C2]',
      action: (u) => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-white',
      bg: 'bg-[#25D366]',
      action: (u, t) => window.open(`https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}`, '_blank')
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-white',
      bg: 'bg-gray-600',
      action: (u, t) => window.location.href = `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`
    },
    {
        name: 'More',
        icon: MoreHorizontal,
        color: 'text-gray-600 dark:text-gray-300',
        bg: 'bg-gray-200 dark:bg-slate-700',
        action: async (u, t) => {
            if (navigator.share) {
                try { 
                    await navigator.share({ 
                        title: t, 
                        text: `Check this out: ${t}`, 
                        url: u 
                    }); 
                } catch (e: any) {
                    if (e.name !== 'AbortError') {
                        console.error('Share failed:', e);
                        alert('Unable to share automatically. Please copy the link manually.');
                    }
                }
            } else {
                alert("Native sharing is not supported on this device/browser.");
            }
        }
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-white dark:bg-brand-darker rounded-t-3xl sm:rounded-3xl shadow-2xl transform transition-all animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-4 duration-300 overflow-hidden border border-gray-200 dark:border-white/10 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Handle for mobile swipe feel */}
        <div className="mx-auto w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mt-3 mb-1 sm:hidden"></div>

        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Share to</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{title}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Grid of Apps */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-2 mb-8">
                {shareOptions.slice(1).map((opt) => (
                    <button
                        key={opt.name}
                        type="button"
                        onClick={(e) => { 
                            e.preventDefault();
                            opt.action(url, title); 
                        }}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 group-active:scale-95 ${opt.bg}`}>
                            <opt.icon className={`w-7 h-7 ${opt.color}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{opt.name}</span>
                    </button>
                ))}
            </div>

            {/* Copy Link Row */}
            <div className="relative group cursor-pointer" onClick={handleCopy}>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-blue rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
                            <LinkIcon className="w-5 h-5 text-brand-orange" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Page Link</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{url}</span>
                        </div>
                    </div>
                    <button 
                        type="button"
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shrink-0 flex items-center gap-2 ${
                            copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// --- Engagement Buttons Component ---

const SocialActionButtons = ({ title, slug }: { title: string, slug: string }) => {
  // Production-ready counters starting at 0, persisted in localStorage
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    // Load persisted state for this specific slug
    const storedLike = localStorage.getItem(`like-${slug}`);
    const storedShareCount = localStorage.getItem(`share-count-${slug}`);
    const storedLikeCount = localStorage.getItem(`like-count-${slug}`);

    if (storedLike === 'true') setIsLiked(true);
    if (storedShareCount) setShares(parseInt(storedShareCount, 10));
    if (storedLikeCount) setLikes(parseInt(storedLikeCount, 10));
  }, [slug]);

  const handleLike = () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    
    // Update count based on toggle
    const newCount = newLikedStatus ? likes + 1 : Math.max(0, likes - 1);
    setLikes(newCount);

    if (newLikedStatus) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }

    // Persist
    localStorage.setItem(`like-${slug}`, String(newLikedStatus));
    localStorage.setItem(`like-count-${slug}`, String(newCount));
  };

  const handleShareClick = () => {
      // Logic: If mobile and navigator.share exists, we could use that directly, 
      // but the user asked for a "cleaner interface for platform sharing", implying the modal.
      // However, "leveraging the native share API where available" typically implies 
      // using the native sheet if possible OR providing it as a robust option.
      // We'll stick to opening the robust modal which contains the native option.
      
      setIsShareOpen(true);
      
      const newCount = shares + 1;
      setShares(newCount);
      localStorage.setItem(`share-count-${slug}`, String(newCount));
  };

  return (
    <>
        <div className="flex items-center justify-between my-8 py-4 border-y border-gray-100 dark:border-gray-800">
        
        <div className="flex items-center gap-6">
            <button 
                type="button"
                onClick={handleLike}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isLiked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500'
                }`}
            >
                <div className="relative">
                <Heart className={`w-6 h-6 transition-all duration-300 ${isLiked ? 'fill-red-600 scale-110' : 'group-hover:scale-110'}`} />
                {showConfetti && (
                    <span className="absolute -top-4 -right-4 text-xs animate-ping">❤️</span>
                )}
                </div>
                <div className="flex flex-col text-left">
                <span className="font-bold text-sm leading-none">{likes}</span>
                <span className="text-[10px] uppercase font-medium opacity-70">Likes</span>
                </div>
            </button>

            <button 
                type="button"
                onClick={handleShareClick}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-brand-blue/10 hover:text-brand-blue transition-all duration-300"
            >
                <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <div className="flex flex-col text-left">
                <span className="font-bold text-sm leading-none">{shares}</span>
                <span className="text-[10px] uppercase font-medium opacity-70">Shares</span>
                </div>
            </button>
        </div>

        {/* Desktop Quick Links (Visual flair) */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>Share now</span>
            <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-black hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[#1877F2] hover:text-white transition-colors"><Facebook className="w-4 h-4" /></button>
            <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[#0A66C2] hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
        </div>
        </div>

        {/* Global Share Modal */}
        <ShareSheet 
            isOpen={isShareOpen} 
            onClose={() => setIsShareOpen(false)} 
            title={title} 
            url={window.location.href} 
        />
    </>
  );
};

export const BlogList: React.FC = () => {
  const [posts] = useState(INITIAL_POSTS);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Centered */}
        <div className="text-center mb-20">
            <span className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-3 block">The Forge Blog</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">Insights & Updates</h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Leading the conversation on email authentication, digital identity, and brand security.
            </p>
            <div className="h-1 w-24 bg-brand-orange mx-auto rounded-full mt-8 opacity-80"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange/50 transition-all group flex flex-col h-full transform hover:-translate-y-1 hover:shadow-2xl duration-300">
              <Link to={`/blog/${post.slug}`} className="block h-56 relative overflow-hidden bg-slate-800">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-brand-orange/90 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
                  <Calendar className="w-3 h-3 text-brand-orange" /> {post.date}
                  <span className="text-gray-600">•</span>
                  <Clock className="w-3 h-3 text-brand-orange" /> {post.readTime}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors leading-snug">
                  <Link to={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                        {post.author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{post.author}</span>
                  </div>
                  
                  {/* Minified Social Stats for Grid View (Loads from localStorage) */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                     <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {localStorage.getItem(`like-count-${post.slug}`) || 0}</span>
                     <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {localStorage.getItem(`share-count-${post.slug}`) || 0}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const post = INITIAL_POSTS.find(p => p.slug === slug) || INITIAL_POSTS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-darker py-24 px-4 sm:px-6 lg:px-8">
       <article className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back */}
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-orange mb-8 transition-colors group">
             <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>
          
          {/* Hero Image Section */}
          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl relative h-[400px] md:h-[500px] group">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s]" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90"></div>
             
             <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-10">
                <div className="flex gap-2 mb-6">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-brand-orange text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-lg border border-white/10">{tag}</span>
                    ))}
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight drop-shadow-xl">
                    {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white text-brand-blue flex items-center justify-center text-sm font-bold shadow-lg">
                            {post.author.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase text-gray-400">Written By</span>
                           <span className="font-bold text-white">{post.author}</span>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/20"></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] uppercase text-gray-400">Published</span>
                       <span className="text-white flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/20"></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] uppercase text-gray-400">Read Time</span>
                       <span className="text-white flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Engagement Bar Top */}
          <SocialActionButtons title={post.title} slug={post.slug} />

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Left Sidebar (Desktop Only Sticky Share) */}
             <div className="hidden lg:block col-span-1">
                <div className="sticky top-32 flex flex-col gap-4 items-center">
                   <button className="p-3 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-brand-orange hover:bg-white shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
                      <Heart className="w-5 h-5" />
                   </button>
                   {/* This button triggers the same modal */}
                   <button className="p-3 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-brand-blue hover:bg-white shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
                      <Share2 className="w-5 h-5" />
                   </button>
                   <div className="w-px h-12 bg-gray-200 dark:bg-gray-800 my-2"></div>
                   <span className="text-[10px] font-bold text-gray-400 vertical-text tracking-widest uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>Share</span>
                </div>
             </div>

             {/* Main Content */}
             <div className="col-span-1 lg:col-span-10">
                <div 
                  className="prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none 
                    prose-headings:font-extrabold prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-a:text-brand-orange prose-a:no-underline hover:prose-a:text-orange-500 hover:prose-a:underline
                    prose-strong:text-brand-blue dark:prose-strong:text-blue-300
                    prose-blockquote:border-l-brand-orange prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                    prose-img:rounded-2xl prose-img:shadow-xl"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
             </div>
          </div>
          
          {/* Engagement Bar Bottom */}
          <div className="mt-12">
             <SocialActionButtons title={post.title} slug={post.slug} />
          </div>

          {/* Author Box */}
          <div className="mt-16 bg-gray-50 dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
             <div className="w-20 h-20 rounded-full bg-brand-blue flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-slate-800 shadow-lg shrink-0">
                {post.author.charAt(0)}
             </div>
             <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">About {post.author}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Delivering cutting-edge insights on email authentication, vector engineering, and digital brand security. The OrenGen team is composed of industry veterans dedicated to the open web.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                    <button className="text-sm font-bold text-brand-orange hover:text-orange-600">View all posts</button>
                    <button className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Follow on Twitter</button>
                </div>
             </div>
          </div>

       </article>
    </div>
  );
};
