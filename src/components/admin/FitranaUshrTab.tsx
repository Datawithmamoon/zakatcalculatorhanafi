import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Field({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FitranaUshrTab() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [draft, setDraft] = useState<Record<string, string>>({});

  if (!settings) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  const val = (k: string) =>
    draft[k] ?? String((settings as unknown as Record<string, unknown>)[k] ?? "");
  const set = (k: string) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async (patch: Record<string, unknown>) => {
    try {
      await updateSettings.mutateAsync(patch);
      setDraft({});
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Fitrana (Zakat al-Fitr)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="fitranaAmount"
            label="Amount per person"
            value={val("fitrana_amount_per_person")}
            onChange={set("fitrana_amount_per_person")}
            hint="Cash value per family member"
          />
          <Field
            id="fitranaKg"
            label="Wheat per person (kg)"
            value={val("fitrana_wheat_kg")}
            onChange={set("fitrana_wheat_kg")}
            hint="Half a sa' of wheat ≈ 2.045 kg"
          />
          <Field
            id="fitranaPrice"
            label="Wheat price per kg"
            value={val("fitrana_wheat_price_per_kg")}
            onChange={set("fitrana_wheat_price_per_kg")}
          />
        </div>
        <Button
          onClick={() =>
            save({
              fitrana_amount_per_person: Number(val("fitrana_amount_per_person")),
              fitrana_wheat_kg: Number(val("fitrana_wheat_kg")),
              fitrana_wheat_price_per_kg: Number(val("fitrana_wheat_price_per_kg")),
            })
          }
          disabled={updateSettings.isPending}
        >
          <Save className="size-4" aria-hidden /> Save Fitrana
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Ushr (agricultural produce)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="ushrRain"
            label="Rain-fed rate (e.g. 0.10)"
            value={val("ushr_rate_rain")}
            onChange={set("ushr_rate_rain")}
            hint="One-tenth for naturally irrigated land"
          />
          <Field
            id="ushrIrrigated"
            label="Irrigated rate (e.g. 0.05)"
            value={val("ushr_rate_irrigated")}
            onChange={set("ushr_rate_irrigated")}
            hint="One-twentieth for artificially irrigated land"
          />
        </div>
        <Button
          onClick={() =>
            save({
              ushr_rate_rain: Number(val("ushr_rate_rain")),
              ushr_rate_irrigated: Number(val("ushr_rate_irrigated")),
            })
          }
          disabled={updateSettings.isPending}
        >
          <Save className="size-4" aria-hidden /> Save Ushr
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Inheritance calculator notice</h3>
        <p className="text-xs text-muted-foreground">
          Shown on the inheritance calculator as a fiqh disclaimer.
        </p>
        <div className="grid gap-4">
          <div className="space-y-1.5" dir="ltr">
            <Label htmlFor="noticeEn">Notice (English)</Label>
            <Textarea
              id="noticeEn"
              rows={4}
              value={val("inheritance_notice_en")}
              onChange={(e) => set("inheritance_notice_en")(e.target.value)}
            />
          </div>
          <div className="space-y-1.5" dir="rtl">
            <Label htmlFor="noticeUr">Notice (Urdu)</Label>
            <Textarea
              id="noticeUr"
              rows={4}
              value={val("inheritance_notice_ur")}
              onChange={(e) => set("inheritance_notice_ur")(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={() =>
            save({
              inheritance_notice_en: val("inheritance_notice_en"),
              inheritance_notice_ur: val("inheritance_notice_ur"),
            })
          }
          disabled={updateSettings.isPending}
        >
          <Save className="size-4" aria-hidden /> Save notice
        </Button>
      </section>
    </div>
  );
}
