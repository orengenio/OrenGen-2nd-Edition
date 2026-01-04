import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col h-[90vh] md:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 shrink-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Free Business Audit</h3>
            <button 
                onClick={onClose}
                className="p-1.5 md:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Close Modal"
            >
                <X size={20} />
            </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 overflow-y-auto bg-white p-1 md:p-2">
             <iframe 
                id='prospecting-widget-modal' 
                src='https://services.leadconnectorhq.com/prospecting/widgets/load/693a6f8dae155e84b34f2d65'
                frameBorder='0' 
                style={{ display: 'block', width: '100%', height: '100%', minHeight: '600px' }}
                title="Orengen Free Audit"
            ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AuditModal;