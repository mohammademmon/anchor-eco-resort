"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

/**
 * A room as a full-bleed cinematic band (design system §8 imagery + §2 night
 * palette). The photograph runs edge-to-edge, a forest-night scrim keeps the
 * overlaid cream type legible on any image, and content alternates left/right
 * down the page for rhythm. Whole band is the link (stretched-link pattern);
 * only the room name is a real tab stop.
 */
export function RoomBand({
  index,
  slug,
  name,
  view,
  short,
  price,
  cta,
  image,
  align = "left",
}: {
  index: number;
  slug: string;
  name: string;
  view?: string;
  short?: string;
  price?: string;
  cta: string;
  image?: string | null;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const right = align === "right";

  return (
    <article
      ref={ref}
      aria-label={name}
      className={cn(
        "group relative isolate flex min-h-[72svh] items-end overflow-hidden lg:min-h-[82vh]",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-on-night",
      )}
    >
      {/* Media */}
      <div className="absolute inset-0 -z-20">
        {image ? (
          <motion.div
            className="absolute inset-0"
            style={reduce ? undefined : { y, scale: 1.14 }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </motion.div>
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-night via-forest-600 to-forest">
            <svg
              viewBox="0 0 60 44"
              aria-hidden="true"
              className="w-32 text-on-night/10"
              fill="currentColor"
            >
              <path d="M30 3 L43 26 L30 26 Z" />
              <path d="M28 7 L17 26 L28 26 Z" opacity="0.6" />
              <path d="M12 29 Q30 39 48 29 L44 34 Q30 39 16 34 Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Scrims: strong from the base for the copy, plus a directional wash on
          the copy's side so bright daytime shots stay legible (§8). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/45 to-night/5"
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 hidden lg:block",
          right
            ? "bg-gradient-to-l from-night/75 via-night/15 to-transparent"
            : "bg-gradient-to-r from-night/75 via-night/15 to-transparent",
        )}
      />

      <Container className="relative w-full py-16 lg:py-24">
        <div className={cn("max-w-[38rem]", right && "lg:ml-auto lg:text-right")}>
          <Reveal>
            <p
              className={cn(
                "text-on-photo flex items-center gap-3 text-eyebrow font-medium uppercase text-gold",
                right && "lg:justify-end",
              )}
            >
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

            <h3 className="text-on-photo mt-5 font-display text-h1 text-on-night">
              <Link
                href={`/rooms/${slug}`}
                className="outline-none after:absolute after:inset-0"
              >
                {name}
              </Link>
            </h3>

            {short ? (
              <p
                className={cn(
                  "text-on-photo mt-5 max-w-[42ch] text-body-lg text-on-night-soft",
                  right && "lg:ml-auto",
                )}
              >
                {short}
              </p>
            ) : null}

            <div
              className={cn(
                "mt-8 flex flex-wrap items-center gap-x-8 gap-y-4",
                right && "lg:justify-end",
              )}
            >
              {price ? (
                <span className="text-on-photo whitespace-nowrap font-display text-body-lg font-medium text-on-night">
                  {price}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-on-night/45 px-6 py-2.5 text-small font-medium text-on-night transition-colors duration-[250ms] group-hover:border-on-night group-hover:bg-on-night/10">
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
        </div>
      </Container>
    </article>
  );
}
