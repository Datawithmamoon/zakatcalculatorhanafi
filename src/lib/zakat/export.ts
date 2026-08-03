import type { ZakatInput, ZakatResult } from "./engine";

export interface ExportMeta {
  currency: string;
  generatedAt: string;
  preset?: string;
  priceSource?: string;
}

export interface ExportPayload {
  meta: ExportMeta;
  input: ZakatInput;
  result: ZakatResult;
}

export function buildPayload(
  input: ZakatInput,
  result: ZakatResult,
  meta: Omit<ExportMeta, "generatedAt">,
): ExportPayload {
  return { meta: { ...meta, generatedAt: new Date().toISOString() }, input, result };
}

const escapeCsv = (v: string | number): string => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(payload: ExportPayload): string {
  const { meta, input, result } = payload;
  const rows: Array<[string, string | number]> = [
    ["Generated at", meta.generatedAt],
    ["Currency", meta.currency],
    ["Template", meta.preset ?? "custom"],
    ["Price source", meta.priceSource ?? "manual"],
    ["Hawl completed", input.hawlCompleted ? "yes" : "no"],
    ["Nisab basis", input.nisabBasis],
    ["Gold value", Math.round(result.goldValue)],
    ["Silver value", Math.round(result.silverValue)],
    ["Cash", Math.round(result.cashTotal)],
    ["Business assets", Math.round(result.businessTotal)],
    ["Investments", Math.round(result.investmentsTotal)],
    ["Receivables (zakatable)", Math.round(result.receivablesTotal)],
    ["Total assets", Math.round(result.totalAssets)],
    ["Liabilities", Math.round(result.liabilitiesTotal)],
    ["Net wealth", Math.round(result.netWealth)],
    ["Nisab threshold", Math.round(result.nisab)],
    ["Above Nisab", result.aboveNisab ? "yes" : "no"],
    ["Zakat due (2.5%)", Math.round(result.zakatDue)],
  ];

  return ["Item,Value", ...rows.map(([k, v]) => `${escapeCsv(k)},${escapeCsv(v)}`)].join("\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const fileStamp = () => new Date().toISOString().slice(0, 10);
