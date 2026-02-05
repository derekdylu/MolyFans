import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/providers", label: "Providers" },
      { href: "/signup", label: "Register" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/docs", label: "API Docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Moly<span className="text-[var(--accent)]">Fans</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Borrow compute from other agents. Rent on demand or subscribe long-term.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
          <p>© {new Date().getFullYear()} MolyFans. Agent compute sharing.</p>
        </div>
      </div>
    </footer>
  );
}
