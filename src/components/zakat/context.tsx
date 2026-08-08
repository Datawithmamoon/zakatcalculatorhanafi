import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Dict, type Lang } from "@/lib/zakat/i18n";
import {
  defaultInput,
  DEFAULT_GOLD_PRICE,
  DEFAULT_SILVER_PRICE,
  type ZakatInput,
  type ZakatConfig,
  DEFAULT_CONFIG,
} from "@/lib/zakat/engine";
import { useSettings, type AppSettings } from "@/lib/settings";
import { useLivePrices, type LivePriceState } from "@/lib/zakat/useLivePrices";

const STORAGE_KEY = "hanafi-zakat-state-v1";

interface Prefs {
  lang: Lang;
  dark: boolean;
  highContrast: boolean;
}

interface Ctx {
  t: Dict;
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  input: ZakatInput;
  update: (patch: Partial<ZakatInput>) => void;
  setMoney: (group: "cash" | "business" | "investments" | "liabilities", key: string, v: number) => void;
  reset: () => void;
  hydrated: boolean;
  settings: AppSettings | null;
  /** Admin-managed Nisab weights and Zakat rate. */
  config: ZakatConfig;
  /** Live gold/silver spot prices with freshness and error state. */
  live: LivePriceState;
}

const ZakatContext = createContext<Ctx | null>(null);

export function ZakatProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [input, setInput] = useState<ZakatInput>(defaultInput);
  const [hydrated, setHydrated] = useState(false);

  // Restore autosaved answers (offline-friendly, no login required).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { prefs?: Prefs; input?: ZakatInput };
        if (parsed.prefs) {
          setLang(parsed.prefs.lang ?? "en");
          setDark(Boolean(parsed.prefs.dark));
          setHighContrast(Boolean(parsed.prefs.highContrast));
        }
        if (parsed.input) setInput({ ...defaultInput(), ...parsed.input });
      }
    } catch {
      /* corrupted storage is ignored */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ prefs: { lang, dark, highContrast }, input }),
    );
  }, [lang, dark, highContrast, input, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.classList.toggle("hc", highContrast);
    root.lang = lang;
    root.dir = lang === "ur" ? "rtl" : "ltr";
  }, [dark, highContrast, lang]);

  // Admin-managed settings.
  const { data: settings } = useSettings();

  // Live market prices (auto-refreshing, cached offline).
  const live = useLivePrices({
    currency: settings?.base_currency ?? "PKR",
    autoRefresh: settings?.auto_refresh_enabled ?? true,
    intervalMinutes: settings?.refresh_interval_minutes ?? 30,
  });

  // Prices flow: live market price > admin price > built-in default.
  // A price the user typed themselves is never overwritten.
  useEffect(() => {
    if (!hydrated) return;
    const gold = live.goldPerGram ?? (settings ? Number(settings.gold_price_per_gram) : null);
    const silver = live.silverPerGram ?? (settings ? Number(settings.silver_price_per_gram) : null);
    setInput((prev) => {
      const next = { ...prev };
      if (!prev.gold.priceEdited && gold && gold > 0 && gold !== prev.gold.pricePerGram) {
        next.gold = { ...prev.gold, pricePerGram: gold };
      }
      if (!prev.silver.priceEdited && silver && silver > 0 && silver !== prev.silver.pricePerGram) {
        next.silver = { ...prev.silver, pricePerGram: silver };
      }
      return next;
    });
  }, [settings, hydrated, live.goldPerGram, live.silverPerGram]);

  const config = useMemo<ZakatConfig>(
    () =>
      settings
        ? {
            nisabGoldGrams: Number(settings.nisab_gold_grams) || DEFAULT_CONFIG.nisabGoldGrams,
            nisabSilverGrams:
              Number(settings.nisab_silver_grams) || DEFAULT_CONFIG.nisabSilverGrams,
            zakatRate: Number(settings.zakat_rate) || DEFAULT_CONFIG.zakatRate,
          }
        : DEFAULT_CONFIG,
    [settings],
  );

  const value = useMemo<Ctx>(
    () => ({
      t: settings
        ? { ...dictionaries[lang], currency: settings.currency_symbol }
        : dictionaries[lang],
      lang,
      setLang,
      dark,
      setDark,
      highContrast,
      setHighContrast,
      input,
      hydrated,
      settings: settings ?? null,
      config,
      live,
      update: (patch) => setInput((prev) => ({ ...prev, ...patch })),
      setMoney: (group, key, v) =>
        setInput((prev) => ({ ...prev, [group]: { ...prev[group], [key]: v } })),
      reset: () => setInput(defaultInput()),
    }),
    [lang, dark, highContrast, input, hydrated, settings, config, live],
  );

  return <ZakatContext.Provider value={value}>{children}</ZakatContext.Provider>;
}

export function useZakat() {
  const ctx = useContext(ZakatContext);
  if (!ctx) throw new Error("useZakat must be used inside ZakatProvider");
  return ctx;
}
