import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRoomBySlug, getAmenitiesForRoom, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { taka } from "@/lib/format";
import { Container } from "@/components/Container";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const room = await safe(() => getRoomBySlug(slug), null);
  if (!room) notFound();

  const amenities = await safe(() => getAmenitiesForRoom(room.id), []);

  const td = await getTranslations("RoomDetail");
  const tc = await getTranslations("Common");
  const perNight = tc("perNight");
  const name = loc(room.nameEn, room.nameBn, locale);
  const images = room.images ?? [];

  return (
    <>
      {/* Image gallery */}
      <PageSection label={td("gallery")}>
        <Link href="/rooms" className="mb-6 inline-block text-sm text-forest hover:underline">
          ← {td("back")}
        </Link>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.length
            ? images.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`${name} ${i + 1}`}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <Placeholder key={i} label={`${tc("imageLabel")} ${i + 1}`} />
              ))}
        </div>
      </PageSection>

      {/* Name + description */}
      <PageSection label={td("overview")}>
        {room.view ? (
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-teal">
            {room.view}
          </p>
        ) : null}
        <SectionHeader as="h1" title={name} />
        <p className="max-w-[65ch] text-ink-soft">
          {loc(room.descriptionEn, room.descriptionBn, locale)}
        </p>
      </PageSection>

      {/* Details */}
      <PageSection label={td("details")}>
        <SectionHeader title={td("details")} />
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("occupancy")}</dt>
            <dd className="mt-1 font-medium text-ink">{room.occupancy}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("size")}</dt>
            <dd className="mt-1 font-medium text-ink">{room.size || "—"}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper-raised p-4">
            <dt className="text-sm text-ink-soft">{td("rate")}</dt>
            <dd className="mt-1 font-medium text-ink">
              {taka(room.weekdayRate)} / {taka(room.weekendRate)} {perNight}
            </dd>
          </div>
        </dl>
      </PageSection>

      {/* Amenities */}
      <PageSection label={td("amenities.title")}>
        <SectionHeader title={td("amenities.title")} />
        {amenities.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <li key={a.id} className="rounded-xl border border-line bg-paper-raised p-4">
                <p className="font-medium text-ink">{loc(a.nameEn, a.nameBn, locale)}</p>
                {loc(a.noteEn, a.noteBn, locale) ? (
                  <p className="mt-1 text-sm text-ink-soft">{loc(a.noteEn, a.noteBn, locale)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-soft">—</p>
        )}
      </PageSection>

      {/* Booking CTA */}
      <section aria-label={td("booking")} className="bg-sand/30">
        <Container className="py-14 text-center md:py-20">
          <h2 className="font-display text-2xl text-ink md:text-3xl">{td("booking")}</h2>
          <p className="mx-auto mt-2 max-w-[50ch] text-ink-soft">{td("bookingIntro")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/book?room=${room.slug}`}
              className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600"
            >
              {td("bookCta")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
