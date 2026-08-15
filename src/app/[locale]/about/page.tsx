import { getTranslations, setRequestLocale } from "next-intl/server";
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

  return (
    <>
      {/* Intro */}
      <PageSection label={t("header.title")}>
        <SectionHeader
          as="h1"
          eyebrow={t("header.eyebrow")}
          title={t("header.title")}
          intro={t("header.intro")}
        />
        <Placeholder label={tc("imageLabel")} aspect="aspect-[21/9]" />
      </PageSection>

      {/* Our Story */}
      <PageSection label={t("story.title")}>
        <SectionHeader eyebrow={t("story.eyebrow")} title={t("story.title")} />
        <p className="max-w-[65ch] text-ink-soft">{t("story.body")}</p>
      </PageSection>

      {/* Eco Commitment */}
      <PageSection label={t("eco.title")}>
        <SectionHeader eyebrow={t("eco.eyebrow")} title={t("eco.title")} />
        <p className="max-w-[65ch] text-ink-soft">{t("eco.body")}</p>
      </PageSection>

      {/* The Experience */}
      <PageSection label={t("experience.title")} className="border-b-0">
        <SectionHeader eyebrow={t("experience.eyebrow")} title={t("experience.title")} />
        <p className="max-w-[65ch] text-ink-soft">{t("experience.body")}</p>
      </PageSection>
    </>
  );
}
