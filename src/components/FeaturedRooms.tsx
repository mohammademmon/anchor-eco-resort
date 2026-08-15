import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";

// view_type values that have a translated label; anything else falls back to
// the raw value so a new type added in the CMS still renders sensibly.
const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

export async function FeaturedRooms({
  rooms,
  locale,
}: {
  rooms: Room[];
  locale: string;
}) {
  const t = await getTranslations("Home.featuredRooms");
  const tc = await getTranslations("Common");
  const tr = await getTranslations("Rooms");

  if (!rooms.length) return null;

  return (
    <section
      id="featured-rooms"
      aria-label={t("title")}
      className="bg-paper py-24 md:py-32 lg:py-40"
    >
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            intro={t("intro")}
          />
        </Reveal>

        {/* 2-up from tablet up. With four room types a 3-up desktop grid would
            strand one card alone on a second row; 2×2 stays balanced and lets
            the photography run larger. */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:gap-8">
          {rooms.map((room, i) => (
            <li key={room.id} className="h-full">
              <Reveal delay={Math.min(i, 3) * 0.09} className="h-full">
                <RoomCard
                  className="h-full"
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
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-14 lg:mt-20">
            <Link
              href="/rooms"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-7 text-body font-medium text-ink transition-[background-color,border-color,transform] duration-[250ms] hover:-translate-y-px hover:border-ink-soft hover:bg-paper-raised active:translate-y-0"
            >
              {t("viewAll")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
