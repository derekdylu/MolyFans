import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Log in",
  description: "Log in to your MolyFans account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-[var(--muted)]">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
