import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Homepage art-direction for the featured teaser (design system §8). The section
 * leads with one room as a large cinematic feature, then lists the rest as a
 * numbered editorial index. This map keeps weak interior snapshots out of the
 * big feature and gives every row a strong, on-message image:
 *   - the signature sea-view room fronts the open Bay of Bengal (lifestyle),
 *   - the second sea-view room borrows the atmospheric balcony shot,
 *   - the hill room (no photo of its own) gets a fitting greenery image.
 * Anything not listed falls back to the room's own first image.
 */
const FEATURE_SLUG = "super-deluxe-sea-view";
const CURATED_IMAGE: Record<string, string> = {
  "super-deluxe-sea-view": "/images/generated/beach-detail.png",
  "premium-deluxe-sea-view":
    "https://njhepvltaloyefkxvuuz.supabase.co/storage/v1/object/public/media/content/room-balcony-seaview-01.png",
  "super-deluxe-hill-side": "/images/generated/nature-leaves-pool.png",
};

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

  const feature = rooms.find((r) => r.slug === FEATURE_SLUG) ?? rooms[0];
  const rest = rooms
    .filter((r) => r.id !== feature.id)
    .sort((a, b) => (b.weekdayRate ?? 0) - (a.weekdayRate ?? 0));

  const imageFor = (r: Room) => CURATED_IMAGE[r.slug] ?? r.images?.[0] ?? null;
  const viewLabel = (r: Room) =>
    r.view && KNOWN_VIEWS.has(r.view) ? tr(`views.${r.view}`) : r.view || undefined;
  const priceOf = (r: Room) =>
    r.weekdayRate ? tc("fromPrice", { price: taka(r.weekdayRate) }) : undefined;
  const shortOf = (r: Room) =>
    loc(r.shortEn, r.shortBn, locale) ||
    loc(r.descriptionEn, r.descriptionBn, locale);

  const featureImg = imageFor(feature);

  return (
    <section id="featured-rooms" aria-label={t("title")} className="bg-paper">
      <Container className="pb-16 pt-24 md:pt-32 lg:pb-20 lg:pt-40">
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            intro={t("intro")}
            size="h1"
          />
        </Reveal>
      </Container>

      {/* FEATURE — the signature room. The photograph bleeds off the left edge of
          the viewport; the copy sits in the right container gutter. */}
      <div className="grid items-stretch lg:grid-cols-[54vw_1fr]">
        <div className="relative order-1 min-h-[52vh] overflow-hidden bg-night lg:min-h-[78vh]">
          {featureImg ? (
            <Image
              src={featureImg}
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="order-2 flex flex-col justify-center px-6 py-14 md:px-10 md:py-20 lg:py-24 lg:pl-16 lg:pr-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]">
          <Reveal>
            <p className="flex items-center gap-3 text-eyebrow font-medium uppercase text-moss">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {t("featuredLabel")}
            </p>
            <h3 className="mt-5 font-display text-display text-ink">
              <Link
                href={`/rooms/${feature.slug}`}
                className="outline-none transition-colors duration-[250ms] hover:text-forest focus-visible:text-forest"
              >
                {loc(feature.nameEn, feature.nameBn, locale)}
              </Link>
            </h3>
            {shortOf(feature) ? (
              <p className="mt-5 max-w-[44ch] text-body-lg text-ink-soft">
                {shortOf(feature)}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              {viewLabel(feature) ? (
                <span className="text-small uppercase tracking-wide text-ink-soft">
                  {viewLabel(feature)}
                </span>
              ) : null}
              {priceOf(feature) ? (
                <span className="font-display text-h3 text-ink">
                  {priceOf(feature)}
                </span>
              ) : null}
            </div>
            <Link
              href={`/rooms/${feature.slug}`}
              className="group mt-9 inline-flex min-h-12 items-center gap-2 text-small font-medium uppercase tracking-wide text-forest"
            >
              {tc("viewDetails")}
              <span
                aria-hidden="true"
                className="transition-transform duration-[250ms] group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* INDEX — the remaining rooms as a numbered editorial list. Whole row is
          the link; only the name is a tab stop (stretched-link). */}
      <Container className="pb-8 pt-20 lg:pt-28">
        <Reveal>
          <p className="text-eyebrow font-medium uppercase tracking-wide text-moss">
            {t("moreLabel")}
          </p>
        </Reveal>
        <ul className="mt-6">
          {rest.map((r, i) => {
            const img = imageFor(r);
            return (
              <li key={r.id}>
                <Reveal delay={Math.min(i * 0.06, 0.24)}>
                  <div className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-t border-line py-7 transition-colors duration-[250ms] hover:bg-sand/40 md:gap-x-8 md:py-9 has-[a:focus-visible]:bg-sand/40">
                    <span className="text-small font-medium tabular-nums text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-h3 text-ink md:text-h2">
                        <Link
                          href={`/rooms/${r.slug}`}
                          className="outline-none after:absolute after:inset-0 group-hover:text-forest"
                        >
                          {loc(r.nameEn, r.nameBn, locale)}
                        </Link>
                      </h3>
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-soft">
                        {viewLabel(r) ? <span>{viewLabel(r)}</span> : null}
                        {viewLabel(r) && priceOf(r) ? (
                          <span aria-hidden="true" className="text-line">
                            ·
                          </span>
                        ) : null}
                        {priceOf(r) ? (
                          <span className="whitespace-nowrap">{priceOf(r)}</span>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 md:gap-8">
                      <div className="relative hidden aspect-[4/3] w-28 shrink-0 overflow-hidden bg-night sm:block md:w-36">
                        {img ? (
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 144px, 112px"
                            className="object-cover transition-transform duration-[500ms] ease-out group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <span
                        aria-hidden="true"
                        className="hidden text-h3 text-forest transition-transform duration-[250ms] group-hover:translate-x-1 lg:block"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line" />

        <Reveal>
          <Link
            href="/rooms"
            className="group mt-10 inline-flex min-h-12 items-center gap-2 font-display text-h3 text-ink transition-colors duration-[250ms] hover:text-forest"
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
