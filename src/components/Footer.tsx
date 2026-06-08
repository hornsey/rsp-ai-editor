import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface">
      <div className="app-shell flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_fix_high
            </span>
            <span className="font-extrabold text-on-surface">RSP AI Editor</span>
          </div>
          <p className="text-sm leading-6 text-on-surface-variant">
            Fast image and copy editing for creators, sellers, and solo teams. Start without signup, upgrade when volume grows.
          </p>
          <p className="mt-4 text-xs text-on-surface-variant">© {year} RSP AI Editor. All rights reserved.</p>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm md:grid-cols-3">
          <Link href="/editor" className="text-on-surface-variant hover:text-primary">Editor</Link>
          <Link href="/features" className="text-on-surface-variant hover:text-primary">Features</Link>
          <Link href="/pricing" className="text-on-surface-variant hover:text-primary">Pricing</Link>
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary">Privacy</Link>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary">Terms</Link>
          <Link href="/refund" className="text-on-surface-variant hover:text-primary">Refund</Link>
          <Link href="/cookie" className="text-on-surface-variant hover:text-primary">Cookie</Link>
          <Link href="/blog/ai-editor-rsp-editing-guide" className="text-on-surface-variant hover:text-primary">Guide</Link>
        </nav>
      </div>
    </footer>
  );
}
