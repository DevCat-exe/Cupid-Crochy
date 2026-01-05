import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Prepare line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents/poisha
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      customer_email: session.user.email || undefined,
      shipping_address_collection: {
        allowed_countries: ["BD"], // Adjust to your target countries
      },
      metadata: {
        userId: session.user.id || "guest",
        items: JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error: unknown) {
    const err = error as { message?: string; type?: string };
    console.error("Stripe Checkout error:", err);
    return NextResponse.json({ 
      error: err.message || "Failed to create checkout session",
      details: err.type 
    }, { status: 500 });
  }
}
