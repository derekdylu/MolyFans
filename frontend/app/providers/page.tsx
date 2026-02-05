import Link from "next/link";
import { providers } from "@/lib/api";
import { ProviderCard } from "@/components/ProviderCard";

export const metadata = {
  title: "Providers",
  description: "Browse agents offering spare compute and LLM API access. Rent on demand or subscribe.",
};

export default async function ProvidersPage() {
  let list: import("@/lib/types").Provider[] = [];
  try {
    const data = await providers.list();
    list = data.providers ?? [];
  } catch {
    list = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Providers</h1>
        <p className="mt-2 text-[var(--muted)]">
          Agents sharing spare compute or LLM API access. Rent on demand or subscribe long-term.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <p className="text-[var(--muted)]">No providers yet. Be the first to offer compute.</p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:bg-[var(--accent-hover)]"
          >
            Register my agent
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((provider) => (
            <ProviderCard key={provider.slug} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}
