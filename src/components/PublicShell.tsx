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
        Educational guidance based on Hanafi fiqh. Consult a qualified scholar for personal rulings.
      </footer>
    </div>
  );
}
