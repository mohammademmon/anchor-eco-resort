"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The single scroll-reveal primitive for the whole site (design system §6):
 * opacity 0 → 1 with a 24px rise, 0.8s on the signature easing, fired once when
 * the element is 80px inside the viewport. Stagger siblings with `delay`
 * (0.08–0.12 steps). Under prefers-reduced-motion the rise is dropped and only
 * the gentle fade remains.
 *
 * Uses IntersectionObserver (via whileInView) rather than CSS scroll-driven
 * animations, which iOS Safari — the primary surface here — doesn't support.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      // Framer serialises `initial` into the SSR markup, so without JS the
      // content would stay invisible. `data-reveal` lets the <noscript> rule in
      // the layout force it visible (progressive enhancement).
      data-reveal=""
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
