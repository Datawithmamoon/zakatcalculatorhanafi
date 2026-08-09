import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Disclaimer — Hanafi Zakat Calculator";
const description =
  "This Zakat calculator follows Hanafi jurisprudence and is intended for educational purposes. For complex cases consult a qualified Hanafi Mufti.";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/disclaimer` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/disclaimer` }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">Disclaimer</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>This calculator follows Hanafi jurisprudence.</p>
        <p>This calculator is intended for educational purposes.</p>
        <p>For complex cases consult a qualified Hanafi Mufti.</p>
        <h2 className="text-base font-semibold text-foreground">Rates and figures</h2>
        <p>
          Gold and silver prices are pulled from public market data and may differ from your local
          bullion market. Nisab is recalculated from whichever rate is currently shown, so always
          confirm the price before finalising your Zakat payment.
        </p>
        <h2 className="text-base font-semibold text-foreground">No fatwa</h2>
        <p>
          Output from this tool is an estimate, not a religious verdict. Situations involving mixed
          partnerships, agricultural produce, livestock, pension funds, long-term debts or disputed
          assets require personal guidance from a scholar.
        </p>
        <p>
          <Link to="/" className="text-primary underline underline-offset-4">
            Back to the Zakat calculator
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
