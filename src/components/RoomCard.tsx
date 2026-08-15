import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Room card (design system §7). Shared by the homepage featured grid and the
 * /rooms listing — one card, two places.
 *
 * Uses the stretched-link pattern: the whole card is clickable, but only the
 * room name is a real link, so the accessibility tree gets one clean tab stop
 * named after the room rather than a link wrapping every scrap of card content.
 * The focus ring is drawn on the card, not the name.
 */
export function RoomCard({
  slug,
  name,
  view,
  short,
  price,
  image,
  className,
}: {
  slug: string;
  name: string;
  /** Already-localised view label, e.g. "Sea View" */
  view?: string;
  short?: string;
  /** Already-formatted, e.g. "from ৳5,400 / night" */
  price?: string;
  image?: string | null;
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand transition-shadow duration-[400ms] group-hover:shadow-lift">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          // Not every room type has photography yet. A quiet branded panel
          // reads as intentional, where an empty box reads as broken.
          <div className="flex size-full items-center justify-center bg-sand">
            <svg
              viewBox="0 0 60 44"
              aria-hidden="true"
              className="w-12 text-moss/35"
              fill="currentColor"
            >
              <path d="M30 3 L43 26 L30 26 Z" />
              <path d="M28 7 L17 26 L28 26 Z" opacity="0.6" />
              <path d="M12 29 Q30 39 48 29 L44 34 Q30 39 16 34 Z" />
            </svg>
          </div>
        )}

        {view ? (
          <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-eyebrow font-medium uppercase text-ink backdrop-blur-sm">
            {view}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="font-display text-h3 text-ink">
          <Link
            href={`/rooms/${slug}`}
            className="underline-offset-4 outline-none after:absolute after:inset-0 after:rounded-2xl group-hover:underline"
          >
            {name}
          </Link>
        </h3>

        {short ? (
          <p className="mt-2 text-small text-ink-soft">{short}</p>
        ) : null}

        {price ? (
          <p className="mt-auto pt-5 font-display text-body-lg font-medium text-ink">
            {price}
          </p>
        ) : null}
      </div>
    </article>
  );
}
