import type { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Agent } from "../models/Agent.js";
import { signAccessToken } from "../auth/tokens.js";

const SignupSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: z.string().min(1).max(120),
  handle: z.string().min(1).max(64),
  password: z.string().min(8).max(256),
});

const LoginSchema = z.object({
  slug: z.string().min(2).max(64),
  password: z.string().min(8).max(256),
});

export function mountAuthRoutes(router: Router, opts: { jwtSecret: string }) {
  router.post("/v1/auth/signup", async (req, res) => {
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

    const { slug, name, handle, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const agent = await Agent.create({
        slug: slug.toLowerCase(),
        name,
        handle,
        passwordHash,
        isProvider: false,
      });

      const accessToken = signAccessToken({ sub: String(agent._id) }, opts.jwtSecret);
      return res.status(201).json({
        accessToken,
        agent: {
          id: String(agent._id),
          slug: agent.slug,
          name: agent.name,
          handle: agent.handle,
          isProvider: agent.isProvider,
        },
      });
    } catch (e: unknown) {
      const isDup = (e as { code?: number })?.code === 11000;
      if (isDup) return res.status(409).json({ error: "already_exists" });
      return res.status(500).json({ error: "server_error" });
    }
  });

  router.post("/v1/auth/login", async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

    const { slug, password } = parsed.data;
    const agent = await Agent.findOne({ slug: slug.toLowerCase() });
    if (!agent) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, agent.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const accessToken = signAccessToken({ sub: String(agent._id) }, opts.jwtSecret);
    return res.status(200).json({
      accessToken,
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
      },
    });
  });
}
