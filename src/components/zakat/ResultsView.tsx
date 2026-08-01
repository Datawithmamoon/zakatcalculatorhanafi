import { useMemo } from "react";
import { Download, Printer, Share2, RotateCcw, Pencil, CircleCheckBig, Info } from "lucide-react";
import { calculateZakat, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/zakat/engine";
import { useZakat } from "./context";
import { ChoiceButton, Money } from "./bits";
import { MoneyInput } from "./bits";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ResultsView({ onEdit, onReset }: { onEdit: () => void; onReset: () => void }) {
  const { t, input, update } = useZakat();
  const r = useMemo(() => calculateZakat(input), [input]);

  const rows: Array<[string, number]> = [
    [t.results.gold ?? "", r.goldValue],
    [t.results.silver ?? "", r.silverValue],
    [t.results.cash ?? "", r.cashTotal],
    [t.results.business ?? "", r.businessTotal],
    [t.results.investments ?? "", r.investmentsTotal],
    [t.results.receivables ?? "", r.receivablesTotal],
  ];

  const share = async () => {
    const text = `${t.results.zakatDue}: ${t.currency} ${Math.round(r.zakatDue).toLocaleString("en-US")}`;
    try {
      if (navigator.share) await navigator.share({ title: t.appName, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success(text);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="space-y-6">
      <section
        className={
          "gradient-emerald rounded-2xl p-6 text-primary-foreground shadow-elevated sm:p-8"
        }
      >
        <p className="text-sm opacity-90">
          {!r.hawlCompleted ? t.results.noHawl : r.aboveNisab ? t.results.due : t.results.notDue}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          <Money value={r.zakatDue} />
        </p>
        <p className="mt-2 text-sm opacity-90">
          {r.aboveNisab ? t.results.rate : t.results.notDueWhy}
        </p>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">{t.results.title}</h3>
        <dl className="space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-1">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>
                <Money value={value} />
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 border-t pt-3 font-medium">
            <dt>{t.results.totalAssets}</dt>
            <dd>
              <Money value={r.totalAssets} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t.results.liabilities}</dt>
            <dd className="text-destructive">
              − <Money value={r.liabilitiesTotal} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-3 text-base font-semibold">
            <dt>{t.results.netWealth}</dt>
            <dd>
              <Money value={r.netWealth} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t.results.nisab}</dt>
            <dd>
              <Money value={r.nisab} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg bg-accent/60 px-3 py-3 text-base font-semibold text-accent-foreground">
            <dt className="flex items-center gap-2">
              <CircleCheckBig className="size-4" aria-hidden /> {t.results.zakatDue}
            </dt>
            <dd>
              <Money value={r.zakatDue} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="no-print space-y-4 rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="text-sm font-semibold">{t.labels.nisabBasis}</h3>
        <div className="flex flex-wrap gap-2">
          <ChoiceButton
            active={input.nisabBasis === "silver"}
            onClick={() => update({ nisabBasis: "silver" })}
          >
            {t.labels.silverNisab}
          </ChoiceButton>
          <ChoiceButton
            active={input.nisabBasis === "gold"}
            onClick={() => update({ nisabBasis: "gold" })}
          >
            {t.labels.goldNisab}
          </ChoiceButton>
          <ChoiceButton
            active={input.nisabBasis === "manual"}
            onClick={() => update({ nisabBasis: "manual" })}
          >
            {t.labels.manual}
          </ChoiceButton>
        </div>
        {input.nisabBasis === "manual" && (
          <MoneyInput
            id="manual-nisab"
            label={t.results.nisab ?? ""}
            value={input.manualNisab}
            onChange={(v) => update({ manualNisab: v })}
          />
        )}
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>
            {t.labels.silverNisab}: <Money value={r.silverNisab} /> ({NISAB_SILVER_GRAMS} g)
          </p>
          <p>
            {t.labels.goldNisab}: <Money value={r.goldNisab} /> ({NISAB_GOLD_GRAMS} g)
          </p>
        </div>
        <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          {t.lang === "ur"
            ? ""
            : ""}
          {t.dir === "rtl"
            ? "فقہ حنفی میں نقدی اور مخلوط اموال کے لیے عموماً چاندی کا نصاب اختیار کیا جاتا ہے تاکہ فقراء کو زیادہ فائدہ ہو۔"
            : "The Hanafi school generally applies the silver Nisab to cash and mixed assets, as it is more beneficial to the poor."}
        </p>
      </section>

      <div className="no-print flex flex-wrap gap-3">
        <Button onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden /> {t.results.print}
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download className="size-4" aria-hidden /> {t.results.pdf}
        </Button>
        <Button variant="secondary" onClick={share}>
          <Share2 className="size-4" aria-hidden /> {t.results.share}
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="size-4" aria-hidden /> {t.results.edit}
        </Button>
        <Button variant="ghost" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden /> {t.results.again}
        </Button>
      </div>

      <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        {t.disclaimer}
      </p>
    </div>
  );
}
