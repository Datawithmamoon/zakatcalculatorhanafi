import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { CheckField, EduBlock, NumField, ResultRow, useMoneyFormat } from "@/components/calculators/bits";
import { calculateFitrana } from "@/lib/calculators/fitrana";
import { calcCopy } from "@/lib/calculators/copy";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { useSettings } from "@/lib/settings";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Fitrana Calculator (Sadaqat al-Fitr) — Hanafi | English & Urdu";
const description =
  "Free Fitrana calculator based on Hanafi fiqh: half a sa' of wheat per person. Work out Sadaqat al-Fitr for your whole household in seconds, in English or Urdu.";

export const Route = createFileRoute("/fitrana-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/fitrana-calculator` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/fitrana-calculator` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Fitrana Calculator (Hanafi)",
          url: `${SITE}/fitrana-calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          inLanguage: ["en", "ur"],
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: FitranaPage,
});

function FitranaPage() {
  const { lang } = useLangPref();
  const c = calcCopy[lang];
  const { data: settings } = useSettings();
  const symbol = settings?.currency_symbol ?? "PKR";
  const money = useMoneyFormat(lang, symbol);

  const [people, setPeople] = useState(1);
  const [useFixed, setUseFixed] = useState(false);
  const [fixed, setFixed] = useState(0);
  const wheatKg = Number(settings?.fitrana_wheat_kg ?? 2.045);
  const wheatPriceDefault = Number(settings?.fitrana_wheat_price_per_kg ?? 150);
  const [wheatPrice, setWheatPrice] = useState<number | null>(null);

  const price = wheatPrice ?? wheatPriceDefault;
  const result = useMemo(
    () =>
      calculateFitrana({
        people,
        wheatKgPerPerson: wheatKg,
        wheatPricePerKg: price,
        fixedPerPerson: fixed,
        useFixed,
      }),
    [people, wheatKg, price, fixed, useFixed],
  );

  const invalid = lang === "ur" ? "درست عدد درج کریں" : "Enter a valid number";

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.fitranaTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.fitranaIntro}</p>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
        <NumField
          id="fitr-people"
          label={c.people}
          hint={c.peopleHint}
          value={people}
          onChange={setPeople}
          integer
          min={0}
          invalidText={invalid}
        />
        <CheckField
          id="fitr-fixed"
          label={c.useAnnounced}
          checked={useFixed}
          onChange={setUseFixed}
        />
        {useFixed ? (
          <NumField
            id="fitr-amount"
            label={`${c.announcedAmount} (${symbol})`}
            value={fixed}
            onChange={setFixed}
            invalidText={invalid}
          />
        ) : (
          <NumField
            id="fitr-wheat-price"
            label={`${c.wheatPrice} (${symbol})`}
            hint={`${c.wheatKg}: ${wheatKg}`}
            value={price}
            onChange={setWheatPrice}
            invalidText={invalid}
          />
        )}
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-4 shadow-soft sm:p-6" aria-live="polite">
        <h2 className="mb-2 text-base font-semibold text-foreground">{c.result}</h2>
        <ResultRow label={c.perPerson} value={money(result.perPerson)} />
        <ResultRow label={c.people} value={result.people} />
        {!useFixed && (
          <ResultRow label={c.totalWheat} value={`${result.totalWheatKg.toFixed(3)} kg`} />
        )}
        <ResultRow label={c.totalDue} value={money(result.total)} strong />
        <p className="mt-3 text-xs text-muted-foreground">{c.currencyNote}</p>
      </section>

      <div className="mt-6">
        <EduBlock
          ruling={c.fitranaRuling}
          mistakes={c.fitranaMistakes}
          evidence={c.fitranaEvidence}
          labels={{ ruling: c.ruling, mistakes: c.mistakes, evidence: c.evidence }}
        />
      </div>
    </PublicShell>
  );
}
