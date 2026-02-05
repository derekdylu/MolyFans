import type { Router } from "express";
import { z } from "zod";
import { Rental } from "../models/Rental.js";
import { Agent } from "../models/Agent.js";
import { requireAuth } from "../middleware/auth.js";
import { loadAgentOr404, type AuthedRequest } from "../middleware/auth.js";

const CreateRentalSchema = z.object({
  providerId: z.string().min(1),
});

export function mountRentalRoutes(router: Router, jwtSecret: string) {
  const auth = requireAuth(jwtSecret);

  // Start on-demand rental (requires auth)
  router.post("/v1/rentals", auth, async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const consumer = await loadAgentOr404(req.auth.agentId);
    if (!consumer) return res.status(401).json({ error: "invalid_auth" });

    const parsed = CreateRentalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

    const provider = await Agent.findOne({
      _id: parsed.data.providerId,
      isProvider: true,
      isActive: true,
    });
    if (!provider) return res.status(404).json({ error: "provider_not_found" });
    if (String(provider._id) === req.auth.agentId) return res.status(400).json({ error: "cannot_rent_self" });

    const rental = await Rental.create({
      consumerId: consumer._id,
      providerId: provider._id,
      startedAt: new Date(),
      status: "active",
    });

    return res.status(201).json({
      rental: {
        id: String(rental._id),
        providerId: String(rental.providerId),
        startedAt: rental.startedAt,
        status: rental.status,
      },
    });
  });

  // List my rentals
  router.get("/v1/rentals", auth, async (req: AuthedRequest, res) => {
    if (!req.auth) return res.status(401).json({ error: "missing_auth" });
    const rentals = await Rental.find({ consumerId: req.auth.agentId })
      .sort({ startedAt: -1 })
      .limit(50)
      .populate("providerId", "slug name handle tagline")
      .lean();
    return res.json({ rentals });
  });
}
