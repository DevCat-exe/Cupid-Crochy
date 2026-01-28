import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
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
