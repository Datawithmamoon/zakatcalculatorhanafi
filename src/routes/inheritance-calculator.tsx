import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { CheckField, EduBlock, NumField, useMoneyFormat } from "@/components/calculators/bits";
import { calculateInheritance, emptyHeirs, type HeirsInput } from "@/lib/calculators/inheritance";
import { calcCopy } from "@/lib/calculators/copy";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { useSettings } from "@/lib/settings";
import { Label } from "@/components/ui/label";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Islamic Inheritance Calculator (Faraid) — Hanafi | English & Urdu";
const description =
  "Free Hanafi inheritance calculator: divide an estate between spouse, children, parents, grandparents and siblings with correct Quranic shares, 'Awl and Radd, in English or Urdu.";

export const Route = createFileRoute("/inheritance-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/inheritance-calculator` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/inheritance-calculator` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Islamic Inheritance Calculator (Hanafi Faraid)",
          url: `${SITE}/inheritance-calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          inLanguage: ["en", "ur"],
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: InheritancePage,
});

function fractionLabel(fraction: number): string {
  return `${(fraction * 100).toFixed(2)}%`;
}

function InheritancePage() {
  const { lang } = useLangPref();
  const c = calcCopy[lang];
  const { data: settings } = useSettings();
  const symbol = settings?.currency_symbol ?? "PKR";
  const money = useMoneyFormat(lang, symbol);

  const [heirs, setHeirs] = useState<HeirsInput>(emptyHeirs);
  const set = <K extends keyof HeirsInput>(key: K, value: HeirsInput[K]) =>
    setHeirs((h) => ({ ...h, [key]: value }));

  const result = useMemo(() => calculateInheritance(heirs), [heirs]);
  const invalid = lang === "ur" ? "درست عدد درج کریں" : "Enter a valid number";

  const notes: string[] = [];
  if (result.awlApplied) notes.push(c.awlNote);
  if (result.raddApplied) notes.push(c.raddNote);
  if (result.warnings.includes("siblings-excluded")) notes.push(c.siblingsExcluded);
  if (result.warnings.includes("grandmother-excluded")) notes.push(c.grandmotherExcluded);

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.inheritanceTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.inheritanceIntro}</p>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
        <NumField
          id="inh-estate"
          label={`${c.estate} (${symbol})`}
          hint={c.estateHint}
          value={heirs.estate}
          onChange={(v) => set("estate", v)}
          invalidText={invalid}
        />

        <fieldset className="space-y-2">
          <Label asChild>
            <legend>{c.spouse}</legend>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["none", c.spouseNone],
                ["husband", c.husband],
                ["wife", c.wife],
              ] as Array<[HeirsInput["spouse"], string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => set("spouse", key)}
                aria-pressed={heirs.spouse === key}
                className={`min-h-11 rounded-xl border px-3 text-sm ${
                  heirs.spouse === key ? "border-primary bg-primary/5 font-medium" : "bg-card"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {heirs.spouse === "wife" && (
          <NumField
            id="inh-wives"
            label={c.wives}
            value={heirs.wives}
            onChange={(v) => set("wives", Math.min(4, Math.max(1, v)))}
            integer
            min={1}
            invalidText={invalid}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <NumField
            id="inh-sons"
            label={c.sons}
            value={heirs.sons}
            onChange={(v) => set("sons", v)}
            integer
            invalidText={invalid}
          />
          <NumField
            id="inh-daughters"
            label={c.daughters}
            value={heirs.daughters}
            onChange={(v) => set("daughters", v)}
            integer
            invalidText={invalid}
          />
          <NumField
            id="inh-brothers"
            label={c.brothers}
            value={heirs.fullBrothers}
            onChange={(v) => set("fullBrothers", v)}
            integer
            invalidText={invalid}
          />
          <NumField
            id="inh-sisters"
            label={c.sisters}
            value={heirs.fullSisters}
            onChange={(v) => set("fullSisters", v)}
            integer
            invalidText={invalid}
          />
          <NumField
            id="inh-grandmothers"
            label={c.grandmothers}
            value={heirs.grandmothers}
            onChange={(v) => set("grandmothers", Math.min(2, v))}
            integer
            invalidText={invalid}
          />
        </div>

        <div className="space-y-2">
          <CheckField
            id="inh-father"
            label={c.father}
            checked={heirs.father}
            onChange={(v) => set("father", v)}
          />
          <CheckField
            id="inh-mother"
            label={c.mother}
            checked={heirs.mother}
            onChange={(v) => set("mother", v)}
          />
          {!heirs.father && (
            <CheckField
              id="inh-grandfather"
              label={c.grandfather}
              checked={heirs.paternalGrandfather}
              onChange={(v) => set("paternalGrandfather", v)}
            />
          )}
        </div>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-4 shadow-soft sm:p-6" aria-live="polite">
        <h2 className="mb-3 text-base font-semibold text-foreground">{c.result}</h2>
        {result.shares.length === 0 ? (
          <p className="text-sm text-muted-foreground">{c.noHeirs}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-start text-xs uppercase text-muted-foreground">
                    <th className="py-2 text-start font-medium">{c.heir}</th>
                    <th className="py-2 text-start font-medium">{c.share}</th>
                    <th className="py-2 text-end font-medium">{c.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.shares.map((s) => (
                    <tr key={s.key} className="border-b border-border/60 last:border-b-0">
                      <td className="py-2">
                        {c.heirNames[s.key] ?? s.key}
                        {s.count > 1 && <span className="text-muted-foreground"> ×{s.count}</span>}
                      </td>
                      <td className="py-2 text-muted-foreground">{fractionLabel(s.fraction)}</td>
                      <td className="py-2 text-end font-medium">
                        {money(s.amount)}
                        {s.count > 1 && (
                          <span className="block text-xs font-normal text-muted-foreground">
                            {money(s.perPerson)} {c.each}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-base font-semibold">
              <span>{c.totalDistributed}</span>
              <span>{money(result.distributed)}</span>
            </div>
          </>
        )}
        {notes.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 ps-5 text-xs text-muted-foreground">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <EduBlock
          ruling={c.inheritanceRuling}
          mistakes={c.inheritanceMistakes}
          evidence={c.inheritanceEvidence}
          labels={{ ruling: c.ruling, mistakes: c.mistakes, evidence: c.evidence }}
        />
      </div>
    </PublicShell>
  );
}
