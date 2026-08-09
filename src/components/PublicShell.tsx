import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Lightweight shell for public content pages (FAQ, guides) — no wizard state needed. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="surface-pattern min-h-screen bg-background">
      <header className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span
              className="gradient-gold flex size-10 items-center justify-center rounded-xl text-lg font-bold text-gold-foreground"
              aria-hidden
            >
              ۞
            </span>
            <span className="text-base font-semibold">Hanafi Zakat Calculator</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-4 text-sm">
            <Link to="/" className="underline-offset-4 hover:underline">
              Calculator
            </Link>
            <Link to="/guide" className="underline-offset-4 hover:underline">
              Guide
            </Link>
            <Link to="/faq" className="underline-offset-4 hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 text-center text-xs text-muted-foreground">
        <nav
          aria-label="Footer"
          className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
        >
          <Link to="/privacy" className="text-primary underline underline-offset-4">
            Privacy
          </Link>
          <Link to="/terms" className="text-primary underline underline-offset-4">
            Terms
          </Link>
          <Link to="/disclaimer" className="text-primary underline underline-offset-4">
            Disclaimer
          </Link>
        </nav>
        Educational guidance based on Hanafi fiqh. This calculator follows Hanafi jurisprudence and
        is intended for educational purposes. For complex cases consult a qualified Hanafi Mufti.
      </footer>

    </div>
  );
}
