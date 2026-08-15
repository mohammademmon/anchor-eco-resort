import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedRooms, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return { title: t("rooms.title"), description: t("rooms.description") };
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tr = await getTranslations("Rooms");
  const tc = await getTranslations("Common");
  const rooms = await safe(getPublishedRooms, []);

  return (
    <section className="bg-paper py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeader
            as="h1"
            size="h1"
            eyebrow={tr("header.eyebrow")}
            title={tr("header.title")}
            intro={tr("header.intro")}
          />
        </Reveal>

        <ul className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:gap-y-8">
          {rooms.map((room, i) => {
            const wide = i % 4 === 0 || i % 4 === 3;
            return (
            <li
              key={room.id}
              className={cn(
                "flex",
                wide ? "lg:col-span-7" : "lg:col-span-5",
                i % 2 === 1 && "lg:mt-24",
              )}
            >
              <Reveal delay={Math.min(i, 3) * 0.09} className="flex w-full">
                <RoomCard
                  className="w-full"
                  aspect={wide ? "aspect-[4/3]" : "aspect-[4/5]"}
                  cta={tc("viewDetails")}
                  slug={room.slug}
                  name={loc(room.nameEn, room.nameBn, locale)}
                  view={
                    room.view && KNOWN_VIEWS.has(room.view)
                      ? tr(`views.${room.view}`)
                      : room.view || undefined
                  }
                  short={
                    loc(room.shortEn, room.shortBn, locale) ||
                    loc(room.descriptionEn, room.descriptionBn, locale)
                  }
                  price={
                    room.weekdayRate
                      ? tc("fromPrice", { price: taka(room.weekdayRate) })
                      : undefined
                  }
                  image={room.images?.[0]}
                />
              </Reveal>
            </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
