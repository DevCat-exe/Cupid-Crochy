import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import fs from "fs";
import path from "path";

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
  const margin = 20;

  // Load Logo
  let logoBase64 = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "favicon.jpg");
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      logoBase64 = `data:image/jpeg;base64,${logoData.toString("base64")}`;
    }
  } catch (error) {
    console.error("Error loading logo for PDF:", error);
  }

  // Load Custom Font (Cookie)
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "Cookie-Regular.ttf");
    if (fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath).toString("base64");
      doc.addFileToVFS("Cookie-Regular.ttf", fontData);
      doc.addFont("Cookie-Regular.ttf", "Cookie", "normal");
    }
  } catch (error) {
    console.error("Error loading font for PDF:", error);
  }

  // --- HEADER SECTION ---
  doc.setFillColor(...beige);
  doc.rect(0, 0, pageWidth, 55, "F");

  // Logo
  if (logoBase64) {
    doc.addImage(logoBase64, "JPEG", margin, 12, 12, 12);
  }

  // Brand Name
  doc.setTextColor(...maroon);
  doc.setFont("Cookie", "normal"); // Use Cookie font
  doc.setFontSize(42); // Larger size for cursive font
  doc.text("Cupid Crochy", margin + (logoBase64 ? 16 : 0), 24);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Handcrafted with love", margin + (logoBase64 ? 16 : 0), 32); // Lowered Y position

  // Invoice Label & Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(200, 200, 200); // Subtle background text
  doc.text("INVOICE", pageWidth - margin, 25, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(...maroon);
  doc.text(`Invoice #: ${order.shortOrderId}`, pageWidth - margin, 38, { align: "right" });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - margin, 44, { align: "right" });

  // --- CUSTOMER & SHIPPING INFO ---
  const infoStartY = 65; // Moved up slightly since status is gone
  
  // Bill To
  doc.setTextColor(...maroon);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", margin, infoStartY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Darker text
  doc.setFontSize(10);
  doc.text(order.userName, margin, infoStartY + 6);
  doc.text(order.userEmail, margin, infoStartY + 11);

  // Ship To
  doc.setTextColor(...maroon);
  doc.setFont("helvetica", "bold");
  doc.text("SHIP TO", pageWidth / 2, infoStartY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Darker text
  
  const addressLines = [
    order.shippingAddress.line1,
    `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
    `${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`
  ].filter(Boolean) as string[];

  addressLines.forEach((line, i) => {
    doc.text(line, pageWidth / 2, infoStartY + 6 + (i * 5));
  });

  // --- ITEMS TABLE ---
  const tableData = order.items.map((item) => [
    item.name,
    item.quantity.toString(),
    `Tk ${item.price.toLocaleString()}`,
    `Tk ${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [["Item Description", "Qty", "Price", "Total"]],
    body: tableData,
    theme: 'grid',
    styles: {
      font: "helvetica",
      fontSize: 10,
      textColor: [0, 0, 0], // Darker text
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
      cellPadding: 8,
    },
    headStyles: { 
      fillColor: maroon, 
      textColor: white,
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 25, halign: "center" }, // Increased width
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right", fontStyle: 'bold' }
    },
    alternateRowStyles: { 
      fillColor: [252, 252, 252]
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // --- TOTALS SECTION ---
  const summaryX = pageWidth - margin - 80;
  const valueX = pageWidth - margin;
  let currentY = finalY;

  // Calculations
  const shippingCost = 50;
  const discount = order.discountAmount || 0;
  const subtotal = order.total - shippingCost + discount;

  // Subtotal
  doc.setTextColor(0, 0, 0); // Darker
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", summaryX, currentY);
  doc.text(`Tk ${subtotal.toLocaleString()}`, valueX, currentY, { align: "right" });
  currentY += 8;

  // Shipping
  doc.text("Shipping", summaryX, currentY);
  doc.text(`Tk ${shippingCost}`, valueX, currentY, { align: "right" });
  currentY += 8;

  // Discount
  if (discount > 0) {
    doc.setTextColor(220, 53, 69); // Red for discount
    doc.text(`Discount ${order.couponCode ? `(${order.couponCode})` : ""}`, summaryX, currentY);
    doc.text(`- Tk ${discount.toLocaleString()}`, valueX, currentY, { align: "right" });
    currentY += 8;
  }

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(summaryX, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Grand Total
  doc.setFillColor(...pink);
  doc.roundedRect(summaryX - 10, currentY - 7, 100, 16, 2, 2, "F");
  
  doc.setTextColor(...maroon);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL PAID", summaryX, currentY);
  doc.text(`Tk ${order.total.toLocaleString()}`, valueX, currentY, { align: "right" });

  // --- FOOTER ---
  const footerY = pageHeight - 30;
  
  doc.setDrawColor(...pink);
  doc.setLineWidth(1);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setTextColor(...maroon);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for shopping with Cupid Crochy!", pageWidth / 2, footerY + 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("cupidcrochy.com  |  support@cupidcrochy.com", pageWidth / 2, footerY + 20, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
};
