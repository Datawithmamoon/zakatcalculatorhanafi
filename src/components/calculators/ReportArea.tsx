import { useRef, useState, type ReactNode } from "react";
import { Download, Loader2, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { saveBlob, shareContent, printOrFallback } from "@/lib/platform";

const stamp = () => new Date().toISOString().slice(0, 10);

/**
 * Renders the report element to a multi-page A4 PDF. The element is captured as an
 * image (so Urdu/Arabic shaping and RTL match the screen exactly) and split at blank
 * rows so lines of text are never cut between pages.
 */
async function buildPdf(el: HTMLElement): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    windowWidth: 900,
    useCORS: true,
    onclone: (doc) => {
      const clone = doc.querySelector<HTMLElement>("[data-report-clone]");
      if (!clone) return;
      clone.style.width = "780px";
      clone.style.padding = "16px";
      clone.style.background = "#ffffff";
      clone.querySelectorAll<HTMLElement>(".report-header").forEach((h) => (h.style.display = "block"));
      clone.querySelectorAll<HTMLElement>(".overflow-x-auto").forEach((h) => (h.style.overflow = "visible"));
      clone.querySelectorAll<HTMLElement>(".no-print").forEach((h) => (h.style.display = "none"));
    },
  });

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 28;
  const contentW = pageW - margin * 2;
  const contentH = pageH - margin * 2 - 14;
  const ratio = canvas.width / contentW;
  const sliceMax = Math.floor(contentH * ratio);
  const ctx = canvas.getContext("2d");

  const isBlankRow = (y: number) => {
    if (!ctx) return true;
    const row = ctx.getImageData(0, y, canvas.width, 1).data;
    for (let i = 0; i < row.length; i += 16) {
      if (row[i]! < 235 || row[i + 1]! < 235 || row[i + 2]! < 235) return false;
    }
    return true;
  };

  const slices: Array<[number, number]> = [];
  let y = 0;
  while (y < canvas.height) {
    let end = Math.min(y + sliceMax, canvas.height);
    if (end < canvas.height) {
      const floor = end - Math.floor(sliceMax * 0.3);
      for (let t = end; t > floor; t -= 2) {
        if (isBlankRow(t)) {
          end = t;
          break;
        }
      }
    }
    slices.push([y, end]);
    y = end;
  }

  slices.forEach(([from, to], i) => {
    if (i > 0) pdf.addPage();
    const part = document.createElement("canvas");
    part.width = canvas.width;
    part.height = to - from;
    part.getContext("2d")?.drawImage(canvas, 0, from, canvas.width, to - from, 0, 0, canvas.width, to - from);
    pdf.addImage(part.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, contentW, (to - from) / ratio);
    pdf.setFontSize(8);
    pdf.setTextColor(140);
    pdf.text(`${i + 1} / ${slices.length}`, pageW - margin, pageH - 14, { align: "right" });
  });
  return pdf.output("blob") as Blob;
}

export function ReportArea({
  title,
  filename,
  shareText,
  ur,
  children,
}: {
  title: string;
  filename: string;
  shareText: string;
  ur: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<null | "pdf" | "share">(null);

  const pdf = async () => {
    if (!ref.current) throw new Error("no report");
    return buildPdf(ref.current);
  };

  const download = async () => {
    setBusy("pdf");
    try {
      await saveBlob(`${filename}-${stamp()}.pdf`, await pdf());
      toast.success(ur ? "پی ڈی ایف تیار ہے" : "PDF downloaded");
    } catch {
      toast.error(ur ? "پی ڈی ایف نہیں بن سکی" : "Could not create the PDF");
    } finally {
      setBusy(null);
    }
  };

  const print = () =>
    printOrFallback(async () => {
      await saveBlob(`${filename}-${stamp()}.pdf`, await pdf());
    });

  const doPrint = async () => {
    document.body.classList.add("printing-report");
    ref.current?.classList.add("report-target");
    const cleanup = () => {
      document.body.classList.remove("printing-report");
      ref.current?.classList.remove("report-target");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    await print();
    setTimeout(cleanup, 1500);
  };

  const share = async () => {
    setBusy("share");
    try {
      const outcome = await shareContent({
        title,
        text: shareText,
        file: { filename: `${filename}-${stamp()}.pdf`, blob: await pdf() },
      });
      if (outcome === "copied") toast.success(ur ? "کاپی ہو گیا" : "Copied to clipboard");
    } catch {
      toast.error(ur ? "شیئر نہیں ہو سکا" : "Could not share");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div ref={ref} data-report-clone dir={ur ? "rtl" : "ltr"}>
        <div className="report-header mb-4 hidden border-b pb-3">
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleString(ur ? "ur-PK" : "en-GB")} — zakatcalculatorhanafi.lovable.app
          </p>
        </div>
        {children}
      </div>
      <div className="no-print mt-4 flex flex-wrap gap-3">
        <Button className="min-h-11" onClick={doPrint}>
          <Printer className="size-4" aria-hidden /> {ur ? "پرنٹ" : "Print"}
        </Button>
        <Button className="min-h-11" variant="secondary" onClick={download} disabled={busy !== null}>
          {busy === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" aria-hidden />}
          {ur ? "پی ڈی ایف ڈاؤن لوڈ" : "Download PDF"}
        </Button>
        <Button className="min-h-11" variant="secondary" onClick={share} disabled={busy !== null}>
          {busy === "share" ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" aria-hidden />}
          {ur ? "شیئر کریں" : "Share result"}
        </Button>
      </div>
      <Toaster />
    </>
  );
}
