import { Link } from "@tanstack/react-router";
import { useZakat } from "./context";

export function AboutZakat() {
  const { t } = useZakat();
  return (
    <>
      <section
        aria-labelledby="about-heading"
        className="no-print mt-12 space-y-6 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground"
      >
        <div>
          <h2 id="about-heading" className="text-base font-semibold text-foreground">
            About this Hanafi Zakat Calculator
          </h2>
          <p className="mt-2">
            This free Islamic Zakat calculator lets you calculate Zakat online step by step
            according to Hanafi fiqh. It uses live gold rate and live silver rate data to work out
            your Zakat Nisab in your own currency, so the threshold always reflects today&apos;s
            market rather than an outdated figure. It is widely used as a Pakistan Zakat
            calculator, but works with any currency.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">How Nisab is calculated</h2>
          <p className="mt-2">
            Nisab is 87.48 grams of gold or 612.36 grams of silver. The silver standard is used by
            default in the Hanafi school because it is more beneficial to the poor. Zakat becomes
            due at 2.5% of your net Zakatable wealth once a full lunar year (Hawl) has passed and
            your wealth stays at or above Nisab.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Scholarly note</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>This calculator follows Hanafi jurisprudence.</li>
            <li>This calculator is intended for educational purposes.</li>
            <li>For complex cases consult a qualified Hanafi Mufti.</li>
          </ul>
        </div>
      </section>
      <footer className="no-print mx-auto max-w-3xl px-4 pb-10 pt-10 text-center text-xs text-muted-foreground">
        <nav
          aria-label="Footer"
          className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
        >
          <Link to="/guide" className="text-primary underline underline-offset-4">
            Zakat guide
          </Link>
          <Link to="/faq" className="text-primary underline underline-offset-4">
            FAQ
          </Link>
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
        {t.disclaimer}
      </footer>
    </>
  );
}
