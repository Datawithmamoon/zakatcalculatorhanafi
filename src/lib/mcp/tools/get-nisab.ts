import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchLivePrices } from "@/lib/prices.server";
import { DEFAULT_CONFIG, num } from "@/lib/zakat/engine";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_nisab",
  title: "Get the current Nisab threshold",
  description:
    "Compute the current gold and silver Nisab thresholds from live market prices, using the app's configured gram weights (Hanafi default: 87.48g gold / 612.36g silver).",
  inputSchema: {
    currency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, "Use a 3-letter ISO currency code")
      .default("PKR")
      .describe("ISO 4217 currency code, e.g. PKR, USD."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ currency }) => {
    const code = (currency ?? "PKR").toUpperCase();
    const supabase = supabaseAnon();
    const { data: settings } = await supabase
      .from("app_settings")
      .select("nisab_gold_grams,nisab_silver_grams,zakat_rate")
      .eq("id", "global")
      .maybeSingle();

    const goldGrams = num(settings?.nisab_gold_grams) || DEFAULT_CONFIG.nisabGoldGrams;
    const silverGrams = num(settings?.nisab_silver_grams) || DEFAULT_CONFIG.nisabSilverGrams;
    const zakatRate = num(settings?.zakat_rate) || DEFAULT_CONFIG.zakatRate;

    let prices;
    try {
      prices = await fetchLivePrices();
    } catch (error) {
      throw new ToolError(
        `Live price feed unavailable: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    const rate = code === "USD" ? 1 : prices.rates[code];
    if (!rate || !Number.isFinite(rate)) throw new ToolError(`Unsupported currency: ${code}`);

    const result = {
      currency: code,
      zakatRate,
      goldNisabGrams: goldGrams,
      silverNisabGrams: silverGrams,
      goldNisabValue: Number((goldGrams * prices.goldUsdPerGram * rate).toFixed(2)),
      silverNisabValue: Number((silverGrams * prices.silverUsdPerGram * rate).toFixed(2)),
      hanafiDefaultBasis: "silver",
      note: "Hanafi practice uses the silver Nisab for cash and mixed wealth as it is more beneficial to the poor.",
      pricesFetchedAt: prices.fetchedAt,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
