import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedOffers, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
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

  const offers = await safe(getPublishedOffers, []);

  return (
    <PageSection label={to("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={to("header.eyebrow")}
        title={to("header.title")}
        intro={to("header.intro")}
      />
      {offers.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {offers.map((o) => (
            <OfferCard
              key={o.id}
              title={loc(o.titleEn, o.titleBn, locale)}
              badge={loc(o.badgeEn, o.badgeBn, locale)}
              blurb={loc(o.descriptionEn, o.descriptionBn, locale)}
              price={o.price ?? ""}
              image={o.image}
              imageLabel={tc("imageLabel")}
              cta={tc("learnMore")}
            />
          ))}
        </div>
      ) : (
        <p className="text-ink-soft">{to("header.intro")}</p>
      )}
    </PageSection>
  );
}
