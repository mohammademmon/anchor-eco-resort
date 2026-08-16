import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * A room as an editorial index row (design system §7, adapted).
 *
 * Deliberately typography-led rather than image-led: the resort's current
 * photography is working-resolution phone captures, and large showcase crops
 * expose that. Here the serif name carries the row and the photograph is a
 * small, consistently-cropped plate — supporting, not dominant. When real
 * editorial photography arrives the plate can grow without touching anything
 * else.
 *
 * Stretched-link pattern: the whole row is clickable, but only the room name is
 * a real link, so the a11y tree gets one clean tab stop per room.
 */
export function RoomCard({
  index,
  slug,
  name,
  view,
  short,
  showShort = true,
  price,
  image,
  className,
}: {
  index?: number;
  slug: string;
  name: string;
  /** Already-localised view label, e.g. "Sea View" */
  view?: string;
  short?: string;
  /** Hidden in the narrow homepage rail; shown on the full-width listing */
  showShort?: boolean;
  /** Already-formatted, e.g. "from ৳5,400 / night" */
  price?: string;
  image?: string | null;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex items-center gap-5 border-t border-line py-7 transition-colors duration-[400ms] lg:gap-10 lg:py-10",
        "hover:bg-sand/25 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-teal has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-paper",
        className,
      )}
    >
      {/* Plate — small and uniformly cropped so four inconsistent snapshots
          still read as one curated set. */}
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-sand sm:w-32 lg:w-44 lg:rounded-xl">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 176px, (min-width: 640px) 128px, 96px"
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <svg
              viewBox="0 0 60 44"
              aria-hidden="true"
              className="w-7 text-moss/30"
              fill="currentColor"
            >
              <path d="M30 3 L43 26 L30 26 Z" />
              <path d="M28 7 L17 26 L28 26 Z" opacity="0.6" />
              <path d="M12 29 Q30 39 48 29 L44 34 Q30 39 16 34 Z" />
            </svg>
          </div>
        )}
      </div>

      {/* The row's voice */}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2.5 text-eyebrow font-medium uppercase text-moss">
          {index != null ? (
            <span className="tabular-nums text-ink-soft">
              {String(index).padStart(2, "0")}
            </span>
          ) : null}
          {index != null && view ? (
            <span aria-hidden="true" className="h-3 w-px bg-line" />
          ) : null}
          {view ? <span>{view}</span> : null}
        </p>

        <h3 className="mt-2 font-display text-h3 text-ink">
          <Link
            href={`/rooms/${slug}`}
            className="underline-offset-[6px] outline-none after:absolute after:inset-0 group-hover:underline"
          >
            {name}
          </Link>
        </h3>

        {short && showShort ? (
          <p className="mt-2 hidden max-w-[46ch] text-small text-ink-soft sm:block">
            {short}
          </p>
        ) : null}

        {/* Price rides under the name on phones, moves to its own column above */}
        {price ? (
          <p className="mt-2 font-display text-body font-medium text-ink lg:hidden">
            {price}
          </p>
        ) : null}
      </div>

      <div className="hidden shrink-0 items-center justify-end gap-6 lg:flex">
        {price ? (
          <span className="whitespace-nowrap text-right font-display text-body font-medium text-ink xl:text-body-lg">
            {price}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="text-h3 text-forest transition-transform duration-[250ms] group-hover:translate-x-1.5"
        >
          →
        </span>
      </div>
    </article>
  );
}
