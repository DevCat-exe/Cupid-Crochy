import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { code, orderAmount } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is not active" }, { status: 400 });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ error: "This coupon is expired or not yet valid" }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usageCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of ৳${coupon.minOrderAmount} required` 
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discount) / 100;
    } else {
      discountAmount = coupon.discount;
    }

    const finalAmount = orderAmount - discountAmount;

    return NextResponse.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discount: coupon.discount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
