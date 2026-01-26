import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateInvoice } from "@/lib/pdf-generator";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    console.log("Fetching order with ID:", orderId);

    // Find order by shortOrderId or ObjectId
    let order;
    if (orderId.length < 24) {
      order = await Order.findOne({ shortOrderId: orderId.toUpperCase() });
    } else {
      order = await Order.findById(orderId);
    }

    if (!order) {
      console.log("Order not found for ID:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", order._id, "shortOrderId:", order.shortOrderId);

    // Generate invoice PDF
    const pdfBuffer = generateInvoice(order);

    // Return PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.shortOrderId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Failed to generate invoice:", error);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
