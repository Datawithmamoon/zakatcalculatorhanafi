import { BookOpen, CircleAlert, CircleCheck, CircleX, Scale } from "lucide-react";
import type { Edu } from "@/lib/zakat/i18n";
import { useZakat } from "./context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function EduPanel({ edu }: { edu: Edu }) {
  const { t } = useZakat();
  const rows: Array<{ key: keyof Edu; icon: typeof BookOpen }> = [
    { key: "included", icon: CircleCheck },
    { key: "excluded", icon: CircleX },
    { key: "mistakes", icon: CircleAlert },
    { key: "ruling", icon: Scale },
    { key: "evidence", icon: BookOpen },
  ];
  const available = rows.filter((r) => edu[r.key]);
  if (available.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="rounded-xl border bg-muted/40 px-4">
      {available.map(({ key, icon: Icon }) => (
        <AccordionItem key={key} value={key} className="last:border-b-0">
          <AccordionTrigger className="gap-3 text-start text-sm font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              {t.labels[key]}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {edu[key]}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function MoneyInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useZakat();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-xs font-medium text-muted-foreground">
          {t.currency}
        </span>
        <Input
          id={id}
          inputMode="decimal"
          type="number"
          min={0}
          step="any"
          dir="ltr"
          value={value ? String(value) : ""}
          placeholder="0"
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="ps-14 text-end tabular-nums"
        />
      </div>
    </div>
  );
}

export function Money({ value, className }: { value: number; className?: string }) {
  const { t, lang } = useZakat();
  return (
    <span className={cn("tabular-nums", className)} dir="ltr">
      {t.currency} {Math.round(value).toLocaleString(lang === "ur" ? "en-PK" : "en-US")}
    </span>
  );
}

export function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}
