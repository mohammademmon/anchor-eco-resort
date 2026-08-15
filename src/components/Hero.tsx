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
import { WhatsAppButton } from "@/components/WhatsAppButton";

// The staggered entrance (eyebrow → h1 → sub → buttons) is CSS-driven — see
// `.anchor-rise` in globals.css. Framer Motion here only powers the parallax,
// which is scroll-driven and therefore inherently client-side.
export function Hero({
  imageUrl,
  heading,
  subtitle,
  brand,
  whatsapp,
}: {
  imageUrl?: string | null;
  heading: string;
  subtitle: string;
  brand: string;
  whatsapp?: string | null;
}) {
  const t = useTranslations("Home.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Subtle parallax — max 8% drift, disabled for reduced motion (§6).
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={sectionRef}
      aria-label={heading}
      className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden lg:min-h-svh lg:justify-center"
    >
      {/* Full-bleed photography */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={reduceMotion ? undefined : { y, scale: 1.12 }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${brand} — ${heading}`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={82}
            className="object-cover object-center"
          />
        ) : (
          <div className="size-full bg-night" />
        )}
      </motion.div>

      {/* Forest-tinted scrims: top keeps the navbar legible over a bright sky,
          bottom keeps the copy legible (§8). Tall + soft — never a hard band. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-night/70 via-night/30 to-transparent"
      />
      {/* Mobile: bottom-weighted (copy sits low). Desktop: left-weighted so the
          photography stays visible beside the left-aligned copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night/80 via-night/30 to-transparent lg:bg-gradient-to-r lg:from-night/80 lg:via-night/35 lg:to-transparent"
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 pb-28 pt-32 text-center md:px-10 lg:py-20 lg:text-left">
        <p className="anchor-rise text-on-photo text-eyebrow font-medium uppercase text-on-night/90">
          {t("eyebrow")}
        </p>

        <h1
          className="anchor-rise text-on-photo mt-4 max-w-[18ch] font-display text-display text-on-night max-lg:mx-auto"
          style={{ animationDelay: "90ms" }}
        >
          {heading}
        </h1>

        <p
          className="anchor-rise text-on-photo mt-6 max-w-[46ch] text-body-lg text-on-night/90 max-lg:mx-auto"
          style={{ animationDelay: "180ms" }}
        >
          {subtitle}
        </p>

        <div
          className="anchor-rise mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center max-lg:justify-center"
          style={{ animationDelay: "270ms" }}
        >
          {/* WhatsApp carries the cream fill: on photography the light button
              reads as primary, keeping the money button unmistakable (§7, §11). */}
          <WhatsAppButton variant="hero" number={whatsapp} onDark />
          <Link
            href="/rooms"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-on-night/45 px-7 text-body font-medium text-on-night transition-[background-color,border-color,transform] duration-[250ms] hover:-translate-y-px hover:border-on-night/70 hover:bg-on-night/10 active:translate-y-0"
          >
            {t("ctaExplore")}
          </Link>
        </div>
      </div>

      {/* Quiet scroll cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
      >
        <span
          className="block h-9 w-[1px] bg-gradient-to-b from-transparent via-on-night/60 to-on-night/80"
          style={{ animation: "anchor-scroll-cue 2.4s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
