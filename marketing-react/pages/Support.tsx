import React from 'react';
import FAQSection from '../components/FAQSection';
import CtaSection from '../components/CtaSection';
import { Mail, MessageCircle, FileText } from 'lucide-react';

const Support: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-brand-black">
       <div className="bg-brand-black dark:bg-black/50 py-16 text-center border-b border-white/10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Support & <span className="text-brand-orange">Resources</span></h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center hover:shadow-lg transition-all">
              <Mail size={40} className="mx-auto text-brand-orange mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Email Support</h3>
              <p className="text-gray-500 mb-4">24/7 Ticket System</p>
              <a href="mailto:support@orengen.io" className="text-brand-blue font-bold hover:underline">support@orengen.io</a>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center hover:shadow-lg transition-all">
              <MessageCircle size={40} className="mx-auto text-brand-orange mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Live Chat</h3>
              <p className="text-gray-500 mb-4">Available 9am - 5pm EST</p>
              <a 
                href="https://api.orengen.io/widget/groups/coffeedate" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue font-bold hover:underline inline-block"
              >
                Book Support Call
              </a>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center hover:shadow-lg transition-all">
              <FileText size={40} className="mx-auto text-brand-orange mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Knowledge Base</h3>
              <p className="text-gray-500 mb-4">Documentation & Guides</p>
              <a href="#" className="text-brand-blue font-bold hover:underline">View Docs</a>
          </div>
      </div>

      <FAQSection />
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default Support;