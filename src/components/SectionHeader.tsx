import { cn } from "@/lib/utils";

// Structural section header: eyebrow → heading → optional intro.
// (Visual polish comes in Phase 3; this only establishes hierarchy.)
export function SectionHeader({
  eyebrow,
  title,
  intro,
  as = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const Heading = as;
  return (
    <header className={cn("mb-8 max-w-[65ch] md:mb-12", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-teal">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-display text-3xl leading-tight text-ink md:text-4xl">
        {title}
      </Heading>
      {intro ? <p className="mt-3 text-ink-soft">{intro}</p> : null}
    </header>
  );
}
