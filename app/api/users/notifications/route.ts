import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailNotifications } = await request.json();

    if (typeof emailNotifications !== "boolean") {
      return NextResponse.json({ error: "Email notification preference is required." }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { emailNotifications },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification preferences updated." });
  } catch (error) {
    console.error("Notifications update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
