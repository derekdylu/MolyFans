import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { verifyAccessToken } from "../auth/tokens.js";
import { Agent } from "../models/Agent.js";

export type AuthedRequest = Request & {
  auth?: {
    agentId: string;
  };
};

export function requireAuth(jwtSecret: string) {
  return async function (req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const header = req.header("authorization") || "";
      const [scheme, token] = header.split(" ");
      if (scheme?.toLowerCase() !== "bearer" || !token) {
        return res.status(401).json({ error: "missing_auth" });
      }

      const payload = verifyAccessToken(token, jwtSecret);
      req.auth = { agentId: payload.sub };
      return next();
    } catch {
      return res.status(401).json({ error: "invalid_auth" });
    }
  };
}

export async function loadAgentOr404(agentId: string) {
  if (!mongoose.isValidObjectId(agentId)) return null;
  return await Agent.findById(agentId).lean();
}
