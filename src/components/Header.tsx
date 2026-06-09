"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { getAuthMe, logout, type AuthMeData } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog/ai-editor-rsp-editing-guide", label: "Guide" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useState<AuthMeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAuthMe()
      .then((data) => {
        if (!cancelled) setAuth(data);
      })
      .catch(() => {
        if (!cancelled) setAuth({ authenticated: false });
      });
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuth({ authenticated: false });
  };

  const authControl = auth?.authenticated ? (
    <div className="hidden items-center gap-2 md:flex">
      {auth.user?.picture ? (
        <img src={auth.user.picture} alt="Google profile" className="h-8 w-8 rounded-full border border-outline-variant" />
      ) : null}
      <span className="max-w-28 truncate text-sm font-bold text-on-surface">
        {auth.user?.name || "Signed in"}
      </span>
      <button type="button" onClick={handleLogout} className="text-sm font-bold text-on-surface-variant hover:text-primary">
        Sign out
      </button>
    </div>
  ) : (
    <div className="hidden md:block">
      <GoogleLoginButton compact />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-background/90 backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_fix_high
          </span>
          <span className="truncate text-lg font-extrabold text-on-surface">RSP AI Editor</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-muted hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {authControl}
          <Link href="/editor" className="primary-button hidden px-4 py-2 text-sm sm:inline-flex">
            <span className="material-symbols-outlined text-lg">bolt</span>
            Start Free
          </Link>
          <button
            className="rounded-lg border border-outline-variant bg-surface p-2 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav className="border-t border-outline-variant bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {auth?.authenticated ? (
              <button type="button" onClick={handleLogout} className="secondary-button mt-2 text-sm">
                Sign out
              </button>
            ) : (
              <GoogleLoginButton compact className="secondary-button mt-2 text-sm" />
            )}
            <Link href="/editor" className="primary-button mt-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
              Open Editor
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
