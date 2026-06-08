export const metadata = {
  title: "Terms of Service | RSP AI Editor",
  description: "RSP AI Editor Terms of Service - Your rights and responsibilities when using our service.",
};

export default function TermsPage() {
  return (
    <main className="app-shell max-w-3xl flex-1 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-on-surface-variant">
          <p><strong>Effective date:</strong> [DATE]</p>
          <p><strong>Company:</strong> [LEGAL_ENTITY_NAME]</p>
          <p><strong>Contact:</strong> [SUPPORT_EMAIL]</p>
          
          <p className="mt-6">By using RSP AI Editor, you agree to these Terms.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">1. Service Scope</h2>
          <p>AI-assisted image and copy editing tools. Features may change over time.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">2. Accounts</h2>
          <p>You are responsible for account security and all activity under your account.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">3. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload illegal, copyrighted, or infringing content</li>
            <li>Abuse usage limits or circumvent rate restrictions</li>
            <li>Bypass security measures</li>
            <li>Impersonate official authorities or misrepresent the service</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">4. User Content</h2>
          <p>You retain all rights to your uploaded content. You grant us a limited, non-exclusive license to process your content solely to operate and improve the service.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">5. AI Output Disclaimer</h2>
          <p>AI outputs may be imperfect. Users must review all results before commercial or public use. We do not guarantee the accuracy, reliability, or fitness for any particular purpose.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">6. Payments & Subscriptions</h2>
          <p>Paid plans are billed in advance and renew automatically unless canceled. Prices are subject to change with 30 days notice.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">7. Refunds</h2>
          <p>See our Refund Policy for eligibility criteria and procedures.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">8. Intellectual Property</h2>
          <p>Service software, branding, and design are owned by [LEGAL_ENTITY_NAME] or its licensors. You may not copy, modify, or redistribute these without permission.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">9. Termination</h2>
          <p>We may suspend or terminate access for abuse, violations of these Terms, or legal/security reasons. Users may cancel their account at any time.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">10. Limitation of Liability</h2>
          <p>The service is provided &quot;as is&quot; to the extent permitted by law. We are not liable for indirect, incidental, or consequential damages.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">11. Governing Law</h2>
          <p>These Terms are governed by the laws of [JURISDICTION].</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">12. Contact</h2>
          <p>Questions about these Terms: <a href="mailto:[SUPPORT_EMAIL]" className="text-primary hover:underline">[SUPPORT_EMAIL]</a></p>
        </div>
      </main>
  );
}
