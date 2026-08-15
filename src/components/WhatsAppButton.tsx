import { getTranslations } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/content";

// The primary CTA. Rendered inline in the navbar and fixed bottom-right site-wide.
// (Placeholder styling only — Phase 3 gives it the eco-luxe treatment.)
export async function WhatsAppButton({
  variant = "inline",
}: {
  variant?: "inline" | "floating";
}) {
  const t = await getTranslations("WhatsApp");

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("aria")}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-forest-600",
        variant === "floating" &&
          "fixed bottom-5 right-5 z-50 px-5 py-3 shadow-lg",
      )}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      <span>{t("label")}</span>
    </a>
  );
}
