import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  DEFAULT_CONFIG,
  GOLD_PURITIES,
  SILVER_PURITIES,
  calculateZakat,
  num,
  type GoldPurity,
  type MetalUnit,
  type SilverPurity,
  type ZakatInput,
} from "@/lib/zakat/engine";
import { fetchLivePrices } from "@/lib/prices.server";
import { supabaseAnon } from "../supabase";

const amount = z.number().nonnegative().finite().default(0);
const unit = z.enum(["gram", "tola", "kilogram"]).default("gram");

export default defineTool({
  name: "calculate_zakat",
  title: "Calculate Zakat (Hanafi)",
  description:
    "Calculate Zakat due according to Hanafi fiqh from gold, silver, cash, business assets, investments, receivables and liabilities. Metal prices default to live spot rates when not supplied.",
  inputSchema: {
    currency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/)
      .default("PKR")
      .describe("ISO 4217 currency code used for all amounts."),
    hawlCompleted: z
      .boolean()
      .default(true)
      .describe("Whether a full lunar year (Hawl) has passed over the wealth."),
    nisabBasis: z
      .enum(["silver", "gold"])
      .default("silver")
      .describe("Which metal sets the Nisab threshold. Hanafi default: silver."),
    goldWeight: amount.describe("Gold owned."),
    goldUnit: unit,
    goldPurity: z.enum(GOLD_PURITIES as [GoldPurity, ...GoldPurity[]]).default("24K"),
    silverWeight: amount.describe("Silver owned."),
    silverUnit: unit,
    silverPurity: z.enum(SILVER_PURITIES as [SilverPurity, ...SilverPurity[]]).default("999"),
    goldPricePerGram: z.number().positive().finite().optional().describe("Override the live gold price (per gram of pure gold)."),
    silverPricePerGram: z.number().positive().finite().optional().describe("Override the live silver price (per gram of pure silver)."),
    cash: amount.describe("Cash in hand, bank balances and savings."),
    businessAssets: amount.describe("Business inventory and trade goods at market value."),
    investments: amount.describe("Shares, funds and other zakatable investments."),
    receivablesLikely: amount.describe("Debts owed to you that are likely to be recovered (zakatable)."),
    receivablesUncertain: amount.describe("Doubtful debts (not zakatable until received)."),
    receivablesBad: amount.describe("Bad debts (excluded)."),
    liabilities: amount.describe("Immediately due debts and expenses deductible from wealth."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (input) => {
    const code = (input.currency ?? "PKR").toUpperCase();

    let goldPrice = input.goldPricePerGram;
    let silverPrice = input.silverPricePerGram;
    let priceSource = "user-supplied";
    let pricesFetchedAt: string | null = null;

    if (goldPrice === undefined || silverPrice === undefined) {
      try {
        const prices = await fetchLivePrices();
        const rate = code === "USD" ? 1 : prices.rates[code];
        if (!rate || !Number.isFinite(rate)) throw new Error(`Unsupported currency: ${code}`);
        goldPrice = goldPrice ?? prices.goldUsdPerGram * rate;
        silverPrice = silverPrice ?? prices.silverUsdPerGram * rate;
        priceSource = prices.metalSource;
        pricesFetchedAt = prices.fetchedAt;
      } catch (error) {
        throw new ToolError(
          `Live prices unavailable (${error instanceof Error ? error.message : String(error)}). Supply goldPricePerGram and silverPricePerGram to calculate anyway.`,
        );
      }
    }

    const { data: settings } = await supabaseAnon()
      .from("app_settings")
      .select("nisab_gold_grams,nisab_silver_grams,zakat_rate")
      .eq("id", "global")
      .maybeSingle();

    const config = {
      nisabGoldGrams: num(settings?.nisab_gold_grams) || DEFAULT_CONFIG.nisabGoldGrams,
      nisabSilverGrams: num(settings?.nisab_silver_grams) || DEFAULT_CONFIG.nisabSilverGrams,
      zakatRate: num(settings?.zakat_rate) || DEFAULT_CONFIG.zakatRate,
    };

    const zakatInput: ZakatInput = {
      hawlCompleted: input.hawlCompleted ?? true,
      gold: {
        owns: (input.goldWeight ?? 0) > 0,
        weight: input.goldWeight ?? 0,
        unit: (input.goldUnit ?? "gram") as MetalUnit,
        purity: (input.goldPurity ?? "24K") as GoldPurity,
        pricePerGram: goldPrice!,
      },
      silver: {
        owns: (input.silverWeight ?? 0) > 0,
        weight: input.silverWeight ?? 0,
        unit: (input.silverUnit ?? "gram") as MetalUnit,
        purity: (input.silverPurity ?? "999") as SilverPurity,
        pricePerGram: silverPrice!,
      },
      cash: { cash: input.cash ?? 0 },
      business: { business: input.businessAssets ?? 0 },
      investments: { investments: input.investments ?? 0 },
      receivables: {
        likely: input.receivablesLikely ?? 0,
        uncertain: input.receivablesUncertain ?? 0,
        bad: input.receivablesBad ?? 0,
      },
      liabilities: { liabilities: input.liabilities ?? 0 },
      nisabBasis: (input.nisabBasis ?? "silver") as "silver" | "gold",
      manualNisab: 0,
    };

    const r = calculateZakat(zakatInput, config);
    const result = {
      currency: code,
      ...r,
      priceSource,
      goldPricePerGram: goldPrice,
      silverPricePerGram: silverPrice,
      pricesFetchedAt,
      notes: [
        "Hanafi: doubtful and bad debts owed to you are excluded until actually received.",
        "Zakat is due only when net wealth reaches Nisab and a full lunar year (Hawl) has passed.",
        "Educational estimate — consult a qualified Hanafi Mufti for complex cases.",
      ],
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
