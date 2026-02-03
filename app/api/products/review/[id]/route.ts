import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newReview = {
      user: session.user?.name || "Anonymous",
      userImage: session.user?.image || null,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    
    // Update average rating
    const totalRating = product.reviews.reduce((acc: number, item: { rating: number }) => acc + item.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    return NextResponse.json(product);
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
