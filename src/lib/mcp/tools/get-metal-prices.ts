import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchLivePrices } from "@/lib/prices.server";

export default defineTool({
  name: "get_metal_prices",
  title: "Get live gold and silver prices",
  description:
    "Fetch the current live spot price of gold and silver per gram in a given currency (default PKR), with the source and fetch timestamp.",
  inputSchema: {
    currency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, "Use a 3-letter ISO currency code, e.g. PKR or USD")
      .default("PKR")
      .describe("ISO 4217 currency code, e.g. PKR, USD, GBP."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ currency }) => {
    const code = (currency ?? "PKR").toUpperCase();
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
      goldPerGram: Number((prices.goldUsdPerGram * rate).toFixed(2)),
      silverPerGram: Number((prices.silverUsdPerGram * rate).toFixed(2)),
      goldPerTola: Number((prices.goldUsdPerGram * rate * 11.6638).toFixed(2)),
      silverPerTola: Number((prices.silverUsdPerGram * rate * 11.6638).toFixed(2)),
      usdRate: rate,
      metalSource: prices.metalSource,
      ratesSource: prices.ratesSource,
      fetchedAt: prices.fetchedAt,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
