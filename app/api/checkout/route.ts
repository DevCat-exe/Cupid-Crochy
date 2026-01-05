import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

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

    const { items, couponCode }: { items: CartItem[]; couponCode?: string } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;

    // Validate coupon if provided
    if (couponCode) {
      await connectDB();
      
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon && coupon.isActive) {
        const now = new Date();
        const isValid = 
          now >= coupon.validFrom && 
          now <= coupon.validUntil &&
          (coupon.maxUses === 0 || coupon.usageCount < coupon.maxUses) &&
          subtotal >= coupon.minOrderAmount;

        if (isValid) {
          if (coupon.discountType === "percentage") {
            discountAmount = (subtotal * coupon.discount) / 100;
          } else {
            discountAmount = coupon.discount;
          }
        }
      }
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

    // Add discount as a line item if applicable
    if (discountAmount > 0) {
      line_items.push({
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Coupon Discount (${couponCode})`,
            images: ["https://via.placeholder.com/150"],
          },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      } as any);
    }

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
        couponCode: couponCode || "",
        discountAmount: discountAmount.toString(),
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
