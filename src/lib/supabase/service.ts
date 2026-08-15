import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client — bypasses RLS. SERVER ONLY.
// Used for privileged operations such as creating the admin user.
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
