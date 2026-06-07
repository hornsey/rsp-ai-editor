import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | RSP AI Editor",
  description: "RSP AI Editor refund policy — learn about refund eligibility, request process, and response times.",
};

export default function RefundPage() {
  return (
    <>
      <header className="w-full top-0 sticky z-30 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
            <span className="text-xl font-bold text-primary">RSP AI Editor</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/editor" className="text-sm bg-primary text-on-primary px-4 py-2 rounded-lg font-medium">Start Free</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Refund Policy</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: June 2024 · Contact: support@image-editor.co</p>

        <div className="prose space-y-8">
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">1. Initial Purchase</h2>
            <p className="text-on-surface-variant">
              Refund requests are accepted within <strong>7 days</strong> of first purchase if usage is below 5 paid edits and no abuse or fraud signals are found. To request a refund, email <a href="mailto:support@image-editor.co" className="text-primary underline">support@image-editor.co</a> with your account email, transaction ID, and reason.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">2. Renewals</h2>
            <p className="text-on-surface-variant">
              Renewal charges are generally non-refundable except where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">3. Non-Refundable Cases</h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li>Excessive usage already consumed (5+ paid edits used)</li>
              <li>Policy violations or abuse of the service</li>
              <li>Chargebacks or payment fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">4. How to Request a Refund</h2>
            <p className="text-on-surface-variant mb-3">
              Email <a href="mailto:support@image-editor.co" className="text-primary underline">support@image-editor.co</a> with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li>The email address associated with your account</li>
              <li>Your transaction ID (found in your payment confirmation)</li>
              <li>A brief description of the issue</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">5. Response Time</h2>
            <p className="text-on-surface-variant">
              We aim to respond to all refund requests within <strong>3 business days</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">6. Policy Updates</h2>
            <p className="text-on-surface-variant">
              This policy may be updated from time to time. The latest version posted on this page applies to your subscription.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant">
          <p className="text-sm text-on-surface-variant">
            Questions? <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> · <Link href="/terms" className="text-primary underline">Terms of Service</Link>
          </p>
        </div>
      </main>
    </>
  );
}
