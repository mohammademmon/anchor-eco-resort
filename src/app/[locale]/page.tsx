import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getSettings,
  getFeaturedRooms,
  getPublishedAmenities,
  getPublishedOffers,
  getPublishedGallery,
  getPublishedReviews,
  safe,
} from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { roomPrice } from "@/lib/format";
import { Container } from "@/components/Container";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";
import { RoomCard } from "@/components/RoomCard";
import { OfferCard } from "@/components/OfferCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return { title: t("home.title"), description: t("home.description") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tc = await getTranslations("Common");
  const perNight = tc("perNight");

  const [settings, rooms, amenities, offers, gallery, reviews] =
    await Promise.all([
      safe(getSettings, null),
      safe(getFeaturedRooms, []),
      safe(getPublishedAmenities, []),
      safe(getPublishedOffers, []),
      safe(getPublishedGallery, []),
      safe(getPublishedReviews, []),
    ]);

  const displayFont = locale === "bn" ? "font-bn-display" : "font-display";
  const heroTitle =
    loc(settings?.heroTitleEn, settings?.heroTitleBn, locale) || t("hero.title");
  const heroSubtitle =
    loc(settings?.heroSubtitleEn, settings?.heroSubtitleBn, locale) ||
    t("hero.subtitle");

  return (
    <>
      {/* Hero */}
      <section aria-label={heroTitle} className="border-b border-line bg-sand/30">
        <Container className="py-20 text-center md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal">
            {t("hero.eyebrow")}
          </p>
          <h1 className={`${displayFont} mx-auto max-w-3xl text-4xl leading-tight text-ink sm:text-5xl`}>
            {heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-[60ch] text-ink-soft">{heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600">
              {t("hero.ctaBook")}
            </Link>
            <Link href="/rooms" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-paper-raised">
              {t("hero.ctaExplore")}
            </Link>
          </div>
          {settings?.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.heroImage}
              alt={heroTitle}
              className="mx-auto mt-10 max-h-[520px] w-full max-w-5xl rounded-2xl object-cover"
            />
          ) : null}
        </Container>
      </section>

      {/* Eco Story */}
      <PageSection id="eco-story" label={t("ecoStory.title")}>
        <SectionHeader eyebrow={t("ecoStory.eyebrow")} title={t("ecoStory.title")} />
        <p className="max-w-[65ch] whitespace-pre-line text-ink-soft">
          {loc(settings?.aboutEn, settings?.aboutBn, locale) || t("ecoStory.body")}
        </p>
      </PageSection>

      {/* Featured Rooms */}
      <PageSection id="featured-rooms" label={t("featuredRooms.title")}>
        <SectionHeader
          eyebrow={t("featuredRooms.eyebrow")}
          title={t("featuredRooms.title")}
          intro={t("featuredRooms.intro")}
        />
        {rooms.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {rooms.map((r) => (
              <RoomCard
                key={r.id}
                slug={r.slug}
                name={loc(r.nameEn, r.nameBn, locale)}
                view={r.view}
                blurb={loc(r.shortEn, r.shortBn, locale) || loc(r.descriptionEn, r.descriptionBn, locale)}
                price={roomPrice(r.weekdayRate, r.weekendRate, perNight)}
                image={r.images?.[0]}
                imageLabel={tc("imageLabel")}
                viewDetails={tc("viewDetails")}
              />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">{tc("imageLabel")}</p>
        )}
      </PageSection>

      {/* Amenities */}
      <PageSection id="amenities" label={t("amenities.title")}>
        <SectionHeader eyebrow={t("amenities.eyebrow")} title={t("amenities.title")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <li key={a.id} className="rounded-xl border border-line bg-paper-raised p-4">
              <p className="font-medium text-ink">{loc(a.nameEn, a.nameBn, locale)}</p>
              {loc(a.noteEn, a.noteBn, locale) ? (
                <p className="mt-1 text-sm text-ink-soft">{loc(a.noteEn, a.noteBn, locale)}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Offers */}
      <PageSection id="offers" label={t("offers.title")}>
        <SectionHeader
          eyebrow={t("offers.eyebrow")}
          title={t("offers.title")}
          intro={t("offers.intro")}
        />
        {offers.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {offers.map((o) => (
              <OfferCard
                key={o.id}
                title={loc(o.titleEn, o.titleBn, locale)}
                badge={loc(o.badgeEn, o.badgeBn, locale)}
                blurb={loc(o.descriptionEn, o.descriptionBn, locale)}
                price={o.price ?? ""}
                image={o.image}
                imageLabel={tc("imageLabel")}
                cta={tc("learnMore")}
              />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">{t("offers.intro")}</p>
        )}
      </PageSection>

      {/* Gallery */}
      <PageSection id="gallery" label={t("gallery.title")}>
        <SectionHeader
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title")}
          intro={t("gallery.intro")}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.length
            ? gallery.slice(0, 6).map((g) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={g.id}
                  src={g.url}
                  alt={loc(g.captionEn, g.captionBn, locale) || tc("imageLabel")}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <Placeholder key={i} label={`${tc("imageLabel")} ${i + 1}`} />
              ))}
        </div>
        <Link href="/gallery" className="mt-6 inline-block text-sm font-medium text-forest hover:underline">
          {tc("viewAll")} →
        </Link>
      </PageSection>

      {/* Reviews */}
      <PageSection id="reviews" label={t("reviews.title")}>
        <SectionHeader eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((rv) => (
            <figure key={rv.id} className="rounded-2xl border border-line bg-paper-raised p-6">
              <p className="text-gold" aria-hidden="true">
                {"★".repeat(rv.rating)}
              </p>
              <blockquote className="mt-2 text-ink-soft">
                “{loc(rv.bodyEn, rv.bodyBn, locale)}”
              </blockquote>
              <figcaption className="mt-3 text-sm font-medium text-ink">
                — {rv.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </PageSection>

      {/* Location */}
      <PageSection id="location" label={t("location.title")} className="border-b-0">
        <SectionHeader eyebrow={t("location.eyebrow")} title={t("location.title")} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="text-ink-soft">
            <p className="font-medium text-ink">
              {loc(settings?.addressEn, settings?.addressBn, locale) || t("location.address")}
            </p>
            <p className="mt-2">{t("location.directions")}</p>
          </div>
          <Placeholder label={tc("mapPlaceholder")} aspect="aspect-[16/9]" />
        </div>
      </PageSection>
    </>
  );
}
