import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Payment from "@/models/Payment";
import Coupon from "@/models/Coupon";
import { Resend } from "resend";
import { generateInvoice } from "@/lib/pdf-generator";
import { generateShortOrderId } from "@/lib/shortOrderId";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

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
      const couponCode = metadata?.couponCode;
      const discountAmount = metadata?.discountAmount ? parseFloat(metadata.discountAmount) : 0;
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

      // Extract shipping details with fallbacks
      const shippingDetails = session.shipping_details?.address;
      const shippingAddress = {
        line1: shippingDetails?.line1 || session.customer_details?.address?.line1 || "No Address Provided",
        line2: shippingDetails?.line2 || session.customer_details?.address?.line2 || undefined,
        city: shippingDetails?.city || session.customer_details?.address?.city || "Unknown",
        state: shippingDetails?.state || session.customer_details?.address?.state || "Unknown",
        postalCode: shippingDetails?.postal_code || session.customer_details?.address?.postal_code || "Unknown",
        country: shippingDetails?.country || session.customer_details?.address?.country || "Unknown",
      };

      // Create the order
      const order = await Order.create({
        shortOrderId: generateShortOrderId(),
        userId: userId === "guest" ? undefined : userId,
        userName: session.customer_details?.name || "Guest",
        userEmail: session.customer_details?.email || "guest@example.com",
        items: orderItems,
        total: (session.amount_total || 0) / 100,
        status: "pending",
        paymentStatus: "paid",
        stripePaymentId: session.payment_intent as string,
        couponCode,
        discountAmount,
        shippingAddress,
      });

      // Update coupon usage count if applicable
      if (couponCode && discountAmount > 0) {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { $inc: { usageCount: 1 } }
        );
      }

      console.log("Order created successfully:", order._id);

      // Create payment record
      await Payment.create({
        userId: userId === "guest" ? undefined : userId,
        orderId: order._id,
        amount: order.total,
        currency: "bdt",
        status: "succeeded",
        paymentMethod: "card",
        stripePaymentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
        description: `Payment for Order #${order.shortOrderId}`,
        metadata: {
          userName: session.customer_details?.name,
          userEmail: session.customer_details?.email,
        },
      });

      console.log("Payment record created successfully");

      // Send confirmation email with invoice PDF
      try {
        const pdfBuffer = await generateInvoice(order);
        const base64Attachment = pdfBuffer.toString("base64");

        await resend.emails.send({
          from: "Cupid Crochy <onboarding@resend.dev>",
          to: session.customer_details?.email || "",
          subject: `Order Confirmed - #${order.shortOrderId} | Cupid Crochy`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Cookie&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Outfit', sans-serif; background-color: #F5F0E6;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(91, 26, 26, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #5B1A1A 0%, #7A2535 100%); padding: 50px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #F5F0E6; font-family: 'Cookie', cursive; font-size: 42px; font-weight: 400;">
                      Cupid Crochy
                    </h1>
                    <p style="margin: 8px 0 0 0; color: rgba(245, 240, 230, 0.9); font-size: 13px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase;">
                      Handcrafted with Love
                    </p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="background: #ffffff; padding: 50px 40px;">
                    <!-- Thank You Section -->
                    <div style="text-align: center; margin-bottom: 45px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #FFB6C1 0%, #F5DDEA 100%); width: 80px; height: 80px; border-radius: 50%; margin-bottom: 25px; line-height: 80px; box-shadow: 0 4px 15px rgba(255, 182, 193, 0.4);">
                        <span style="font-size: 36px;">🎉</span>
                      </div>
                      <h2 style="margin: 0 0 12px 0; color: #5B1A1A; font-size: 28px; font-weight: 700;">
                        Order Confirmed!
                      </h2>
                      <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                        Hi <strong style="color: #5B1A1A;">${session.customer_details?.name || "there"}</strong>!
                      </p>
                      <p style="margin: 12px 0 0 0; color: #666; font-size: 15px; line-height: 1.7;">
                        Thank you for your order. We're thrilled to begin crafting your hand treasures! Your order <strong style="color: #5B1A1A; font-size: 18px;">#${order.shortOrderId}</strong> has been received and is being prepared.
                      </p>
                    </div>

                    <!-- Order Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF8F6; border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 2px solid #FFB6C1;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 20px 0; color: #5B1A1A; font-size: 18px; font-weight: 600;">
                            📦 Order Details
                          </h3>
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td width="50%" style="color: #666; font-size: 14px; padding-bottom: 12px;">
                                <strong>Order ID:</strong><br>
                                <span style="color: #5B1A1A; font-weight: 700; font-size: 16px;">#${order.shortOrderId}</span>
                              </td>
                              <td width="50%" style="color: #666; font-size: 14px; padding-bottom: 12px;">
                                <strong>Date:</strong><br>
                                <span style="color: #5B1A1A;">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </td>
                            </tr>
                            <tr>
                              <td width="50%" style="color: #666; font-size: 14px; padding-bottom: 12px;">
                                <strong>Status:</strong><br>
                                <span style="color: #5B1A1A; background: #FFF3E0; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${order.status.toUpperCase()}</span>
                              </td>
                              <td width="50%" style="color: #666; font-size: 14px; padding-bottom: 12px;">
                                <strong>Payment:</strong><br>
                                <span style="color: #5B1A1A;">${order.paymentStatus.toUpperCase()}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Items Table -->
                    <div style="background: #fff; border: 1px solid #E8D8CF; border-radius: 12px; overflow: hidden; margin-bottom: 30px;">
                      <table width="100%" cellpadding="15" cellspacing="0">
                        <tr style="background: linear-gradient(135deg, #5B1A1A 0%, #7A2535 100%);">
                          <th style="color: #F5F0E6; font-size: 13px; font-weight: 600; text-align: left; padding: 15px;">Item</th>
                          <th style="color: #F5F0E6; font-size: 13px; font-weight: 600; text-align: center; padding: 15px;">Qty</th>
                          <th style="color: #F5F0E6; font-size: 13px; font-weight: 600; text-align: right; padding: 15px;">Price</th>
                          <th style="color: #F5F0E6; font-size: 13px; font-weight: 600; text-align: right; padding: 15px;">Total</th>
                        </tr>
                        ${orderItems.map(item => `
                        <tr style="border-bottom: 1px solid #F5F0E6;">
                          <td style="color: #333; font-size: 15px; padding: 15px;">
                            <strong>${item.name}</strong>
                          </td>
                          <td style="color: #666; font-size: 15px; text-align: center; padding: 15px;">x${item.quantity}</td>
                          <td style="color: #666; font-size: 15px; text-align: right; padding: 15px;">৳${item.price}</td>
                          <td style="color: #5B1A1A; font-size: 15px; font-weight: 600; text-align: right; padding: 15px;">৳${item.price * item.quantity}</td>
                        </tr>
                        `).join('')}
                        ${couponCode && discountAmount > 0 ? `
                        <tr>
                          <td colspan="3" style="color: #E74C3C; font-size: 14px; padding: 15px; font-weight: 500;">
                            💸 Coupon Discount (${couponCode})
                          </td>
                          <td colspan="2" style="color: #E74C3C; font-size: 15px; font-weight: 600; text-align: right; padding: 15px;">-৳${discountAmount}</td>
                        </tr>
                        ` : ''}
                        <tr style="background: #FDF8F6;">
                          <td colspan="3" style="color: #5B1A1A; font-size: 15px; font-weight: 600; padding: 15px;">Subtotal</td>
                          <td colspan="2" style="color: #5B1A1A; font-size: 15px; font-weight: 600; text-align: right; padding: 15px;">৳${(order.total + (discountAmount || 0))}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="color: #666; font-size: 14px; padding: 15px;">Shipping</td>
                          <td colspan="2" style="color: #666; font-size: 15px; text-align: right; padding: 15px;">৳50</td>
                        </tr>
                        <tr style="background: linear-gradient(135deg, #5B1A1A 0%, #7A2535 100%);">
                          <td colspan="3" style="color: #F5F0E6; font-size: 18px; font-weight: 600; padding: 20px;">Total Paid</td>
                          <td colspan="2" style="color: #F5F0E6; font-size: 22px; font-weight: 700; text-align: right; padding: 20px;">৳${order.total}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Shipping Address -->
                    <div style="background: #FFF9F5; border-radius: 16px; padding: 30px; border: 2px solid #FFB6C1;">
                      <h3 style="margin: 0 0 20px 0; color: #5B1A1A; font-size: 18px; font-weight: 600;">
                        📍 Shipping Address
                      </h3>
                      <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6;">
                        ${session.customer_details?.name}<br>
                        ${order.shippingAddress.line1}<br>
                        ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br>' : ''}
                        ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                        ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}
                      </p>
                    </div>

                    <!-- Invoice Download CTA -->
                    <div style="text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                        Your detailed invoice has been attached to this email. You can also download it anytime from your account.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #5B1A1A; padding: 40px 30px; text-align: center;">
                    <p style="margin: 0 0 15px 0; color: #F5F0E6; font-size: 16px; font-weight: 600;">
                      Need Help?
                    </p>
                    <p style="margin: 0; color: rgba(245, 240, 230, 0.8); font-size: 14px; line-height: 1.6;">
                      We're here for you! Reach out to us at:<br>
                      <a href="mailto:support@cupidcrochy.com" style="color: #FFB6C1; text-decoration: none; font-weight: 500;">support@cupidcrochy.com</a>
                    </p>
                    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(245, 240, 230, 0.2);">
                      <p style="margin: 0; color: rgba(245, 240, 230, 0.6); font-size: 12px;">
                        💝 Handcrafted with love by Cupid Crochy<br>
                        <a href="https://cupidcrochy.com" style="color: #FFB6C1; text-decoration: none;">www.cupidcrochy.com</a>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: `invoice-${order.shortOrderId}.pdf`,
              content: base64Attachment,
            }
          ]
        });
      } catch (emailErr) {
        console.error("Failed to send order confirmation email:", emailErr);
      }

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
      }
    } catch (error) {
       console.error("CRITICAL ERROR IN STRIPE WEBHOOK:", error);
       return NextResponse.json({ error: "Internal Server Error during order processing" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

