import { createSupabaseServerClient } from "@/lib/supabase/server";

// Returns the current user + whether they are an admin (via the RLS-protected
// admins table — the row is only visible to admins through is_admin()).
export async function getAdminContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isAdmin: false as const };

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: !!data };
}

// Guard for admin server actions (defense-in-depth beyond the proxy).
export async function requireAdmin() {
  const ctx = await getAdminContext();
  if (!ctx.user || !ctx.isAdmin) {
    throw new Error("Unauthorized");
  }
  return ctx;
}
