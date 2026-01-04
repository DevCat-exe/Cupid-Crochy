import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { Resend } from "resend";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24-preview" as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await connectDB();

    // Extract order info from metadata
    const metadata = session.metadata;
    const items = JSON.parse(metadata?.items || "[]");
    const userId = metadata?.userId || "guest";

    // Prepare items for Order model (need full product info)
    const orderItems = await Promise.all(
      items.map(async (item: { id: string; quantity: number }) => {
        const product = await Product.findById(item.id);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0],
        };
      })
    );

    // Create the order
    const order = await Order.create({
      userId: userId === "guest" ? null : userId,
      userName: session.customer_details?.name || "Guest",
      userEmail: session.customer_details?.email || "guest@example.com",
      items: orderItems,
      total: (session.amount_total || 0) / 100,
      status: "pending",
      paymentStatus: "paid",
      stripePaymentId: session.payment_intent as string,
      shippingAddress: {
        line1: session.shipping_details?.address?.line1 || "",
        line2: session.shipping_details?.address?.line2 || undefined,
        city: session.shipping_details?.address?.city || "",
        state: session.shipping_details?.address?.state || "",
        postalCode: session.shipping_details?.address?.postal_code || "",
        country: session.shipping_details?.address?.country || "",
      },
    });

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

export const config = {
  api: {
    bodyParser: false,
  },
};
