import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface Order {
  _id: string;
  shortOrderId: string;
  userName: string;
  userEmail: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: any;
  discountAmount?: number;
  couponCode?: string;
}

export const generateInvoice = (order: Order) => {
  const doc = new jsPDF() as any;

  // Colors
  const maroon: [number, number, number] = [91, 26, 26];
  const pink: [number, number, number] = [245, 221, 235];

  // Header - Brand
  doc.setFillColor(...maroon);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Cupid Crochy", 20, 25);
  
  doc.setFontSize(10);
  doc.text("Handcrafted with love", 20, 32);
  
  doc.setFontSize(14);
  doc.text("INVOICE", 170, 25);

  // Order Details
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text(`Invoice ID: #${order.shortOrderId}`, 20, 60);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 66);
  doc.text(`Status: ${order.status.toUpperCase()}`, 20, 72);

  // Bill To
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(order.userName, 20, 98);
  doc.text(order.userEmail, 20, 104);
  doc.text(`${order.shippingAddress.line1 || ""}`, 20, 110);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 20, 116);
  doc.text(`${order.shippingAddress.country}, ${order.shippingAddress.postalCode}`, 20, 122);

  // Items Table
  const tableData = order.items.map((item: any) => [
    item.name,
    item.quantity.toString(),
    `৳${item.price}`,
    `৳${item.price * item.quantity}`
  ]);

  autoTable(doc, {
    startY: 140,
    head: [["Product", "Qty", "Price", "Total"]],
    body: tableData,
    headStyles: { fillColor: maroon, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: pink },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 25, halign: "right" }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Summary
  const subtotal = order.total;
  const shipping = 50;
  const discount = order.discountAmount || 0;
  const total = subtotal - discount + shipping;

  doc.setFontSize(10);
  doc.text("Subtotal:", 140, finalY);
  doc.text(`৳${subtotal}`, 175, finalY, { align: "right" });
  
  if (discount > 0) {
    const discountLabel = order.couponCode ? `Coupon (${order.couponCode})` : "Discount";
    doc.text(`${discountLabel}:`, 140, finalY + 7);
    doc.text(`-৳${discount}`, 175, finalY + 7, { align: "right" });
    doc.setFontSize(10);
    doc.text("Shipping:", 140, finalY + 17);
    doc.text("৳50", 175, finalY + 17, { align: "right" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 140, finalY + 27);
    doc.text(`৳${total}`, 175, finalY + 27, { align: "right" });
  } else {
    doc.setFontSize(10);
    doc.text("Shipping:", 140, finalY + 7);
    doc.text("৳50", 175, finalY + 7, { align: "right" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 140, finalY + 17);
    doc.text(`৳${subtotal + shipping}`, 175, finalY + 17, { align: "right" });
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for supporting our handcrafted creations!", 105, 280, { align: "center" });
  doc.text("Visit us at cupid-crochy.com", 105, 285, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
};
