import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client — Client Components (auth sign-in, image upload).
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
