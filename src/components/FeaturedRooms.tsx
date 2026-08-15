import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Rooms as an editorial collection rather than a uniform card grid: spans
 * alternate 7/5 across a 12-column field and every second card drops down a
 * step, so the page reads as a magazine spread instead of a product listing.
 * The wide slot takes a landscape crop, the narrow slot a portrait one.
 */
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
            size="h1"
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
                  // every second card steps down — the stagger that keeps the
                  // spread from reading as a grid
                  i % 2 === 1 && "lg:mt-24",
                )}
              >
                <Reveal delay={Math.min(i, 3) * 0.09} className="flex w-full">
                  <RoomCard
                    className="w-full"
                    aspect={wide ? "aspect-[4/3]" : "aspect-[4/5]"}
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
                    cta={tc("viewDetails")}
                    image={room.images?.[0]}
                  />
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-20 border-t border-line pt-10 lg:mt-28">
            <Link
              href="/rooms"
              className="group inline-flex min-h-12 items-center gap-2 font-display text-h3 text-ink transition-colors duration-[250ms] hover:text-forest"
            >
              {t("viewAll")}
              <span
                aria-hidden="true"
                className="transition-transform duration-[250ms] group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
