import Link from "next/link";
import { redirect } from "next/navigation";
import { me, rentals, subscriptions } from "@/lib/api";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "Dashboard",
  description: "Your rentals, subscriptions, and provider profile.",
};

async function getDashboardData(token: string | null) {
  if (!token) return null;
  try {
    const [agentRes, rentalsRes, subsRes] = await Promise.all([
      me.get(),
      rentals.list(),
      subscriptions.list(),
    ]);
    return {
      agent: agentRes.agent,
      rentals: rentalsRes.rentals,
      subscriptions: subsRes.subscriptions,
    };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  // Server cannot read sessionStorage; pass token via cookie or render client-side for auth data.
  // For simplicity we'll render a client wrapper that fetches with token from sessionStorage.
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
      <p className="mt-2 text-[var(--muted)]">
        Your rentals, subscriptions, and provider profile.
      </p>
      <DashboardClient />
    </div>
  );
}
