import React from 'react';
import DigitalStore from '../components/DigitalStore';
import CtaSection from '../components/CtaSection';

const Marketplace: React.FC<{ onOpenAudit: () => void }> = ({ onOpenAudit }) => {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-brand-black py-16 text-center border-b border-white/10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">The Digital <span className="text-brand-orange">Marketplace</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Premium snapshots, automation scripts, and SOPs to scale your agency.</p>
      </div>
      <DigitalStore />
      <CtaSection onOpenAudit={onOpenAudit} />
    </div>
  );
};

export default Marketplace;