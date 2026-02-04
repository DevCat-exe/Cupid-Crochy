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

        const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Order Confirmation</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Cookie&family=Outfit:wght@300;400;500;600;700&display=swap');
                
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  background-color: #FDF2F7;
                  color: #5B1A1A;
                }
                
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                
                .wrapper {
                  width: 100%;
                  table-layout: fixed;
                  background-color: #FDF2F7;
                  padding-bottom: 40px;
                }
                
                .main {
                  background-color: #ffffff;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 600px;
                  border-spacing: 0;
                  font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  color: #5B1A1A;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(91, 26, 26, 0.05);
                }
                
                .header {
                  padding: 40px 0;
                  text-align: center;
                  background-color: #5B1A1A;
                  background-image: linear-gradient(135deg, #5B1A1A 0%, #7A2535 100%);
                }
                
                .logo {
                  font-family: 'Cookie', 'Brush Script MT', 'Segoe Script', 'Gabriola', cursive;
                  font-size: 48px;
                  color: #F5DDEB;
                  text-decoration: none;
                  margin: 0;
                  line-height: 1.2;
                }
                
                .tagline {
                  color: rgba(245, 221, 235, 0.8);
                  font-size: 14px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  margin-top: 5px;
                }
                
                .content {
                  padding: 40px 30px;
                }
                
                .greeting {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  color: #5B1A1A;
                  text-align: center;
                }
                
                .message {
                  font-size: 16px;
                  line-height: 1.6;
                  color: #666666;
                  margin-bottom: 30px;
                  text-align: center;
                }
                
                .order-info {
                  background-color: #FDF9FB;
                  border: 1px solid #F5DDEB;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 30px;
                }
                
                .item-table th {
                  text-align: left;
                  padding: 12px;
                  font-size: 12px;
                  text-transform: uppercase;
                  color: #888;
                  border-bottom: 2px solid #F5DDEB;
                }
                
                .item-table td {
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  color: #444;
                  font-size: 14px;
                }
                
                .total-row td {
                  border-bottom: none;
                  padding-top: 15px;
                  color: #5B1A1A;
                  font-weight: bold;
                  font-size: 16px;
                }
                
                .footer {
                  background-color: #FDF9FB;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #888;
                  border-top: 1px solid #F5DDEB;
                }
                
                /* Mobile adjustments */
                @media only screen and (max-width: 600px) {
                  .content { padding: 20px; }
                  .logo { font-size: 36px; }
                }
              </style>
            </head>
            <body>
              <center class="wrapper">
                <table class="main" width="100%">
                  <!-- Header -->
                  <tr>
                    <td class="header">
                      <div class="logo">Cupid Crochy</div>
                      <div class="tagline">Handcrafted with Love</div>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td class="content">
                      <h1 class="greeting">Thank You, ${session.customer_details?.name?.split(' ')[0] || "Friend"}!</h1>
                      <p class="message">
                        We've received your order and are getting your handmade treasures ready.
                        <br><br>
                        Invoice attached below 📎
                      </p>
                      
                      <div class="order-info" style="text-align: center;">
                         <p style="margin: 0; font-size: 14px; color: #888;">Order Reference</p>
                         <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #5B1A1A;">#${order.shortOrderId}</p>
                      </div>

                      <table class="item-table" width="100%" cellspacing="0">
                        <thead>
                          <tr>
                            <th width="60%">Item</th>
                            <th width="15%" style="text-align: center;">Qty</th>
                            <th width="25%" style="text-align: right;">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${orderItems.map(item => `
                            <tr>
                              <td>
                                <strong>${item.name}</strong>
                              </td>
                              <td style="text-align: center;">${item.quantity}</td>
                              <td style="text-align: right;">৳${item.price * item.quantity}</td>
                            </tr>
                          `).join('')}
                          
                          <!-- Totals -->
                          <tr class="total-row">
                            <td colspan="2" style="text-align: right; padding-right: 15px;">Subtotal</td>
                            <td style="text-align: right;">৳${(order.total + (discountAmount || 0)).toLocaleString()}</td>
                          </tr>
                          ${couponCode && discountAmount > 0 ? `
                          <tr style="color: #d9534f;">
                             <td colspan="2" style="text-align: right; padding-right: 15px;">Discount (${couponCode})</td>
                             <td style="text-align: right;">-৳${discountAmount.toLocaleString()}</td>
                          </tr>
                          ` : ''}
                           <tr>
                            <td colspan="2" style="text-align: right; padding-right: 15px; color: #666; font-size: 14px;">Shipping</td>
                            <td style="text-align: right; color: #666; font-size: 14px;">৳50</td>
                          </tr>
                          <tr class="total-row" style="font-size: 18px;">
                            <td colspan="2" style="text-align: right; padding-right: 15px;">Total Paid</td>
                            <td style="text-align: right;">৳${order.total.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="footer">
                      <p>&copy; ${new Date().getFullYear()} Cupid Crochy. All rights reserved.</p>
                      <p>Questions? Reply to this email or contact <a href="mailto:support@cupidcrochy.com" style="color: #5B1A1A;">support@cupidcrochy.com</a></p>
                    </td>
                  </tr>
                </table>
              </center>
            </body>
            </html>
          `;

        await resend.emails.send({
          from: "Cupid Crochy <onboarding@resend.dev>",
          to: session.customer_details?.email || "",
          subject: `Order Confirmed - #${order.shortOrderId} | Cupid Crochy`,
          html: emailHtml,
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
