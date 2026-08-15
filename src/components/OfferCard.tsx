import { Link } from "@/i18n/navigation";
import { Placeholder } from "@/components/Placeholder";

// Offer card stub — badge, title, blurb, price, CTA.
export function OfferCard({
  title,
  badge,
  blurb,
  price,
  imageLabel,
  cta,
}: {
  title: string;
  badge: string;
  blurb: string;
  price: string;
  imageLabel: string;
  cta: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised">
      <div className="relative">
        <Placeholder label={imageLabel} className="rounded-none border-0" />
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-medium text-night">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl text-ink">{title}</h3>
        <p className="text-sm text-ink-soft">{blurb}</p>
        <p className="mt-auto pt-2 text-ink">{price}</p>
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
