import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: string; // Can be MongoDB ObjectId or Google OAuth ID
  orderId: string; // Store as string for consistency
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";
  paymentMethod: string;
  stripePaymentId: string;
  stripeCustomerId?: string;
  description?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "bdt" },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    stripePaymentId: { type: String, required: true },
    stripeCustomerId: { type: String },
    description: { type: String },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
