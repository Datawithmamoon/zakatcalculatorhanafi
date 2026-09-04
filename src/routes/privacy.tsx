import { createFileRoute, Link } from "@tanstack/react-router";
import { EnglishBlock, PublicShell } from "@/components/PublicShell";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Privacy Policy — Hanafi Zakat Calculator";
const description =
  "How the Hanafi Zakat Calculator handles your data: calculations stay in your browser, no financial figures are uploaded, and no personal data is sold.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/privacy` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicShell>
      <EnglishBlock>
      <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          The Hanafi Zakat Calculator is designed to be private by default. Every Zakat calculation
          runs inside your own browser or device. The amounts you enter for gold, silver, cash,
          business stock, investments, receivables and liabilities are never transmitted to our
          servers.
        </p>
        <h2 className="text-base font-semibold text-foreground">What is stored</h2>
        <p>
          Your in-progress calculation, language choice and theme preference are saved in your
          device&apos;s local storage so you can return to them later. You can clear them at any
          time by clearing your browser data or resetting the calculator.
        </p>
        <h2 className="text-base font-semibold text-foreground">Third-party data</h2>
        <p>
          Live gold, silver and currency rates are requested from public market-data providers. Only
          the rate request is sent — none of your financial inputs are included.
        </p>
        <h2 className="text-base font-semibold text-foreground">Accounts</h2>
        <p>
          An account is only needed by site administrators who manage prices and content. If you
          create one, we store your email address to authenticate you. We never sell personal data.
        </p>
        <h2 className="text-base font-semibold text-foreground">Contact</h2>
        <p>
          For any privacy question, please reach out through the site. See also our{" "}
          <Link to="/terms" className="text-primary underline underline-offset-4">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
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
