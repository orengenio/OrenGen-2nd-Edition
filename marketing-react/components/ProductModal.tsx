import React, { useEffect } from 'react';
import { X, Check, ShieldCheck, Zap, Download, CreditCard, Lock } from 'lucide-react';

interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: React.ElementType;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const Icon = product.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-fade-in" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] bg-white dark:bg-[#0a0a0a] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up border border-gray-200 dark:border-white/10">
        
        {/* Close Button Mobile */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white md:hidden"
        >
            <X size={24} />
        </button>

        {/* Left Side: Visuals & Key Info */}
        <div className="w-full md:w-5/12 bg-gray-100 dark:bg-[#111] p-8 md:p-12 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white dark:bg-white/5 shadow-2xl flex items-center justify-center text-brand-orange mb-8 border border-gray-200 dark:border-white/10">
                    <Icon size={48} className="md:w-16 md:h-16" />
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs uppercase tracking-wider mb-4">
                    {product.category}
                </div>
                
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-6">
                    {product.title}
                </h2>

                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-4 py-2 rounded-lg">
                    <Check size={16} /> Verified & Tested
                </div>
            </div>

            <div className="relative z-10 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> Instant Delivery</span>
                    <span className="flex items-center gap-2"><Lock size={14} className="text-green-500" /> Secure Encryption</span>
                </div>
            </div>
        </div>

        {/* Right Side: Sales Copy & Checkout */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto bg-white dark:bg-brand-black">
            <div className="flex justify-between items-start mb-8 hidden md:flex">
                <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Product OS Details</div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-white">
                    <X size={24} />
                </button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-10">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Why you need this asset</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                    {product.description} This asset is pre-configured for immediate deployment. 
                    Stop building from scratch and start scaling your operations with enterprise-grade infrastructure.
                </p>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">What's Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <Check size={18} className="text-brand-orange mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </li>
                    ))}
                    {/* Add generic extra features for fullness */}
                    <li className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <Check size={18} className="text-brand-orange mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Installation Guide PDF</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                         <Check size={18} className="text-brand-orange mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Lifetime Updates</span>
                    </li>
                </ul>
            </div>

            {/* Checkout Section */}
            <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">One-time payment</div>
                        <div className="text-4xl font-display font-bold text-gray-900 dark:text-white">{product.price}</div>
                    </div>
                    <div className="flex gap-2">
                        {/* Payment Icons */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-70 grayscale hover:grayscale-0 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70 grayscale hover:grayscale-0 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>

                <button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-4">
                    <Download size={20} />
                    Get Instant Access
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>30-Day Money Back Guarantee</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span>Encrypted Checkout</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;