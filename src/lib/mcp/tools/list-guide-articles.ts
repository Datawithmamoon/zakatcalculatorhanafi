import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_guide_articles",
  title: "List published Zakat guide articles",
  description:
    "List the published educational articles about Hanafi Zakat rulings. Pass a slug to fetch the full body of one article.",
  inputSchema: {
    language: z.enum(["en", "ur"]).default("en").describe("Content language: en or ur."),
    slug: z.string().trim().max(200).optional().describe("Optional article slug to fetch in full."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ language, slug }) => {
    const lang = language ?? "en";
    let query = supabaseAnon()
      .from("educational_content")
      .select("id,slug,category,title_en,title_ur,body_en,body_ur,updated_at")
      .eq("published", true)
      .order("sort_order");
    if (slug) query = query.eq("slug", slug);

    const { data, error } = await query;
    if (error) throw new ToolError(error.message);
    if (slug && (data ?? []).length === 0) throw new ToolError(`No published article with slug "${slug}"`);

    const items = (data ?? []).map((a) => ({
      slug: a.slug,
      category: a.category,
      title: lang === "ur" ? a.title_ur : a.title_en,
      body: slug ? (lang === "ur" ? a.body_ur : a.body_en) : undefined,
      updatedAt: a.updated_at,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
