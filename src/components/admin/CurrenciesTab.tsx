import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save } from "lucide-react";
import { useCurrencyRates, useUpsertRate } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CurrenciesTab() {
  const { data: rates } = useCurrencyRates();
  const upsert = useUpsertRate();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [next, setNext] = useState({ code: "", name: "", rate: "" });

  const saveRate = async (code: string, name: string) => {
    const raw = edits[code];
    const rate = Number(raw);
    if (!Number.isFinite(rate) || rate <= 0) return toast.error("Enter a valid rate");
    await upsert.mutateAsync({
      code,
      name,
      rate_per_usd: rate,
      source: "manual (admin)",
      updated_at: new Date().toISOString(),
    });
    setEdits((e) => ({ ...e, [code]: "" }));
    toast.success(`${code} updated`);
  };

  const add = async () => {
    const rate = Number(next.rate);
    if (!next.code || !Number.isFinite(rate) || rate <= 0) return toast.error("Code and rate required");
    await upsert.mutateAsync({
      code: next.code.toUpperCase(),
      name: next.name || next.code.toUpperCase(),
      rate_per_usd: rate,
      source: "manual (admin)",
    });
    setNext({ code: "", name: "", rate: "" });
    toast.success("Currency added");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">Currency rates (per 1 USD)</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-end">Rate</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rates ?? []).map((r) => (
                <TableRow key={r.code}>
                  <TableCell className="font-medium">{r.code}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell className="w-36">
                    <Input
                      aria-label={`${r.code} rate`}
                      type="number"
                      step="any"
                      className="text-end tabular-nums"
                      value={edits[r.code] ?? String(r.rate_per_usd)}
                      onChange={(e) => setEdits((s) => ({ ...s, [r.code]: e.target.value }))}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.source}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => saveRate(r.code, r.name)}>
                      <Save className="size-4" aria-hidden />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 font-semibold">Add currency</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="c-code">Code</Label>
            <Input
              id="c-code"
              value={next.code}
              onChange={(e) => setNext({ ...next, code: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={next.name}
              onChange={(e) => setNext({ ...next, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-rate">Rate per USD</Label>
            <Input
              id="c-rate"
              type="number"
              step="any"
              value={next.rate}
              onChange={(e) => setNext({ ...next, rate: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={add} className="w-full">
              <Plus className="size-4" aria-hidden /> Add
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
