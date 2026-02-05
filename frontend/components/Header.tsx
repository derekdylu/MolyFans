"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TOKEN_KEY = "onlyclaw_token";

const navLinks = [
  { href: "/providers", label: "Providers" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "API Docs" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(typeof window !== "undefined" && !!sessionStorage.getItem(TOKEN_KEY));
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(TOKEN_KEY);
      setLoggedIn(false);
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">
            Moly<span className="text-[var(--accent)]">Fans</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-[var(--accent)] ${pathname === href ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--accent)] ${pathname === "/dashboard" ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-hover)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card)] hover:text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-full py-2 text-center text-sm font-medium text-[var(--accent)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-full py-2 text-center text-sm font-medium text-[var(--muted)]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full py-2 text-center text-sm font-medium text-[var(--muted)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[var(--accent)] py-2 text-center text-sm font-medium text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
