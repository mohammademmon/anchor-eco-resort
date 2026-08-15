"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const LABELS: Record<string, string> = {
  en: "EN",
  bn: "বাংলা",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language">
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
