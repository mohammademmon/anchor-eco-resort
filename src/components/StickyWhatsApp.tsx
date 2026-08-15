"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Mobile sticky WhatsApp pill. On the homepage it stays hidden while the hero
 * (which already shows a WhatsApp CTA) is on screen, then fades in — so the
 * money button is always reachable without ever doubling up.
 */
export function StickyWhatsApp({ number }: { number?: string | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Only the scroll position is state; visibility is derived from it.
  const [pastHero, setPastHero] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isHome]);

  const visible = !isHome || pastHero;

  return (
    <>
      {isHome && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[80svh] w-px"
        />
      )}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="lg:hidden"
          >
            <WhatsAppButton variant="floating" number={number} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
