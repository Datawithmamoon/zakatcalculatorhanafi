import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate, TablesInsert } from "@/integrations/supabase/types";

export type AppSettings = Tables<"app_settings">;
export type CurrencyRate = Tables<"currency_rates">;
export type Faq = Tables<"faqs">;
export type EduContent = Tables<"educational_content">;

const SETTINGS_CACHE = "zakat-settings-cache-v1";

/** Offline fallback: last known settings, so the calculator still works without network. */
function cacheSettings(s: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_CACHE, JSON.stringify(s));
  } catch {
    /* storage full or unavailable */
  }
}

export function cachedSettings(): AppSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE);
    return raw ? (JSON.parse(raw) as AppSettings) : null;
  } catch {
    return null;
  }
}

export function useSettings() {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", "global")
        .maybeSingle();
      if (error) throw error;
      if (data) cacheSettings(data);
      return data;
    },
    initialData: () => cachedSettings() ?? undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: TablesUpdate<"app_settings">) => {
      const { data, error } = await supabase
        .from("app_settings")
        .update(patch)
        .eq("id", "global")
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app-settings"] }),
  });
}

export function useCurrencyRates() {
  return useQuery({
    queryKey: ["currency-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("currency_rates")
        .select("*")
        .order("code");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: TablesInsert<"currency_rates">) => {
      const { error } = await supabase.from("currency_rates").upsert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currency-rates"] }),
  });
}

export function useFaqs(includeUnpublished = false) {
  return useQuery({
    queryKey: ["faqs", includeUnpublished],
    queryFn: async () => {
      let q = supabase.from("faqs").select("*").order("sort_order");
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEduContent(includeUnpublished = false) {
  return useQuery({
    queryKey: ["edu-content", includeUnpublished],
    queryFn: async () => {
      let q = supabase.from("educational_content").select("*").order("sort_order");
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
