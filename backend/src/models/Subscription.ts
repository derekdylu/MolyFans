import mongoose, { Schema } from "mongoose";

export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface SubscriptionDoc {
  consumerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  startedAt: Date;
  endsAt?: Date;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDoc>(
  {
    consumerId: { type: Schema.Types.ObjectId, ref: "Agent", required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Agent", required: true, index: true },
    startedAt: { type: Date, required: true, default: () => new Date() },
    endsAt: { type: Date },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active", index: true },
  },
  { timestamps: true }
);

// One active subscription per consumer–provider pair
SubscriptionSchema.index(
  { consumerId: 1, providerId: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export const Subscription = mongoose.model<SubscriptionDoc>("Subscription", SubscriptionSchema);
