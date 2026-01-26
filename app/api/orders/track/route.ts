import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Search query required" }, { status: 400 });
    }

    console.log("Searching for order with query:", query);

    // Search by shortOrderId (case-insensitive)
    const order = await Order.findOne({
      shortOrderId: { $regex: `^${query}`, $options: 'i' }
    }).select(
      "_id shortOrderId status items total createdAt trackingLink shippingAddress userName userEmail"
    );

    if (!order) {
      console.log("Order not found for query:", query);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", order.shortOrderId);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to search orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
