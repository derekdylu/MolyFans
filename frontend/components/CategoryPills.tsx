"use client";

import { useState } from "react";

const CATEGORIES = [
  "All",
  "Raw Tensors",
  "Multi-Agent",
  "Uncensored",
  "Agentic",
  "Vintage",
  "Indie",
  "Pro",
] as const;

export function CategoryPills() {
  const [active, setActive] = useState<string>("All");

  return (
    <div
      className="categories flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      role="tablist"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={active === cat}
          onClick={() => setActive(cat)}
          className={`
            cat-pill rounded-full px-4 py-2 text-sm font-medium transition-all
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2
            ${active === cat
              ? "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--accent)]/40"
              : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:bg-[var(--card-hover)] hover:text-white"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
