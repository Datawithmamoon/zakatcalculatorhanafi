import {
  DEFAULT_GOLD_PRICE,
  DEFAULT_SILVER_PRICE,
  PURITY_FACTOR,
  metalValue,
  pureGrams,
  type GoldPurity,
  type MetalHolding,
} from "@/lib/zakat/engine";
import { useZakat } from "./context";
import { ChoiceButton, Money, MoneyInput, NumberInput } from "./bits";
import { Label } from "@/components/ui/label";

export function MetalStep({ metal }: { metal: "gold" | "silver" }) {
  const { t, input, update, settings } = useZakat();
  const holding = input[metal];
  const set = (patch: Partial<MetalHolding>) => update({ [metal]: { ...holding, ...patch } });
  const referencePrice =
    metal === "gold"
      ? Number(settings?.gold_price_per_gram) || DEFAULT_GOLD_PRICE
      : Number(settings?.silver_price_per_gram) || DEFAULT_SILVER_PRICE;
  const purities = Object.keys(PURITY_FACTOR) as GoldPurity[];

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

      {holding.owns && (
        <div className="space-y-5 rounded-xl border bg-card p-4 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              id={`${metal}-weight`}
              label={t.labels.weight}
              value={holding.weight}
              onChange={(v) => set({ weight: v })}
              suffix={holding.unit === "tola" ? "tola" : "g"}
            />
            <div className="space-y-1.5">
              <Label>{t.labels.unit}</Label>
              <div className="flex gap-2">
                <ChoiceButton active={holding.unit === "gram"} onClick={() => set({ unit: "gram" })}>
                  {t.labels.gram}
                </ChoiceButton>
                <ChoiceButton active={holding.unit === "tola"} onClick={() => set({ unit: "tola" })}>
                  {t.labels.tola}
                </ChoiceButton>
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
                  onClick={() => set({ purity: p })}
                >
                  {p}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <MoneyInput
              id={`${metal}-price`}
              label={t.labels.pricePerGram}
              value={holding.pricePerGram}
              onChange={(v) => set({ pricePerGram: v })}
            />
            <ChoiceButton active={false} onClick={() => set({ pricePerGram: referencePrice })}>
              {t.labels.autofill}
            </ChoiceButton>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm">
            <span className="text-muted-foreground">
              {pureGrams(holding).toFixed(2)} g ({holding.purity})
            </span>
            <Money value={metalValue(holding)} className="font-semibold text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
