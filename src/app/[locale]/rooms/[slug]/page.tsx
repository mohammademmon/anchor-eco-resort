import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROOM_SLUGS, type RoomSlug } from "@/lib/content";
import { Container } from "@/components/Container";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";

export function generateStaticParams() {
  return ROOM_SLUGS.map((slug) => ({ slug }));
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!ROOM_SLUGS.includes(slug as RoomSlug)) {
    notFound();
  }

  const tr = await getTranslations("Rooms");
  const td = await getTranslations("RoomDetail");
  const tc = await getTranslations("Common");

  const amenities = td.raw("amenities.items") as string[];

  return (
    <>
      {/* Image gallery */}
      <PageSection label={td("gallery")}>
        <Link href="/rooms" className="mb-6 inline-block text-sm text-forest hover:underline">
          ← {td("back")}
        </Link>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Placeholder key={i} label={`${tc("imageLabel")} ${i + 1}`} />
          ))}
        </div>
      </PageSection>

      {/* Name + description */}
      <PageSection label={td("overview")}>
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-teal">
          {tr(`items.${slug}.view`)}
        </p>
        <SectionHeader as="h1" title={tr(`items.${slug}.name`)} />
        <p className="max-w-[65ch] text-ink-soft">{tr(`items.${slug}.blurb`)}</p>
      </PageSection>

      {/* Details */}
      <PageSection label={td("details")}>
        <SectionHeader title={td("details")} />
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("occupancy")}</dt>
            <dd className="mt-1 font-medium text-ink">{td("occupancyValue")}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("size")}</dt>
            <dd className="mt-1 font-medium text-ink">{td("sizeValue")}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("rate")}</dt>
            <dd className="mt-1 font-medium text-ink">{tr(`items.${slug}.price`)}</dd>
          </div>
        </dl>
      </PageSection>

      {/* Amenities */}
      <PageSection label={td("amenities.title")}>
        <SectionHeader title={td("amenities.title")} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item, i) => (
            <li key={i} className="rounded-xl border border-line bg-paper-raised p-4 text-ink">
              {item}
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Booking CTA */}
      <section aria-label={td("booking")} className="bg-sand/30">
        <Container className="py-14 text-center md:py-20">
          <h2 className="font-display text-2xl text-ink md:text-3xl">{td("booking")}</h2>
          <p className="mx-auto mt-2 max-w-[50ch] text-ink-soft">{td("bookingIntro")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600">
              {td("bookCta")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
