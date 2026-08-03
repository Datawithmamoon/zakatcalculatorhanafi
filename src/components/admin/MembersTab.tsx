import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShieldCheck, ShieldMinus } from "lucide-react";
import { listMembers, setMemberRole } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MembersTab() {
  const fetchMembers = useServerFn(listMembers);
  const changeRole = useServerFn(setMemberRole);
  const qc = useQueryClient();

  const members = useQuery({ queryKey: ["members"], queryFn: () => fetchMembers() });

  const mutate = useMutation({
    mutationFn: (vars: { userId: string; role: "admin" | "moderator" | "user"; grant: boolean }) =>
      changeRole({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      toast.success("Roles updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 font-semibold">Members &amp; roles</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(members.data ?? []).map((m) => {
              const isAdmin = m.roles.includes("admin");
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.roles.join(", ") || "user"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={isAdmin ? "ghost" : "outline"}
                      onClick={() => mutate.mutate({ userId: m.id, role: "admin", grant: !isAdmin })}
                    >
                      {isAdmin ? (
                        <>
                          <ShieldMinus className="size-4" aria-hidden /> Revoke admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-4" aria-hidden /> Make admin
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
