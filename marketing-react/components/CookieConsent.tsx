import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('orengen-cookie-consent');
    if (!consent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('orengen-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <h4 className="text-gray-900 dark:text-white font-bold mb-1">We value your privacy</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "OK", you consent to our use of cookies. 
            <a href="#" className="text-brand-orange hover:underline ml-1">Read our Cookie Policy</a>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={() => setIsVisible(false)}
             className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
           >
             Decline
           </button>
           <button 
             onClick={handleAccept}
             className="flex-1 md:flex-none px-6 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-colors shadow-lg"
           >
             OK
           </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;