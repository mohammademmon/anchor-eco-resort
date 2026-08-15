import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { BookingForm } from "@/components/BookingForm";

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Book");

  return (
    <PageSection label={t("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        intro={t("header.intro")}
      />
      <BookingForm />
    </PageSection>
  );
}
