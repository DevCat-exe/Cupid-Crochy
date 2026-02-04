import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Find orders for the logged-in user
    // Using both possible user ID fields for compatibility
    const userId = (session.user as { id?: string; _id?: string }).id ?? (session.user as { id?: string; _id?: string })._id;
    
    if (!userId) {
       return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    // Query by userId (can be string or ObjectId, MongoDB handles both)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error("Error fetching my orders:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
