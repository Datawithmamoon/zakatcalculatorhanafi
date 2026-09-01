import { defineMcp } from "@lovable.dev/mcp-js";
import calculateZakatTool from "./tools/calculate-zakat";
import getMetalPricesTool from "./tools/get-metal-prices";
import getNisabTool from "./tools/get-nisab";
import listFaqsTool from "./tools/list-faqs";
import listGuideArticlesTool from "./tools/list-guide-articles";

export default defineMcp({
  name: "zakat-pro",
  title: "Zakat Pro",
  version: "0.1.0",
  instructions:
    "Tools for the Hanafi Zakat Calculator. Use `get_metal_prices` for live gold/silver spot rates, `get_nisab` for the current Nisab thresholds, `calculate_zakat` to compute Zakat due from a person's assets and liabilities under Hanafi fiqh, and `list_faqs` / `list_guide_articles` for the site's published Zakat guidance. Results are educational estimates; recommend consulting a qualified Hanafi Mufti for complex cases.",
  tools: [
    calculateZakatTool,
    getMetalPricesTool,
    getNisabTool,
    listFaqsTool,
    listGuideArticlesTool,
    // Tools without an outputSchema widen cleanly at runtime; the cast satisfies
    // exactOptionalPropertyTypes.
  ] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
