import { Link } from "@/i18n/navigation";
import { Placeholder } from "@/components/Placeholder";

// Offer card — badge, title, blurb, price, CTA. Renders a real image when present.
export function OfferCard({
  title,
  badge,
  blurb,
  price,
  image,
  imageLabel,
  cta,
}: {
  title: string;
  badge: string;
  blurb: string;
  price: string;
  image?: string | null;
  imageLabel: string;
  cta: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised">
      <div className="relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
        ) : (
          <Placeholder label={imageLabel} className="rounded-none border-0" />
        )}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-medium text-night">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl text-ink">{title}</h3>
        {blurb ? <p className="text-sm text-ink-soft">{blurb}</p> : null}
        {price ? <p className="mt-auto pt-2 text-ink">{price}</p> : null}
        <Link
          href="/book"
          className="text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          {cta} →
        </Link>
      </div>
    </article>
  );
}
