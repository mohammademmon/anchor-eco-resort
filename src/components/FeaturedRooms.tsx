"use client";

import { useRef, type CSSProperties } from "react";
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

const KNOWN_VIEWS = new Set(["sea", "hill", "cottage"]);

/**
 * Per-room art direction for the cinematic sequence (the direction the client
 * approved): one full-screen visual per room, built on the strongest imagery so
 * the modest interior snapshots never fill the frame. `origin` keeps the most
 * interesting part of each photo in view as it slowly zooms.
 */
const SCENE: Record<string, { img: string; origin: string }> = {
  "premium-executive-cottage": {
    img: "/images/generated/dining-mood.png",
    origin: "70% 50%",
  },
  "super-deluxe-sea-view": {
    img: "/images/generated/beach-detail.png",
    origin: "50% 60%",
  },
  "premium-deluxe-sea-view": {
    img: "/images/generated/pool-golden-hour.png",
    origin: "40% 50%",
  },
  "super-deluxe-hill-side": {
    img: "/images/generated/nature-leaves-pool.png",
    origin: "50% 45%",
  },
};

type SceneProps = {
  index: number;
  slug: string;
  name: string;
  view?: string;
  short?: string;
  price?: string;
  cta: string;
  img: string | null;
  origin: string;
  priority: boolean;
  lead?: { title: string; viewAll: string };
};

function RoomScene({
  index,
  slug,
  name,
  view,
  short,
  price,
  cta,
  img,
  origin,
  priority,
  lead,
}: SceneProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <article
      ref={ref}
      aria-label={name}
      className="group relative isolate flex h-[100svh] min-h-[600px] items-end overflow-hidden bg-night has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-on-night"
    >
      {/* Media: scroll-parallax on the outer layer, Ken Burns drift on the inner */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={reduce ? undefined : { y }}
      >
        <div
          className="anchor-kenburns absolute inset-0"
          style={{ "--kb-origin": origin } as CSSProperties}
        >
          {img ? (
            <Image
              src={img}
              alt={name}
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </motion.div>

      {/* Forest-night scrim: strong at the foot for the copy, a light wash on the
          left, the photograph luminous through the middle. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/35 to-night/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-night/55 via-transparent to-transparent"
      />

      {/* Lead scene carries the section's name + a way out to all rooms */}
      {lead ? (
        <div className="absolute inset-x-0 top-0 z-10 pt-20 md:pt-24">
          <Container className="flex items-center justify-between gap-4">
            <span className="text-on-photo text-eyebrow font-medium uppercase tracking-wide text-on-night">
              {lead.title}
            </span>
            <Link
              href="/rooms"
              className="text-on-photo group/all inline-flex items-center gap-2 text-eyebrow font-medium uppercase tracking-wide text-on-night-soft transition-colors hover:text-on-night"
            >
              {lead.viewAll}
              <span
                aria-hidden="true"
                className="transition-transform duration-[250ms] group-hover/all:translate-x-1"
              >
                →
              </span>
            </Link>
          </Container>
        </div>
      ) : null}

      <Container className="relative w-full pb-16 md:pb-24 lg:pb-28">
        <Reveal>
          <p className="text-on-photo flex items-center gap-3 text-eyebrow font-medium uppercase text-gold">
            <span className="tabular-nums text-on-night-soft">
              {String(index).padStart(2, "0")}
            </span>
            {view ? (
              <>
                <span aria-hidden="true" className="h-3 w-px bg-on-night/40" />
                <span>{view}</span>
              </>
            ) : null}
          </p>

          <h2 className="text-on-photo mt-4 max-w-[16ch] text-balance font-display text-display text-on-night">
            <Link
              href={`/rooms/${slug}`}
              className="outline-none after:absolute after:inset-0"
            >
              {name}
            </Link>
          </h2>

          {short ? (
            <p className="text-on-photo mt-5 max-w-[40ch] text-body-lg text-on-night-soft">
              {short}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {price ? (
              <span className="text-on-photo whitespace-nowrap font-display text-h3 text-on-night">
                {price}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-on-night/45 px-6 py-2.5 text-small font-medium uppercase tracking-wide text-on-night transition-colors duration-[250ms] group-hover:border-on-night group-hover:bg-on-night/10">
              {cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-[250ms] group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </Reveal>
      </Container>
    </article>
  );
}

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

  if (!rooms.length) return null;

  const ordered = [...rooms].sort(
    (a, b) => (b.weekdayRate ?? 0) - (a.weekdayRate ?? 0),
  );

  const viewLabel = (r: Room) =>
    r.view && KNOWN_VIEWS.has(r.view) ? tr(`views.${r.view}`) : r.view || undefined;

  return (
    <section id="featured-rooms" aria-label={t("title")} className="bg-night">
      {ordered.map((r, i) => (
        <RoomScene
          key={r.id}
          index={i + 1}
          slug={r.slug}
          name={loc(r.nameEn, r.nameBn, locale)}
          view={viewLabel(r)}
          short={
            loc(r.shortEn, r.shortBn, locale) ||
            loc(r.descriptionEn, r.descriptionBn, locale)
          }
          price={
            r.weekdayRate
              ? tc("fromPrice", { price: taka(r.weekdayRate) })
              : undefined
          }
          cta={tc("viewDetails")}
          img={SCENE[r.slug]?.img ?? r.images?.[0] ?? null}
          origin={SCENE[r.slug]?.origin ?? "center"}
          priority={i === 0}
          lead={i === 0 ? { title: t("title"), viewAll: t("viewAll") } : undefined}
        />
      ))}
    </section>
  );
}
