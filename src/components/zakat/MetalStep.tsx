import { RefreshCw, TriangleAlert } from "lucide-react";
import {
  metalValue,
  pureGrams,
  puritiesFor,
  toGrams,
  type MetalHolding,
  type MetalPurity,
  type MetalUnit,
} from "@/lib/zakat/engine";
import { useZakat } from "./context";
import { ChoiceButton, Money, MoneyInput, NumberInput } from "./bits";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UNITS: Array<{ id: MetalUnit; key: "gram" | "tola" | "kilogram" }> = [
  { id: "gram", key: "gram" },
  { id: "tola", key: "tola" },
  { id: "kilogram", key: "kilogram" },
];

const SUFFIX: Record<MetalUnit, string> = { gram: "g", tola: "tola", kilogram: "kg" };

function LivePriceBar({ metal }: { metal: "gold" | "silver" }) {
  const { t, live, lang } = useZakat();
  const price = metal === "gold" ? live.goldPerGram : live.silverPerGram;
  const stamp = live.fetchedAt
    ? new Date(live.fetchedAt).toLocaleString(lang === "ur" ? "ur-PK" : "en-GB")
    : null;

  return (
    <div className="space-y-2 rounded-xl border border-dashed bg-muted/40 p-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          {t.labels.livePrices}
          {price ? (
            <>
              {": "}
              <Money value={price} className="font-semibold text-primary" /> / g
            </>
          ) : null}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-9"
          onClick={live.refresh}
          disabled={live.loading}
        >
          <RefreshCw className={live.loading ? "size-3.5 animate-spin" : "size-3.5"} aria-hidden />
          {t.labels.refreshPrices}
        </Button>
      </div>
      {live.loading && !price && <p className="text-muted-foreground">{t.labels.liveLoading}</p>}
      {stamp && !live.error && (
        <p className="text-muted-foreground">
          {t.labels.updated}: {stamp} — {live.source}
        </p>
      )}
      {live.error && (
        <p className="flex items-start gap-1.5 font-medium text-destructive">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {live.error === "live-failed" ? t.labels.liveFailed : t.labels.liveCached}
          {stamp && live.error !== "live-failed" ? ` (${stamp})` : ""}
        </p>
      )}
    </div>
  );
}

export function MetalStep({ metal }: { metal: "gold" | "silver" }) {
  const { t, input, update, live, settings, lang } = useZakat();
  const holding = input[metal];
  const set = (patch: Partial<MetalHolding>) => update({ [metal]: { ...holding, ...patch } });

  const referencePrice =
    (metal === "gold" ? live.goldPerGram : live.silverPerGram) ??
    Number(metal === "gold" ? settings?.gold_price_per_gram : settings?.silver_price_per_gram) ??
    0;

  const purities = puritiesFor(metal);
  const grams = toGrams(holding.weight, holding.unit);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">
          {metal === "gold" ? t.labels.gold : t.labels.silver}?
        </span>
        <div className="flex gap-2">
          <ChoiceButton active={holding.owns} onClick={() => set({ owns: true })}>
            {t.yes}
          </ChoiceButton>
          <ChoiceButton active={!holding.owns} onClick={() => set({ owns: false })}>
            {t.no}
          </ChoiceButton>
        </div>
      </div>

      <LivePriceBar metal={metal} />

      {holding.owns && (
        <div className="space-y-6 rounded-xl border bg-card p-4 shadow-soft sm:p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberInput
              id={`${metal}-weight`}
              label={t.labels.weight}
              value={holding.weight}
              onChange={(v) => set({ weight: v })}
              suffix={SUFFIX[holding.unit]}
            />
            <div className="space-y-1.5">
              <Label>{t.labels.unit}</Label>
              <div className="flex flex-wrap gap-2">
                {UNITS.map((u) => (
                  <ChoiceButton
                    key={u.id}
                    active={holding.unit === u.id}
                    onClick={() => set({ unit: u.id })}
                  >
                    {t.labels[u.key]}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t.labels.purity}</Label>
            <div className="flex flex-wrap gap-2">
              {purities.map((p) => (
                <ChoiceButton
                  key={p}
                  active={holding.purity === p}
                  onClick={() => set({ purity: p as MetalPurity })}
                >
                  {metal === "gold" ? p : `${p} (${(Number(p) / 10).toFixed(1)}%)`}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <MoneyInput
              id={`${metal}-price`}
              label={t.labels.pricePerGram}
              value={holding.pricePerGram}
              onChange={(v) => set({ pricePerGram: v, priceEdited: true })}
            />
            <ChoiceButton
              active={false}
              onClick={() =>
                referencePrice > 0 && set({ pricePerGram: referencePrice, priceEdited: false })
              }
            >
              {t.labels.autofill}
            </ChoiceButton>
          </div>

          <div className="space-y-2 rounded-lg bg-muted px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted-foreground">
                {t.labels.converted}: {grams.toFixed(2)} g
                {holding.unit !== "gram" ? ` (${holding.weight} ${SUFFIX[holding.unit]})` : ""}
              </span>
              <span className="text-muted-foreground" dir="ltr">
                {lang === "ur" ? "خالص" : "Pure"} {pureGrams(holding).toFixed(2)} g ·{" "}
                {holding.purity}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t pt-2">
              <span className="text-muted-foreground">{t.labels.value}</span>
              <Money value={metalValue(holding)} className="font-semibold text-primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
