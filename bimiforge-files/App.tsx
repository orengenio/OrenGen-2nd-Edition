import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Hero, HowItWorks } from './components/Hero';
import { Reviews } from './components/Reviews';
import { ComparisonTable } from './components/ComparisonTable';
import { Pricing } from './components/Pricing';
import { Newsletter } from './components/Newsletter';
import { Workspace } from './components/Workspace';
import { BimiChecker } from './components/BimiChecker';
import { SpfTool } from './components/SpfTool';
import { DmarcTool } from './components/DmarcTool';
import { DkimTool } from './components/DkimTool';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { FAQ } from './components/FAQ';
import { Affiliate } from './components/Affiliate';
import { PrivacyPolicy, TermsOfService, RefundPolicy, ServiceLevelAgreement, SecurityCompliance, DataProcessingAgreement, GDPRPolicy } from './components/LegalPages';
import { OurStory, InTheNews, WhyChooseUs, BimiHistory, VmcCertification } from './components/InfoPages';
import { BlogList, BlogPost } from './components/Blog';

const LandingPage: React.FC = () => (
  <>
    <Hero />
    <HowItWorks />
    <ComparisonTable />
    <Pricing />
    <FAQ />
    <Reviews />
    <Affiliate />
    <Newsletter />
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/check" element={<BimiChecker />} />
          <Route path="/quiz" element={<KnowledgeQuiz />} />
          <Route path="/tools/spf" element={<SpfTool />} />
          <Route path="/tools/dmarc" element={<DmarcTool />} />
          <Route path="/tools/dkim" element={<DkimTool />} />
          
          {/* Informational Pages */}
          <Route path="/story" element={<OurStory />} />
          <Route path="/news" element={<InTheNews />} />
          <Route path="/why-us" element={<WhyChooseUs />} />
          <Route path="/history" element={<BimiHistory />} />
          <Route path="/vmc" element={<VmcCertification />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/sla" element={<ServiceLevelAgreement />} />
          <Route path="/security" element={<SecurityCompliance />} />
          <Route path="/dpa" element={<DataProcessingAgreement />} />
          <Route path="/gdpr" element={<GDPRPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;