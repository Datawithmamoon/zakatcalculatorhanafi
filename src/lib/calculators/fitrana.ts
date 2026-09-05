/**
 * Sadaqat al-Fitr (Fitrana) — Hanafi.
 *
 * The Hanafi measure is half a sa' of wheat (or its flour) per person, which is
 * conventionally taken as 1.75 kg (some contemporary bodies use 2.045 kg to be
 * cautious). It may also be paid as one sa' of barley, dates or raisins, or the
 * cash value of that food. Payment is due for the head of household and every
 * dependant, before the Eid prayer.
 */
export interface FitranaInput {
  /** Number of people the payer is responsible for. */
  people: number;
  /** Kilograms of wheat per person (admin configurable). */
  wheatKgPerPerson: number;
  /** Market price of one kilogram of wheat / flour. */
  wheatPricePerKg: number;
  /** Optional fixed per-person amount announced locally; overrides the wheat calculation. */
  fixedPerPerson?: number | undefined;
  /** Use the announced fixed amount instead of calculating from wheat price. */
  useFixed: boolean;
}

export interface FitranaResult {
  people: number;
  perPerson: number;
  totalWheatKg: number;
  total: number;
  basis: "fixed" | "wheat";
}

const clean = (n: unknown): number => {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export function calculateFitrana(input: FitranaInput): FitranaResult {
  const people = Math.max(0, Math.floor(clean(input.people)));
  const wheatKg = clean(input.wheatKgPerPerson);
  const perPerson = input.useFixed
    ? clean(input.fixedPerPerson)
    : wheatKg * clean(input.wheatPricePerKg);

  return {
    people,
    perPerson,
    totalWheatKg: people * wheatKg,
    total: people * perPerson,
    basis: input.useFixed ? "fixed" : "wheat",
  };
}
