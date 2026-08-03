import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Ban, RotateCcw } from "lucide-react";
import type { StepKey } from "@/lib/zakat/i18n";
import { PRESETS, presetById, type PresetId } from "@/lib/zakat/presets";
import { useZakat } from "./context";
import { ChoiceButton, EduPanel, Money, MoneyInput } from "./bits";
import { MetalStep } from "./MetalStep";
import { ResultsView } from "./ResultsView";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sum, calculateZakat } from "@/lib/zakat/engine";

const STEPS: StepKey[] = [
  "hawl",
  "gold",
  "silver",
  "cash",
  "business",
  "investments",
  "receivables",
  "agriculture",
  "livestock",
  "excluded",
  "liabilities",
];

type MoneyGroup = "cash" | "business" | "investments" | "liabilities";
const MONEY_GROUPS: Partial<Record<StepKey, MoneyGroup>> = {
  cash: "cash",
  business: "business",
  investments: "investments",
  liabilities: "liabilities",
};

export function Wizard() {
  const { t, lang, input, update, setMoney, reset } = useZakat();
  const [index, setIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [presetId, setPresetId] = useState<PresetId>("full");

  const steps = useMemo(() => presetById(presetId).steps, [presetId]);
  const stepKey = (steps[index] ?? steps[0]) as StepKey;
  const copy = t.steps[stepKey];
  const group = MONEY_GROUPS[stepKey];
  const result = useMemo(() => calculateZakat(input), [input]);

  const blockedByHawl = stepKey === "hawl" && !input.hawlCompleted;
  const isLast = index === steps.length - 1;

  const goNext = () => (isLast ? setShowResults(true) : setIndex((i) => i + 1));
  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  if (showResults) {
    return (
      <ResultsView
        presetId={presetId}
        onEdit={() => setShowResults(false)}
        onReset={() => {
          reset();
          setIndex(0);
          setShowResults(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print space-y-3 rounded-2xl border bg-card p-4 shadow-soft">
        <p className="text-sm font-semibold">
          {lang === "ur" ? "تیز ٹیمپلیٹ منتخب کریں" : "Choose a quick template"}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <ChoiceButton
              key={p.id}
              active={presetId === p.id}
              onClick={() => {
                setPresetId(p.id);
                setIndex(0);
              }}
            >
              {lang === "ur" ? p.labelUr : p.labelEn}
            </ChoiceButton>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === "ur" ? presetById(presetId).descUr : presetById(presetId).descEn}
        </p>
      </div>

      <div className="no-print space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            {t.step} {index + 1} {t.of} {steps.length}
          </span>
          <span>{Math.round(((index + 1) / steps.length) * 100)}%</span>
        </div>
        <Progress value={((index + 1) / steps.length) * 100} className="h-1.5" />
      </div>


      <section className="rounded-2xl border bg-card p-5 shadow-soft sm:p-7">
        <header className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight">{copy.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.intro}</p>
        </header>

        <div className="space-y-6">
          {stepKey === "hawl" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <ChoiceButton
                  active={input.hawlCompleted}
                  onClick={() => update({ hawlCompleted: true })}
                >
                  {t.yes}
                </ChoiceButton>
                <ChoiceButton
                  active={!input.hawlCompleted}
                  onClick={() => update({ hawlCompleted: false })}
                >
                  {t.no}
                </ChoiceButton>
              </div>
              {blockedByHawl && (
                <p className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                  <Ban className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                  {t.results.noHawl} — {copy.edu.ruling}
                </p>
              )}
            </div>
          )}

          {(stepKey === "gold" || stepKey === "silver") && <MetalStep metal={stepKey} />}

          {group && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(copy.fields).map(([key, label]) => (
                <MoneyInput
                  key={key}
                  id={`${group}-${key}`}
                  label={label}
                  value={input[group][key] ?? 0}
                  onChange={(v) => setMoney(group, key, v)}
                />
              ))}
            </div>
          )}

          {stepKey === "receivables" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {(["likely", "uncertain", "bad"] as const).map((key) => (
                <MoneyInput
                  key={key}
                  id={`receivable-${key}`}
                  label={copy.fields[key] ?? key}
                  value={input.receivables[key]}
                  onChange={(v) =>
                    update({ receivables: { ...input.receivables, [key]: v } })
                  }
                />
              ))}
            </div>
          )}

          {stepKey === "excluded" && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {Object.entries(copy.fields).map(([key, label]) => (
                <li
                  key={key}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
                >
                  <Ban className="size-4 shrink-0 text-destructive" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          )}

          {(stepKey === "agriculture" || stepKey === "livestock") && (
            <p className="rounded-lg bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
              {t.optional} — {t.skip}
            </p>
          )}

          {group && (
            <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">{t.labels.total}</span>
              <Money value={sum(input[group])} className="font-semibold text-primary" />
            </div>
          )}

          <EduPanel edu={copy.edu} />
        </div>
      </section>

      <nav className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={goBack} disabled={index === 0}>
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden /> {t.back}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden /> {t.reset}
          </Button>
          <Button onClick={goNext} disabled={blockedByHawl}>
            {isLast ? t.calculate : t.next}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Button>
        </div>
      </nav>

      <p className="no-print flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed px-4 py-3 text-xs text-muted-foreground">
        <span>{t.savedNote}</span>
        <span>
          {t.results.netWealth}: <Money value={result.netWealth} />
        </span>
      </p>
    </div>
  );
}
