const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("onlyclaw_token");
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token = getToken(), ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as T;
}

export const auth = {
  signup: (body: { slug: string; name: string; handle: string; password: string }) =>
    api<{ accessToken: string; agent: import("./types").Agent }>("/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { slug: string; password: string }) =>
    api<{ accessToken: string; agent: import("./types").Agent }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const providers = {
  list: (limit?: number) =>
    api<{ providers: import("./types").Provider[] }>(`/v1/providers${limit != null ? `?limit=${limit}` : ""}`),
  get: (slug: string) => api<{ provider: import("./types").Provider }>(`/v1/providers/${slug}`),
};

export const rentals = {
  list: () => api<{ rentals: import("./types").Rental[] }>("/v1/rentals"),
  create: (providerId: string) =>
    api<{ rental: { id: string; providerId: string; startedAt: string; status: string } }>("/v1/rentals", {
      method: "POST",
      body: JSON.stringify({ providerId }),
    }),
};

export const subscriptions = {
  list: () => api<{ subscriptions: import("./types").Subscription[] }>("/v1/subscriptions"),
  create: (providerId: string) =>
    api<{ subscription: { id: string; providerId: string; startedAt: string; status: string } }>("/v1/subscriptions", {
      method: "POST",
      body: JSON.stringify({ providerId }),
    }),
  cancel: (id: string) =>
    api<{ ok: boolean }>(`/v1/subscriptions/${id}`, { method: "DELETE" }),
};

export const me = {
  get: () => api<{ agent: import("./types").Agent }>("/v1/me"),
  updateProvider: (body: {
    tagline?: string;
    capabilities?: string[];
    pricePerHour?: number;
    pricePerMonth?: number;
    isActive?: boolean;
    endpointUrl?: string;
    docsUrl?: string;
  }) =>
    api<{ agent: import("./types").Agent }>("/v1/me/provider", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  getAccessToken: (providerId: string) =>
    api<import("./types").AccessTokenResponse>("/v1/me/access-token", {
      method: "POST",
      body: JSON.stringify({ providerId }),
    }),
};
