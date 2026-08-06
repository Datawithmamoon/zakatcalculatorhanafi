import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ZakatProvider, useZakat } from "@/components/zakat/context";
import { AppHeader } from "@/components/zakat/AppHeader";
import { Wizard } from "@/components/zakat/Wizard";

const title = "Hanafi Zakat Calculator — Gold, Silver, Cash & Business";
const description =
  "Free step-by-step Zakat calculator based on Hanafi fiqh. Gold, silver, cash, business, investments, Nisab and Hawl explained in English and Urdu.";

const SITE = "https://zakatcalculatorhanafi.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: SITE + "/" },
      { property: "og:type", content: "website" },
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
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        <h1 className="sr-only">{t.appName}</h1>
        <Wizard />
      </main>
      <footer className="no-print mx-auto max-w-3xl px-4 pb-10 text-center text-xs text-muted-foreground">
        <nav aria-label="Footer" className="mb-3 flex justify-center gap-4 text-sm">
          <Link to="/guide" className="text-primary underline underline-offset-4">
            Zakat guide
          </Link>
          <Link to="/faq" className="text-primary underline underline-offset-4">
            FAQ
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
