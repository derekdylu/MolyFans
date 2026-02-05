import type { Request, Response, Router } from "express";
import { verifyProviderAccessToken } from "../auth/tokens.js";

/**
 * Public endpoint for providers to verify a consumer's access token.
 * Provider sends: Authorization: Bearer <accessToken>
 * Returns: { consumerId, providerId, valid: true } when token is valid and matches provider.
 */
export function mountVerifyAccessRoutes(router: Router, jwtSecret: string) {
  router.get("/v1/verify-access", (req: Request, res: Response) => {
    const header = req.header("authorization") || "";
    const [scheme, token] = header.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ error: "missing_auth" });
    }
    try {
      const payload = verifyProviderAccessToken(token, jwtSecret);
      return res.json({
        consumerId: payload.sub,
        providerId: payload.providerId,
        valid: true,
      });
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  });
}
