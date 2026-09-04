import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { pageCopy } from "@/lib/zakat/i18n";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { getPublicFaqs, type PublicFaq } from "@/lib/public-content.functions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Zakat FAQ — Hanafi Rulings on Gold, Silver, Cash & Nisab";
const description =
  "Answers to common Hanafi Zakat questions: Nisab thresholds, Hawl, gold and silver, business stock, loans, and how the 2.5% rate is applied.";

export const Route = createFileRoute("/faq")({
  loader: async () => ({ faqs: await getPublicFaqs() }),
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/faq` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ((loaderData?.faqs ?? []) as PublicFaq[]).map((f: PublicFaq) => ({
            "@type": "Question",
            name: f.question_en,
            acceptedAnswer: { "@type": "Answer", text: f.answer_en },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE}/faq` },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { faqs } = Route.useLoaderData() as { faqs: PublicFaq[] };
  const { lang } = useLangPref();
  const c = pageCopy[lang];

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.faqTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.faqIntro}</p>

      {faqs.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{c.empty}</p>
      ) : (
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left">
                <span dir="ltr" className="text-left">
                  {f.question_en}
                  {f.question_ur ? (
                    <span className="font-urdu mt-1 block text-xs text-muted-foreground" dir="rtl">
                      {f.question_ur}
                    </span>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p dir="ltr" className="whitespace-pre-line text-left text-sm text-foreground">{f.answer_en}</p>
                {f.answer_ur ? (
                  <p
                    className="font-urdu mt-3 whitespace-pre-line text-sm text-muted-foreground"
                    dir="rtl"
                  >
                    {f.answer_ur}
                  </p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <p className="mt-8 text-sm">
        <Link to="/" className="text-primary underline underline-offset-4">
          {c.toCalculator}
        </Link>
      </p>
    </PublicShell>
  );
}
