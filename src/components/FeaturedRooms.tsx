import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { RoomBand } from "@/components/RoomBand";

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Rooms as a run of full-bleed cinematic bands (the direction chosen for the
 * $50k+ feel): a light header on paper, then each room edge-to-edge with the
 * type overlaid, alternating side to side. Bets on scale and photography.
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
    <section id="featured-rooms" aria-label={t("title")} className="bg-paper">
      <Container className="py-24 md:py-32 lg:pb-20 lg:pt-40">
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            intro={t("intro")}
            size="h1"
          />
        </Reveal>
      </Container>

      <div className="flex flex-col">
        {rooms.map((room, i) => (
          <RoomBand
            key={room.id}
            index={i + 1}
            align={i % 2 === 1 ? "right" : "left"}
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
        ))}
      </div>

      <Container className="py-16 lg:py-24">
        <Reveal>
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
        </Reveal>
      </Container>
    </section>
  );
}
