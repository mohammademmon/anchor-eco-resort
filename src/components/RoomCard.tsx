import { Link } from "@/i18n/navigation";
import { Placeholder } from "@/components/Placeholder";

// Room card stub — links to the room detail page. Content is passed in as
// already-translated placeholder strings.
export function RoomCard({
  slug,
  name,
  view,
  blurb,
  price,
  imageLabel,
  viewDetails,
}: {
  slug: string;
  name: string;
  view: string;
  blurb: string;
  price: string;
  imageLabel: string;
  viewDetails: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised">
      <Placeholder label={imageLabel} className="rounded-none border-0" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal">
          {view}
        </p>
        <h3 className="font-display text-xl text-ink">{name}</h3>
        <p className="text-sm text-ink-soft">{blurb}</p>
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
