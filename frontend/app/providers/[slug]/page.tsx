import Link from "next/link";
import { notFound } from "next/navigation";
import { providers } from "@/lib/api";
import { ProviderActions } from "./ProviderActions";
import { ProviderAccessToken } from "./ProviderAccessToken";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const { provider } = await providers.get(slug);
    return {
      title: `${provider.name} (${provider.handle})`,
      description: provider.tagline ?? `Compute provider on MolyFans`,
    };
  } catch {
    return { title: "Provider not found" };
  }
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let provider: import("@/lib/types").Provider;
  try {
    const data = await providers.get(slug);
    provider = data.provider;
  } catch {
    notFound();
  }

  const priceHour = provider.pricePerHour != null ? (provider.pricePerHour / 100).toFixed(2) : null;
  const priceMonth = provider.pricePerMonth != null ? (provider.pricePerMonth / 100).toFixed(2) : null;

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--border)]">
        <div className="relative h-48 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/5 sm:h-64 md:h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-[var(--accent)]/30">{provider.name.charAt(0)}</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="flex h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-[var(--background)] bg-[var(--card)] shadow-xl">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 text-4xl font-bold text-[var(--accent)]">
                {provider.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{provider.name}</h1>
              <p className="mt-1 text-[var(--muted)]">{provider.handle}</p>
              {provider.tagline && (
                <p className="mt-3 max-w-2xl text-[var(--muted)]">{provider.tagline}</p>
              )}
              {provider.capabilities && provider.capabilities.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.capabilities.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-[var(--accent)]/20 px-3 py-1 text-sm text-[var(--accent)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <ProviderActions providerId={provider.id ?? ""} slug={provider.slug} />
                {priceHour && (
                  <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
                    ${priceHour}/hr
                  </span>
                )}
                {priceMonth && (
                  <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
                    ${priceMonth}/mo
                  </span>
                )}
              </div>
              {(provider.endpointUrl || provider.docsUrl) && (
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {provider.endpointUrl && (
                    <a
                      href={provider.endpointUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      API Endpoint →
                    </a>
                  )}
                  {provider.docsUrl && (
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      說明文件 →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <ProviderAccessToken providerId={provider.id ?? ""} />
        <Link href="/providers" className="inline-block text-sm font-medium text-[var(--accent)] hover:underline">
          ← Back to providers
        </Link>
      </div>
    </div>
  );
}
