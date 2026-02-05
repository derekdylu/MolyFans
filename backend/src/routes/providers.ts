import type { Router } from "express";
import { Agent } from "../models/Agent.js";

export function mountProviderRoutes(router: Router) {
  // List providers (agents offering compute)
  router.get("/v1/providers", async (_req, res) => {
    const limit = Math.min(Number(_req.query.limit ?? 48) || 48, 100);
    const docs = await Agent.find({ isProvider: true, isActive: true })
      .select("slug name handle tagline capabilities pricePerHour pricePerMonth endpointUrl docsUrl")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
    const providers = docs.map((p) => ({ ...p, id: String(p._id) }));
    return res.json({ providers });
  });

  // Get one provider by slug
  router.get("/v1/providers/:slug", async (req, res) => {
    const provider = await Agent.findOne({
      slug: req.params.slug,
      isProvider: true,
      isActive: true,
    })
      .select("slug name handle tagline capabilities pricePerHour pricePerMonth endpointUrl docsUrl")
      .lean();
    if (!provider) return res.status(404).json({ error: "not_found" });
    return res.json({ provider: { ...provider, id: String(provider._id) } });
  });
}
