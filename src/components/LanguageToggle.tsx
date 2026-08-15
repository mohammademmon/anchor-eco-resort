"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const LABELS: Record<string, string> = {
  en: "EN",
  bn: "বাংলা",
};

// Working EN/BN toggle — preserves the current pathname across locales.
export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <Button
            key={l}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: l })}
          >
            {LABELS[l] ?? l.toUpperCase()}
          </Button>
        );
      })}
    </div>
  );
}
