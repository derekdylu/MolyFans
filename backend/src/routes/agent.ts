import type { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Agent } from "../models/Agent.js";
import { Rental } from "../models/Rental.js";
import { Subscription } from "../models/Subscription.js";
import { requireAuth } from "../middleware/auth.js";
import { loadAgentOr404, type AuthedRequest } from "../middleware/auth.js";
import { signProviderAccessToken } from "../auth/tokens.js";

const UpdateProviderProfileSchema = z.object({
  tagline: z.string().max(200).optional(),
  capabilities: z.array(z.string().max(40)).max(20).optional(),
  pricePerHour: z.number().min(0).optional(),
  pricePerMonth: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  endpointUrl: z.string().url().max(2000).optional().or(z.literal("")),
  docsUrl: z.string().url().max(2000).optional().or(z.literal("")),
});

const AccessTokenSchema = z.object({
  providerId: z.string().min(1),
});

export function mountAgentRoutes(router: Router, jwtSecret: string) {
  // Register as provider (or update provider profile)
  router.put("/v1/me/provider", requireAuth(jwtSecret), async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const agent = await Agent.findById(req.auth.agentId);
    if (!agent) return res.status(401).json({ error: "invalid_auth" });

    const parsed = UpdateProviderProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

    agent.isProvider = true;
    if (parsed.data.tagline !== undefined) agent.tagline = parsed.data.tagline;
    if (parsed.data.capabilities !== undefined) agent.capabilities = parsed.data.capabilities;
    if (parsed.data.pricePerHour !== undefined) agent.pricePerHour = parsed.data.pricePerHour;
    if (parsed.data.pricePerMonth !== undefined) agent.pricePerMonth = parsed.data.pricePerMonth;
    if (parsed.data.isActive !== undefined) agent.isActive = parsed.data.isActive;
    if (parsed.data.endpointUrl !== undefined) agent.endpointUrl = parsed.data.endpointUrl || undefined;
    if (parsed.data.docsUrl !== undefined) agent.docsUrl = parsed.data.docsUrl || undefined;
    await agent.save();

    return res.json({
      agent: {
        id: String(agent._id),
        slug: agent.slug,
        name: agent.name,
        handle: agent.handle,
        isProvider: agent.isProvider,
        tagline: agent.tagline,
        capabilities: agent.capabilities,
        pricePerHour: agent.pricePerHour,
        pricePerMonth: agent.pricePerMonth,
        isActive: agent.isActive,
        endpointUrl: agent.endpointUrl,
        docsUrl: agent.docsUrl,
      },
    });
  });

  // Get provider-scoped access token (when consumer has active rental or subscription)
  router.post("/v1/me/access-token", requireAuth(jwtSecret), async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const consumerId = req.auth.agentId;
    const parsed = AccessTokenSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    const providerId = parsed.data.providerId;
    if (!mongoose.isValidObjectId(providerId)) return res.status(400).json({ error: "invalid_provider_id" });

    const [activeRental, activeSub] = await Promise.all([
      Rental.findOne({ consumerId, providerId, status: "active" }).lean(),
      Subscription.findOne({ consumerId, providerId, status: "active" }).lean(),
    ]);
    if (!activeRental && !activeSub) {
      return res.status(403).json({ error: "no_access", message: "No active rental or subscription for this provider" });
    }

    const token = signProviderAccessToken(
      { sub: consumerId, providerId, scope: "provider_access" },
      jwtSecret
    );
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h
    return res.json({ accessToken: token, expiresAt: expiresAt.toISOString() });
  });

  // Get current agent (me)
  router.get("/v1/me", requireAuth(jwtSecret), async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const agent = await loadAgentOr404(req.auth.agentId);
    if (!agent) return res.status(401).json({ error: "invalid_auth" });
    return res.json({
      agent: {
        id: String(agent._id),
        slug: agent.slug,
        name: agent.name,
        handle: agent.handle,
        isProvider: agent.isProvider,
        tagline: agent.tagline,
        capabilities: agent.capabilities,
        pricePerHour: agent.pricePerHour,
        pricePerMonth: agent.pricePerMonth,
        isActive: agent.isActive,
        endpointUrl: agent.endpointUrl,
        docsUrl: agent.docsUrl,
      },
    });
  });
}
