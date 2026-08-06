import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export interface PublicFaq {
  id: string;
  question_en: string;
  question_ur: string;
  answer_en: string;
  answer_ur: string;
}

export interface PublicEdu {
  id: string;
  slug: string;
  category: string;
  title_en: string;
  title_ur: string;
  body_en: string;
  body_ur: string;
  updated_at: string;
}

/** Public: published FAQs, no auth required (anon SELECT policy). */
export const getPublicFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("faqs")
    .select("id,question_en,question_ur,answer_en,answer_ur")
    .eq("published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicFaq[];
});

/** Public: published educational articles, no auth required. */
export const getPublicEdu = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("educational_content")
    .select("id,slug,category,title_en,title_ur,body_en,body_ur,updated_at")
    .eq("published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicEdu[];
});
