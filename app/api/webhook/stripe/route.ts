import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { Resend } from "resend";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

interface SessionWithShipping extends Stripe.Checkout.Session {
  shipping_details?: {
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (!process.env.RESEND_API_KEY) {
     console.error("Missing RESEND_API_KEY");
     // We might continue without Resend but logging it is good. 
     // Or return 500. Let's return 500 for safety.
     return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as SessionWithShipping;
      
      await connectDB();

      // Extract order info from metadata
      const metadata = session.metadata;
      console.log("Webhook metadata:", metadata);
      const items = JSON.parse(metadata?.items || "[]");
      const userId = metadata?.userId || "guest";
      console.log("Processing order for user:", userId);

      // Prepare items for Order model (need full product info)
      const orderItems = await Promise.all(
        items.map(async (item: { id: string; quantity: number }) => {
          const product = await Product.findById(item.id);
          if (!product) {
             console.error(`Product not found: ${item.id}`);
             throw new Error(`Product not found: ${item.id}`);
          }
          return {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.images[0],
          };
        })
      );

      console.log("Order items prepared:", orderItems.length);

      // Create the order
      const order = await Order.create({
        userId: userId === "guest" ? undefined : userId,
        userName: session.customer_details?.name || "Guest",
        userEmail: session.customer_details?.email || "guest@example.com",
        items: orderItems,
        total: (session.amount_total || 0) / 100,
        status: "pending",
        paymentStatus: "paid",
        stripePaymentId: session.payment_intent as string,
        shippingAddress: {
          line1: session.shipping_details?.address?.line1 || "No Address Provided",
          line2: session.shipping_details?.address?.line2 || undefined,
          city: session.shipping_details?.address?.city || "Unknown",
          state: session.shipping_details?.address?.state || "Unknown",
          postalCode: session.shipping_details?.address?.postal_code || "Unknown",
          country: session.shipping_details?.address?.country || "Unknown",
        },
      });

      console.log("Order created successfully:", order._id);

      // Send confirmation email ... (rest of logic)
    } catch (error) {
       console.error("CRITICAL ERROR IN STRIPE WEBHOOK:", error);
       return NextResponse.json({ error: "Internal Server Error during order processing" }, { status: 500 });
    }
  }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Cupid Crochy <onboarding@resend.dev>",
        to: session.customer_details?.email || "",
        subject: `Your Cupid Crochy Order Confirmation (#${order._id.toString().slice(-6).toUpperCase()})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #5B1A1A; text-align: center;">Thank You for Your Order!</h1>
            <p>Hi ${session.customer_details?.name},</p>
            <p>We've received your order and we're getting it ready for shipment.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3>Order Summary</h3>
            ${orderItems.map(item => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${item.name} (x${item.quantity})</span>
                <span>৳${item.price * item.quantity}</span>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 20px; border-top: 2px solid #5B1A1A; pt: 10px;">
              <span>Total</span>
              <span>৳${order.total}</span>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
              Handcrafted with love by Cupid Crochy.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }

    // Optional: Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
    }
  }

  return NextResponse.json({ received: true });
}

