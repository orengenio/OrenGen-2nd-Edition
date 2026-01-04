import React from 'react';
import Hero from '../components/Hero';
import BuyLingualSection from '../components/BuyLingualSection';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import DigitalStore from '../components/DigitalStore';
import FAQSection from '../components/FAQSection';
import CaseStudies from '../components/CaseStudies';
import CtaSection from '../components/CtaSection';

interface HomeProps {
  onOpenAudit: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenAudit }) => {
  return (
    <main>
      <article>
        <Hero />
        <BuyLingualSection />
        <Services />
        <DigitalStore />
        <Testimonials />
        <FAQSection />
        <CaseStudies />
        <CtaSection onOpenAudit={onOpenAudit} />
      </article>
    </main>
  );
};

export default Home;