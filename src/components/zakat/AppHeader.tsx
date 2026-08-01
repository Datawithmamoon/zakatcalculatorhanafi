import { Contrast, Globe, Moon, Sun } from "lucide-react";
import { useZakat } from "./context";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { t, lang, setLang, dark, setDark, highContrast, setHighContrast } = useZakat();

  return (
    <header className="no-print gradient-emerald text-primary-foreground">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            className="gradient-gold flex size-10 items-center justify-center rounded-xl text-lg font-bold text-gold-foreground"
            aria-hidden
          >
            ۞
          </span>
          <div>
            <p className="text-base font-semibold leading-tight">{t.appName}</p>
            <p className="text-xs opacity-85">{t.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            aria-label="Switch language"
          >
            <Globe className="size-4" aria-hidden />
            <span className={lang === "en" ? "font-urdu" : ""}>{t.labels.language}</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setHighContrast(!highContrast)}
            aria-pressed={highContrast}
            aria-label="High contrast mode"
          >
            <Contrast className="size-4" aria-hidden />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setDark(!dark)}
            aria-pressed={dark}
            aria-label={t.labels.theme}
          >
            {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
          </Button>
        </div>
      </div>
    </header>
  );
}
