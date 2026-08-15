"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/LanguageToggle";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar({
  brand,
  whatsapp,
}: {
  brand: string;
  whatsapp?: string | null;
}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Only the homepage has a full-bleed hero behind the navbar.
  const overHero = pathname === "/";

  // Scroll state without a scroll listener: observe an 80px sentinel at the
  // top of the document. (CSS scroll-state queries are Chrome/Edge-only.)
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close the drawer on Escape, and lock background scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Transparent only while over the hero and not yet scrolled.
  const transparent = overHero && !scrolled;

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-20 w-px"
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-[400ms]",
          transparent
            ? "bg-transparent"
            : "bg-paper/90 shadow-soft backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-6 md:px-10 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            aria-label={brand}
            className="flex min-h-11 shrink-0 items-center transition-opacity duration-[250ms] hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={transparent ? "/logo-light.svg" : "/logo.svg"}
              alt={brand}
              width={240}
              height={68}
              className="h-9 w-auto lg:h-10"
            />
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.filter((l) => l.key !== "book").map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // generous hit area; the rule animates on the inner span
                        "flex min-h-11 items-center text-small transition-colors duration-[250ms]",
                        transparent
                          ? "text-on-night/85 hover:text-on-night"
                          : "text-ink-soft hover:text-ink",
                      )}
                    >
                      <span
                        className={cn(
                          "relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-[width] after:duration-[250ms] hover:after:w-full",
                          active ? "after:w-full" : "after:w-0",
                        )}
                      >
                        {t(link.key)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right cluster */}
          <div className={cn("flex items-center gap-3", "ml-auto lg:ml-0")}>
            <LanguageToggle light={transparent} />
            <div className="hidden lg:block">
              <WhatsAppButton
                variant="nav"
                number={whatsapp}
                onDark={transparent}
              />
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={open}
              className={cn(
                "flex size-11 items-center justify-center rounded-full transition-colors duration-[250ms] lg:hidden",
                transparent
                  ? "text-on-night hover:bg-on-night/10"
                  : "text-ink hover:bg-sand/60",
              )}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.button
              type="button"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full bg-night/50 backdrop-blur-sm"
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("menu")}
              data-lenis-prevent
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-paper px-6 pb-10 pt-6 shadow-lift"
              variants={{ open: { x: 0 }, closed: { x: "100%" } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt={brand} className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("closeMenu")}
                  className="flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-[250ms] hover:bg-sand/60"
                >
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-10">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.filter((l) => l.key !== "book").map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center border-b border-line/70 font-display text-h3 transition-colors duration-[250ms]",
                          pathname === link.href
                            ? "text-forest"
                            : "text-ink hover:text-forest",
                        )}
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto flex flex-col gap-5 pt-10">
                <LanguageToggle size="lg" className="self-start" />
                <WhatsAppButton
                  variant="hero"
                  number={whatsapp}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for pages without a hero behind the fixed navbar. */}
      {!overHero && <div aria-hidden="true" className="h-16 lg:h-20" />}
    </>
  );
}
