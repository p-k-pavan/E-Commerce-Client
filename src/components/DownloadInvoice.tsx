"use client";

import axios from "axios";
import { toast } from "sonner";

interface Orders {
  _id?: string;
  orderId?: string;
  product_details: {
    name: string;
    image: string[];
  };
  quantity: number;
  payment_status: string;
  subTotalAmt: number;
  totalAmt: number;
  createdAt: string;
  delivery_address?: string;
}

interface Address {
  _id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  mobile: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AddressResponse {
  message: string;
  address: Address;
  error: boolean;
  success: true;
}

export const downloadInvoice = async (order: Orders) => {
  console.log("Generating invoice for order:", order);
  try {
    toast.info("Generating invoice...");

    // Fetch delivery address if available
    let deliveryAddress: Address | null = null;
    if (order.delivery_address) {
      try {
        const addressResponse = await axios.get<AddressResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/address/${order.delivery_address}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (addressResponse.data.success) {
          deliveryAddress = addressResponse.data.address;
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        // Continue without address if fetch fails
      }
    }

    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    // Create PDF document
    const pdfDoc = new jsPDF();

    // Set up PDF dimensions
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Header
    pdfDoc.setFontSize(24);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setTextColor(34, 197, 94); // Green color
    pdfDoc.text("NAMMA MART", pageWidth / 2, margin, { align: "center" });

    // Invoice Title
    pdfDoc.setFontSize(18);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.text("INVOICE", pageWidth / 2, margin + 15, { align: "center" });

    let yPosition = margin + 35;

    // Company Info
    pdfDoc.setFontSize(10);
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.text("Namma Mart Pvt. Ltd.", margin, yPosition);
    pdfDoc.text("123 Business Street, Bengaluru", margin, yPosition + 5);
    pdfDoc.text("Karnataka - 560001, India", margin, yPosition + 10);
    pdfDoc.text("GSTIN: 29ABCDE1234F1Z2", margin, yPosition + 15);
    pdfDoc.text("Phone: +91 9876543210", margin, yPosition + 20);

    // Order Details (right side)
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Order Details:", pageWidth - margin - 60, yPosition);
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.text(`Order ID: ${order.orderId || "N/A"}`, pageWidth - margin - 60, yPosition + 5);
    pdfDoc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      pageWidth - margin - 60,
      yPosition + 10
    );
    pdfDoc.text(
      `Payment: ${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}`,
      pageWidth - margin - 60,
      yPosition + 15
    );

    yPosition += 35;

    // Delivery Address
    if (deliveryAddress) {
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("Delivery Address:", margin, yPosition);
      pdfDoc.setFont("helvetica", "normal");

      const addressLines = [
        deliveryAddress.street || "",
        `${deliveryAddress.city || ""}, ${deliveryAddress.state || ""} - ${deliveryAddress.postalCode || ""}`,
        deliveryAddress.country || "",
        `Phone: ${deliveryAddress.mobile || ""}`,
      ].filter((line) => line.trim() !== "");

      addressLines.forEach((line, index) => {
        pdfDoc.text(line, margin, yPosition + 5 + index * 5);
      });

      yPosition += addressLines.length * 5 + 15;
    }

    // Table Header
    pdfDoc.setFillColor(34, 197, 94);
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.rect(margin, yPosition, contentWidth, 10, "F");

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Product Description", margin + 5, yPosition + 7);
    pdfDoc.text("Qty", margin + 90, yPosition + 7);
    pdfDoc.text("Unit Price", pageWidth - margin - 40, yPosition + 7, { align: "right" });
    pdfDoc.text("Amount", pageWidth - margin - 5, yPosition + 7, { align: "right" });

    yPosition += 15;

    // Table Content
    pdfDoc.setFillColor(255, 255, 255);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.setFont("helvetica", "normal");

    const productName = order.product_details?.name || "Product";
    const unitPrice = order.subTotalAmt / order.quantity;
    const totalPrice = order.subTotalAmt;

    const maxProductWidth = 90;
    const productLines = pdfDoc.splitTextToSize(productName, maxProductWidth);
    const rowHeight = Math.max(productLines.length * 5, 12);

    productLines.forEach((line: string, index: number) => {
      pdfDoc.text(line, margin + 5, yPosition + 5 + index * 5);
    });

    const textYPosition = yPosition + rowHeight / 2 - 2;
    pdfDoc.text(order.quantity.toString(), margin + 90, textYPosition);
    pdfDoc.text(`Rs. ${unitPrice.toFixed(2)}`, pageWidth - margin - 40, textYPosition, { align: "right" });
    pdfDoc.text(`Rs. ${totalPrice.toFixed(2)}`, pageWidth - margin - 5, textYPosition, { align: "right" });

    yPosition += rowHeight + 10;

    pdfDoc.setDrawColor(200, 200, 200);
    pdfDoc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Summary
    const summaryX = pageWidth - margin - 60;
    pdfDoc.setFont("helvetica", "normal");

    pdfDoc.text("Subtotal:", summaryX, yPosition, { align: "right" });
    pdfDoc.text(`Rs. ${order.subTotalAmt.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: "right" });

    pdfDoc.text("Shipping:", summaryX, yPosition + 8, { align: "right" });
    pdfDoc.text("FREE", pageWidth - margin - 5, yPosition + 8, { align: "right" });

    const discountOrTax = order.totalAmt - order.subTotalAmt;
    if (discountOrTax !== 0) {
      const label = discountOrTax < 0 ? "Discount" : "Tax";
      pdfDoc.text(`${label}:`, summaryX, yPosition + 16, { align: "right" });
      pdfDoc.text(`Rs. ${Math.abs(discountOrTax).toFixed(2)}`, pageWidth - margin - 5, yPosition + 16, { align: "right" });
      yPosition += 8;
    }

    yPosition += 20;

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("Grand Total:", summaryX, yPosition, { align: "right" });
    pdfDoc.text(`Rs. ${order.totalAmt.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: "right" });

    yPosition += 25;

    // Footer Notes
    pdfDoc.setFontSize(8);
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setTextColor(100, 100, 100);
    pdfDoc.text("Thank you for shopping with Namma Mart!", pageWidth / 2, yPosition, { align: "center" });
    pdfDoc.text("For any queries, contact: support@nammamart.com", pageWidth / 2, yPosition + 5, { align: "center" });
    pdfDoc.text("This is a computer-generated invoice.", pageWidth / 2, yPosition + 10, { align: "center" });

    // Save PDF
    const fileName = `namma-mart-invoice-${order.orderId || order._id}.pdf`;
    pdfDoc.save(fileName);

    toast.success("Invoice downloaded successfully!");
  } catch (error) {
    console.error("Error generating invoice:", error);
    toast.error("Failed to download invoice");
  }
};
