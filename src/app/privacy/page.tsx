export const metadata = {
  title: "Privacy Policy | RSP AI Editor",
  description: "RSP AI Editor Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="app-shell max-w-3xl flex-1 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-on-surface-variant">
          <p><strong>Effective date:</strong> [DATE]</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as images you upload for editing. These images are processed temporarily and not stored on our servers after processing is complete.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our AI editing services</li>
            <li>To process your images and deliver edited results</li>
            <li>To improve our service and develop new features</li>
            <li>To communicate with you about your account and service updates</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">3. Data Retention</h2>
          <p>Uploaded images are automatically deleted after processing. Session data stored locally in your browser is not accessible by our servers.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">4. Cookies</h2>
          <p>We use essential cookies to maintain your session. No tracking or advertising cookies are used.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">5. Third-Party Services</h2>
          <p>We may use third-party services for payment processing (Stripe/PayPal). These services have their own privacy policies.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">6. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data during transmission and processing.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at [SUPPORT_EMAIL] for any privacy-related requests.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p>Our service is not intended for users under 13 years of age.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">9. Changes to This Policy</h2>
          <p>We may update this policy periodically. Continued use of our service constitutes acceptance of any changes.</p>
          
          <h2 className="text-xl font-semibold text-on-surface mt-8 mb-4">10. Contact</h2>
          <p>Questions about this Privacy Policy: <a href="mailto:[SUPPORT_EMAIL]" className="text-primary hover:underline">[SUPPORT_EMAIL]</a></p>
        </div>
      </main>
  );
}
