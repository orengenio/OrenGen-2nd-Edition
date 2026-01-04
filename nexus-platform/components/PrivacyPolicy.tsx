import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-orange-500 selection:text-white">
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
                <span className="text-orange-500">ORENGEN</span>
                <span>NEXUS</span>
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-white flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Privacy Policy</h1>
            <p className="text-lg text-slate-400">Last Updated: March 15, 2024</p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
            <p>
                At OrenGen Nexus, we take your privacy seriously. This policy describes how we collect, use, and protect your data when you use our Operating System, AI Agents, and Cloud Infrastructure.
            </p>

            <h3>1. Data Collection</h3>
            <p>
                We collect information you provide directly to us when you create an account, configure an Agent, or deploy a project. This includes:
            </p>
            <ul>
                <li><strong>Account Information:</strong> Name, email, and billing details.</li>
                <li><strong>Project Data:</strong> Brand guidelines, uploaded assets, and campaign configurations.</li>
                <li><strong>Usage Data:</strong> Interactions with AI agents and system performance metrics.</li>
            </ul>

            <h3>2. How We Use Your Data</h3>
            <p>
                Your data is used exclusively to power the Nexus OS features. We do not sell your data to third parties.
            </p>
            <ul>
                <li>To train and personalize your specific AI Agents (Context Injection).</li>
                <li>To automate workflows via third-party integrations (e.g., MailWizz, n8n) that you explicitly authorize.</li>
                <li>To improve system reliability and uptime.</li>
            </ul>

            <h3>3. AI & Data Security</h3>
            <p>
                Data processed by our AI models (Gemini Pro) is ephemeral within the context window or stored securely in your private vector database indices. We employ enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit.
            </p>

            <h3>4. Your Rights</h3>
            <p>
                As a user, you have the right to request a full export of your data (via the "Export Deployment Pack" feature) or a complete deletion of your account and associated knowledge bases.
            </p>

            <h3>5. Contact Us</h3>
            <p>
                If you have questions about this policy, please contact our Data Protection Officer at privacy@orengen.nexus.
            </p>
        </div>
      </main>

       <footer className="border-t border-white/10 py-12 text-center text-slate-500 text-sm">
         &copy; {new Date().getFullYear()} OrenGen Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;