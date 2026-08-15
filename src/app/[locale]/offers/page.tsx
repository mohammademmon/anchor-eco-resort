import { getTranslations, setRequestLocale } from "next-intl/server";
import { OFFER_IDS } from "@/lib/content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { OfferCard } from "@/components/OfferCard";

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const to = await getTranslations("Offers");
  const tc = await getTranslations("Common");

  return (
    <PageSection label={to("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={to("header.eyebrow")}
        title={to("header.title")}
        intro={to("header.intro")}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {OFFER_IDS.map((id) => (
          <OfferCard
            key={id}
            title={to(`items.${id}.title`)}
            badge={to(`items.${id}.badge`)}
            blurb={to(`items.${id}.blurb`)}
            price={to(`items.${id}.price`)}
            imageLabel={tc("imageLabel")}
            cta={tc("learnMore")}
          />
        ))}
      </div>
    </PageSection>
  );
}
