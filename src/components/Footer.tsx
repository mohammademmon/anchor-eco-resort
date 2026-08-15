import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/content";
import { Container } from "@/components/Container";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-paper-raised">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        {/* Contact block (placeholder) */}
        <section aria-label={t("contactHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">
            {tc("resortName")}
          </h2>
          <p className="text-sm text-ink-soft">{t("tagline")}</p>
          <dl className="mt-4 space-y-1 text-sm text-ink-soft">
            <div>
              <dt className="inline font-medium text-ink">{t("phoneLabel")}: </dt>
              <dd className="inline">{t("phone1")} · {t("phone2")}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-ink">{t("addressLabel")}: </dt>
              <dd className="inline">{t("address")}</dd>
            </div>
          </dl>
        </section>

        {/* Nav links */}
        <nav aria-label={t("linksHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">
            {t("linksHeading")}
          </h2>
          <ul className="space-y-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-soft hover:text-ink"
                >
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

        {/* Socials (placeholder) */}
        <section aria-label={t("socialHeading")}>
          <h2 className="mb-3 font-display text-lg text-ink">
            {t("socialHeading")}
          </h2>
          <ul className="space-y-1 text-sm text-ink-soft">
            <li>{t("socialFacebook")}</li>
            <li>{t("socialInstagram")}</li>
            <li>{t("socialYoutube")}</li>
          </ul>
        </section>
      </Container>

      <div className="border-t border-line py-6">
        <Container>
          <p className="text-center text-xs text-ink-soft">
            © {year} {tc("resortName")}. {t("rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
