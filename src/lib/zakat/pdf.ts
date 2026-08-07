import { jsPDF } from "jspdf";
import type { ZakatResult } from "./engine";

export interface PdfOptions {
  currency: string;
  preset?: string;
  priceSource?: string;
  appName?: string;
}

const money = (currency: string, v: number) =>
  `${currency} ${Math.round(v).toLocaleString("en-US")}`;

/**
 * Real PDF generation (not a print dialog). Rendered in English/Latin script
 * because the built-in PDF fonts cannot embed Nastaliq glyphs.
 */
export function generateZakatPdf(result: ZakatResult, opts: PdfOptions): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  // Header band
  doc.setFillColor(15, 81, 50);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(opts.appName ?? "Hanafi Zakat Calculator", margin, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Zakat statement prepared according to Hanafi jurisprudence", margin, 66);
  doc.text(new Date().toLocaleString("en-GB"), margin, 82);

  y = 130;
  doc.setTextColor(20, 20, 20);

  const line = (label: string, value: string, bold = false, indent = 0) => {
    if (y > pageHeight - 90) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(11);
    doc.text(label, margin + indent, y);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += 20;
  };

  const rule = () => {
    doc.setDrawColor(220);
    doc.line(margin, y - 12, pageWidth - margin, y - 12);
    y += 4;
  };

  const heading = (text: string) => {
    if (y > pageHeight - 110) {
      doc.addPage();
      y = margin;
    }
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 81, 50);
    doc.text(text, margin, y);
    doc.setTextColor(20, 20, 20);
    y += 20;
  };

  const c = opts.currency;

  heading("Zakatable assets");
  line("Gold value", money(c, result.goldValue));
  line("Silver value", money(c, result.silverValue));
  line("Cash & bank", money(c, result.cashTotal));
  line("Business assets", money(c, result.businessTotal));
  line("Investments", money(c, result.investmentsTotal));
  line("Receivables (strong debt)", money(c, result.receivablesTotal));
  rule();
  line("Total zakatable assets", money(c, result.totalAssets), true);

  heading("Excluded receivables (Hanafi)");
  line("Uncertain / weak debt — counted when received", money(c, result.receivablesUncertain));
  line("Bad debt — excluded entirely", money(c, result.receivablesBad));

  heading("Deductions & threshold");
  line("Deductible liabilities", `- ${money(c, result.liabilitiesTotal)}`);
  line("Net zakatable wealth", money(c, result.netWealth), true);
  line("Nisab threshold", money(c, result.nisab));
  line("Hawl (lunar year) completed", result.hawlCompleted ? "Yes" : "No");
  line("Above Nisab", result.aboveNisab ? "Yes" : "No");

  const rate = ((result.config?.zakatRate ?? 0.025) * 100).toFixed(2).replace(/\.00$/, "");
  heading(`Zakat payable (${rate}%)`);
  doc.setFillColor(240, 247, 243);
  doc.rect(margin, y - 16, pageWidth - margin * 2, 40, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(money(c, result.zakatDue), pageWidth - margin - 8, y + 10, { align: "right" });
  y += 56;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  const footer = doc.splitTextToSize(
    `Template: ${opts.preset ?? "custom"}  •  Price source: ${opts.priceSource ?? "manual"}\nThis statement follows Hanafi jurisprudence and is provided for guidance only. For complex situations, please consult a qualified Mufti.`,
    pageWidth - margin * 2,
  );
  doc.text(footer, margin, Math.min(y, pageHeight - 60));

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(140);
    doc.text(`Page ${i} of ${pages}`, pageWidth - margin, pageHeight - 24, { align: "right" });
  }

  return doc;
}
