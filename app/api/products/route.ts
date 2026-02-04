import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    await connectDB();

    const query: { category?: string } = {};
    if (category) query.category = category;

    const products = await Product.find(query)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin or staff
    if (!session || ((session.user as { role: string }).role !== "admin" && (session.user as { role: string }).role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
