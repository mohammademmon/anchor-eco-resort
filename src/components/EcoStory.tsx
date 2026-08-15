"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

export function EcoStory({ body }: { body: string }) {
  const t = useTranslations("Home.ecoStory");
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const pillars = t.raw("pillars") as string[];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Counter-drifting layers — the depth cue that makes the diptych feel built
  // rather than pasted. Max 8% (§6), disabled under reduced motion.
  const forestY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const seaY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={sectionRef}
      id="eco-story"
      aria-label={t("title")}
      className="bg-gradient-to-b from-paper to-sand/30 py-24 md:py-32 lg:py-40"
    >
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Copy — narrow, editorial measure */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                size="h1"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[48ch] whitespace-pre-line text-body-lg text-ink-soft">
                {body}
              </p>
            </Reveal>
          </div>

          {/* Diptych: forest above, sea overlapping — the two halves of the
              heading, shown rather than stated. */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft lg:aspect-[4/5]">
                <motion.div
                  className="absolute inset-0"
                  style={reduceMotion ? undefined : { y: forestY, scale: 1.08 }}
                >
                  <Image
                    src="/images/generated/nature-leaves-pool.png"
                    alt={t("imageAlt")}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>

              {/* Sea detail, layered over the corner */}
              <div className="relative z-10 -mt-16 ml-auto w-2/3 sm:w-3/5 lg:absolute lg:-bottom-12 lg:-left-12 lg:ml-0 lg:mt-0 lg:w-[48%]">
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl shadow-lift ring-1 ring-paper/60">
                  <motion.div
                    className="absolute inset-0"
                    style={reduceMotion ? undefined : { y: seaY, scale: 1.1 }}
                  >
                    <Image
                      src="/images/generated/beach-detail.png"
                      alt={t("imageAltSea")}
                      fill
                      sizes="(min-width: 1024px) 28vw, 66vw"
                      // 16:9 source into a 5:4 box crops horizontally, so the
                      // framing shifts left — onto the surf line rather than a
                      // block of sand
                      className="object-cover object-[30%_50%]"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Numbered band — a quiet index of what the place is, opened by a
            hairline. Gold stays a rule only, never a fill (§2). */}
        <Reveal delay={0.2}>
          <ul className="mt-24 grid gap-12 border-t border-line pt-12 sm:grid-cols-3 sm:gap-8 lg:mt-32">
            {pillars.map((pillar, i) => (
              <li key={pillar}>
                <div className="flex items-center gap-4">
                  <span className="text-small tabular-nums text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gold/70" />
                </div>
                <p className="mt-5 font-display text-h3 text-ink">{pillar}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
