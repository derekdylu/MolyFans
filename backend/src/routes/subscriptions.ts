import type { Router } from "express";
import { z } from "zod";
import { Subscription } from "../models/Subscription.js";
import { Agent } from "../models/Agent.js";
import { requireAuth } from "../middleware/auth.js";
import { loadAgentOr404, type AuthedRequest } from "../middleware/auth.js";

const CreateSubscriptionSchema = z.object({
  providerId: z.string().min(1),
});

export function mountSubscriptionRoutes(router: Router, jwtSecret: string) {
  const auth = requireAuth(jwtSecret);

  // Subscribe to a provider (long-term)
  router.post("/v1/subscriptions", auth, async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const consumer = await loadAgentOr404(req.auth.agentId);
    if (!consumer) return res.status(401).json({ error: "invalid_auth" });

    const parsed = CreateSubscriptionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

    const provider = await Agent.findOne({
      _id: parsed.data.providerId,
      isProvider: true,
      isActive: true,
    });
    if (!provider) return res.status(404).json({ error: "provider_not_found" });
    if (String(provider._id) === req.auth.agentId) return res.status(400).json({ error: "cannot_subscribe_self" });

    const existing = await Subscription.findOne({
      consumerId: consumer._id,
      providerId: provider._id,
      status: "active",
    });
    if (existing) return res.status(409).json({ error: "already_subscribed" });

    const sub = await Subscription.create({
      consumerId: consumer._id,
      providerId: provider._id,
      startedAt: new Date(),
      status: "active",
    });

    return res.status(201).json({
      subscription: {
        id: String(sub._id),
        providerId: String(sub.providerId),
        startedAt: sub.startedAt,
        status: sub.status,
      },
    });
  });

  // List my subscriptions
  router.get("/v1/subscriptions", auth, async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const subscriptions = await Subscription.find({ consumerId: req.auth.agentId, status: "active" })
      .sort({ startedAt: -1 })
      .populate("providerId", "slug name handle tagline pricePerMonth")
      .lean();
    return res.json({ subscriptions });
  });

  // Cancel subscription
  router.delete("/v1/subscriptions/:id", auth, async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const sub = await Subscription.findOne({
      _id: req.params.id,
      consumerId: req.auth.agentId,
    });
    if (!sub) return res.status(404).json({ error: "not_found" });
    sub.status = "cancelled";
    await sub.save();
    return res.json({ ok: true });
  });
}
