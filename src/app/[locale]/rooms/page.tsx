import { getTranslations, setRequestLocale } from "next-intl/server";
import { ROOM_SLUGS } from "@/lib/content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { RoomCard } from "@/components/RoomCard";

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tr = await getTranslations("Rooms");
  const tc = await getTranslations("Common");

  return (
    <PageSection label={tr("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={tr("header.eyebrow")}
        title={tr("header.title")}
        intro={tr("header.intro")}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {ROOM_SLUGS.map((slug) => (
          <RoomCard
            key={slug}
            slug={slug}
            name={tr(`items.${slug}.name`)}
            view={tr(`items.${slug}.view`)}
            blurb={tr(`items.${slug}.blurb`)}
            price={tr(`items.${slug}.price`)}
            imageLabel={tc("imageLabel")}
            viewDetails={tc("viewDetails")}
          />
        ))}
      </div>
    </PageSection>
  );
}
