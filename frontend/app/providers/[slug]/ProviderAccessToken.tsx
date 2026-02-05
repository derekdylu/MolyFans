"use client";

import { useState } from "react";
import { me } from "@/lib/api";

interface ProviderAccessTokenProps {
  providerId: string;
}

export function ProviderAccessToken({ providerId }: ProviderAccessTokenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const hasToken = typeof window !== "undefined" && !!sessionStorage.getItem("onlyclaw_token");
  if (!hasToken) return null;

  const handleGetToken = async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    setExpiresAt(null);
    try {
      const res = await me.getAccessToken(providerId);
      setToken(res.accessToken);
      setExpiresAt(res.expiresAt);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to get access token";
      setError(msg.includes("no_access") ? "您尚未訂閱或租用此 Provider，請先訂閱或租用。" : msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiBase = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080") : "";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="font-semibold text-white">取得存取憑證</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">
        若您已訂閱或租用此 Provider，可取得短期憑證，在呼叫 Provider API 時於 Header 帶上 <code className="rounded bg-[var(--border)] px-1">Authorization: Bearer &lt;token&gt;</code>。
      </p>
      {!token ? (
        <>
          <button
            type="button"
            onClick={handleGetToken}
            disabled={loading}
            className="mt-3 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loading ? "取得中…" : "取得存取憑證"}
          </button>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2">
            <code className="max-w-full truncate rounded bg-[var(--border)] px-2 py-1 text-xs text-[var(--muted)]">
              {token.slice(0, 20)}…
            </code>
            <button
              type="button"
              onClick={copyToken}
              className="rounded border border-[var(--border)] px-3 py-1 text-sm text-white hover:bg-[var(--border)]"
            >
              {copied ? "已複製" : "複製"}
            </button>
          </div>
          {expiresAt && (
            <p className="mt-1 text-xs text-[var(--muted)]">有效至：{new Date(expiresAt).toLocaleString("zh-TW")}</p>
          )}
          <p className="mt-3 text-xs text-[var(--muted)]">
            Provider 驗證方式：對 <code className="rounded bg-[var(--border)] px-1">{apiBase}/v1/verify-access</code> 發送 GET，Header 帶上 <code className="rounded bg-[var(--border)] px-1">Authorization: Bearer &lt;token&gt;</code>，成功時回傳 <code className="rounded bg-[var(--border)] px-1">consumerId</code>、<code className="rounded bg-[var(--border)] px-1">providerId</code>、<code className="rounded bg-[var(--border)] px-1">valid: true</code>。
          </p>
        </>
      )}
    </div>
  );
}
