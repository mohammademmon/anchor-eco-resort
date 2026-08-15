import { cn } from "@/lib/utils";

/**
 * The signature section opener (design system §7): eyebrow → display-serif
 * heading → optional body-lg intro.
 *
 * `tone="dark"` is for the forest-night immersive bands (§2). On night the
 * eyebrow can use gold (5.3:1) — on paper it must not, so the light tone uses
 * moss (4.9:1) instead of teal (4.0:1, below AA).
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  as = "h2",
  size,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  size?: "h1" | "h2";
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  const Heading = as;
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "max-w-[65ch]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-eyebrow font-medium uppercase",
            dark ? "text-gold" : "text-moss",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "text-balance font-display",
          (size ?? as) === "h1" ? "text-h1" : "text-h2",
          dark ? "text-on-night" : "text-ink",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <p
          className={cn(
            "mt-5 text-body-lg",
            dark ? "text-on-night-soft" : "text-ink-soft",
          )}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}
