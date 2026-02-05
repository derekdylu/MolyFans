import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { getEnv } from "./config/env.js";
import { connectDb } from "./db.js";
import { mountAuthRoutes } from "./routes/auth.js";
import { mountProviderRoutes } from "./routes/providers.js";
import { mountRentalRoutes } from "./routes/rentals.js";
import { mountSubscriptionRoutes } from "./routes/subscriptions.js";
import { mountAgentRoutes } from "./routes/agent.js";
import { mountVerifyAccessRoutes } from "./routes/verify-access.js";

const env = getEnv();

await connectDb(env.MONGODB_URI);

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const router = express.Router();
mountAuthRoutes(router, { jwtSecret: env.JWT_SECRET });
mountProviderRoutes(router);
mountRentalRoutes(router, env.JWT_SECRET);
mountSubscriptionRoutes(router, env.JWT_SECRET);
mountAgentRoutes(router, env.JWT_SECRET);
mountVerifyAccessRoutes(router, env.JWT_SECRET);

app.use(router);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on :${env.PORT}`);
});
