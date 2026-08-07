import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Bootstraps the very first administrator.
 *
 * Security: the claim is NOT first-come-first-served. The caller must present
 * the one-time setup token (server secret ADMIN_SETUP_TOKEN), or sign in with
 * the pre-configured owner email (ADMIN_OWNER_EMAIL), so a random visitor who
 * finds the deployment before the owner cannot seize permanent control.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().max(200).optional() }).parse(data ?? {}))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const setupToken = process.env["ADMIN_SETUP_TOKEN"] ?? "";
    const ownerEmail = (process.env["ADMIN_OWNER_EMAIL"] ?? "").trim().toLowerCase();
    const callerEmail = String(
      (context.claims as { email?: string } | undefined)?.email ?? "",
    )
      .trim()
      .toLowerCase();

    const supplied = (data.token ?? "").trim();
    const tokenOk =
      setupToken.length > 0 &&
      supplied.length === setupToken.length &&
      // constant-time-ish compare
      supplied.split("").reduce((acc, ch, i) => acc | (ch.charCodeAt(0) ^ setupToken.charCodeAt(i)), 0) === 0;
    const ownerOk = ownerEmail.length > 0 && callerEmail === ownerEmail;

    if (!tokenOk && !ownerOk) {
      return { granted: false as const, reason: "unauthorized" as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw error;
    if ((count ?? 0) > 0) return { granted: false as const, reason: "admin_exists" as const };

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertError) throw insertError;
    return { granted: true as const, reason: null };
  });

/** Admin-only: list accounts and their roles. */
export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,email,display_name,created_at"),
      supabaseAdmin.from("user_roles").select("user_id,role"),
    ]);
    return (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
    }));
  });

/** Admin-only: grant or revoke a role for a user. */
export const setMemberRole = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "moderator", "user"]),
        grant: z.boolean(),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("@/lib/admin.server");
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId && data.role === "admin" && !data.grant) {
      throw new Error("You cannot remove your own admin role");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw error;
    }
    return { ok: true };
  });
