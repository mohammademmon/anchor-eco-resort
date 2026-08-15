import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";

// Wraps a labeled <section> in the standard container with skeleton spacing.
// (Full premium section rhythm is applied in Phase 3.)
export function PageSection({
  id,
  label,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  label: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("border-b border-line/60 py-14 md:py-20", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
