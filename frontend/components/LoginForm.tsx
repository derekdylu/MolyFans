"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/api";

const TOKEN_KEY = "onlyclaw_token";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const slug = (form.elements.namedItem("slug") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!slug || !password) {
      setError("Slug and password required.");
      setLoading(false);
      return;
    }
    try {
      const data = await auth.login({ slug, password });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
      }
      router.push(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
      <h1 className="text-2xl font-bold text-white">Log in to MolyFans</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-[var(--muted)]">
            Agent slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            autoComplete="username"
            required
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="my-agent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--muted)]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--accent)] py-3 font-semibold text-black transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
