import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Room card (design system §7). Shared by the homepage collection and the
 * /rooms listing — one card, two places.
 *
 * Stretched-link pattern: the whole card is clickable, but only the room name
 * is a real link, so the accessibility tree gets one clean tab stop named after
 * the room. The focus ring is drawn on the card, not the name.
 */
export function RoomCard({
  slug,
  name,
  view,
  short,
  price,
  cta,
  image,
  aspect = "aspect-[4/3]",
  className,
}: {
  slug: string;
  name: string;
  /** Already-localised view label, e.g. "Sea View" */
  view?: string;
  short?: string;
  /** Already-formatted, e.g. "from ৳5,400 / night" */
  price?: string;
  /** Visual affordance only — the whole card is the link */
  cta?: string;
  image?: string | null;
  aspect?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-teal has-[a:focus-visible]:ring-offset-4 has-[a:focus-visible]:ring-offset-paper",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-sand transition-shadow duration-[400ms] group-hover:shadow-lift",
          aspect,
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          // Not every room type has photography yet. A quiet branded panel
          // reads as intentional, where an empty box reads as broken.
          <div className="flex size-full items-center justify-center bg-sand">
            <svg
              viewBox="0 0 60 44"
              aria-hidden="true"
              className="w-12 text-moss/30"
              fill="currentColor"
            >
              <path d="M30 3 L43 26 L30 26 Z" />
              <path d="M28 7 L17 26 L28 26 Z" opacity="0.6" />
              <path d="M12 29 Q30 39 48 29 L44 34 Q30 39 16 34 Z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-6">
        {view ? (
          <p className="text-eyebrow font-medium uppercase text-moss">{view}</p>
        ) : null}

        <h3 className="mt-3 font-display text-h3 text-ink">
          <Link
            href={`/rooms/${slug}`}
            className="underline-offset-4 outline-none after:absolute after:inset-0 after:rounded-2xl group-hover:underline"
          >
            {name}
          </Link>
        </h3>

        {short ? (
          <p className="mt-2 max-w-[38ch] text-small text-ink-soft">{short}</p>
        ) : null}

        {/* Hairline foot: price against the quiet call to action. Gives the
            card a base instead of leaving the text floating (§5). */}
        <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-line pt-5">
          {price ? (
            <span className="font-display text-body-lg font-medium text-ink">
              {price}
            </span>
          ) : (
            <span />
          )}
          {cta ? (
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 text-small font-medium text-forest"
            >
              {cta}
              <span className="transition-transform duration-[250ms] group-hover:translate-x-1">
                →
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
