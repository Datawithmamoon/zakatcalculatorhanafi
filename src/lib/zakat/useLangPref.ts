import { useCallback, useEffect, useState } from "react";
import type { Lang } from "./i18n";

const STORAGE_KEY = "hanafi-zakat-state-v1";

interface Stored {
  prefs?: { lang?: Lang; dark?: boolean; highContrast?: boolean };
  input?: unknown;
}

function read(): Lang {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "en";
    const parsed = JSON.parse(raw) as Stored;
    return parsed.prefs?.lang === "ur" ? "ur" : "en";
  } catch {
    return "en";
  }
}

/**
 * Reads (and writes) the same language preference the wizard stores, so public
 * content pages stay in the language the user picked without duplicating state.
 * Starts at "en" on the server and syncs after hydration to avoid a mismatch.
 */
export function useLangPref() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLangState(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Stored) : {};
      const prefs = { ...(parsed.prefs ?? {}), lang: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, prefs }));
    } catch {
      /* storage unavailable — the in-memory value still applies */
    }
  }, []);

  return { lang, setLang, toggle: () => setLang(lang === "ur" ? "en" : "ur") };
}
