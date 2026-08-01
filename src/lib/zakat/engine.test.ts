import { describe, expect, it } from "vitest";
import {
  calculateZakat,
  defaultInput,
  metalValue,
  toGrams,
  TOLA_IN_GRAMS,
  zakatableReceivables,
} from "./engine";

describe("unit conversion", () => {
  it("converts tola to grams", () => {
    expect(toGrams(1, "tola")).toBeCloseTo(TOLA_IN_GRAMS);
    expect(toGrams(10, "gram")).toBe(10);
  });

  it("applies karat purity", () => {
    const v = metalValue({ owns: true, weight: 24, unit: "gram", purity: "22K", pricePerGram: 100 });
    expect(v).toBeCloseTo(2200);
  });

  it("returns 0 when not owned", () => {
    expect(
      metalValue({ owns: false, weight: 24, unit: "gram", purity: "24K", pricePerGram: 100 }),
    ).toBe(0);
  });
});

describe("receivables (Hanafi)", () => {
  it("counts only likely-recoverable debt", () => {
    expect(zakatableReceivables({ likely: 1000, uncertain: 500, bad: 900 })).toBe(1000);
  });
});

describe("zakat calculation", () => {
  it("is not due before hawl completes", () => {
    const r = calculateZakat({ ...defaultInput(), hawlCompleted: false, cash: { bank: 1_000_000 } });
    expect(r.zakatDue).toBe(0);
  });

  it("is not due below nisab", () => {
    const i = defaultInput();
    i.silver.pricePerGram = 360; // silver nisab ≈ 220,449
    i.cash = { home: 10_000 };
    expect(calculateZakat(i).aboveNisab).toBe(false);
  });

  it("computes 2.5% above nisab and deducts liabilities", () => {
    const i = defaultInput();
    i.silver.pricePerGram = 360;
    i.cash = { bank: 1_000_000 };
    i.liabilities = { loan: 200_000 };
    const r = calculateZakat(i);
    expect(r.netWealth).toBe(800_000);
    expect(r.zakatDue).toBe(20_000);
  });

  it("uses gold nisab when selected", () => {
    const i = defaultInput();
    i.gold.pricePerGram = 30_000;
    i.nisabBasis = "gold";
    expect(calculateZakat(i).nisab).toBeCloseTo(87.48 * 30_000);
  });
});
