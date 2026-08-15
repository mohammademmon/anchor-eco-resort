import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedRooms, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { roomPrice } from "@/lib/format";
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
  const perNight = tc("perNight");

  const rooms = await safe(getPublishedRooms, []);

  return (
    <PageSection label={tr("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={tr("header.eyebrow")}
        title={tr("header.title")}
        intro={tr("header.intro")}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {rooms.map((r) => (
          <RoomCard
            key={r.id}
            slug={r.slug}
            name={loc(r.nameEn, r.nameBn, locale)}
            view={r.view}
            blurb={loc(r.descriptionEn, r.descriptionBn, locale)}
            price={roomPrice(r.weekdayRate, r.weekendRate, perNight)}
            image={r.images?.[0]}
            imageLabel={tc("imageLabel")}
            viewDetails={tc("viewDetails")}
          />
        ))}
      </div>
    </PageSection>
  );
}
