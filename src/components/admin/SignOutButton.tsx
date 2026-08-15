"use client";

import { useRouter } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await createSupabaseBrowserClient().auth.signOut();
        router.push("/admin");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
