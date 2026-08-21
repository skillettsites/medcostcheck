"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/procedures", label: "Procedures" },
  { href: "/states", label: "By State" },
  { href: "/guides", label: "Guides" },
  { href: "/save", label: "Ways to Save" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [openFor, setOpenFor] = useState<string | null>(null);
  const pathname = usePathname();

  // Derive "open" from the route rather than closing it in an effect. Setting
  // state inside an effect on every navigation causes a cascading render, and
  // the menu should simply never be open for a route the user just landed on.
  const menuOpen = openFor === pathname;
  const setMenuOpen = (open: boolean) => setOpenFor(open ? pathname : null);

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-[var(--hairline)]">
      <nav className="max-w-6xl mx-auto px-5 h-12 sm:h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <span className="w-6 h-6 rounded-[7px] bg-ink text-white grid place-items-center">
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[15px] sm:text-base font-semibold tracking-tight text-ink">
            MedCostCheck
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-[13px] rounded-full transition-colors ${
                  active ? "text-ink bg-black/[0.05]" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-ink rounded-full hover:bg-black/[0.04] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <div
        className={`md:hidden mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: true } : {})}
      >
        <div className="mobile-drawer-inner">
          <div className="px-5 pb-4 pt-1 space-y-0.5 border-t border-[var(--hairline)] bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 text-[15px] text-ink rounded-xl hover:bg-black/[0.04] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
