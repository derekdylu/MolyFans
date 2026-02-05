import jwt from "jsonwebtoken";

export type AccessTokenPayload = {
  sub: string; // agentId
};

export function signAccessToken(payload: AccessTokenPayload, secret: string) {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string, secret: string): AccessTokenPayload {
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
  if (!decoded?.sub) {
    throw new Error("Invalid token payload");
  }
  return { sub: String(decoded.sub) };
}

// Provider-scoped access token (consumer presents to provider to prove subscription/rental)
export type ProviderAccessTokenPayload = {
  sub: string; // consumer agentId
  providerId: string;
  scope: "provider_access";
};

export function signProviderAccessToken(payload: ProviderAccessTokenPayload, secret: string) {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}

export function verifyProviderAccessToken(token: string, secret: string): ProviderAccessTokenPayload {
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
  if (!decoded?.sub || decoded?.scope !== "provider_access" || !decoded?.providerId) {
    throw new Error("Invalid provider access token");
  }
  return {
    sub: String(decoded.sub),
    providerId: String(decoded.providerId),
    scope: "provider_access",
  };
}
