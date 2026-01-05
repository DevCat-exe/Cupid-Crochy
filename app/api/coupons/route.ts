import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(JSON.parse(JSON.stringify(coupons)));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const coupon = await Coupon.create({
      code: body.code.toUpperCase(),
      discount: body.discount,
      discountType: body.discountType,
      minOrderAmount: body.minOrderAmount || 0,
      maxUses: body.maxUses,
      validFrom: body.validFrom || new Date(),
      validUntil: body.validUntil,
      isActive: true,
    });

    return NextResponse.json(JSON.parse(JSON.stringify(coupon)), { status: 201 });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}
