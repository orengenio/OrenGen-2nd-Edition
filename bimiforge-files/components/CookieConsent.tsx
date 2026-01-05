import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] max-w-sm w-[calc(100%-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-orange/10 rounded-xl hidden sm:block shrink-0">
            <Cookie className="w-6 h-6 text-brand-orange" />
        </div>
        <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">We value your privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "OK", you consent to our use of cookies. <Link to="/privacy" className="text-brand-orange hover:underline font-medium whitespace-nowrap">Read our Cookie Policy.</Link>
            </p>
            <div className="flex gap-3">
                <button
                    onClick={handleAccept}
                    className="w-full px-4 py-2.5 bg-brand-orange hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg hover:shadow-orange-500/25"
                >
                OK
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};