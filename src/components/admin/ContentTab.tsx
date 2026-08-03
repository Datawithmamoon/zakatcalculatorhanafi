import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEduContent, type EduContent } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const blank = {
  slug: "",
  category: "general",
  title_en: "",
  title_ur: "",
  body_en: "",
  body_ur: "",
  sort_order: 0,
  published: true,
};

export function ContentTab() {
  const { data: items } = useEduContent(true);
  const qc = useQueryClient();
  const [draft, setDraft] = useState(blank);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["edu-content"] });

  const save = useMutation({
    mutationFn: async (row: Partial<EduContent> & { id?: string }) => {
      const { error } = row.id
        ? await supabase.from("educational_content").update(row).eq("id", row.id)
        : await supabase.from("educational_content").insert(row as EduContent);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Content saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("educational_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    },
  });

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Add educational article</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat">Category</Label>
            <Input
              id="cat"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-en">Title (English)</Label>
            <Input
              id="t-en"
              value={draft.title_en}
              onChange={(e) => setDraft({ ...draft, title_en: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-ur">Title (Urdu)</Label>
            <Input
              id="t-ur"
              dir="rtl"
              className="font-urdu"
              value={draft.title_ur}
              onChange={(e) => setDraft({ ...draft, title_ur: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-en">Body (English)</Label>
            <Textarea
              id="b-en"
              value={draft.body_en}
              onChange={(e) => setDraft({ ...draft, body_en: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-ur">Body (Urdu)</Label>
            <Textarea
              id="b-ur"
              dir="rtl"
              className="font-urdu"
              value={draft.body_ur}
              onChange={(e) => setDraft({ ...draft, body_ur: e.target.value })}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            if (!draft.slug || !draft.title_en || !draft.body_en) {
              toast.error("Slug, English title and body are required");
              return;
            }
            save.mutate({ ...draft, sort_order: (items?.length ?? 0) + 1 });
            setDraft(blank);
          }}
        >
          <Plus className="size-4" aria-hidden /> Add article
        </Button>
      </section>

      {(items ?? []).map((item) => (
        <ContentRow
          key={item.id}
          item={item}
          onSave={(row) => save.mutate(row)}
          onDelete={() => remove.mutate(item.id)}
        />
      ))}
    </div>
  );
}

function ContentRow({
  item,
  onSave,
  onDelete,
}: {
  item: EduContent;
  onSave: (row: Partial<EduContent> & { id: string }) => void;
  onDelete: () => void;
}) {
  const [row, setRow] = useState(item);
  return (
    <section className="space-y-3 rounded-xl border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground">
        /{row.slug} · {row.category}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label="Title English"
          value={row.title_en}
          onChange={(e) => setRow({ ...row, title_en: e.target.value })}
        />
        <Input
          aria-label="Title Urdu"
          dir="rtl"
          className="font-urdu"
          value={row.title_ur}
          onChange={(e) => setRow({ ...row, title_ur: e.target.value })}
        />
        <Textarea
          aria-label="Body English"
          value={row.body_en}
          onChange={(e) => setRow({ ...row, body_en: e.target.value })}
        />
        <Textarea
          aria-label="Body Urdu"
          dir="rtl"
          className="font-urdu"
          value={row.body_ur}
          onChange={(e) => setRow({ ...row, body_ur: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id={`cpub-${row.id}`}
            checked={row.published}
            onCheckedChange={(v) => setRow({ ...row, published: v })}
          />
          <Label htmlFor={`cpub-${row.id}`}>Published</Label>
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
