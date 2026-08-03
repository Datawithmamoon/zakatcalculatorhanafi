import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, Save, Wifi, WifiOff } from "lucide-react";
import { getLivePrices } from "@/lib/prices.functions";
import { useSettings, useUpdateSettings, useCurrencyRates, useUpsertRate } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function Field({
  id,
  label,
  value,
  onChange,
  type = "number",
  hint,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} step="any" value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PricesTab() {
  const { data: settings } = useSettings();
  const { data: rates } = useCurrencyRates();
  const updateSettings = useUpdateSettings();
  const upsertRate = useUpsertRate();
  const fetchLive = useServerFn(getLivePrices);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const live = useQuery({
    queryKey: ["live-prices"],
    queryFn: () => fetchLive(),
    refetchInterval: settings?.auto_refresh_enabled
      ? Math.max(5, settings.refresh_interval_minutes) * 60 * 1000
      : false,
    retry: 1,
  });

  if (!settings) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  const val = (k: string) =>
    draft[k] ?? String((settings as unknown as Record<string, unknown>)[k] ?? "");
  const set = (k: string) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const baseRate =
    rates?.find((r) => r.code === settings.base_currency)?.rate_per_usd ??
    live.data?.rates[settings.base_currency] ??
    1;

  const liveGold = live.data ? live.data.goldUsdPerGram * Number(baseRate) : null;
  const liveSilver = live.data ? live.data.silverUsdPerGram * Number(baseRate) : null;

  const save = async (patch: Record<string, unknown>) => {
    try {
      await updateSettings.mutateAsync(patch);
      setDraft({});
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const applyLive = async () => {
    if (!live.data || liveGold === null || liveSilver === null) return;
    await save({
      gold_price_per_gram: Number(liveGold.toFixed(2)),
      silver_price_per_gram: Number(liveSilver.toFixed(2)),
      price_source: `${live.data.metalSource} + ${live.data.ratesSource}`,
      price_source_url: live.data.metalSourceUrl,
      prices_updated_at: live.data.fetchedAt,
    });
    if (live.data.rates) {
      const known = new Set((rates ?? []).map((r) => r.code));
      await Promise.all(
        Object.entries(live.data.rates)
          .filter(([code]) => known.has(code))
          .map(([code, rate]) =>
            upsertRate.mutateAsync({
              code,
              name: rates?.find((r) => r.code === code)?.name ?? code,
              rate_per_usd: rate,
              source: live.data!.ratesSource,
              updated_at: new Date().toISOString(),
            }),
          ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-semibold">
            {live.isError ? (
              <WifiOff className="size-4 text-destructive" aria-hidden />
            ) : (
              <Wifi className="size-4 text-primary" aria-hidden />
            )}
            Live market prices
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => live.refetch()} disabled={live.isFetching}>
              <RefreshCw className={`size-4 ${live.isFetching ? "animate-spin" : ""}`} aria-hidden />
              Refresh
            </Button>
            <Button size="sm" onClick={applyLive} disabled={!live.data}>
              Apply to settings
            </Button>
          </div>
        </div>

        {live.isError ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            Live feed unavailable. The saved manual prices below stay in use as a fallback.
          </p>
        ) : (
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Gold / gram</dt>
              <dd className="font-medium tabular-nums">
                {liveGold ? `${settings.currency_symbol} ${liveGold.toFixed(2)}` : "…"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Silver / gram</dt>
              <dd className="font-medium tabular-nums">
                {liveSilver ? `${settings.currency_symbol} ${liveSilver.toFixed(2)}` : "…"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="truncate">
                {live.data ? `${live.data.metalSource}, ${live.data.ratesSource}` : "…"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Published prices &amp; currency</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="gold"
            label="Gold price per gram (24K)"
            value={val("gold_price_per_gram")}
            onChange={set("gold_price_per_gram")}
          />
          <Field
            id="silver"
            label="Silver price per gram"
            value={val("silver_price_per_gram")}
            onChange={set("silver_price_per_gram")}
          />
          <Field
            id="currency"
            label="Base currency code"
            type="text"
            value={val("base_currency")}
            onChange={set("base_currency")}
          />
          <Field
            id="symbol"
            label="Currency symbol shown to users"
            type="text"
            value={val("currency_symbol")}
            onChange={set("currency_symbol")}
          />
          <Field
            id="source"
            label="Price source label"
            type="text"
            value={val("price_source")}
            onChange={set("price_source")}
          />
          <Field
            id="sourceUrl"
            label="Price source link"
            type="text"
            value={val("price_source_url")}
            onChange={set("price_source_url")}
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Switch
              id="auto"
              checked={settings.auto_refresh_enabled}
              onCheckedChange={(v) => save({ auto_refresh_enabled: v })}
            />
            <Label htmlFor="auto">Automatic refresh</Label>
          </div>
          <div className="w-40">
            <Field
              id="interval"
              label="Interval (minutes)"
              value={val("refresh_interval_minutes")}
              onChange={set("refresh_interval_minutes")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated {new Date(settings.prices_updated_at).toLocaleString()}
          </p>
        </div>

        <Button
          onClick={() =>
            save({
              gold_price_per_gram: Number(val("gold_price_per_gram")),
              silver_price_per_gram: Number(val("silver_price_per_gram")),
              base_currency: val("base_currency").toUpperCase(),
              currency_symbol: val("currency_symbol"),
              price_source: val("price_source"),
              price_source_url: val("price_source_url"),
              refresh_interval_minutes: Number(val("refresh_interval_minutes")),
              prices_updated_at: new Date().toISOString(),
            })
          }
          disabled={updateSettings.isPending}
        >
          <Save className="size-4" aria-hidden /> Save prices
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Nisab settings</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="goldGrams"
            label="Gold Nisab (grams)"
            value={val("nisab_gold_grams")}
            onChange={set("nisab_gold_grams")}
          />
          <Field
            id="silverGrams"
            label="Silver Nisab (grams)"
            value={val("nisab_silver_grams")}
            onChange={set("nisab_silver_grams")}
          />
          <Field
            id="rate"
            label="Zakat rate (e.g. 0.025)"
            value={val("zakat_rate")}
            onChange={set("zakat_rate")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["silver", "gold"] as const).map((basis) => (
            <Button
              key={basis}
              size="sm"
              variant={settings.default_nisab_basis === basis ? "default" : "outline"}
              onClick={() => save({ default_nisab_basis: basis })}
            >
              Default basis: {basis}
            </Button>
          ))}
        </div>
        <Button
          onClick={() =>
            save({
              nisab_gold_grams: Number(val("nisab_gold_grams")),
              nisab_silver_grams: Number(val("nisab_silver_grams")),
              zakat_rate: Number(val("zakat_rate")),
            })
          }
        >
          <Save className="size-4" aria-hidden /> Save Nisab
        </Button>
      </section>
    </div>
  );
}
