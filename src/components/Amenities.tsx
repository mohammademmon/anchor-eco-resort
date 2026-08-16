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
import { loc } from "@/lib/i18n-content";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

const IMAGE = "/images/generated/dining-mood.png";

type AmenityItem = {
  id: string;
  nameEn: string;
  nameBn: string | null;
  noteEn: string | null;
  noteBn: string | null;
};

/**
 * Amenities as a full-bleed cinematic band (the immersive language already used
 * for the hero and eco-story §2). The seaside photograph runs edge-to-edge with
 * a slow parallax and a forest-night scrim; an oversized serif headline sits at
 * the top, and the eight amenities read as a numbered editorial index in cream
 * with thin gold hairlines at the foot — no icons, no cards, no template grid.
 * The image is left to breathe in the gap between the two.
 */
export function Amenities({
  amenities,
  locale,
}: {
  amenities: AmenityItem[];
  locale: string;
}) {
  const t = useTranslations("Home.amenities");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!amenities.length) return null;

  return (
    <section
      ref={ref}
      id="amenities"
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
            className="object-cover"
          />
        </motion.div>
      </div>
      {/* Forest-night scrim: dark at the top and foot where the type sits, so the
          photograph stays visible and luminous through the middle. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night/85 via-night/35 to-night/90"
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
        </Reveal>
      </Container>

      {/* Numbered editorial index of the eight amenities */}
      <Container className="relative mt-20 lg:mt-24">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10 lg:gap-x-14">
          {amenities.map((a, i) => {
            const note = loc(a.noteEn, a.noteBn, locale);
            return (
              <li key={a.id}>
                <Reveal delay={Math.min(i * 0.05, 0.25)}>
                  <div className="border-t border-on-night/25 pt-4">
                    <span className="text-small font-medium tabular-nums text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-on-photo mt-3 font-display text-h3 text-on-night">
                      {loc(a.nameEn, a.nameBn, locale)}
                    </h3>
                    {note ? (
                      <p className="text-on-photo mt-1.5 text-small text-on-night-soft">
                        {note}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
