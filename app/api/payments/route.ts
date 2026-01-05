import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const [payments, orders] = await Promise.all([
      Payment.find({ userId }).sort({ createdAt: -1 }),
      Order.find({ userId }).sort({ createdAt: -1 }).select('_id status'),
    ]);

    return NextResponse.json({ payments, orders });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
