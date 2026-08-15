import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/content";
import type { SiteSettings } from "@/lib/db/schema";
import { Container } from "@/components/Container";
import { LanguageToggle } from "@/components/LanguageToggle";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export async function Navbar({ settings }: { settings: SiteSettings | null }) {
  const t = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const brand = settings?.brand || tc("resortName");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link href="/" className="font-display text-lg text-ink">
          {brand}
        </Link>

        <nav aria-label="Primary" className="flex-1">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-soft transition-colors hover:text-ink"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <WhatsAppButton variant="inline" number={settings?.whatsapp} />
        </div>
      </Container>
    </header>
  );
}
