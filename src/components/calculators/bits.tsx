import type { ReactNode } from "react";
import { useState } from "react";
import { BookOpen, CircleAlert, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Numeric field with inline validation shared by the standalone calculators. */
export function NumField({
  id,
  label,
  hint,
  value,
  onChange,
  min = 0,
  step = "any",
  integer = false,
  invalidText,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: string;
  integer?: boolean;
  invalidText: string;
}) {
  const [text, setText] = useState(value ? String(value) : "");
  const [error, setError] = useState(false);

  const handle = (raw: string) => {
    setText(raw);
    const cleaned = raw.replace(/[,\s]/g, "");
    if (cleaned === "") {
      setError(false);
      onChange(0);
      return;
    }
    const n = Number(cleaned);
    if (!Number.isFinite(n) || n < min) {
      setError(true);
      onChange(0);
      return;
    }
    setError(false);
    onChange(integer ? Math.floor(n) : n);
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode={integer ? "numeric" : "decimal"}
        type="number"
        min={min}
        step={step}
        value={text}
        onChange={(e) => handle(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        aria-invalid={error}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="min-h-11 text-base"
      />
      {error ? (
        <p className="text-xs text-destructive">{invalidText}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CheckField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-2 text-sm"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-[var(--color-primary)]"
      />
      <span>{label}</span>
    </label>
  );
}

export function ResultRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-b-0 ${
        strong ? "text-base font-semibold text-foreground" : "text-sm text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span className={strong ? "" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

export function EduBlock({
  ruling,
  mistakes,
  evidence,
  labels,
}: {
  ruling: string;
  mistakes: string;
  evidence?: string;
  labels: { ruling: string; mistakes: string; evidence: string };
}) {
  const rows = [
    { key: "ruling", icon: Scale, label: labels.ruling, body: ruling },
    { key: "mistakes", icon: CircleAlert, label: labels.mistakes, body: mistakes },
    ...(evidence
      ? [{ key: "evidence", icon: BookOpen, label: labels.evidence, body: evidence }]
      : []),
  ];
  return (
    <Accordion type="single" collapsible className="rounded-xl border bg-muted/40 px-4">
      {rows.map(({ key, icon: Icon, label, body }) => (
        <AccordionItem key={key} value={key} className="last:border-b-0">
          <AccordionTrigger className="gap-3 text-start text-sm font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              {label}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Formats a money amount with the site currency, without pulling in the wizard context. */
export function useMoneyFormat(lang: string, symbol: string) {
  return (value: number) =>
    `${symbol} ${new Intl.NumberFormat(lang === "ur" ? "ur-PK" : "en-PK", {
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0)}`;
}
