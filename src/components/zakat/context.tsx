import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Dict, type Lang } from "@/lib/zakat/i18n";
import {
  defaultInput,
  DEFAULT_GOLD_PRICE,
  DEFAULT_SILVER_PRICE,
  type ZakatInput,
} from "@/lib/zakat/engine";
import { useSettings, type AppSettings } from "@/lib/settings";

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

  const value = useMemo<Ctx>(
    () => ({
      t: dictionaries[lang],
      lang,
      setLang,
      dark,
      setDark,
      highContrast,
      setHighContrast,
      input,
      hydrated,
      update: (patch) => setInput((prev) => ({ ...prev, ...patch })),
      setMoney: (group, key, v) =>
        setInput((prev) => ({ ...prev, [group]: { ...prev[group], [key]: v } })),
      reset: () => setInput(defaultInput()),
    }),
    [lang, dark, highContrast, input, hydrated],
  );

  return <ZakatContext.Provider value={value}>{children}</ZakatContext.Provider>;
}

export function useZakat() {
  const ctx = useContext(ZakatContext);
  if (!ctx) throw new Error("useZakat must be used inside ZakatProvider");
  return ctx;
}
