import { createFileRoute, Link } from "@tanstack/react-router";
import { EnglishBlock, PublicShell } from "@/components/PublicShell";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Terms & Conditions — Hanafi Zakat Calculator";
const description =
  "Terms of use for the free Hanafi Zakat Calculator, including acceptable use, accuracy of live gold and silver rates, and limitation of liability.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/terms` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicShell>
      <EnglishBlock>
      <h1 className="text-2xl font-semibold text-foreground">Terms &amp; Conditions</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          By using this website you agree to these terms. The calculator is provided free of charge
          for educational use.
        </p>
        <h2 className="text-base font-semibold text-foreground">Accuracy of information</h2>
        <p>
          Live gold, silver and currency rates come from third-party market-data providers and may
          be delayed or temporarily unavailable. When a live rate cannot be fetched, the last cached
          value is shown and clearly marked. You are responsible for confirming the rate used before
          paying Zakat.
        </p>
        <h2 className="text-base font-semibold text-foreground">Religious rulings</h2>
        <p>
          The calculations follow Hanafi jurisprudence as commonly applied, but they are not a
          fatwa. For complex cases consult a qualified Hanafi Mufti.
        </p>
        <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
        <p>
          Do not attempt to disrupt the service, scrape it at abusive volume, or misrepresent its
          output as an official religious ruling.
        </p>
        <h2 className="text-base font-semibold text-foreground">Limitation of liability</h2>
        <p>
          The site is provided &quot;as is&quot; without warranty. We are not liable for any loss
          arising from reliance on the figures produced. See our{" "}
          <Link to="/disclaimer" className="text-primary underline underline-offset-4">
            Disclaimer
          </Link>
          .
        </p>
      </div>
      </EnglishBlock>
    </PublicShell>
  );
}
