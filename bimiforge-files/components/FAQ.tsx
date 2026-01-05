import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: "Do I really need a VMC?",
    a: "For Gmail to display the blue checkmark, YES. For the logo itself, NO, you don't, BUT it is contingent on your sender reputation. BIMI Forge prepares you for both scenarios. However, we do encourage you to follow sending best practices to get the best results among ISP providers."
  },
  {
    q: "What file formats do you accept?",
    a: "We accept PNG, JPG, PDF, AI, EPS, and SVG. Our engine converts them all to the compliant SVG Tiny 1.2 profile."
  },
  {
    q: "How long does the process take?",
    a: "Using BIMI Forge, the conversion takes seconds. DNS propagation depends on your provider (usually 1-24 hours)."
  },
  {
    q: "Is this a subscription?",
    a: "We offer both one-time passes and pro subscriptions for agencies managing multiple domains."
  },
  {
    q: "Why can't I just use Adobe Illustrator?",
    a: "Adobe Illustrator exports standard SVG, which often contains 'unsafe' elements (scripts, foreignObjects) that Gmail rejects. We clean and restructure the file specifically for the Tiny-PS profile."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-brand-dark scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Everything you need to know about BIMI implementation.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-900 text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};