import { jsPDF } from "jspdf";

import type { OrderLine } from "@/lib/order-store";
import { shippingFit } from "@/lib/shipping";

export function downloadOrderPdf(lines: OrderLine[], notes: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  let y = 64;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("ANTILIA SUPPLY CO.", left, y);
  y += 16;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("MADE TO ORDER  ·  FACTORY-DIRECT  ·  ORDER SUMMARY", left, y);
  doc.setTextColor(20);

  y += 34;
  doc.setFontSize(8);
  doc.text("VERSION", left, y);
  doc.text("QTY", 360, y);
  doc.text("UNIT", 410, y);
  doc.text("M3", 462, y);
  doc.text("TOTAL", 505, y);
  y += 8;
  doc.setDrawColor(210);
  doc.line(left, y, 547, y);
  y += 18;

  doc.setFontSize(9.5);
  for (const line of lines) {
    doc.text(`${line.seriesCode} — ${line.variantName}`, left, y, { maxWidth: 290 });
    doc.text(String(line.qty), 360, y);
    doc.text(`$${line.price.toFixed(0)}`, 410, y);
    doc.text((line.cbm * line.qty).toFixed(2), 462, y);
    doc.text(`$${(line.price * line.qty).toFixed(0)}`, 505, y);
    y += 20;
    if (y > 740) {
      doc.addPage();
      y = 64;
    }
  }

  const pieces = lines.reduce((s, l) => s + l.qty, 0);
  const cost = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const cbm = lines.reduce((s, l) => s + l.qty * l.cbm, 0);

  y += 8;
  doc.line(left, y, 547, y);
  y += 20;
  doc.setFontSize(10);
  doc.text(`${pieces} pieces   ·   $${cost.toLocaleString("en-US")}   ·   ${cbm.toFixed(1)} m³`, left, y);
  y += 20;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(shippingFit(cbm).caption, left, y, { maxWidth: 460 });

  if (notes.trim()) {
    y += 30;
    doc.setTextColor(20);
    doc.setFontSize(8);
    doc.text("PROJECT NOTES", left, y);
    y += 16;
    doc.setFontSize(9.5);
    doc.text(notes, left, y, { maxWidth: 460 });
  }

  y = Math.min(y + 40, 780);
  doc.setFontSize(7.5);
  doc.setTextColor(140);
  doc.text(
    "Pricing shown is factory-direct (FOB) in USD; freight, duties and taxes are confirmed with your order.",
    left,
    y,
    { maxWidth: 460 },
  );

  doc.save("antilia-order-summary.pdf");
}
