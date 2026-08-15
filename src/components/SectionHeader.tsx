import { cn } from "@/lib/utils";

/**
 * The signature section opener (design system §7): eyebrow (teal, uppercase,
 * wide tracking) → display-serif heading → optional body-lg intro.
 * Left-aligned by default; centrepieces may centre.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  as = "h2",
  size,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  /** Visual scale, independent of the heading level. Centrepiece sections may
   *  step up to `h1` scale while staying an <h2> semantically. */
  size?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
}) {
  const Heading = as;
  return (
    <header
      className={cn(
        "max-w-[65ch]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        // `moss`, not `teal`: at 13px the teal token measures 4.04:1 on paper,
        // under the 4.5:1 AA floor. Moss keeps the natural-green signature at
        // 4.9:1 (§10 — AA is non-negotiable).
        <p className="text-eyebrow font-medium uppercase text-moss">{eyebrow}</p>
      ) : null}
      <Heading
        className={cn(
          // text-balance evens out the line lengths and avoids orphan words
          "text-balance font-display text-ink",
          (size ?? as) === "h1" ? "text-h1" : "text-h2",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <p className="mt-5 text-body-lg text-ink-soft">{intro}</p>
      ) : null}
    </header>
  );
}
