import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How human do the Buy-Lingual™ AI Agents sound?",
      answer: "Our agents utilize advanced neural voice synthesis that is nearly indistinguishable from human speech. They include natural pauses, breath intakes, and can detect/match tone, ensuring high trust and conversion rates."
    },
    {
      question: "Can I integrate these agents with my current CRM?",
      answer: "Yes. Our systems are built to be platform-agnostic but shine with HighLevel (GoHighLevel), Salesforce, and HubSpot. We provide seamless webhooks and API integrations to push lead data instantly."
    },
    {
      question: "What languages are currently supported?",
      answer: "Our flagship Buy-Lingual™ tech supports real-time switching between English, Spanish, French, Portuguese, and German. We are constantly training models for additional languages based on enterprise demand."
    },
    {
      question: "Is there a setup fee for the Digital Assets?",
      answer: "No. The Digital Arsenal products (snapshots, scripts, templates) are one-time purchases with instant delivery. For custom enterprise deployments of AI Agents, we do have an onboarding phase which may carry a setup fee depending on complexity."
    },
    {
      question: "How do you handle compliance (TCPA/FCC)?",
      answer: "Compliance is our priority. Our 'AI Transformation Playbook' includes SOPs for TCPA compliance. We also configure agents to identify themselves as AI if required by your local jurisdiction and respect DNC lists."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-brand-black transition-colors duration-300 border-t border-gray-200 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold text-xs uppercase tracking-wider mb-4">
             <HelpCircle size={12} /> Common Questions
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="text-brand-blue">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about deploying our AI workforce.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-300 overflow-hidden transform ${
                openIndex === index 
                  ? 'border-brand-orange bg-brand-orange/5 dark:bg-brand-orange/5 shadow-md scale-[1.01]' 
                  : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-brand-orange/30 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-orange' : 'text-gray-900 dark:text-white'}`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="text-brand-orange shrink-0" size={20} />
                ) : (
                  <Plus className="text-gray-400 shrink-0" size={20} />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;