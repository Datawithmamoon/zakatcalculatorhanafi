import { TROY_OUNCE_IN_GRAMS, type LivePrices } from "./prices.types";

const METAL_URL = "https://api.gold-api.com/price";
const RATES_URL = "https://open.er-api.com/v6/latest/USD";

async function metalPricePerGram(symbol: "XAU" | "XAG"): Promise<number> {
  const res = await fetch(`${METAL_URL}/${symbol}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Metal price request failed (${symbol}): ${res.status}`);
  const json = (await res.json()) as { price?: number };
  const perOunce = Number(json?.price);
  if (!Number.isFinite(perOunce) || perOunce <= 0) throw new Error(`Invalid ${symbol} price`);
  return perOunce / TROY_OUNCE_IN_GRAMS;
}

async function usdRates(): Promise<Record<string, number>> {
  const res = await fetch(RATES_URL, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Exchange rate request failed: ${res.status}`);
  const json = (await res.json()) as { result?: string; rates?: Record<string, number> };
  if (json?.result !== "success" || !json.rates) throw new Error("Invalid exchange rate payload");
  return json.rates;
}

export async function fetchLivePrices(): Promise<LivePrices> {
  const [gold, silver, rates] = await Promise.all([
    metalPricePerGram("XAU"),
    metalPricePerGram("XAG"),
    usdRates(),
  ]);

  return {
    goldUsdPerGram: gold,
    silverUsdPerGram: silver,
    rates,
    metalSource: "gold-api.com (live spot)",
    metalSourceUrl: "https://api.gold-api.com",
    ratesSource: "exchangerate-api.com (open access)",
    ratesSourceUrl: "https://www.exchangerate-api.com",
    fetchedAt: new Date().toISOString(),
  };
}
