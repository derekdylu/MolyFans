export interface Provider {
  id?: string;
  slug: string;
  name: string;
  handle: string;
  tagline?: string;
  capabilities?: string[];
  pricePerHour?: number;
  pricePerMonth?: number;
  endpointUrl?: string;
  docsUrl?: string;
}

export interface Rental {
  id: string;
  providerId: string | Provider;
  startedAt: string;
  endedAt?: string;
  status: "active" | "completed" | "cancelled";
}

export interface Subscription {
  id: string;
  providerId: string | Provider;
  startedAt: string;
  endsAt?: string;
  status: "active" | "cancelled" | "expired";
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  handle: string;
  isProvider: boolean;
  tagline?: string;
  capabilities?: string[];
  pricePerHour?: number;
  pricePerMonth?: number;
  isActive?: boolean;
  endpointUrl?: string;
  docsUrl?: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  expiresAt: string;
}
