import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const payments = await Payment.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("_id orderId amount currency status paymentMethod createdAt stripePaymentId description");

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
