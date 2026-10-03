import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Scale, Sprout, Users, Wheat } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { homeCopy } from "@/lib/zakat/i18n";
import { useLangPref } from "@/lib/zakat/useLangPref";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Islamic Calculators — Zakat, Haq Mehr & More | English & Urdu";
const description =
  "Choose a Hanafi calculator: Zakat, Haq Mehr, Fitrana, Ushr or Inheritance. Calculate in English or Urdu using live gold, silver and currency rates.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Islamic Calculators",
          url: `${SITE}/`,
          description,
          inLanguage: ["en", "ur"],
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Hanafi Zakat Calculator",
                url: `${SITE}/zakat-calculator`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Haq Mehr Calculator",
                url: `${SITE}/haq-mehr-calculator`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Fitrana Calculator",
                url: `${SITE}/fitrana-calculator`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Ushr Calculator",
                url: `${SITE}/ushr-calculator`,
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "Inheritance Calculator",
                url: `${SITE}/inheritance-calculator`,
              },
            ],
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { lang } = useLangPref();
  const c = homeCopy[lang];

  return (
    <PublicShell>
      <section className="py-4 text-center sm:py-8">
        <p className="text-sm font-medium text-primary">{c.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">{c.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {c.intro}
        </p>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="flex h-full flex-col border-primary/25 shadow-soft">
          <CardHeader>
            <span className="gradient-emerald mb-3 flex size-12 items-center justify-center rounded-xl text-primary-foreground">
              <Coins className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-xl">{c.zakatTitle}</CardTitle>
            <CardDescription className="leading-relaxed">{c.zakatDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild className="min-h-11 w-full">
              <Link to="/zakat-calculator">
                {c.zakatAction}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col border-gold/40 shadow-soft">
          <CardHeader>
            <span className="gradient-gold mb-3 flex size-12 items-center justify-center rounded-xl text-gold-foreground">
              <Scale className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-xl">{c.mehrTitle}</CardTitle>
            <CardDescription className="leading-relaxed">{c.mehrDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild variant="outline" className="min-h-11 w-full border-gold/60">
              <Link to="/haq-mehr-calculator">
                {c.mehrAction}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex h-full flex-col border-border shadow-soft">
          <CardHeader>
            <span className="gradient-emerald mb-3 flex size-12 items-center justify-center rounded-xl text-primary-foreground">
              <Wheat className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-lg">{c.fitranaTitle}</CardTitle>
            <CardDescription className="leading-relaxed">{c.fitranaDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild variant="outline" className="min-h-11 w-full">
              <Link to="/fitrana-calculator">
                {c.fitranaAction}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col border-border shadow-soft">
          <CardHeader>
            <span className="gradient-emerald mb-3 flex size-12 items-center justify-center rounded-xl text-primary-foreground">
              <Sprout className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-lg">{c.ushrTitle}</CardTitle>
            <CardDescription className="leading-relaxed">{c.ushrDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild variant="outline" className="min-h-11 w-full">
              <Link to="/ushr-calculator">
                {c.ushrAction}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full flex-col border-border shadow-soft">
          <CardHeader>
            <span className="gradient-emerald mb-3 flex size-12 items-center justify-center rounded-xl text-primary-foreground">
              <Users className="size-6" aria-hidden />
            </span>
            <CardTitle className="text-lg">{c.inheritanceTitle}</CardTitle>
            <CardDescription className="leading-relaxed">{c.inheritanceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild variant="outline" className="min-h-11 w-full">
              <Link to="/inheritance-calculator">
                {c.inheritanceAction}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PublicShell>
  );
}
