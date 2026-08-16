import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  WavesLadder,
  UtensilsCrossed,
  Wifi,
  Flower2,
  Umbrella,
  TreePalm,
  Wine,
  Droplets,
  Sparkles,
} from "lucide-react";
import { loc } from "@/lib/i18n-content";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

const POOL_IMAGE = "/images/generated/pool-golden-hour.png";

/**
 * English amenity name → lucide icon. The DB `icon` column is empty, so the
 * mapping lives here keyed on the stable English name; anything unmapped falls
 * back to a neutral mark so the grid never breaks. One consistent size (24) and
 * stroke (1.5) across all eight — icon consistency is a $50k tell (design
 * system §11).
 */
const ICONS: Record<string, typeof Sparkles> = {
  "Infinity Pool": WavesLadder,
  "Ocean Kitchen Restaurant": UtensilsCrossed,
  "Free Wi-Fi": Wifi,
  Spa: Flower2,
  "Beachfront Access": Umbrella,
  "Landscaped Gardens": TreePalm,
  "Welcome Drinks": Wine,
  "Bottled Water": Droplets,
};

type AmenityItem = {
  id: string;
  nameEn: string;
  nameBn: string | null;
  noteEn: string | null;
  noteBn: string | null;
};

/**
 * Amenities as a calm, warm editorial split (design system §4 whitespace, §8
 * imagery): a tall golden-hour pool photo held on one side, the eight amenities
 * as an airy two-column list on the other — no cards, no heavy borders, just
 * whitespace and a single moss icon per item. Sits on a lighter paper-raised
 * band framed by hairlines so it reads as a distinct, restful beat after the
 * dark hero / eco-story / room bands above.
 */
export async function Amenities({
  amenities,
  locale,
}: {
  amenities: AmenityItem[];
  locale: string;
}) {
  const t = await getTranslations("Home.amenities");
  if (!amenities.length) return null;

  return (
    <section
      id="amenities"
      aria-label={t("title")}
      className="border-y border-line bg-paper-raised"
    >
      <Container className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-16">
          {/* Editorial image — sticky on desktop so it holds while the list scrolls */}
          <Reveal className="lg:col-span-5">
            <figure className="lg:sticky lg:top-28">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft lg:aspect-[4/5]">
                <Image
                  src={POOL_IMAGE}
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent"
                />
                <figcaption className="text-on-photo absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 text-small text-on-night">
                  <span aria-hidden="true" className="h-px w-8 bg-gold" />
                  {t("imageCaption")}
                </figcaption>
              </div>
            </figure>
          </Reveal>

          {/* Header + amenity grid */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                intro={t("intro")}
              />
            </Reveal>

            <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-14 md:gap-x-12">
              {amenities.map((a, i) => {
                const Icon = ICONS[a.nameEn] ?? Sparkles;
                const note = loc(a.noteEn, a.noteBn, locale);
                return (
                  <li key={a.id}>
                    <Reveal delay={Math.min(i * 0.06, 0.3)}>
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-6 text-moss"
                      />
                      <h3 className="mt-4 font-display text-body-lg text-ink">
                        {loc(a.nameEn, a.nameBn, locale)}
                      </h3>
                      {note ? (
                        <p className="mt-1.5 text-small text-ink-soft">{note}</p>
                      ) : null}
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
