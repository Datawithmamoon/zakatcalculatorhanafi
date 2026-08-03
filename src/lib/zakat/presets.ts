import type { StepKey } from "./i18n";

export type PresetId = "salaried" | "business" | "investor" | "student" | "full";

export interface Preset {
  id: PresetId;
  labelEn: string;
  labelUr: string;
  descEn: string;
  descUr: string;
  /** Wizard steps this preset walks through, in order. */
  steps: StepKey[];
}

const ALL: StepKey[] = [
  "hawl",
  "gold",
  "silver",
  "cash",
  "business",
  "investments",
  "receivables",
  "agriculture",
  "livestock",
  "excluded",
  "liabilities",
];

export const PRESETS: Preset[] = [
  {
    id: "salaried",
    labelEn: "Salaried person",
    labelUr: "ملازمت پیشہ",
    descEn: "Savings, gold jewellery and monthly liabilities.",
    descUr: "بچت، زیورات اور ماہانہ واجبات۔",
    steps: ["hawl", "cash", "gold", "silver", "investments", "excluded", "liabilities"],
  },
  {
    id: "business",
    labelEn: "Business owner",
    labelUr: "کاروباری شخص",
    descEn: "Trade inventory, receivables and business cash.",
    descUr: "مالِ تجارت، واجب الوصول رقوم اور کاروباری نقدی۔",
    steps: ["hawl", "cash", "business", "receivables", "gold", "excluded", "liabilities"],
  },
  {
    id: "investor",
    labelEn: "Investor",
    labelUr: "سرمایہ کار",
    descEn: "Shares, funds, crypto and metals.",
    descUr: "حصص، فنڈز، کرپٹو اور دھاتیں۔",
    steps: ["hawl", "investments", "cash", "gold", "silver", "excluded", "liabilities"],
  },
  {
    id: "student",
    labelEn: "Student / simple",
    labelUr: "طالبِ علم / سادہ",
    descEn: "Just cash and a little gold.",
    descUr: "صرف نقدی اور تھوڑا سونا۔",
    steps: ["hawl", "cash", "gold", "liabilities"],
  },
  {
    id: "full",
    labelEn: "Complete review",
    labelUr: "مکمل جائزہ",
    descEn: "Every category including Ushr and livestock notes.",
    descUr: "عشر اور مویشی سمیت تمام اقسام۔",
    steps: ALL,
  },
];

export const presetById = (id: PresetId): Preset =>
  PRESETS.find((p) => p.id === id) ?? (PRESETS[PRESETS.length - 1] as Preset);
