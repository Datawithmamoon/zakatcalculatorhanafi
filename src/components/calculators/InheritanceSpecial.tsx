import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  calculateMissing,
  calculateMunasakha,
  calculatePregnancy,
  emptyHeirs,
  fStr,
  MISSING_KEYS,
  type ConditionalResult,
  type HeirsInput,
  type MissingKey,
  type MunasakhaStage,
} from "@/lib/calculators/inheritance";
import { CheckField, NumField } from "@/components/calculators/bits";

type Mode = "pregnancy" | "missing" | "munasakha";

interface Props {
  heirs: HeirsInput;
  ur: boolean;
  money: (v: number) => string;
  name: (key: string) => string;
  invalid: string;
}

const scenarioLabel = (l: string, ur: boolean) =>
  ({
    son: ur ? "اگر لڑکا پیدا ہو" : "If born a son",
    daughter: ur ? "اگر لڑکی پیدا ہو" : "If born a daughter",
    stillborn: ur ? "اگر مردہ پیدا ہو" : "If stillborn",
    alive: ur ? "اگر زندہ ہو" : "If alive",
    dead: ur ? "اگر وفات پا چکا ہو" : "If deceased",
  })[l] ?? l;

export function InheritanceSpecial({ heirs, ur, money, name, invalid }: Props) {
  const [mode, setMode] = useState<Mode>("pregnancy");
  const modes: Array<[Mode, string]> = [
    ["pregnancy", ur ? "حمل (پیدا نہ ہونے والا بچہ)" : "Unborn child"],
    ["missing", ur ? "مفقود وارث" : "Missing heir"],
    ["munasakha", ur ? "مناسخہ" : "Munasakha"],
  ];

  return (
    <section className="mt-6 rounded-2xl border bg-card p-4 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-foreground">
        {ur ? "خصوصی حالات" : "Special cases"}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {ur
          ? "اوپر درج ورثاء اور ترکہ کی بنیاد پر حساب کیا جاتا ہے۔"
          : "Uses the estate and heirs entered above."}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3" role="tablist">
        {modes.map(([k, l]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={mode === k}
            onClick={() => setMode(k)}
            className={`min-h-11 rounded-xl border px-3 text-sm ${
              mode === k ? "border-primary bg-primary/5 font-medium" : "bg-card"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {mode === "pregnancy" && <Pregnancy heirs={heirs} ur={ur} money={money} name={name} />}
        {mode === "missing" && <Missing heirs={heirs} ur={ur} money={money} name={name} />}
        {mode === "munasakha" && (
          <Munasakha heirs={heirs} ur={ur} money={money} name={name} invalid={invalid} />
        )}
      </div>
    </section>
  );
}

type Sub = Omit<Props, "invalid">;

function ConditionalView({ r, ur, money, name }: Sub & { r: ConditionalResult }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">{ur ? "ابھی دی جانے والی رقم" : "Paid out now"}</h3>
        <ul className="mt-2 divide-y divide-border/60 text-sm">
          {r.rows.map((row) => (
            <li key={row.key} className="flex justify-between gap-3 py-2">
              <span>
                {name(row.key)}
                {row.count > 1 && <span className="text-muted-foreground"> ×{row.count}</span>}
              </span>
              <span className="font-medium">{money(row.amountNow)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-3 py-2 font-semibold text-primary">
            <span>{ur ? "محفوظ رکھی گئی رقم" : "Reserved"}</span>
            <span>
              {money(r.reservedAmount)} <span className="text-xs" dir="ltr">({fStr(r.reserved)})</span>
            </span>
          </li>
        </ul>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {r.scenarios.map((s) => (
          <div key={s.label} className="min-w-0 rounded-xl border bg-muted/30 p-3">
            <h4 className="text-xs font-semibold">{scenarioLabel(s.label, ur)}</h4>
            <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
              {s.result.shares.map((g) => (
                <li key={g.key} className="flex justify-between gap-2">
                  <span>
                    {name(g.key)}
                    {g.count > 1 ? ` ×${g.count}` : ""}
                  </span>
                  <span>{money(g.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pregnancy(p: Sub) {
  const r = useMemo(() => calculatePregnancy(p.heirs), [p.heirs]);
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {p.ur
          ? "حنفی مسلک میں بچے کو لڑکا اور لڑکی دونوں فرض کر کے ہر وارث کو کم سے کم حصہ ابھی دیا جاتا ہے اور باقی پیدائش تک محفوظ رکھا جاتا ہے۔"
          : "The child is assumed both a son and a daughter; each heir receives the smaller amount now and the rest is held until birth."}
      </p>
      <ConditionalView r={r} {...p} />
    </div>
  );
}

function Missing(p: Sub) {
  const available = MISSING_KEYS.filter((k) =>
    k === "husband"
      ? p.heirs.spouse === "husband"
      : k === "father"
        ? p.heirs.father
        : Number(p.heirs[k] ?? 0) > 0,
  );
  const [key, setKey] = useState<MissingKey | "">("");
  const active = available.includes(key as MissingKey) ? (key as MissingKey) : available[0];
  const r = useMemo(
    () => (active ? calculateMissing(p.heirs, active) : null),
    [p.heirs, active],
  );
  if (!active)
    return (
      <p className="text-sm text-muted-foreground">
        {p.ur
          ? "پہلے اوپر شوہر، والد، بیٹا، بیٹی یا بہن بھائی میں سے کوئی وارث درج کریں۔"
          : "First enter a husband, father, child or sibling above."}
      </p>
    );
  return (
    <div className="space-y-3">
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">{p.ur ? "لاپتہ وارث" : "Missing heir"}</span>
        <select
          value={active}
          onChange={(e) => setKey(e.target.value as MissingKey)}
          className="min-h-11 w-full rounded-md border bg-background px-3 text-base"
        >
          {available.map((k) => (
            <option key={k} value={k}>
              {p.name(k)}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-muted-foreground">
        {p.ur
          ? "مفقود کو زندہ اور فوت دونوں فرض کیا جاتا ہے؛ ہر وارث کو کم حصہ ابھی ملتا ہے، باقی اس کی خبر ملنے تک محفوظ رہتا ہے۔"
          : "The missing heir is treated as both alive and deceased; others get the smaller share now and the rest is held until his fate is known."}
      </p>
      {r && <ConditionalView r={r} {...p} />}
    </div>
  );
}

interface StageDraft {
  source: string; // "stage:key"
  heirs: HeirsInput;
}

function Munasakha({ heirs, ur, money, name, invalid }: Props) {
  const [stages, setStages] = useState<StageDraft[]>([]);

  const parsed: MunasakhaStage[] = stages.map((s) => {
    const [st, key] = s.source.split(":");
    return { fromStage: Number(st), heirKey: key ?? "", heirs: s.heirs };
  });
  const result = useMemo(() => calculateMunasakha(heirs, parsed), [heirs, stages]); // eslint-disable-line react-hooks/exhaustive-deps

  const sourcesFor = (idx: number) =>
    result.stages.slice(0, idx + 1).flatMap((st, sIdx) =>
      st.valid
        ? st.result.shares.map((g) => ({
            value: `${sIdx}:${g.key}`,
            label: `${ur ? "مرحلہ" : "Stage"} ${sIdx + 1} — ${name(g.key)}`,
          }))
        : [],
    );

  const update = (i: number, patch: Partial<StageDraft>) =>
    setStages((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const setHeir = <K extends keyof HeirsInput>(i: number, k: K, v: HeirsInput[K]) =>
    setStages((arr) => arr.map((s, j) => (j === i ? { ...s, heirs: { ...s.heirs, [k]: v } } : s)));

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {ur
          ? "اگر کوئی وارث ترکہ تقسیم ہونے سے پہلے فوت ہو جائے تو اس کا حصہ اس کے اپنے ورثاء میں تقسیم ہوتا ہے۔ مرحلہ 1 اوپر والی تقسیم ہے۔"
          : "If an heir dies before the estate is divided, their share passes to their own heirs. Stage 1 is the division above."}
      </p>

      {stages.map((s, i) => {
        const opts = sourcesFor(i);
        const st = result.stages[i + 1];
        return (
          <div key={i} className="space-y-3 rounded-xl border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">
                {ur ? "مرحلہ" : "Stage"} {i + 2}
              </h3>
              <button
                type="button"
                onClick={() => setStages((a) => a.filter((_, j) => j !== i))}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-destructive"
                aria-label={ur ? "مرحلہ حذف کریں" : "Remove stage"}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">{ur ? "فوت ہونے والا وارث" : "Heir who died"}</span>
              <select
                value={s.source}
                onChange={(e) => update(i, { source: e.target.value })}
                className="min-h-11 w-full rounded-md border bg-background px-3 text-base"
              >
                <option value="">{ur ? "منتخب کریں" : "Select"}</option>
                {opts.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs font-medium">{ur ? "اس کے ورثاء" : "Their heirs"}</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["none", ur ? "کوئی نہیں" : "None"],
                  ["husband", ur ? "شوہر" : "Husband"],
                  ["wife", ur ? "بیوی" : "Wife"],
                ] as Array<[HeirsInput["spouse"], string]>
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.heirs.spouse === k}
                  onClick={() => setHeir(i, "spouse", k)}
                  className={`min-h-11 rounded-xl border px-2 text-sm ${
                    s.heirs.spouse === k ? "border-primary bg-primary/5 font-medium" : "bg-card"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["sons", ur ? "بیٹے" : "Sons"],
                  ["daughters", ur ? "بیٹیاں" : "Daughters"],
                  ["fullBrothers", ur ? "حقیقی بھائی" : "Full brothers"],
                  ["fullSisters", ur ? "حقیقی بہنیں" : "Full sisters"],
                ] as Array<["sons" | "daughters" | "fullBrothers" | "fullSisters", string]>
              ).map(([k, l]) => (
                <NumField
                  key={k}
                  id={`mun-${i}-${k}`}
                  label={l}
                  value={s.heirs[k]}
                  onChange={(v) => setHeir(i, k, v)}
                  integer
                  invalidText={invalid}
                />
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <CheckField
                id={`mun-${i}-father`}
                label={ur ? "والد" : "Father"}
                checked={s.heirs.father}
                onChange={(v) => setHeir(i, "father", v)}
              />
              <CheckField
                id={`mun-${i}-mother`}
                label={ur ? "والدہ" : "Mother"}
                checked={s.heirs.mother}
                onChange={(v) => setHeir(i, "mother", v)}
              />
            </div>
            {st && s.source && (
              <p className={`text-xs ${st.valid ? "text-muted-foreground" : "text-destructive"}`}>
                {st.valid
                  ? `${ur ? "منتقل شدہ حصہ" : "Share passed on"}: ${money(st.transferredAmount)} (${fStr(st.transferred)})`
                  : ur
                    ? "یہ انتخاب درست نہیں۔"
                    : "This selection is not valid."}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => setStages((a) => [...a, { source: "", heirs: emptyHeirs() }])}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-dashed px-4 text-sm font-medium"
      >
        <Plus className="size-4" /> {ur ? "فوت شدہ وارث شامل کریں" : "Add a deceased heir"}
      </button>

      {stages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">{ur ? "حتمی تقسیم" : "Final distribution"}</h3>
          <p className="text-xs text-muted-foreground">
            {ur ? "مسئلہ جامعہ" : "Combined base (al-Jami'a)"}: <span dir="ltr">{result.jamia}</span>
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 text-start font-medium">{ur ? "مرحلہ" : "Stage"}</th>
                  <th className="py-2 text-start font-medium">{ur ? "وارث" : "Heir"}</th>
                  <th className="py-2 text-start font-medium">{ur ? "حصہ" : "Share"}</th>
                  <th className="py-2 text-end font-medium">{ur ? "رقم" : "Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {result.consolidated.map((h) => (
                  <tr key={`${h.stage}:${h.key}`} className="border-b border-border/60 last:border-b-0">
                    <td className="py-2 text-muted-foreground">{h.stage + 1}</td>
                    <td className="py-2">
                      {name(h.key)}
                      {h.count > 1 && <span className="text-muted-foreground"> ×{h.count}</span>}
                    </td>
                    <td className="py-2 text-muted-foreground" dir="ltr">
                      {fStr(h.exact)}
                    </td>
                    <td className="py-2 text-end font-medium">{money(h.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
