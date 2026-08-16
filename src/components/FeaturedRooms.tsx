"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "@/i18n/navigation";
import type { Room } from "@/lib/db/schema";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

const IMAGE = "/images/generated/beach-detail.png";
const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Featured rooms as a full-bleed cinematic band — the immersive language the
 * client approved for the amenities section (§2 night palette, §8 imagery).
 * One beautiful seaside photograph runs edge-to-edge with a slow parallax and a
 * forest-night scrim; an oversized headline sits up top, and the rooms read as
 * a numbered index overlaid at the foot — cream type, gold numerals and
 * hairlines. Each room is a link (stretched-link). The photograph carries the
 * mood, so the modest interior snapshots never have to.
 */
export function FeaturedRooms({
  rooms,
  locale,
}: {
  rooms: Room[];
  locale: string;
}) {
  const t = useTranslations("Home.featuredRooms");
  const tc = useTranslations("Common");
  const tr = useTranslations("Rooms");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!rooms.length) return null;

  const ordered = [...rooms].sort(
    (a, b) => (b.weekdayRate ?? 0) - (a.weekdayRate ?? 0),
  );

  const viewLabel = (r: Room) =>
    r.view && KNOWN_VIEWS.has(r.view) ? tr(`views.${r.view}`) : r.view || undefined;
  const priceOf = (r: Room) =>
    r.weekdayRate ? tc("fromPrice", { price: taka(r.weekdayRate) }) : undefined;

  return (
    <section
      ref={ref}
      id="featured-rooms"
      aria-label={t("title")}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-night py-24 lg:py-28"
    >
      {/* Full-bleed photograph with a slow parallax drift */}
      <div className="absolute inset-0 -z-20">
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { y, scale: 1.12 }}
        >
          <Image
            src={IMAGE}
            alt={t("imageAlt")}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
        </motion.div>
      </div>
      {/* Forest-night scrim: dark at the top and foot where the type sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night/85 via-night/35 to-night/95"
      />

      {/* Headline */}
      <Container className="relative">
        <Reveal>
          <p className="text-on-photo flex items-center gap-3 text-eyebrow font-medium uppercase text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
            {t("eyebrow")}
          </p>
          <h2 className="text-on-photo mt-6 max-w-[15ch] text-balance font-display text-display text-on-night">
            {t("title")}
          </h2>
          <p className="text-on-photo mt-6 max-w-[44ch] text-body-lg text-on-night-soft">
            {t("intro")}
          </p>
          <Link
            href="/rooms"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 text-small font-medium uppercase tracking-wide text-on-night"
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

      {/* Numbered index of the featured rooms */}
      <Container className="relative mt-16 lg:mt-24">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10 lg:gap-x-14">
          {ordered.map((r, i) => (
            <li key={r.id}>
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <div className="group relative border-t border-on-night/25 pt-4 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-on-night">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium tabular-nums text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-body-lg text-on-night/70 transition-transform duration-[250ms] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                  <h3 className="text-on-photo mt-3 font-display text-h3 text-on-night">
                    <Link
                      href={`/rooms/${r.slug}`}
                      className="outline-none after:absolute after:inset-0 group-hover:text-paper"
                    >
                      {loc(r.nameEn, r.nameBn, locale)}
                    </Link>
                  </h3>
                  <p className="text-on-photo mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-on-night-soft">
                    {viewLabel(r) ? <span>{viewLabel(r)}</span> : null}
                    {viewLabel(r) && priceOf(r) ? (
                      <span aria-hidden="true" className="text-on-night/40">
                        ·
                      </span>
                    ) : null}
                    {priceOf(r) ? (
                      <span className="whitespace-nowrap">{priceOf(r)}</span>
                    ) : null}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
