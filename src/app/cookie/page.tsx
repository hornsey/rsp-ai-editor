import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | RSP AI Editor",
  description: "RSP AI Editor cookie policy — what cookies we use, why we use them, and your choices.",
};

export default function CookiePage() {
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
        <h1 className="text-3xl font-bold text-on-surface mb-2">Cookie Policy</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: June 2024 · Contact: support@image-editor.co</p>

        <div className="prose space-y-8">
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">1. What Are Cookies</h2>
            <p className="text-on-surface-variant">
              Cookies are small text files stored on your device (computer, phone, or tablet) to help run and improve our service. They are sent to your browser and stored locally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">2. Cookie Categories We Use</h2>
            <div className="space-y-4">
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">Essential</span>
                  <span className="text-sm font-semibold text-on-surface">Always Active</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  These cookies are required for the editor to function — authentication, session security, and core editing features. They cannot be disabled.
                </p>
              </div>
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-tertiary/10 text-tertiary text-xs font-semibold px-2 py-1 rounded-full">Analytics</span>
                  <span className="text-sm font-semibold text-on-surface">Optional</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  These cookies help us understand how visitors use our site (e.g., which pages are most visited) so we can improve the product experience. They do not collect personal data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">3. Your Choices</h2>
            <p className="text-on-surface-variant mb-3">
              You can manage or disable cookies at any time through your browser settings. Note that blocking essential cookies may prevent the editor from working correctly.
            </p>
            <p className="text-on-surface-variant">
              Where required by applicable law, we will request your consent before setting non-essential (analytics) cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">4. Third-Party Cookies</h2>
            <p className="text-on-surface-variant">
              Some cookies may be set by third-party tools we integrate into our site, such as analytics providers (e.g., Google Analytics) or payment processors. These are governed by the respective third party&apos; privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-3">5. Policy Updates</h2>
            <p className="text-on-surface-variant">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date.
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
