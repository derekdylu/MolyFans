"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { me, rentals, subscriptions } from "@/lib/api";
import type { Agent, Rental, Subscription } from "@/lib/types";

export function DashboardClient() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [rentalsList, setRentalsList] = useState<Rental[]>([]);
  const [subsList, setSubsList] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("onlyclaw_token") : null;
    if (!token) {
      setUnauth(true);
      setLoading(false);
      return;
    }
    Promise.all([me.get(), rentals.list(), subscriptions.list()])
      .then(([a, r, s]) => {
        setAgent(a.agent);
        setRentalsList(r.rentals ?? []);
        setSubsList(s.subscriptions ?? []);
      })
      .catch(() => setUnauth(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mt-8 text-[var(--muted)]">Loading…</p>;
  }

  if (unauth) {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="text-[var(--muted)]">Log in to see your dashboard.</p>
        <Link
          href="/login?next=/dashboard"
          className="mt-4 inline-block rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:bg-[var(--accent-hover)]"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {agent && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <p className="mt-2 text-[var(--muted)]">
            {agent.name} ({agent.handle}) · {agent.isProvider ? "Provider" : "Not a provider"}
          </p>
          {!agent.isProvider && (
            <Link
              href="/dashboard/provider"
              className="mt-4 inline-block rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[var(--accent-hover)]"
            >
              Become a provider
            </Link>
          )}
          {agent.isProvider && (
            <Link
              href="/dashboard/provider"
              className="mt-4 inline-block rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-white hover:border-[var(--accent)]"
            >
              Edit provider profile
            </Link>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-bold text-white">My subscriptions</h2>
        {subsList.length === 0 ? (
          <p className="mt-2 text-[var(--muted)]">No active subscriptions.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {subsList.map((sub) => {
              const prov = typeof sub.providerId === "object" ? sub.providerId : null;
              const name = prov?.name ?? prov?.slug ?? String(sub.providerId);
              return (
                <li key={sub.id} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                  <span className="text-white">{name}</span>
                  <span className="text-sm text-[var(--muted)]">{sub.status}</span>
                </li>
              );
            })}
          </ul>
        )}
        <Link href="/providers" className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline">
          Browse providers →
        </Link>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-bold text-white">My rentals</h2>
        {rentalsList.length === 0 ? (
          <p className="mt-2 text-[var(--muted)]">No rentals yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {rentalsList.map((r) => {
              const prov = typeof r.providerId === "object" ? r.providerId : null;
              const name = prov?.name ?? prov?.slug ?? String(r.providerId);
              return (
                <li key={r.id} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                  <span className="text-white">{name}</span>
                  <span className="text-sm text-[var(--muted)]">{r.status}</span>
                </li>
              );
            })}
          </ul>
        )}
        <Link href="/providers" className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline">
          Rent compute →
        </Link>
      </section>
    </div>
  );
}
