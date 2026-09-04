import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { siteCopy } from "@/lib/zakat/i18n";
import { useLangPref } from "@/lib/zakat/useLangPref";

/** Lightweight shell for public content pages (FAQ, guides) — no wizard state needed. */
export function PublicShell({ children }: { children: ReactNode }) {
  const { lang, toggle } = useLangPref();
  const c = siteCopy[lang];
  const urdu = lang === "ur";

  return (
    <div className={`surface-pattern min-h-screen bg-background ${urdu ? "font-urdu" : ""}`}>
      <header className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span
              className="gradient-gold flex size-10 items-center justify-center rounded-xl text-lg font-bold text-gold-foreground"
              aria-hidden
            >
              ۞
            </span>
            <span className="text-base font-semibold">{c.appName}</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 text-sm">
            <Link to="/" className="rounded-md px-3 py-2 underline-offset-4 hover:underline">
              {c.navCalculator}
            </Link>
            <Link to="/guide" className="rounded-md px-3 py-2 underline-offset-4 hover:underline">
              {c.navGuide}
            </Link>
            <Link to="/faq" className="rounded-md px-3 py-2 underline-offset-4 hover:underline">
              {c.navFaq}
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="min-h-11 rounded-md border border-primary-foreground/40 px-3 py-2 text-sm font-medium"
            >
              {c.switchLang}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs text-muted-foreground">
        <nav
          aria-label="Footer"
          className="mb-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm"
        >
          <Link to="/privacy" className="px-3 py-2 text-primary underline underline-offset-4">
            {c.privacy}
          </Link>
          <Link to="/terms" className="px-3 py-2 text-primary underline underline-offset-4">
            {c.terms}
          </Link>
          <Link to="/disclaimer" className="px-3 py-2 text-primary underline underline-offset-4">
            {c.disclaimerLink}
          </Link>
        </nav>
        {c.footerNote}
      </footer>
    </div>
  );
}

/**
 * Wraps prose that only exists in English so it keeps LTR direction and
 * alignment even while the shell is in Urdu (RTL) mode.
 */
export function EnglishBlock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div dir="ltr" className={`text-left font-sans ${className}`}>
      {children}
    </div>
  );
}
