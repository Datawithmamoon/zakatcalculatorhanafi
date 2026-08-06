import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Verifies the caller holds the admin role using their own (RLS-scoped) client.
 * The role check runs against the user_roles table directly; the internal
 * has_role helper is no longer exposed through the public API schema.
 */
export async function assertAdmin(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Forbidden");
  if (!data) throw new Error("Forbidden");
}
