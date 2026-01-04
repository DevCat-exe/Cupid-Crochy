import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // Allow public access to status and items for tracking
    const order = await Order.findById(params.id).select("status items total userName createdAt shippingAddress.city");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
  }
}
