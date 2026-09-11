import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { EduBlock, NumField, ResultRow } from "@/components/calculators/bits";
import { useLangPref } from "@/lib/zakat/useLangPref";
import { useLivePrices } from "@/lib/zakat/useLivePrices";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SITE = "https://zakatcalculatorhanafi.lovable.app";
const title = "Haq Mehr Calculator — Live Silver Rate | English & Urdu";
const description =
  "Calculate the value of Haq Mehr based on the current live Silver price. Enter the silver weight in grams and view the amount in PKR or any major world currency.";

export const Route = createFileRoute("/haq-mehr-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE}/haq-mehr-calculator` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE}/haq-mehr-calculator` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Haq Mehr Calculator",
          url: `${SITE}/haq-mehr-calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          inLanguage: ["en", "ur"],
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HaqMehrPage,
});

const CURRENCIES = [
  "PKR",
  "USD",
  "EUR",
  "GBP",
  "SAR",
  "AED",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "INR",
  "BDT",
  "TRY",
  "MYR",
  "IDR",
  "CAD",
  "AUD",
  "ZAR",
] as const;

const copy = {
  en: {
    title: "Haq Mehr Calculator",
    intro: "Calculate the value of Haq Mehr based on the current live Silver price.",
    weight: "Silver weight (grams)",
    weightHint: "Enter the agreed silver quantity in grams. Haq Mehr here is based on silver only.",
    currency: "Currency",
    result: "Result",
    liveRate: "Current live silver rate (per gram)",
    weightRow: "Silver weight",
    value: "Haq Mehr value",
    grams: "g",
    updated: "Last updated",
    refresh: "Refresh rate",
    loading: "Fetching live silver rate…",
    stale: "Live rate unavailable — showing the last saved rate.",
    failed: "Live silver rate is unavailable right now. Please try again.",
    noRate: "No exchange rate available for this currency right now.",
    source: "Source",
    ruling: "Hanafi ruling",
    mistakes: "Common mistakes",
    evidence: "Evidence",
    rulingBody:
      "Mehr is an obligatory right of the wife upon the husband (Qur'an 4:4). The Hanafi school sets the minimum Mehr (Mehr-e-Mithl floor) at ten dirhams of silver, which the jurists measure as 30.618 grams of pure silver; there is no upper limit. Valuing the agreed silver quantity at today's market price keeps the right meaningful over time.",
    mistakesBody:
      "Treating Mehr as a formality and never paying it; fixing an amount the husband cannot realistically pay; converting an old silver-based Mehr at historical rather than current silver prices; and confusing Mehr with gifts or wedding expenses, which do not discharge it.",
    evidenceBody:
      "Qur'an 4:4 — “And give the women their dowries graciously.” Hanafi references: al-Hidayah, Kitab al-Nikah (bab al-mahr); Radd al-Muhtar; al-Fatawa al-Hindiyya — ten dirhams as the minimum Mehr.",
  },
  ur: {
    title: "حقِ مہر کیلکولیٹر",
    intro: "موجودہ لائیو چاندی کی قیمت کی بنیاد پر حقِ مہر کی مالیت معلوم کریں۔",
    weight: "چاندی کا وزن (گرام)",
    weightHint: "طے شدہ چاندی کی مقدار گرام میں درج کریں۔ یہاں حقِ مہر صرف چاندی پر مبنی ہے۔",
    currency: "کرنسی",
    result: "نتیجہ",
    liveRate: "موجودہ لائیو چاندی کا ریٹ (فی گرام)",
    weightRow: "چاندی کا وزن",
    value: "حقِ مہر کی مالیت",
    grams: "گرام",
    updated: "آخری اپ ڈیٹ",
    refresh: "ریٹ تازہ کریں",
    loading: "لائیو چاندی کا ریٹ حاصل کیا جا رہا ہے…",
    stale: "لائیو ریٹ دستیاب نہیں — آخری محفوظ ریٹ دکھایا جا رہا ہے۔",
    failed: "اس وقت لائیو چاندی کا ریٹ دستیاب نہیں۔ براہِ کرم دوبارہ کوشش کریں۔",
    noRate: "اس کرنسی کے لیے فی الحال شرحِ تبادلہ دستیاب نہیں۔",
    source: "ماخذ",
    ruling: "حنفی حکم",
    mistakes: "عام غلطیاں",
    evidence: "دلائل",
    rulingBody:
      "مہر بیوی کا شوہر پر واجب حق ہے (سورۃ النساء ۴:۴)۔ فقہِ حنفی میں کم از کم مہر دس درہم چاندی ہے، جسے فقہاء ۳۰.۶۱۸ گرام خالص چاندی کے برابر شمار کرتے ہیں؛ زیادہ کی کوئی حد نہیں۔ طے شدہ چاندی کی مقدار کو آج کے بازاری نرخ پر شمار کرنے سے یہ حق بامعنی رہتا ہے۔",
    mistakesBody:
      "مہر کو محض رسم سمجھ کر ادا نہ کرنا؛ ایسی رقم مقرر کرنا جو شوہر ادا ہی نہ کر سکے؛ پرانے چاندی والے مہر کو پرانے نرخ پر شمار کرنا؛ اور جہیز یا شادی کے اخراجات کو مہر سمجھ لینا، حالانکہ ان سے مہر ادا نہیں ہوتا۔",
    evidenceBody:
      "سورۃ النساء ۴:۴ — «اور عورتوں کو ان کے مہر خوش دلی سے دو۔» حنفی حوالہ جات: الہدایہ، کتاب النکاح (باب المہر)؛ رد المحتار؛ الفتاویٰ الہندیہ — دس درہم کم از کم مہر۔",
  },
} as const;

function HaqMehrPage() {
  const { lang } = useLangPref();
  const c = copy[lang];
  const [grams, setGrams] = useState(30.618);
  const [currency, setCurrency] = useState("PKR");

  const prices = useLivePrices({ currency, autoRefresh: true, intervalMinutes: 30 });

  const locale = lang === "ur" ? "ur-PK" : "en-PK";
  const money = (v: number) =>
    `${currency} ${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(v)}`;

  const total = useMemo(
    () => (prices.silverPerGram ? prices.silverPerGram * grams : null),
    [prices.silverPerGram, grams],
  );

  const invalid = lang === "ur" ? "درست عدد درج کریں" : "Enter a valid number";

  return (
    <PublicShell>
      <h1 className="text-2xl font-semibold text-foreground">{c.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{c.intro}</p>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
        <NumField
          id="mehr-grams"
          label={c.weight}
          hint={c.weightHint}
          value={grams}
          onChange={setGrams}
          invalidText={invalid}
        />
        <div className="space-y-1.5">
          <Label htmlFor="mehr-currency">{c.currency}</Label>
          <select
            id="mehr-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-base"
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-4 shadow-soft sm:p-6" aria-live="polite">
        <h2 className="mb-2 text-base font-semibold text-foreground">{c.result}</h2>
        <ResultRow
          label={c.liveRate}
          value={prices.silverPerGram ? money(prices.silverPerGram) : "—"}
        />
        <ResultRow
          label={c.weightRow}
          value={`${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(grams)} ${c.grams}`}
        />
        <ResultRow label={c.value} value={total !== null ? money(total) : "—"} strong />

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            {prices.loading
              ? c.loading
              : prices.fetchedAt
                ? `${c.updated}: ${new Date(prices.fetchedAt).toLocaleString(locale)}`
                : ""}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={prices.refresh}
          >
            {c.refresh}
          </Button>
        </div>
        {prices.error === "live-failed" ? (
          <p className="mt-2 text-xs text-destructive">{c.failed}</p>
        ) : prices.error === "no-rate" ? (
          <p className="mt-2 text-xs text-destructive">{c.noRate}</p>
        ) : prices.stale ? (
          <p className="mt-2 text-xs text-muted-foreground">{c.stale}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {c.source}: {prices.source}
        </p>
      </section>

      <div className="mt-6">
        <EduBlock
          ruling={c.rulingBody}
          mistakes={c.mistakesBody}
          evidence={c.evidenceBody}
          labels={{ ruling: c.ruling, mistakes: c.mistakes, evidence: c.evidence }}
        />
      </div>
    </PublicShell>
  );
}
