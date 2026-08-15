import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/content";
import { loc } from "@/lib/i18n-content";
import type { SiteSettings } from "@/lib/db/schema";
import { Container } from "@/components/Container";

export async function Footer({ settings }: { settings: SiteSettings | null }) {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const locale = await getLocale();

  const brand = settings?.brand || tc("resortName");
  const tagline = loc(settings?.taglineEn, settings?.taglineBn, locale) || t("tagline");
  const address = loc(settings?.addressEn, settings?.addressBn, locale) || t("address");
  const phones = [settings?.phone1, settings?.phone2, settings?.phone3].filter(
    (p): p is string => !!p && p.length > 0,
  );
  const year = new Date().getFullYear();

  const socials = [
    { href: settings?.facebook, label: "Facebook" },
    { href: settings?.instagram, label: "Instagram" },
    { href: settings?.youtube, label: "YouTube" },
  ].filter((s) => s.href && s.href.length > 0);

  return (
    <footer className="mt-auto border-t border-line bg-paper-raised">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        <section aria-label={t("contactHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">{brand}</h2>
          <p className="text-sm text-ink-soft">{tagline}</p>
          <dl className="mt-4 space-y-1 text-sm text-ink-soft">
            <div>
              <dt className="inline font-medium text-ink">{t("phoneLabel")}: </dt>
              <dd className="inline">
                {phones.length ? phones.join(" · ") : `${t("phone1")} · ${t("phone2")}`}
              </dd>
            </div>
            {settings?.email ? (
              <div>
                <dt className="inline font-medium text-ink">Email: </dt>
                <dd className="inline">{settings.email}</dd>
              </div>
            ) : null}
            <div>
              <dt className="inline font-medium text-ink">{t("addressLabel")}: </dt>
              <dd className="inline">{address}</dd>
            </div>
          </dl>
        </section>

        <nav aria-label={t("linksHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">{t("linksHeading")}</h2>
          <ul className="space-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-soft hover:text-ink">
                  {tn(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="text-ink-soft hover:text-ink">
                {tn("admin")}
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-label={t("socialHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">{t("socialHeading")}</h2>
          <ul className="space-y-1 text-sm text-ink-soft">
            {socials.length ? (
              socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li>{t("socialFacebook")}</li>
                <li>{t("socialInstagram")}</li>
                <li>{t("socialYoutube")}</li>
              </>
            )}
          </ul>
        </section>
      </Container>

      <div className="border-t border-line py-6">
        <Container>
          <p className="text-center text-xs text-ink-soft">
            © {year} {brand}. {t("rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
