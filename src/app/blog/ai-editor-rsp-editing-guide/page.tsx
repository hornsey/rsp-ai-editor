import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use AI Editor RSP Editing Workflow | RSP AI Editor",
  description: "Step-by-step guide to using the RSP AI Editor for fast, professional image editing without complex software. Upload, select a mode, and download in seconds.",
};

export default function BlogPostPage() {
  return (
    <>
      <header className="w-full top-0 sticky z-30 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
            <span className="text-xl font-bold text-primary">RSP AI Editor</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm text-on-surface-variant hover:text-primary">Features</Link>
            <Link href="/pricing" className="text-sm text-on-surface-variant hover:text-primary">Pricing</Link>
            <Link href="/editor" className="text-sm bg-primary text-on-primary px-4 py-2 rounded-lg font-medium">Start Free</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span>How to Use AI Editor RSP Editing Workflow</span>
        </nav>

        <article className="prose">
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
            How to Use AI Editor RSP Editing Workflow
          </h1>

          <p className="text-lg text-on-surface-variant mb-8">
            A practical guide to getting professional-quality image edits in under 3 minutes — no design skills, no software installation, no signup required.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">What is RSP AI Editor?</h2>
          <p className="text-on-surface-variant mb-4">
            RSP AI Editor is a browser-based AI editing tool that handles common image tasks — enhancing quality, removing backgrounds, and restyling images — using artificial intelligence. It&apos;s designed for creators, small business owners, and anyone who needs quick, polished visuals without learning Photoshop or hiring a designer.
          </p>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">Getting Started in 3 Steps</h2>

          <div className="space-y-6">
            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">Upload Your Image</h3>
                  <p className="text-sm text-on-surface-variant">
                    Drag and drop any JPG, PNG, or WebP file directly onto the editor, or click to browse. Maximum file size is 10MB. The upload is instant — no account needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">Choose Your Editing Mode</h3>
                  <p className="text-sm text-on-surface-variant mb-3">Pick the mode that matches your goal:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-base">colors_spark</span>
                      <strong>Auto Enhance</strong> — Fix lighting, color, and clarity automatically
                    </li>
                    <li className="flex items-center gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-base">auto_fix_high</span>
                      <strong>Background Remove</strong> — Get a clean cutout in one click
                    </li>
                    <li className="flex items-center gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-primary text-base">palette</span>
                      <strong>Restyle</strong> — Transform your photo into artistic styles
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-2">Download Your Result</h3>
                  <p className="text-sm text-on-surface-variant">
                    Preview the AI-generated result and download immediately. Free users get standard quality. Pro users unlock HD export with no watermarks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">Common Mistakes and How to Avoid Them</h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">cancel</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Uploading files over 10MB</p>
                <p className="text-xs text-on-surface-variant">Compress your image first using any free online tool before uploading.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">cancel</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Using screenshots instead of photos</p>
                <p className="text-xs text-on-surface-variant">Screenshots have compression artifacts. For best AI results, use original camera photos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Starting with a well-lit photo</p>
                <p className="text-xs text-on-surface-variant">Even low-quality photos improve significantly, but well-lit originals yield professional-grade results.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-on-surface mt-8 mb-4">When to Upgrade to Pro</h2>
          <p className="text-on-surface-variant mb-4">
            The Free plan gives you 10 edits per day — enough to try the tool and handle occasional tasks. Upgrade to Pro when you need:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-on-surface-variant mb-8">
            <li>Unlimited daily edits for regular content production</li>
            <li>HD-quality export without watermarks for client or commercial use</li>
            <li>Batch processing up to 10 images at once</li>
            <li>Priority processing speed during high-traffic periods</li>
          </ul>

          {/* CTA */}
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to try it yourself?</h3>
            <p className="text-sm text-on-primary-container/80 mb-6">No signup, no credit card — open the editor and make your first edit in 30 seconds.</p>
            <Link href="/editor" className="inline-block bg-primary text-on-primary px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all">
              Open the Editor — It&apos;s Free
            </Link>
          </div>
        </article>
      </main>

      <footer className="py-8 px-6 border-t border-outline-variant">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant">© 2024 RSP AI Editor</p>
          <nav className="flex gap-4">
            <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary">Terms</Link>
            <Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary">Privacy</Link>
            <Link href="/editor" className="text-sm text-primary hover:underline">Editor</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
