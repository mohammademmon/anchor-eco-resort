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
  // Subtle counter-drift on the image — 8% max (§6).
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={sectionRef}
      id="eco-story"
      aria-label={t("title")}
      // Soft sand wash lifts the band off the paper page without competing
      // with the photography (§5 texture, kept faint).
      className="bg-gradient-to-b from-paper to-sand/30 py-24 md:py-32 lg:py-40"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Editorial copy */}
          <div>
            <Reveal>
              <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[60ch] whitespace-pre-line text-body-lg text-ink-soft">
                {body}
              </p>
            </Reveal>

            {/* Understated pillars, opened by a thin gold rule (§2: gold is a
                rare premium touch — thin rules only, never large fills). */}
            <Reveal delay={0.2}>
              <ul className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
                {pillars.map((pillar) => (
                  <li key={pillar}>
                    <span aria-hidden="true" className="block h-px w-8 bg-gold" />
                    <span className="mt-4 block text-small text-ink">
                      {pillar}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Editorial image, offset for depth */}
          <Reveal delay={0.15} className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 hidden size-full rounded-2xl border border-line bg-sand/50 lg:block"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft max-lg:aspect-[4/3]">
              <motion.div
                className="absolute inset-0"
                style={reduceMotion ? undefined : { y, scale: 1.08 }}
              >
                <Image
                  src="/images/generated/nature-leaves-pool.png"
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
