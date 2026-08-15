"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/content";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  );
}

/**
 * The primary conversion CTA. Never hidden:
 * - `nav`      compact pill inside the navbar (desktop)
 * - `floating` sticky pill bottom-right (mobile)
 * - `hero`     large CTA beside the hero's primary button
 */
export function WhatsAppButton({
  variant = "nav",
  number,
  onDark = false,
  className,
}: {
  variant?: "nav" | "floating" | "hero";
  number?: string | null;
  /** Rendered over dark photography — invert to a cream fill so the primary
   *  conversion CTA stays unmistakable (design system §7, §11). */
  onDark?: boolean;
  className?: string;
}) {
  const t = useTranslations("WhatsApp");
  const href = `https://wa.me/${number || WHATSAPP_NUMBER}`;

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,transform,box-shadow] duration-[250ms] hover:-translate-y-px active:translate-y-0",
    onDark
      ? "bg-paper text-forest shadow-soft hover:bg-paper-raised"
      : "bg-forest text-paper hover:bg-forest-600",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("aria")}
      className={cn(
        base,
        variant === "nav" && "min-h-10 px-4 text-small",
        variant === "floating" &&
          "fixed bottom-5 right-5 z-50 min-h-12 px-5 text-small shadow-lift lg:hidden",
        variant === "hero" && "min-h-12 px-7 text-body",
        className,
      )}
    >
      <WhatsAppIcon className="size-[1.15em] shrink-0" />
      <span>{t("label")}</span>
    </a>
  );
}
