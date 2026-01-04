import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "percent" | "amount";
  value: number;
  expiry: Date;
  usageLimit: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percent", "amount"], required: true },
    value: { type: Number, required: true },
    expiry: { type: Date, required: true },
    usageLimit: { type: Number, required: true, default: 0 }, // 0 for unlimited
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
