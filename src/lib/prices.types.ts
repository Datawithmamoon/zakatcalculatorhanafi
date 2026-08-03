export interface LivePrices {
  goldUsdPerGram: number;
  silverUsdPerGram: number;
  /** Units of each currency per 1 USD. */
  rates: Record<string, number>;
  metalSource: string;
  metalSourceUrl: string;
  ratesSource: string;
  ratesSourceUrl: string;
  fetchedAt: string;
}

export const TROY_OUNCE_IN_GRAMS = 31.1034768;
