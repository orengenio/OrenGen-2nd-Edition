import React from 'react';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode; lastUpdated: string }> = ({ title, children, lastUpdated }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">Last Updated: {lastUpdated}</p>
      <div className="prose prose-slate dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">This Privacy Policy describes how OrenGen Worldwide LLC, a Texas limited liability company ("OrenGen," "we," "us," or "our"), collects, uses, and protects information in connection with BIMI Forge (the "Service").</p>
    <p className="mb-4">By using the Service, you consent to this Policy.</p>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Information We Collect</h3>
    
    <div className="mb-4 space-y-4">
      <div>
        <p className="font-bold text-gray-900 dark:text-white mb-1">Account Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Organization name</li>
          <li>Billing details (processed via third-party providers)</li>
        </ul>
      </div>
      <div>
        <p className="font-bold text-gray-900 dark:text-white mb-1">User Content</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Logos, images, SVGs, and related assets you upload for processing</li>
        </ul>
      </div>
      <div>
        <p className="font-bold text-gray-900 dark:text-white mb-1">Technical Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address</li>
          <li>Device and browser type</li>
          <li>Usage logs and timestamps</li>
          <li>File metadata and hashes</li>
        </ul>
      </div>
    </div>
    <p className="mb-4 italic">We do not collect unnecessary personal data.</p>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. How We Use Information</h3>
    <p className="mb-2">We use information strictly to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Operate and maintain the Service</li>
      <li>Process and convert assets</li>
      <li>Secure the platform</li>
      <li>Provide customer support</li>
      <li>Comply with legal obligations</li>
    </ul>
    <p className="mb-4 font-semibold">We do not sell user data. Ever.</p>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Legal Basis for Processing</h3>
    <p className="mb-2">Processing is based on:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Contractual necessity (providing the Service)</li>
      <li>Legitimate business interests</li>
      <li>Legal compliance</li>
    </ul>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Data Storage and Security</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Data is stored using industry-standard infrastructure</li>
      <li>Access is restricted and logged</li>
      <li>Encryption is used where appropriate</li>
      <li>Immutable versioning may be applied for auditability</li>
    </ul>
    <p className="mb-4">No system is invulnerable, but we design for failure containment.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Data Retention</h3>
    <p className="mb-2">We retain data:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>While your account is active</li>
      <li>As required to provide the Service</li>
      <li>As required by law</li>
    </ul>
    <p className="mb-4">You may request deletion, subject to legal and operational constraints.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Third-Party Services</h3>
    <p className="mb-2">We use vetted third-party providers for:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Hosting</li>
      <li>Payment processing</li>
      <li>Infrastructure monitoring</li>
    </ul>
    <p className="mb-4">These providers access only what is required to perform their function and are bound by confidentiality obligations.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Intellectual Property and Uploaded Content</h3>
    <p className="mb-4">You retain ownership of your trademarks and uploaded assets.</p>
    <p className="mb-2">We do not:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Claim ownership</li>
      <li>Reuse assets outside Service operation</li>
      <li>Train external or general-purpose models on your content</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Cookies and Tracking</h3>
    <p className="mb-2">We may use minimal cookies or similar technologies for:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Authentication</li>
      <li>Session management</li>
      <li>Performance monitoring</li>
    </ul>
    <p className="mb-4">No ad tracking. No behavioral profiling.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Your Rights</h3>
    <p className="mb-2">Depending on jurisdiction, you may have the right to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Access your data</li>
      <li>Correct inaccuracies</li>
      <li>Request deletion</li>
      <li>Restrict processing</li>
    </ul>
    <p className="mb-4">Requests can be made via the contact below.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. International Use</h3>
    <p className="mb-4">The Service is operated from the United States. By using it, you acknowledge that data may be processed and stored in the U.S.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Children's Privacy</h3>
    <p className="mb-4">The Service is not intended for individuals under 18. We do not knowingly collect data from minors.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">12. Changes to This Policy</h3>
    <p className="mb-4">We may update this Policy from time to time. Continued use of the Service constitutes acceptance of the updated version.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">13. Contact</h3>
    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-lg">
      <p className="font-bold text-gray-900 dark:text-white mb-1">OrenGen Worldwide LLC</p>
      <p className="mb-1">1812 Open Range Drive Texas, United States</p>
      <p className="mb-0 text-brand-orange">Email: support@orengen.io</p>
    </div>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">These Terms of Service ("Terms") govern access to and use of BIMI Forge (the "Service"), a proprietary software product owned and operated by OrenGen Worldwide LLC, a Texas limited liability company ("OrenGen," "we," "us," or "our").</p>

    <p className="mb-4">By accessing or using the Service, you ("User," "you," or "your") agree to be bound by these Terms. If you do not agree, do not use the Service.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. The Service</h3>
    <p className="mb-4">BIMI Forge is a proprietary, cloud-based software platform that converts visual assets into BIMI-compliant SVG Tiny 1.2 (Tiny-PS) files and related outputs.</p>
    <p className="mb-4">The Service is provided on an "as-is" and "as-available" basis. We may modify, suspend, or discontinue any part of the Service at any time without liability.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Eligibility</h3>
    <p className="mb-4">You must be at least 18 years old and have the legal authority to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have authority to bind that entity.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Accounts and Access</h3>
    <p className="mb-2">You are responsible for:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Maintaining the confidentiality of your credentials</li>
      <li>All activity conducted under your account</li>
      <li>Ensuring your use complies with applicable laws</li>
    </ul>
    <p className="mb-4">We reserve the right to suspend or terminate access for any misuse, security risk, or violation of these Terms.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Fees and Payments</h3>
    <p className="mb-2">Certain features of the Service require payment.</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Fees are disclosed prior to purchase</li>
      <li>All payments are non-refundable unless expressly stated</li>
      <li>We may change pricing at any time with prospective effect</li>
    </ul>
    <p className="mb-4">Failure to pay may result in suspension or termination of access.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. User Content</h3>
    <p className="mb-4">You retain ownership of any logos, images, or files you upload ("User Content").</p>
    <p className="mb-4">By using the Service, you grant OrenGen a limited, non-exclusive, royalty-free license to process, transform, store, and transmit User Content solely for the purpose of operating the Service.</p>
    <p className="mb-4">We do not claim ownership of your trademarks or brand assets.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Intellectual Property</h3>
    <p className="mb-4">BIMI Forge, including all software, algorithms, workflows, designs, interfaces, documentation, and outputs (excluding User Content), is proprietary intellectual property of OrenGen Worldwide LLC.</p>
    <p className="mb-2">You may not:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Reverse engineer, decompile, or disassemble the Service</li>
      <li>Copy, resell, sublicense, or redistribute the Service</li>
      <li>Use the Service to build or train competing products</li>
    </ul>
    <p className="mb-4">All rights not expressly granted are reserved.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Acceptable Use</h3>
    <p className="mb-2">You agree not to use the Service to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Violate any law or regulation</li>
      <li>Infringe intellectual property rights</li>
      <li>Upload malicious code or harmful content</li>
      <li>Misrepresent ownership of trademarks</li>
      <li>Abuse, overload, or disrupt the Service</li>
    </ul>
    <p className="mb-4">We enforce zero tolerance for abuse.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. No Guarantee of BIMI Acceptance</h3>
    <p className="mb-4">While BIMI Forge generates files compliant with published BIMI specifications, we do not guarantee acceptance by mailbox providers, certificate authorities, or third-party platforms.</p>
    <p className="mb-4">BIMI implementation depends on factors beyond our control, including DNS configuration, VMC issuance, and provider policies.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Confidentiality</h3>
    <p className="mb-4">Non-public aspects of the Service, including performance data, workflows, and technical details, are confidential and may not be disclosed without written consent.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. Disclaimer of Warranties</h3>
    <p className="mb-4 uppercase font-medium">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE."</p>
    <p className="mb-4 uppercase font-medium">TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORENGEN DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Limitation of Liability</h3>
    <p className="mb-2 uppercase font-medium">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1 uppercase font-medium">
      <li>ORENGEN SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES</li>
      <li>TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE PRIOR 12 MONTHS</li>
      <li>THIS LIMITATION APPLIES REGARDLESS OF THEORY OF LIABILITY.</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">12. Indemnification</h3>
    <p className="mb-2">You agree to indemnify and hold harmless OrenGen Worldwide LLC from any claims, damages, losses, or expenses arising from:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Your use of the Service</li>
      <li>Your User Content</li>
      <li>Your violation of these Terms</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">13. Termination</h3>
    <p className="mb-4">We may terminate or suspend access immediately for any violation of these Terms.</p>
    <p className="mb-2">Upon termination:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Your access ends</li>
      <li>License grants are revoked</li>
      <li>Sections intended to survive shall survive</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">14. Governing Law and Venue</h3>
    <p className="mb-4">These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles.</p>
    <p className="mb-4">Any legal action shall be brought exclusively in state or federal courts located in Texas.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">15. Changes to These Terms</h3>
    <p className="mb-4">We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">16. Contact Information</h3>
    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-lg">
      <p className="font-bold text-gray-900 dark:text-white mb-1">OrenGen Worldwide LLC</p>
      <p className="mb-1">1812 Open Range Drive Texas, United States</p>
      <p className="mb-0 text-brand-orange">Email: support@orengen.io</p>
    </div>
  </LegalLayout>
);

export const RefundPolicy: React.FC = () => (
  <LegalLayout title="Refund Policy" lastUpdated="October 26, 2023">
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8">
      <p className="font-bold text-red-700 dark:text-red-300">Strict No-Refund Policy</p>
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">Please read carefully before purchasing.</p>
    </div>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">1. All Sales Are Final</h3>
    <p className="mb-4"><strong>We do not issue refunds</strong> for any of our services, subscriptions, or one-time purchases once the transaction is completed. By making a purchase on BIMI Forge, you acknowledge and agree to this policy.</p>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">2. Why No Refunds?</h3>
    <p className="mb-4">Our services involve immediate costs associated with high-performance cloud computing (for AI vectorization), API calls for real-time validation, and intellectual property generation. Because the generated SVG files and validation reports are digital goods that cannot be "returned," we cannot offer refunds.</p>
    
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">3. Try Before You Buy</h3>
    <p className="mb-4">We provide extensive free tools (BIMI Checker, SPF/DMARC Generators) and detailed previews of the conversion process. We strongly encourage you to use these resources to ensure our service meets your specific needs before committing to a purchase.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">4. Cancellations</h3>
    <p className="mb-4">For recurring subscriptions, you may cancel your subscription at any time via your account workspace. Cancellation prevents future billing, but no prorated refunds will be issued for the remaining time in the current billing cycle. You will retain access to premium features until the cycle ends.</p>
  </LegalLayout>
);

export const ServiceLevelAgreement: React.FC = () => (
  <LegalLayout title="Enterprise Service Level Agreement (SLA)" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">This Enterprise Service Level Agreement ("SLA") governs the availability, support, and operational commitments for BIMI Forge, a proprietary software product operated by OrenGen Worldwide LLC, a Texas limited liability company ("OrenGen").</p>
    <p className="mb-4">This SLA applies to enterprise customers with an active paid agreement ("Customer").</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Service Availability</h3>
    <p className="mb-2 font-semibold">Uptime Commitment:</p>
    <p className="mb-2">99.9% monthly uptime, excluding permitted downtime.</p>
    <p className="mb-2 font-semibold">Uptime Definition:</p>
    <p className="mb-2">The Service is considered "available" when core asset processing and retrieval functions are operational.</p>
    <p className="mb-2 font-semibold">Measurement:</p>
    <p className="mb-4">Calculated monthly, based on server-side monitoring.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Permitted Downtime</h3>
    <p className="mb-2">The following do not count against uptime:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Scheduled maintenance (with reasonable notice)</li>
      <li>Emergency security fixes</li>
      <li>Force majeure events</li>
      <li>Third-party infrastructure outages beyond OrenGen's control</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Support Response Times</h3>
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Initial Response</th>
            <th className="px-4 py-3">Target Resolution</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
                <td className="px-4 py-3 font-medium">Critical</td>
                <td className="px-4 py-3">Service unavailable</td>
                <td className="px-4 py-3">≤ 1 hour</td>
                <td className="px-4 py-3">Continuous effort</td>
            </tr>
            <tr>
                <td className="px-4 py-3 font-medium">High</td>
                <td className="px-4 py-3">Major feature impaired</td>
                <td className="px-4 py-3">≤ 4 hours</td>
                <td className="px-4 py-3">Business hours</td>
            </tr>
            <tr>
                <td className="px-4 py-3 font-medium">Medium</td>
                <td className="px-4 py-3">Partial degradation</td>
                <td className="px-4 py-3">≤ 1 business day</td>
                <td className="px-4 py-3">Best effort</td>
            </tr>
            <tr>
                <td className="px-4 py-3 font-medium">Low</td>
                <td className="px-4 py-3">General inquiry</td>
                <td className="px-4 py-3">≤ 2 business days</td>
                <td className="px-4 py-3">As scheduled</td>
            </tr>
        </tbody>
      </table>
    </div>
    <p className="mb-4">Support is provided via designated enterprise channels.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Data Integrity and Versioning</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Assets are stored immutably by version</li>
      <li>No destructive overwrites by default</li>
      <li>Auditability maintained via hashes and timestamps</li>
      <li>Rollback supported through version activation controls</li>
    </ul>
    <p className="mb-4">This is a platform guarantee, not a courtesy feature.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Security Commitments</h3>
    <p className="mb-2">OrenGen maintains:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Role-based access controls</li>
      <li>Logical separation of customer data</li>
      <li>Encrypted data in transit</li>
      <li>Restricted production access</li>
      <li>Incident logging and monitoring</li>
    </ul>
    <p className="mb-4">Security architecture is proprietary.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Incident Notification</h3>
    <p className="mb-2">In the event of a confirmed security incident materially affecting Customer data:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Notification will occur without unreasonable delay</li>
      <li>High-level impact summary will be provided</li>
      <li>Detailed forensics may be limited for security reasons</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Service Credits (Optional)</h3>
    <p className="mb-4">If monthly uptime falls below 99.9%, Customer may request service credits as follows:</p>
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full text-left text-sm whitespace-nowrap w-auto">
        <thead className="uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3">Uptime</th>
            <th className="px-4 py-3">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
                <td className="px-4 py-3">99.0% – 99.89%</td>
                <td className="px-4 py-3">5%</td>
            </tr>
            <tr>
                <td className="px-4 py-3">98.0% – 98.99%</td>
                <td className="px-4 py-3">10%</td>
            </tr>
            <tr>
                <td className="px-4 py-3">&lt; 98.0%</td>
                <td className="px-4 py-3">20%</td>
            </tr>
        </tbody>
      </table>
    </div>
    <p className="mb-4">Credits apply to future invoices only. No cash refunds.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Exclusions</h3>
    <p className="mb-2">This SLA does not apply to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Free or trial usage</li>
      <li>Beta features</li>
      <li>Customer misconfiguration</li>
      <li>DNS, VMC, or mailbox provider failures</li>
      <li>BIMI acceptance decisions by third parties</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Termination and Remedies</h3>
    <p className="mb-4">This SLA is the sole and exclusive remedy for service availability issues. No additional warranties are implied.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. Governing Law</h3>
    <p className="mb-4">This SLA is governed by the laws of the State of Texas, without regard to conflict-of-law rules.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Entire Agreement</h3>
    <p className="mb-4">This SLA supplements, but does not replace, the BIMI Forge Terms of Service. In case of conflict, the enterprise agreement controls.</p>
  </LegalLayout>
);

export const SecurityCompliance: React.FC = () => (
  <LegalLayout title="SECURITY & COMPLIANCE ADDENDUM" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">This Security & Compliance Addendum ("Addendum") forms part of the Terms of Service and any Enterprise Agreement governing use of BIMI Forge (the "Service"), operated by OrenGen Worldwide LLC, a Texas limited liability company ("OrenGen").</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Security Governance</h3>
    <p className="mb-2">OrenGen maintains an internal security program designed to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Protect customer data from unauthorized access</li>
      <li>Preserve integrity and availability of the Service</li>
      <li>Reduce operational and supply-chain risk</li>
    </ul>
    <p className="mb-4">Security controls are risk-based and reviewed periodically.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Access Controls</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Role-based access control (RBAC) enforced</li>
      <li>Principle of least privilege applied</li>
      <li>Production access restricted to authorized personnel only</li>
      <li>Access events logged and monitored</li>
    </ul>
    <p className="mb-4">Administrative access is auditable.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Data Segregation</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Logical separation of customer data</li>
      <li>No cross-tenant access paths</li>
      <li>Environment-level isolation enforced</li>
    </ul>
    <p className="mb-4">Customer data is never shared between tenants.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Encryption</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Data encrypted in transit using industry-standard protocols</li>
      <li>Sensitive credentials protected at rest where applicable</li>
      <li>Secrets managed via restricted access systems</li>
    </ul>
    <p className="mb-4">Encryption standards evolve with industry best practice.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Asset Integrity & Version Control</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Immutable asset versioning</li>
      <li>No destructive overwrites by default</li>
      <li>Hash-based verification supported</li>
      <li>Rollback via version activation</li>
    </ul>
    <p className="mb-4">Integrity is enforced by design, not policy.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Logging & Monitoring</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Infrastructure and application-level logging</li>
      <li>Security-relevant events monitored</li>
      <li>Anomalies reviewed and triaged</li>
    </ul>
    <p className="mb-4">Logs are retained per operational requirements.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Incident Response</h3>
    <p className="mb-2">OrenGen maintains an incident response process that includes:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Detection and containment</li>
      <li>Impact assessment</li>
      <li>Customer notification when required</li>
      <li>Post-incident remediation</li>
    </ul>
    <p className="mb-4">Notification timelines align with contractual and legal obligations.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Vulnerability Management</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Dependency monitoring</li>
      <li>Patch management practices in place</li>
      <li>Critical vulnerabilities prioritized for remediation</li>
    </ul>
    <p className="mb-4">No public bug bounty is offered unless contractually agreed.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Compliance Posture</h3>
    <p className="mb-2">BIMI Forge is designed to align with commonly requested enterprise controls, including principles found in:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>SOC 2 (security, availability)</li>
      <li>ISO 27001 (control-aligned practices)</li>
      <li>GDPR data protection principles (where applicable)</li>
    </ul>
    <p className="mb-4">Formal certifications are not implied unless expressly stated in writing.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. Subprocessors</h3>
    <p className="mb-2">OrenGen may use vetted subprocessors for infrastructure, hosting, and payments.</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Subprocessors are contractually bound</li>
      <li>Access limited to operational necessity</li>
      <li>No subprocessors are permitted to exploit customer data</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Customer Responsibilities</h3>
    <p className="mb-2">Customer is responsible for:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Proper configuration of DNS, VMC, and BIMI records</li>
      <li>Securing their credentials</li>
      <li>Lawful use of uploaded assets</li>
    </ul>
    <p className="mb-4">Security is shared. Misconfiguration voids guarantees.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">12. Audit Requests</h3>
    <p className="mb-2">Reasonable audit or security questionnaire requests may be honored at OrenGen's discretion, subject to:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
      <li>Scope limitations</li>
      <li>Confidentiality obligations</li>
      <li>Operational impact</li>
    </ul>
    <p className="mb-4">On-site audits are not supported by default.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">13. No Absolute Security Guarantee</h3>
    <p className="mb-4">No system is immune to risk. This Addendum reflects reasonable and proportionate safeguards, not absolute security.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">14. Governing Law</h3>
    <p className="mb-4">This Addendum is governed by the laws of the State of Texas.</p>
  </LegalLayout>
);

export const DataProcessingAgreement: React.FC = () => (
  <LegalLayout title="DATA PROCESSING AGREEMENT (DPA)" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">This Data Processing Agreement (“DPA”) forms part of the Terms of Service and any applicable agreement between OrenGen Worldwide LLC, a Texas limited liability company (“OrenGen,” “Processor”), and the customer (“Customer,” “Controller”) governing use of BIMI Forge (the “Service”).</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Purpose and Scope</h3>
    <p className="mb-4">This DPA governs the processing of Personal Data by OrenGen on behalf of Customer in connection with the Service, in accordance with applicable data protection laws, including the GDPR, where applicable.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Roles of the Parties</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Customer is the Data Controller</strong></li>
        <li><strong>OrenGen is the Data Processor</strong></li>
    </ul>
    <p className="mb-4">OrenGen processes Personal Data solely on documented instructions from Customer, as required to provide the Service.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Categories of Data and Data Subjects</h3>
    <p className="mb-2 font-semibold">Data Subjects</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Customer employees</li>
        <li>Authorized users</li>
        <li>Account administrators</li>
    </ul>
    <p className="mb-2 font-semibold">Personal Data</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Name</li>
        <li>Email address</li>
        <li>IP address</li>
        <li>Account metadata</li>
        <li>Usage logs</li>
    </ul>
    <p className="mb-4">BIMI Forge is not designed for processing special categories of personal data.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Processing Details</h3>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Nature:</strong> Hosting, processing, transformation, storage</li>
        <li><strong>Purpose:</strong> Operation and delivery of the Service</li>
        <li><strong>Duration:</strong> For the term of the agreement and as required thereafter</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Processor Obligations</h3>
    <p className="mb-2">OrenGen shall:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Process data only as necessary to provide the Service</li>
        <li>Ensure personnel are bound by confidentiality obligations</li>
        <li>Implement appropriate technical and organizational safeguards</li>
        <li>Assist Customer with lawful data subject requests where applicable</li>
        <li>Notify Customer of a confirmed personal data breach without undue delay</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Security Measures</h3>
    <p className="mb-2">OrenGen maintains safeguards including:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Access controls and least-privilege enforcement</li>
        <li>Logical data segregation</li>
        <li>Encryption in transit</li>
        <li>Monitoring and incident response processes</li>
    </ul>
    <p className="mb-4">Detailed internal security architecture remains proprietary.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Subprocessors</h3>
    <p className="mb-2">Customer authorizes OrenGen to engage subprocessors for infrastructure, hosting, and payment processing.</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Subprocessors are contractually bound</li>
        <li>Access limited to necessity</li>
        <li>No subprocessor may use data for independent purposes</li>
    </ul>
    <p className="mb-4">A current list may be provided upon reasonable request.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. International Data Transfers</h3>
    <p className="mb-4">Customer acknowledges that data may be processed in the United States. Where required, transfers are supported by appropriate legal mechanisms.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Data Subject Rights</h3>
    <p className="mb-4">OrenGen shall reasonably assist Customer in responding to requests for access, correction, deletion, or restriction, to the extent legally required and technically feasible.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. Data Retention and Deletion</h3>
    <p className="mb-2">Upon termination of the Service:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Customer may request deletion of Personal Data</li>
        <li>Data may be retained where required by law or for legitimate business purposes</li>
        <li>Backups are deleted according to standard retention cycles</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Audits</h3>
    <p className="mb-2">Customer may submit reasonable written security or compliance inquiries.</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>On-site audits are not supported by default</li>
        <li>Responses subject to confidentiality and scope limitations</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">12. Liability</h3>
    <p className="mb-4">Liability under this DPA is subject to the limitations set forth in the Terms of Service or applicable enterprise agreement.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">13. Governing Law</h3>
    <p className="mb-4">This DPA is governed by the laws of the State of Texas, without regard to conflict-of-law principles.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">14. Order of Precedence</h3>
    <p className="mb-2">In the event of conflict:</p>
    <ol className="list-decimal pl-5 mb-4 space-y-1">
        <li>Enterprise Agreement (if applicable)</li>
        <li>This DPA</li>
        <li>Terms of Service</li>
    </ol>
  </LegalLayout>
);

export const GDPRPolicy: React.FC = () => (
  <LegalLayout title="GDPR COMPLIANCE & PRIVACY RIGHTS" lastUpdated="December 25, 2025">
    <div className="mb-8 p-4 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-lg border border-brand-blue/10">
      <p className="font-bold text-gray-900 dark:text-white">BIMI Forge</p>
      <p className="text-sm">Effective Date: December 25, 2025</p>
    </div>

    <p className="mb-4">This policy outlines the steps OrenGen Worldwide LLC ("OrenGen", "we") has taken to comply with the General Data Protection Regulation (GDPR) for users within the European Economic Area (EEA) using BIMI Forge.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Data Controller vs. Data Processor</h3>
    <p className="mb-4">Under GDPR, OrenGen acts primarily as a <strong>Data Processor</strong> when processing data you upload (logos, brand assets) to the platform. We act as a <strong>Data Controller</strong> regarding your account information (billing, email address).</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Legal Basis for Processing</h3>
    <p className="mb-2">We process personal data based on:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Contractual Performance:</strong> To deliver the software services you signed up for.</li>
        <li><strong>Legal Obligation:</strong> For tax, accounting, and security compliance.</li>
        <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud.</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Your GDPR Rights</h3>
    <p className="mb-2">If you are an EEA resident, you have the following rights:</p>
    <ul className="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Right to Access:</strong> You may request a copy of your personal data.</li>
        <li><strong>Right to Rectification:</strong> You may correct inaccurate data.</li>
        <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request deletion of your data, subject to legal retention requirements.</li>
        <li><strong>Right to Restriction:</strong> You may limit how we process your data.</li>
        <li><strong>Right to Data Portability:</strong> You may receive your data in a structured, machine-readable format.</li>
    </ul>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. International Data Transfers</h3>
    <p className="mb-4">OrenGen is located in the United States. Data collected in the EEA is transferred to the US. We rely on Standard Contractual Clauses (SCCs) or other lawful mechanisms to ensure your data is protected during transfer.</p>

    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. How to Exercise Your Rights</h3>
    <p className="mb-4">To submit a GDPR request, please contact our Data Protection Officer at:</p>
    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-lg">
      <p className="mb-0 text-brand-orange">Email: privacy@orengen.io</p>
      <p className="text-sm mt-2">Subject Line: GDPR Request</p>
    </div>
  </LegalLayout>
);