import { Link } from "@/i18n/navigation";
import { Placeholder } from "@/components/Placeholder";

// Room card — links to the room detail page. Renders a real image when present.
export function RoomCard({
  slug,
  name,
  view,
  blurb,
  price,
  image,
  imageLabel,
  viewDetails,
}: {
  slug: string;
  name: string;
  view: string;
  blurb: string;
  price: string;
  image?: string | null;
  imageLabel: string;
  viewDetails: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <Placeholder label={imageLabel} className="rounded-none border-0" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {view ? (
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal">
            {view}
          </p>
        ) : null}
        <h3 className="font-display text-xl text-ink">{name}</h3>
        {blurb ? <p className="text-sm text-ink-soft">{blurb}</p> : null}
        <p className="mt-auto pt-2 text-ink">{price}</p>
        <Link
          href={`/rooms/${slug}`}
          className="text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          {viewDetails} →
        </Link>
      </div>
    </article>
  );
}
