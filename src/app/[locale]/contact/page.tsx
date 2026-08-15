import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSettings, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";
import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const settings = await safe(getSettings, null);

  const phones = [settings?.phone1, settings?.phone2, settings?.phone3]
    .filter((p): p is string => !!p && p.length > 0)
    .join(" · ");
  const address = loc(settings?.addressEn, settings?.addressBn, locale) || t("address");

  return (
    <>
      <PageSection label={t("header.title")}>
        <SectionHeader
          as="h1"
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          intro={t("header.intro")}
        />
      </PageSection>

      <PageSection label={t("infoHeading")}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-xl text-ink">{t("infoHeading")}</h2>
            <dl className="space-y-2 text-ink-soft">
              <div>
                <dt className="inline font-medium text-ink">{t("phoneLabel")}: </dt>
                <dd className="inline">{phones || t("phone")}</dd>
              </div>
              {settings?.email ? (
                <div>
                  <dt className="inline font-medium text-ink">{t("emailLabel")}: </dt>
                  <dd className="inline">{settings.email}</dd>
                </div>
              ) : null}
              <div>
                <dt className="inline font-medium text-ink">{t("addressLabel")}: </dt>
                <dd className="inline">{address}</dd>
              </div>
            </dl>
          </div>
          <Placeholder label={t("mapLabel")} aspect="aspect-[4/3]" />
        </div>
      </PageSection>

      <PageSection label={t("form.heading")} className="border-b-0">
        <h2 className="mb-6 font-display text-xl text-ink">{t("form.heading")}</h2>
        <ContactForm />
      </PageSection>
    </>
  );
}
