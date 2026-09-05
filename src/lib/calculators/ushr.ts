/**
 * Ushr — Zakat on agricultural produce (Hanafi).
 *
 * Imam Abu Hanifa holds that Ushr is due on any quantity of produce of the land
 * (no Nisab and no Hawl). The rate is one tenth (10%) where the land is watered
 * naturally by rain, springs or rivers, and one twentieth (5%) where irrigation
 * is artificial and costly (tube wells, canal charges, purchased water).
 * Cultivation expenses are NOT deducted before applying the rate.
 */
export type IrrigationType = "rain" | "irrigated";

export interface UshrInput {
  /** Harvest quantity, in the unit the farmer works with (kg, maund, etc.). */
  quantity: number;
  /** Market value of one unit of produce. */
  pricePerUnit: number;
  irrigation: IrrigationType;
  /** Rates are admin configurable; defaults are 0.10 and 0.05. */
  rateRain: number;
  rateIrrigated: number;
}

export interface UshrResult {
  rate: number;
  quantity: number;
  produceDue: number;
  grossValue: number;
  ushrValue: number;
}

const clean = (n: unknown): number => {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export function calculateUshr(input: UshrInput): UshrResult {
  const quantity = clean(input.quantity);
  const price = clean(input.pricePerUnit);
  const rate = input.irrigation === "rain" ? clean(input.rateRain) : clean(input.rateIrrigated);
  const grossValue = quantity * price;

  return {
    rate,
    quantity,
    produceDue: quantity * rate,
    grossValue,
    ushrValue: grossValue * rate,
  };
}
