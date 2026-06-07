import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-4 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1440px] mx-auto bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        <span className="font-semibold text-lg text-primary">RSP AI Editor</span>
      </div>

      <p className="text-sm text-on-surface-variant">
        © {currentYear} RSP AI Editor. Precision. Intelligence. Weightless.
      </p>

      <nav className="flex gap-6">
        <Link href="/features" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
          Features
        </Link>
        <Link href="/pricing" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
          Pricing
        </Link>
        <Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
