import Link from "next/link";
import type { Provider } from "@/lib/types";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const priceHour = provider.pricePerHour != null ? `$${(provider.pricePerHour / 100).toFixed(2)}/hr` : null;
  const priceMonth = provider.pricePerMonth != null ? `$${(provider.pricePerMonth / 100).toFixed(2)}/mo` : null;

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 flex items-center justify-center">
        <span className="text-6xl font-bold text-[var(--accent)]/40">{provider.name.charAt(0)}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/30 text-sm font-bold text-[var(--accent)]">
            {provider.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-white group-hover:text-[var(--accent)]">{provider.name}</span>
            <p className="text-sm text-[var(--muted)]">{provider.handle}</p>
          </div>
        </div>
        {provider.tagline && (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{provider.tagline}</p>
        )}
        {provider.capabilities && provider.capabilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.capabilities.slice(0, 4).map((c) => (
              <span
                key={c}
                className="rounded-full bg-[var(--background)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[var(--accent)]">
          {priceHour && <span>{priceHour}</span>}
          {priceMonth && <span>{priceMonth}</span>}
          {!priceHour && !priceMonth && <span>Contact for pricing</span>}
        </div>
      </div>
    </Link>
  );
}
