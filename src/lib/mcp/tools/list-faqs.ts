import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_faqs",
  title: "List published Zakat FAQs",
  description:
    "List the published Hanafi Zakat FAQs from this site, in English or Urdu.",
  inputSchema: {
    language: z.enum(["en", "ur"]).default("en").describe("Answer language: en or ur."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ language }) => {
    const lang = language ?? "en";
    const { data, error } = await supabaseAnon()
      .from("faqs")
      .select("id,question_en,question_ur,answer_en,answer_ur")
      .eq("published", true)
      .order("sort_order");
    if (error) throw new ToolError(error.message);

    const items = (data ?? []).map((f) => ({
      id: f.id,
      question: lang === "ur" ? f.question_ur : f.question_en,
      answer: lang === "ur" ? f.answer_ur : f.answer_en,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
