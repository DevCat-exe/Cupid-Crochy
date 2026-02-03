import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface Order {
  _id: string;
  shortOrderId: string;
  userName: string;
  userEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    line1?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  discountAmount?: number;
  couponCode?: string;
}

export const generateInvoice = (order: Order) => {
  const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };

  // Brand Colors
  const maroon: [number, number, number] = [91, 26, 26]; // #5B1A1A
  const pink: [number, number, number] = [245, 221, 235]; // #F5DDEB
  const beige: [number, number, number] = [245, 240, 230]; // #F5F0E6
  const white: [number, number, number] = [255, 255, 255];

  // Page Setup
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Decorative Top Border
  doc.setFillColor(...maroon);
  doc.rect(0, 0, pageWidth, 8, "F");

  // Header Section with Branding
  doc.setFillColor(...beige);
  doc.rect(0, 8, pageWidth, 50, "F");

  // Logo/Brand Name
  doc.setTextColor(...maroon);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Cupid Crochy", 20, 38);

  // Tagline
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Handcrafted with Love", 20, 46);

  // Invoice Label
  doc.setFillColor(...maroon);
  doc.roundedRect(pageWidth - 70, 20, 50, 25, 3, 3, "F");
  doc.setTextColor(...white);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 58, 35, { align: "center" });

  // Order Info Section
  doc.setTextColor(...maroon);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Order Information", 20, 75);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: #${order.shortOrderId}`, 20, 85);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, 92);
  
  // Status Badge
  const statusColors: Record<string, [number, number, number]> = {
    pending: [255, 193, 7],
    processing: [33, 150, 243],
    shipped: [156, 39, 176],
    delivered: [76, 175, 80],
    cancelled: [244, 67, 54]
  };
  
  const statusColor = statusColors[order.status] || [128, 128, 128];
  doc.setFillColor(...statusColor);
  doc.roundedRect(20, 96, 40, 12, 2, 2, "F");
  doc.setTextColor(...white);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(order.status.toUpperCase(), 40, 104, { align: "center" });

  // Customer Info Section
  doc.setTextColor(...maroon);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", pageWidth - 90, 75);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(order.userName, pageWidth - 90, 85);
  doc.text(order.userEmail, pageWidth - 90, 92);
  doc.text(order.shippingAddress.line1 || "", pageWidth - 90, 99);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, pageWidth - 90, 106);
  doc.text(`${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`, pageWidth - 90, 113);

  // Decorative Line
  doc.setDrawColor(...maroon);
  doc.setLineWidth(0.5);
  doc.line(20, 125, pageWidth - 20, 125);

  // Items Table
  const tableData = order.items.map((item) => [
    item.name,
    item.quantity.toString(),
    `৳${item.price.toLocaleString()}`,
    `৳${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 135,
    head: [["Product", "Qty", "Price", "Total"]],
    body: tableData,
    headStyles: { 
      fillColor: maroon, 
      textColor: white,
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [60, 60, 60]
    },
    alternateRowStyles: { 
      fillColor: [250, 250, 250]
    },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: 'bold' },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right", fontStyle: 'bold' }
    },
    theme: 'grid',
    tableLineColor: maroon,
    tableLineWidth: 0.1
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  // Summary Section
  const summaryX = pageWidth - 90;
  let currentY = finalY;

  doc.setTextColor(...maroon);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Subtotal
  doc.text("Subtotal:", summaryX, currentY);
  doc.text(`৳${order.total.toLocaleString()}`, pageWidth - 25, currentY, { align: "right" });
  currentY += 10;

  // Shipping
  doc.text("Shipping:", summaryX, currentY);
  doc.text("৳50", pageWidth - 25, currentY, { align: "right" });
  currentY += 10;

  // Discount (if any)
  const discount = order.discountAmount || 0;
  if (discount > 0) {
    doc.setTextColor(220, 53, 69);
    doc.text(`Discount ${order.couponCode ? `(${order.couponCode})` : ""}:`, summaryX, currentY);
    doc.text(`-৳${discount.toLocaleString()}`, pageWidth - 25, currentY, { align: "right" });
    doc.setTextColor(...maroon);
    currentY += 10;
  }

  // Total Line
  doc.setDrawColor(...maroon);
  doc.setLineWidth(1);
  doc.line(summaryX - 10, currentY, pageWidth - 20, currentY);
  currentY += 8;

  // Grand Total
  const grandTotal = order.total + 50 - discount;
  doc.setFillColor(...pink);
  doc.roundedRect(summaryX - 10, currentY - 5, 80, 20, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...maroon);
  doc.text("Total Paid:", summaryX, currentY + 5);
  doc.text(`৳${grandTotal.toLocaleString()}`, pageWidth - 25, currentY + 5, { align: "right" });

  // Footer
  const footerY = pageHeight - 30;
  
  // Decorative Line
  doc.setDrawColor(...maroon);
  doc.setLineWidth(0.5);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);

  // Thank You Message
  doc.setTextColor(...maroon);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for supporting our handcrafted creations!", pageWidth / 2, footerY + 5, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("www.cupid-crochy.com | support@cupidcrochy.com", pageWidth / 2, footerY + 15, { align: "center" });

  // Bottom decorative border
  doc.setFillColor(...maroon);
  doc.rect(0, pageHeight - 5, pageWidth, 5, "F");

  return Buffer.from(doc.output("arraybuffer"));
};
