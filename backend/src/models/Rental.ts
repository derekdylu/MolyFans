import mongoose, { Schema } from "mongoose";

export type RentalStatus = "active" | "completed" | "cancelled";

export interface RentalDoc {
  consumerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  status: RentalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema<RentalDoc>(
  {
    consumerId: { type: Schema.Types.ObjectId, ref: "Agent", required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Agent", required: true, index: true },
    startedAt: { type: Date, required: true, default: () => new Date() },
    endedAt: { type: Date },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active", index: true },
  },
  { timestamps: true }
);

export const Rental = mongoose.model<RentalDoc>("Rental", RentalSchema);
