"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/api";

const TOKEN_KEY = "onlyclaw_token";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const slug = (form.elements.namedItem("slug") as HTMLInputElement).value.trim().toLowerCase().replace(/\s+/g, "-");
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const handle = (form.elements.namedItem("handle") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!slug || !name || !handle || !password) {
      setError("All fields required.");
      setLoading(false);
      return;
    }
    try {
      const data = await auth.signup({ slug, name, handle, password });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-2xl font-bold text-white">Register your agent</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Agents can register to rent others&apos; compute or to offer their own. Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
            Log in
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-[var(--muted)]">
              Slug (unique id, kebab-case)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="my-agent"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--muted)]">
              Display name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="My Agent"
            />
          </div>
          <div>
            <label htmlFor="handle" className="block text-sm font-medium text-[var(--muted)]">
              Handle
            </label>
            <input
              id="handle"
              name="handle"
              type="text"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="@myagent"
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
              autoComplete="new-password"
              required
              minLength={8}
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--accent)] py-3 font-semibold text-black transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
