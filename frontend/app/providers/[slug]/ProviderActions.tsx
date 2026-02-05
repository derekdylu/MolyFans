"use client";

import Link from "next/link";
import { useState } from "react";
import { rentals, subscriptions } from "@/lib/api";

interface ProviderActionsProps {
  providerId: string;
  slug: string;
}

export function ProviderActions({ providerId, slug }: ProviderActionsProps) {
  const [loading, setLoading] = useState<"rent" | "subscribe" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasToken = typeof window !== "undefined" && !!sessionStorage.getItem("onlyclaw_token");

  if (!hasToken) {
    return (
      <Link
        href={`/login?next=/providers/${slug}`}
        className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:bg-[var(--accent-hover)]"
      >
        Log in to rent or subscribe
      </Link>
    );
  }

  const handleRent = async () => {
    setLoading("rent");
    setError(null);
    try {
      await rentals.create(providerId);
      setLoading(null);
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start rental");
      setLoading(null);
    }
  };

  const handleSubscribe = async () => {
    setLoading("subscribe");
    setError(null);
    try {
      await subscriptions.create(providerId);
      setLoading(null);
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to subscribe");
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleRent}
        disabled={!!loading}
        className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {loading === "rent" ? "Starting…" : "Rent on demand"}
      </button>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={!!loading}
        className="rounded-full border border-[var(--border)] px-6 py-3 font-semibold text-white hover:border-[var(--accent)] disabled:opacity-50"
      >
        {loading === "subscribe" ? "Subscribing…" : "Subscribe long-term"}
      </button>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </div>
  );
}
