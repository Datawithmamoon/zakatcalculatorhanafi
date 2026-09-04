import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { pageCopy } from "@/lib/zakat/i18n";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { getPublicEdu, type PublicEdu } from "@/lib/public-content.functions";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Hanafi Zakat Guide — Zakatable Assets, Liabilities & Nisab";
const description =
  "Learn which assets are Zakatable under Hanafi fiqh, what counts as Hajat-e-Asliyah, which liabilities are deductible, and how Nisab and Hawl are applied.";

export const Route = createFileRoute("/guide")({
  loader: async () => ({ items: await getPublicEdu() }),
  head: ({ loaderData }) => {
    const items = (loaderData?.items ?? []) as PublicEdu[];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${SITE}/guide` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `${SITE}/guide` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            inLanguage: "en",
            mainEntityOfPage: `${SITE}/guide`,
            articleSection: items.map((i: PublicEdu) => i.title_en),
            author: { "@type": "Organization", name: "Hanafi Zakat Calculator" },
            publisher: { "@type": "Organization", name: "Hanafi Zakat Calculator" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Guide", item: `${SITE}/guide` },
            ],
          }),
        },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { items } = Route.useLoaderData() as { items: PublicEdu[] };
  const { lang } = useLangPref();
  const c = pageCopy[lang];

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.guideTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.guideIntro}</p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{c.empty}</p>
      ) : (
        <>
          <nav aria-label={c.onThisPage} className="mt-6 rounded-xl border bg-card p-4">
            <ul className="space-y-1 text-sm">
              {items.map((i) => (
                <li key={i.id}>
                  <a href={`#${i.slug}`} className="text-primary underline underline-offset-4">
                    {i.title_en}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-10">
            {items.map((i) => (
              <article key={i.id} id={i.slug} className="scroll-mt-20">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {i.category}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{i.title_en}</h2>
                {i.title_ur ? (
                  <p className="font-urdu text-sm text-muted-foreground" dir="rtl">
                    {i.title_ur}
                  </p>
                ) : null}
                <p className="mt-3 whitespace-pre-line text-sm text-foreground">{i.body_en}</p>
                {i.body_ur ? (
                  <p
                    className="font-urdu mt-3 whitespace-pre-line text-sm text-muted-foreground"
                    dir="rtl"
                  >
                    {i.body_ur}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-sm">
        <Link to="/" className="text-primary underline underline-offset-4">
          {c.toCalculator}
        </Link>
      </p>
    </PublicShell>
  );
}
