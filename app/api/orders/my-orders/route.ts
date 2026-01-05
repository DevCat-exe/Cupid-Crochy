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
    // Assuming the session user has an 'id' property as we added it in the callback
    const userId = (session.user as any).id;
    
    if (!userId) {
       return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching my orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
