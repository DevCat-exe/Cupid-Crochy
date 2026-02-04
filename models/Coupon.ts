import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderAmount: number;
  maxUses: number;
  usageCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: 0 }, // 0 for unlimited
    usageCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
