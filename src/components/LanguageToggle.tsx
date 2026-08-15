"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  en: "EN",
  bn: "বাংলা",
};

// EN/BN pill toggle. `light` = rendered over the hero photography.
export function LanguageToggle({
  light = false,
  size = "sm",
  className,
}: {
  light?: boolean;
  size?: "sm" | "lg";
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 transition-colors duration-[250ms]",
        light ? "border-on-night/30 bg-night/20" : "border-line bg-paper-raised",
        className,
      )}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn(
              // 44px touch target on phones; compact for pointer devices (§10)
              "rounded-full px-3 text-small font-medium transition-colors duration-[250ms]",
              size === "lg" ? "min-h-11" : "min-h-11 lg:min-h-9",
              active
                ? light
                  ? "bg-on-night text-night"
                  : "bg-forest text-paper"
                : light
                  ? "text-on-night/80 hover:text-on-night"
                  : "text-ink-soft hover:text-ink",
            )}
          >
            {LABELS[l] ?? l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
