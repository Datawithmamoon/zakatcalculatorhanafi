import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { EduBlock, NumField, ResultRow, useMoneyFormat } from "@/components/calculators/bits";
import { calculateUshr, type IrrigationType } from "@/lib/calculators/ushr";
import { calcCopy } from "@/lib/calculators/copy";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { useSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Ushr Calculator (Agricultural Zakat) — Hanafi | English & Urdu";
const description =
  "Free Ushr calculator on Hanafi fiqh: 10% on rain-fed land and 5% on irrigated land, due at harvest with no Nisab or Hawl. Calculate agricultural Zakat in English or Urdu.";

export const Route = createFileRoute("/ushr-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/ushr-calculator` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/ushr-calculator` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Ushr Calculator (Hanafi)",
          url: `${SITE}/ushr-calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          inLanguage: ["en", "ur"],
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: UshrPage,
});

function UshrPage() {
  const { lang } = useLangPref();
  const c = calcCopy[lang];
  const { data: settings } = useSettings();
  const symbol = settings?.currency_symbol ?? "PKR";
  const money = useMoneyFormat(lang, symbol);

  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [irrigation, setIrrigation] = useState<IrrigationType>("rain");

  const rateRain = Number(settings?.ushr_rate_rain ?? 0.1);
  const rateIrrigated = Number(settings?.ushr_rate_irrigated ?? 0.05);

  const result = useMemo(
    () => calculateUshr({ quantity, pricePerUnit: price, irrigation, rateRain, rateIrrigated }),
    [quantity, price, irrigation, rateRain, rateIrrigated],
  );

  const invalid = lang === "ur" ? "درست عدد درج کریں" : "Enter a valid number";

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.ushrTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.ushrIntro}</p>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
        <NumField
          id="ushr-qty"
          label={c.quantity}
          hint={c.quantityHint}
          value={quantity}
          onChange={setQuantity}
          invalidText={invalid}
        />
        <NumField
          id="ushr-price"
          label={`${c.pricePerUnit} (${symbol})`}
          value={price}
          onChange={setPrice}
          invalidText={invalid}
        />
        <fieldset className="space-y-2">
          <Label asChild>
            <legend>{c.irrigation}</legend>
          </Label>
          {(
            [
              ["rain", c.rain],
              ["irrigated", c.irrigated],
            ] as Array<[IrrigationType, string]>
          ).map(([key, label]) => (
            <label
              key={key}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-sm ${
                irrigation === key ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <input
                type="radio"
                name="irrigation"
                value={key}
                checked={irrigation === key}
                onChange={() => setIrrigation(key)}
                className="size-5 accent-[var(--color-primary)]"
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-4 shadow-soft sm:p-6" aria-live="polite">
        <h2 className="mb-2 text-base font-semibold text-foreground">{c.result}</h2>
        <ResultRow label={c.rateLabel} value={`${(result.rate * 100).toFixed(2)}%`} />
        <ResultRow label={c.grossValue} value={money(result.grossValue)} />
        <ResultRow
          label={c.produceDue}
          value={result.produceDue.toLocaleString(lang === "ur" ? "ur-PK" : "en-PK", {
            maximumFractionDigits: 3,
          })}
        />
        <ResultRow label={c.ushrDue} value={money(result.ushrValue)} strong />
        <p className="mt-3 text-xs text-muted-foreground">{c.currencyNote}</p>
      </section>

      <div className="mt-6">
        <EduBlock
          ruling={c.ushrRuling}
          mistakes={c.ushrMistakes}
          evidence={c.ushrEvidence}
          labels={{ ruling: c.ruling, mistakes: c.mistakes, evidence: c.evidence }}
        />
      </div>
    </PublicShell>
  );
}
