/**
 * Hanafi Zakat calculation engine.
 *
 * Every rule lives in its own small, pure function so individual Hanafi rulings
 * can be updated independently without touching the UI layer.
 */

export const TOLA_IN_GRAMS = 11.6638;

/** Nisab thresholds (Hanafi): 7.5 tola gold / 52.5 tola silver. */
export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;

export const ZAKAT_RATE = 0.025; // 1/40

export type MetalUnit = "gram" | "tola";
export type GoldPurity = "24K" | "22K" | "21K" | "18K";

/** Purity factor relative to pure (24K) metal. */
export const PURITY_FACTOR: Record<GoldPurity, number> = {
  "24K": 1,
  "22K": 22 / 24,
  "21K": 21 / 24,
  "18K": 18 / 24,
};

export interface MetalHolding {
  owns: boolean;
  weight: number;
  unit: MetalUnit;
  purity: GoldPurity;
  /** Price of one gram of PURE (24K) metal in the reporting currency. */
  pricePerGram: number;
}

export interface ReceivablesInput {
  likely: number;
  uncertain: number;
  bad: number;
}

export interface ZakatInput {
  hawlCompleted: boolean;
  gold: MetalHolding;
  silver: MetalHolding;
  cash: Record<string, number>;
  business: Record<string, number>;
  investments: Record<string, number>;
  receivables: ReceivablesInput;
  liabilities: Record<string, number>;
  /** Which metal defines the Nisab threshold. Hanafi default: silver. */
  nisabBasis: "silver" | "gold" | "manual";
  manualNisab: number;
}

export interface ZakatResult {
  goldValue: number;
  silverValue: number;
  cashTotal: number;
  businessTotal: number;
  investmentsTotal: number;
  receivablesTotal: number;
  receivablesUncertain: number;
  receivablesBad: number;
  config?: ZakatConfig;
  totalAssets: number;
  liabilitiesTotal: number;
  netWealth: number;
  goldNisab: number;
  silverNisab: number;
  nisab: number;
  aboveNisab: boolean;
  zakatDue: number;
  hawlCompleted: boolean;
}

export const toGrams = (weight: number, unit: MetalUnit): number =>
  unit === "tola" ? weight * TOLA_IN_GRAMS : weight;

/** Pure-metal equivalent grams after applying karat purity. */
export const pureGrams = (h: MetalHolding): number =>
  toGrams(num(h.weight), h.unit) * PURITY_FACTOR[h.purity];

/** Market value of a metal holding. */
export const metalValue = (h: MetalHolding): number =>
  h.owns ? pureGrams(h) * num(h.pricePerGram) : 0;

export const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Admin-managed thresholds; falls back to the classical Hanafi constants. */
export interface ZakatConfig {
  nisabGoldGrams: number;
  nisabSilverGrams: number;
  zakatRate: number;
}

export const DEFAULT_CONFIG: ZakatConfig = {
  nisabGoldGrams: NISAB_GOLD_GRAMS,
  nisabSilverGrams: NISAB_SILVER_GRAMS,
  zakatRate: ZAKAT_RATE,
};

const resolveConfig = (c?: Partial<ZakatConfig>): ZakatConfig => ({
  nisabGoldGrams: num(c?.nisabGoldGrams) || NISAB_GOLD_GRAMS,
  nisabSilverGrams: num(c?.nisabSilverGrams) || NISAB_SILVER_GRAMS,
  zakatRate: num(c?.zakatRate) || ZAKAT_RATE,
});

export type ParsedAmount = { value: number; error: "invalid" | "negative" | null };

/**
 * Strict numeric parsing for user-typed money values.
 * Typos ("12o0"), stray characters and negatives surface as errors instead of
 * silently collapsing to 0. Partial entries ("0.", "") are treated as 0 with no error.
 */
export function parseAmount(raw: string): ParsedAmount {
  const s = raw.trim().replace(/[\s,]/g, "");
  if (s === "" || s === "." || /^\d*\.$/.test(s)) {
    return { value: s === "" ? 0 : Number(s.slice(0, -1) || 0), error: null };
  }
  if (/^-/.test(s)) return { value: 0, error: "negative" };
  if (!/^\d*(\.\d+)?$/.test(s)) return { value: 0, error: "invalid" };
  const n = Number(s);
  if (!Number.isFinite(n)) return { value: 0, error: "invalid" };
  return { value: n, error: null };
}

export const sum = (record: Record<string, number> | undefined): number =>
  Object.values(record ?? {}).reduce<number>((a, b) => a + num(b), 0);

/**
 * Hanafi ruling on debts owed to you (duyun):
 * - Strong/likely recoverable debt (dayn qawi): zakatable now.
 * - Uncertain/weak debt: not counted until actually received.
 * - Bad debt: excluded entirely.
 */
export const zakatableReceivables = (r: ReceivablesInput): number => num(r?.likely);

/** Silver is the Hanafi default basis for cash and mixed wealth (more beneficial to the poor). */
export const nisabValue = (input: ZakatInput, config?: Partial<ZakatConfig>): number => {
  const c = resolveConfig(config);
  if (input.nisabBasis === "manual") return num(input.manualNisab);
  if (input.nisabBasis === "gold") return c.nisabGoldGrams * num(input.gold.pricePerGram);
  return c.nisabSilverGrams * num(input.silver.pricePerGram);
};

export function calculateZakat(input: ZakatInput, config?: Partial<ZakatConfig>): ZakatResult {
  const c = resolveConfig(config);
  const goldValue = metalValue(input.gold);
  const silverValue = metalValue(input.silver);
  const cashTotal = sum(input.cash);
  const businessTotal = sum(input.business);
  const investmentsTotal = sum(input.investments);
  const receivablesTotal = zakatableReceivables(input.receivables);
  const liabilitiesTotal = sum(input.liabilities);

  const totalAssets =
    goldValue + silverValue + cashTotal + businessTotal + investmentsTotal + receivablesTotal;

  const netWealth = Math.max(0, totalAssets - liabilitiesTotal);

  const goldNisab = c.nisabGoldGrams * num(input.gold.pricePerGram);
  const silverNisab = c.nisabSilverGrams * num(input.silver.pricePerGram);
  const nisab = nisabValue(input, c);

  const aboveNisab = input.hawlCompleted && nisab > 0 && netWealth >= nisab;
  const zakatDue = aboveNisab ? Math.round(netWealth * c.zakatRate) : 0;

  return {
    goldValue,
    silverValue,
    cashTotal,
    businessTotal,
    investmentsTotal,
    receivablesTotal,
    receivablesUncertain: num(input.receivables?.uncertain),
    receivablesBad: num(input.receivables?.bad),
    totalAssets,
    liabilitiesTotal,
    netWealth,
    goldNisab,
    silverNisab,
    nisab,
    aboveNisab,
    zakatDue,
    hawlCompleted: input.hawlCompleted,
    config: c,
  };
}

export const emptyMetal = (pricePerGram: number): MetalHolding => ({
  owns: false,
  weight: 0,
  unit: "gram",
  purity: "24K",
  pricePerGram,
});

/** Editable reference prices (PKR per gram of pure metal). */
export const DEFAULT_GOLD_PRICE = 30500;
export const DEFAULT_SILVER_PRICE = 360;

export const defaultInput = (): ZakatInput => ({
  hawlCompleted: true,
  gold: emptyMetal(DEFAULT_GOLD_PRICE),
  silver: emptyMetal(DEFAULT_SILVER_PRICE),
  cash: {},
  business: {},
  investments: {},
  receivables: { likely: 0, uncertain: 0, bad: 0 },
  liabilities: {},
  nisabBasis: "silver",
  manualNisab: 0,
});
