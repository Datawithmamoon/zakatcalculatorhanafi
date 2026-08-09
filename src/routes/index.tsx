import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ZakatProvider, useZakat } from "@/components/zakat/context";
import { AppHeader } from "@/components/zakat/AppHeader";
import { Wizard } from "@/components/zakat/Wizard";

const title =
  "Hanafi Zakat Calculator Pakistan | Live Gold & Silver Rates | Free Islamic Zakat Calculator";
const description =
  "Calculate Zakat online free with live gold and silver rates. Hanafi fiqh Nisab, gold, silver, cash, business and investments — step by step in English and Urdu.";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const OG_IMAGE = SITE + "/icon-512.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "Hanafi Zakat Calculator, Pakistan Zakat Calculator, Islamic Zakat Calculator, calculate Zakat online, live gold rate, live silver rate, Zakat Nisab",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: SITE + "/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Hanafi Zakat Calculator",
          url: SITE + "/",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          inLanguage: ["en", "ur"],
          description,
          featureList: [
            "Live gold and silver rates",
            "Hanafi Nisab (87.48g gold / 612.36g silver)",
            "Gold, silver, cash, business and investment assets",
            "PDF and CSV export",
          ],
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});


function Shell() {
  const { t } = useZakat();
  return (
    <div className="surface-pattern min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="sr-only">
          Hanafi Zakat Calculator — calculate Zakat online with live gold and silver rates
        </h1>
        <Wizard />

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
      </main>
      <footer className="no-print mx-auto max-w-3xl px-4 pb-10 text-center text-xs text-muted-foreground">
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

      <Toaster />
    </div>
  );
}

function Index() {
  return (
    <ZakatProvider>
      <Shell />
    </ZakatProvider>
  );
}
