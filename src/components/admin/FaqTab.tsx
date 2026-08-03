import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFaqs, type Faq } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const blank = {
  question_en: "",
  question_ur: "",
  answer_en: "",
  answer_ur: "",
  sort_order: 0,
  published: true,
};

export function FaqTab() {
  const { data: faqs } = useFaqs(true);
  const qc = useQueryClient();
  const [draft, setDraft] = useState(blank);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["faqs"] });

  const save = useMutation({
    mutationFn: async (row: Partial<Faq> & { id?: string }) => {
      const { error } = row.id
        ? await supabase.from("faqs").update(row).eq("id", row.id)
        : await supabase.from("faqs").insert(row as Faq);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("FAQ saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("FAQ deleted");
    },
  });

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Add FAQ</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="q-en">Question (English)</Label>
            <Input
              id="q-en"
              value={draft.question_en}
              onChange={(e) => setDraft({ ...draft, question_en: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-ur">Question (Urdu)</Label>
            <Input
              id="q-ur"
              dir="rtl"
              className="font-urdu"
              value={draft.question_ur}
              onChange={(e) => setDraft({ ...draft, question_ur: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-en">Answer (English)</Label>
            <Textarea
              id="a-en"
              value={draft.answer_en}
              onChange={(e) => setDraft({ ...draft, answer_en: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-ur">Answer (Urdu)</Label>
            <Textarea
              id="a-ur"
              dir="rtl"
              className="font-urdu"
              value={draft.answer_ur}
              onChange={(e) => setDraft({ ...draft, answer_ur: e.target.value })}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            if (!draft.question_en || !draft.answer_en) {
              toast.error("English question and answer are required");
              return;
            }
            save.mutate({ ...draft, sort_order: (faqs?.length ?? 0) + 1 });
            setDraft(blank);
          }}
        >
          <Plus className="size-4" aria-hidden /> Add FAQ
        </Button>
      </section>

      {(faqs ?? []).map((f) => (
        <FaqRow key={f.id} faq={f} onSave={(row) => save.mutate(row)} onDelete={() => remove.mutate(f.id)} />
      ))}
    </div>
  );
}

function FaqRow({
  faq,
  onSave,
  onDelete,
}: {
  faq: Faq;
  onSave: (row: Partial<Faq> & { id: string }) => void;
  onDelete: () => void;
}) {
  const [row, setRow] = useState(faq);
  return (
    <section className="space-y-3 rounded-xl border bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label="Question English"
          value={row.question_en}
          onChange={(e) => setRow({ ...row, question_en: e.target.value })}
        />
        <Input
          aria-label="Question Urdu"
          dir="rtl"
          className="font-urdu"
          value={row.question_ur}
          onChange={(e) => setRow({ ...row, question_ur: e.target.value })}
        />
        <Textarea
          aria-label="Answer English"
          value={row.answer_en}
          onChange={(e) => setRow({ ...row, answer_en: e.target.value })}
        />
        <Textarea
          aria-label="Answer Urdu"
          dir="rtl"
          className="font-urdu"
          value={row.answer_ur}
          onChange={(e) => setRow({ ...row, answer_ur: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id={`pub-${row.id}`}
            checked={row.published}
            onCheckedChange={(v) => setRow({ ...row, published: v })}
          />
          <Label htmlFor={`pub-${row.id}`}>Published</Label>
        </div>
        <div className="w-28">
          <Input
            aria-label="Sort order"
            type="number"
            value={row.sort_order}
            onChange={(e) => setRow({ ...row, sort_order: Number(e.target.value) })}
          />
        </div>
        <Button size="sm" onClick={() => onSave(row)}>
          <Save className="size-4" aria-hidden /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete}>
          <Trash2 className="size-4 text-destructive" aria-hidden />
        </Button>
      </div>
    </section>
  );
}
