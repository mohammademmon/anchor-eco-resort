import { cn } from "@/lib/utils";

// A clearly-labeled placeholder box standing in for images/media in Phase 1.
export function Placeholder({
  label,
  className,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-2xl border border-dashed border-line bg-sand/40 p-4 text-center text-sm text-ink-soft",
        aspect,
        className,
      )}
    >
      {label}
    </div>
  );
}
