import { getTranslations, setRequestLocale } from "next-intl/server";
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

  return (
    <>
      {/* Header */}
      <PageSection label={t("header.title")}>
        <SectionHeader
          as="h1"
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          intro={t("header.intro")}
        />
      </PageSection>

      {/* Info + Map */}
      <PageSection label={t("infoHeading")}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-xl text-ink">{t("infoHeading")}</h2>
            <dl className="space-y-2 text-ink-soft">
              <div>
                <dt className="inline font-medium text-ink">{t("phoneLabel")}: </dt>
                <dd className="inline">{t("phone")}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink">{t("emailLabel")}: </dt>
                <dd className="inline">{t("email")}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink">{t("addressLabel")}: </dt>
                <dd className="inline">{t("address")}</dd>
              </div>
            </dl>
          </div>
          <Placeholder label={t("mapLabel")} aspect="aspect-[4/3]" />
        </div>
      </PageSection>

      {/* Inquiry form */}
      <PageSection label={t("form.heading")} className="border-b-0">
        <h2 className="mb-6 font-display text-xl text-ink">{t("form.heading")}</h2>
        <ContactForm />
      </PageSection>
    </>
  );
}
