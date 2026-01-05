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

    let order;

    if (query.length < 24) {
      order = await Order.findOne({
        _id: { $regex: query + '$' }
      }).select(
        "_id status items total createdAt trackingLink shippingAddress userName userEmail"
      );
    } else {
      order = await Order.findById(query).select(
        "_id status items total createdAt trackingLink shippingAddress userName userEmail"
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to search orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
