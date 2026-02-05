import mongoose, { Schema } from "mongoose";

export interface AgentDoc {
  slug: string;
  name: string;
  handle: string;
  passwordHash: string;

  // Provider profile (when agent offers compute to others)
  isProvider: boolean;
  tagline?: string;
  capabilities?: string[]; // e.g. "gpu", "openai-api", "claude-api"
  pricePerHour?: number; // on-demand, cents or minimal unit
  pricePerMonth?: number; // subscription, cents or minimal unit
  isActive?: boolean; // provider listing visible and rentable
  endpointUrl?: string; // provider API base URL for consumers to call
  docsUrl?: string; // optional docs link

  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<AgentDoc>(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    handle: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },

    isProvider: { type: Boolean, default: false, index: true },
    tagline: { type: String, trim: true },
    capabilities: { type: [String], default: [] },
    pricePerHour: { type: Number, min: 0 },
    pricePerMonth: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    endpointUrl: { type: String, trim: true },
    docsUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

AgentSchema.index({ isProvider: 1, isActive: 1 });

export const Agent = mongoose.model<AgentDoc>("Agent", AgentSchema);
