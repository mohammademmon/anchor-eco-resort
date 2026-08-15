import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSettings, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const tc = await getTranslations("Common");
  const settings = await safe(getSettings, null);
  const about = loc(settings?.aboutEn, settings?.aboutBn, locale);

  return (
    <>
      <PageSection label={t("header.title")}>
        <SectionHeader
          as="h1"
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          intro={loc(settings?.taglineEn, settings?.taglineBn, locale) || t("header.intro")}
        />
        {settings?.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.heroImage}
            alt={settings?.brand ?? ""}
            className="aspect-[21/9] w-full rounded-2xl object-cover"
          />
        ) : (
          <Placeholder label={tc("imageLabel")} aspect="aspect-[21/9]" />
        )}
      </PageSection>

      <PageSection label={t("story.title")} className="border-b-0">
        <SectionHeader eyebrow={t("story.eyebrow")} title={t("story.title")} />
        <p className="max-w-[65ch] whitespace-pre-line text-ink-soft">
          {about || t("story.body")}
        </p>
      </PageSection>
    </>
  );
}
