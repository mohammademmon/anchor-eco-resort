import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { RoomCard } from "@/components/RoomCard";

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Rooms as an index, not a showcase. A two-column split on desktop: the header
 * plus one large atmospheric photograph on the left (which carries the visual
 * weight), a typographic list of rooms on the right (which carries the detail).
 * Keeps the section confident without leaning on per-room snapshots that can't
 * take the scale.
 */
export async function FeaturedRooms({
  rooms,
  locale,
  heroImage,
}: {
  rooms: Room[];
  locale: string;
  heroImage?: string | null;
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
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left rail: header + anchoring image */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                intro={t("intro")}
                size="h1"
              />
            </Reveal>

            {heroImage ? (
              <Reveal delay={0.1}>
                <div className="relative mt-10 aspect-[5/4] overflow-hidden rounded-2xl shadow-soft">
                  <Image
                    src={heroImage}
                    alt={t("imageAlt")}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.15}>
              <Link
                href="/rooms"
                className="group mt-10 inline-flex min-h-11 items-center gap-2 text-body font-medium text-forest transition-colors duration-[250ms] hover:text-forest-600"
              >
                {t("viewAll")}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[250ms] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Right rail: the room index */}
          <div className="lg:col-span-8">
            <ul className="border-b border-line">
              {rooms.map((room, i) => (
                <li key={room.id}>
                  <Reveal delay={Math.min(i, 4) * 0.08}>
                    <RoomCard
                      index={i + 1}
                      slug={room.slug}
                      name={loc(room.nameEn, room.nameBn, locale)}
                      view={
                        room.view && KNOWN_VIEWS.has(room.view)
                          ? tr(`views.${room.view}`)
                          : room.view || undefined
                      }
                      showShort={false}
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
          </div>
        </div>
      </Container>
    </section>
  );
}
