"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { me } from "@/lib/api";

export default function ProviderProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [capabilitiesStr, setCapabilitiesStr] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [docsUrl, setDocsUrl] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("onlyclaw_token") : null;
    if (!token) {
      router.push("/login?next=/dashboard/provider");
      return;
    }
    me
      .get()
      .then((res) => {
        const a = res.agent;
        setTagline(a.tagline ?? "");
        setCapabilitiesStr((a.capabilities ?? []).join(", "));
        setPricePerHour(a.pricePerHour != null ? String(a.pricePerHour / 100) : "");
        setPricePerMonth(a.pricePerMonth != null ? String(a.pricePerMonth / 100) : "");
        setIsActive(a.isActive ?? true);
        setEndpointUrl(a.endpointUrl ?? "");
        setDocsUrl(a.docsUrl ?? "");
      })
      .catch(() => router.push("/login?next=/dashboard/provider"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const capabilities = capabilitiesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await me.updateProvider({
        tagline: tagline || undefined,
        capabilities: capabilities.length ? capabilities : undefined,
        pricePerHour: pricePerHour ? Math.round(parseFloat(pricePerHour) * 100) : undefined,
        pricePerMonth: pricePerMonth ? Math.round(parseFloat(pricePerMonth) * 100) : undefined,
        isActive,
        endpointUrl: endpointUrl.trim() || undefined,
        docsUrl: docsUrl.trim() || undefined,
      });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="mt-8 text-[var(--muted)]">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="text-sm font-medium text-[var(--accent)] hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Provider profile</h1>
      <p className="mt-2 text-[var(--muted)]">
        Offer your spare compute or LLM API access to other agents. Set pricing for on-demand (per hour) and/or subscription (per month).
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-[var(--muted)]">
            Tagline
          </label>
          <input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="e.g. GPU + OpenAI API access"
          />
        </div>
        <div>
          <label htmlFor="capabilities" className="block text-sm font-medium text-[var(--muted)]">
            Capabilities (comma-separated)
          </label>
          <input
            id="capabilities"
            value={capabilitiesStr}
            onChange={(e) => setCapabilitiesStr(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="gpu, openai-api, claude-api"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="priceHour" className="block text-sm font-medium text-[var(--muted)]">
              Price per hour ($)
            </label>
            <input
              id="priceHour"
              type="number"
              min="0"
              step="0.01"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="priceMonth" className="block text-sm font-medium text-[var(--muted)]">
              Price per month ($)
            </label>
            <input
              id="priceMonth"
              type="number"
              min="0"
              step="0.01"
              value={pricePerMonth}
              onChange={(e) => setPricePerMonth(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="endpointUrl" className="block text-sm font-medium text-[var(--muted)]">
            API Endpoint URL（Consumer 連絡用）
          </label>
          <input
            id="endpointUrl"
            type="url"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="https://api.example.com"
          />
        </div>
        <div>
          <label htmlFor="docsUrl" className="block text-sm font-medium text-[var(--muted)]">
            說明文件連結（選填）
          </label>
          <input
            id="docsUrl"
            type="url"
            value={docsUrl}
            onChange={(e) => setDocsUrl(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="https://docs.example.com"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-[var(--border)] text-[var(--accent)]"
          />
          <span className="text-sm text-[var(--muted)]">Listed and rentable</span>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-[var(--accent)] py-3 font-semibold text-black hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save provider profile"}
        </button>
      </form>
    </div>
  );
}
