"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="font-semibold text-xl text-primary">RSP AI Editor</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-medium text-primary border-b-2 border-primary px-3 py-1">
            Home
          </Link>
          <Link href="/features" className="font-medium text-on-surface-variant hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="font-medium text-on-surface-variant hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/editor"
          className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-medium hover:opacity-90 active:scale-95 transition-transform"
        >
          Start Free
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-surface border-t border-outline-variant px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="font-medium text-primary">Home</Link>
          <Link href="/features" className="font-medium text-on-surface-variant">Features</Link>
          <Link href="/pricing" className="font-medium text-on-surface-variant">Pricing</Link>
          <Link href="/editor" className="font-medium text-primary">Start Free</Link>
        </nav>
      )}
    </header>
  );
}
