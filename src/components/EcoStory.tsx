"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

/**
 * The forest-night immersive band (design system §2). Full-bleed: the copy sits
 * on `night`, the photograph runs off the right edge of the viewport and melts
 * into the panel — no card, no border, no rounded box. Sits between the bright
 * hero and the light rooms grid to give the page its rhythm.
 */
export function EcoStory({ body }: { body: string }) {
  const t = useTranslations("Home.ecoStory");
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const pillars = t.raw("pillars") as string[];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      id="eco-story"
      aria-label={t("title")}
      className="relative bg-night"
    >
      <div className="grid lg:grid-cols-[1fr_48vw]">
        {/* Copy — aligned to the site container gutter, then given room.
            On phones it follows the photograph; on desktop it leads on the left. */}
        <div className="order-2 px-6 py-24 md:px-10 md:py-32 lg:order-1 lg:py-40 lg:pl-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))] lg:pr-20">
          <Reveal>
            <SectionHeader
              eyebrow={t("eyebrow")}
              title={t("title")}
              size="h1"
              tone="dark"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[46ch] whitespace-pre-line text-body-lg text-on-night-soft">
              {body}
            </p>
          </Reveal>

          {/* Quiet index of the place — gold stays a hairline only (§2) */}
          <Reveal delay={0.2}>
            <ul className="mt-14 grid max-w-[34rem] gap-8 sm:grid-cols-3">
              {pillars.map((pillar, i) => (
                <li key={pillar}>
                  <div className="flex items-center gap-3">
                    <span className="text-small tabular-nums text-on-night-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-gold/60" />
                  </div>
                  <p className="mt-4 font-display text-h3 text-on-night">
                    {pillar}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Photograph — bleeds off the right edge, blended into the panel */}
        <div className="relative order-1 min-h-[56vh] overflow-hidden lg:order-2 lg:min-h-full">
          <motion.div
            className="absolute inset-0"
            style={reduceMotion ? undefined : { y, scale: 1.1 }}
          >
            <Image
              src="/images/generated/pool-golden-hour.png"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          {/* Soft blend so the photo dissolves into the night panel rather than
              sitting in a frame — bottom edge on mobile (copy sits below),
              left edge on desktop (copy sits beside). */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-night via-night/10 to-transparent lg:bg-gradient-to-r lg:from-night lg:via-night/20 lg:to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
