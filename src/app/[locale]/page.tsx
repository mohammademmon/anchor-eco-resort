import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROOM_SLUGS, OFFER_IDS } from "@/lib/content";
import { Container } from "@/components/Container";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";
import { RoomCard } from "@/components/RoomCard";
import { OfferCard } from "@/components/OfferCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tc = await getTranslations("Common");
  const tr = await getTranslations("Rooms");
  const to = await getTranslations("Offers");

  const displayFont = locale === "bn" ? "font-bn-display" : "font-display";
  const amenities = t.raw("amenities.items") as string[];
  const reviews = t.raw("reviews.items") as { quote: string; author: string }[];

  return (
    <>
      {/* Hero */}
      <section aria-label={t("hero.title")} className="border-b border-line bg-sand/30">
        <Container className="py-20 text-center md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal">
            {t("hero.eyebrow")}
          </p>
          <h1 className={`${displayFont} mx-auto max-w-3xl text-4xl leading-tight text-ink sm:text-5xl`}>
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-[60ch] text-ink-soft">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600">
              {t("hero.ctaBook")}
            </Link>
            <Link href="/rooms" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-paper-raised">
              {t("hero.ctaExplore")}
            </Link>
          </div>
        </Container>
      </section>

      {/* Eco Story */}
      <PageSection id="eco-story" label={t("ecoStory.title")}>
        <SectionHeader eyebrow={t("ecoStory.eyebrow")} title={t("ecoStory.title")} />
        <p className="max-w-[65ch] text-ink-soft">{t("ecoStory.body")}</p>
      </PageSection>

      {/* Featured Rooms */}
      <PageSection id="featured-rooms" label={t("featuredRooms.title")}>
        <SectionHeader
          eyebrow={t("featuredRooms.eyebrow")}
          title={t("featuredRooms.title")}
          intro={t("featuredRooms.intro")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {ROOM_SLUGS.map((slug) => (
            <RoomCard
              key={slug}
              slug={slug}
              name={tr(`items.${slug}.name`)}
              view={tr(`items.${slug}.view`)}
              blurb={tr(`items.${slug}.blurb`)}
              price={tr(`items.${slug}.price`)}
              imageLabel={tc("imageLabel")}
              viewDetails={tc("viewDetails")}
            />
          ))}
        </div>
      </PageSection>

      {/* Amenities */}
      <PageSection id="amenities" label={t("amenities.title")}>
        <SectionHeader eyebrow={t("amenities.eyebrow")} title={t("amenities.title")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item, i) => (
            <li key={i} className="rounded-xl border border-line bg-paper-raised p-4 text-ink">
              {item}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {OFFER_IDS.map((id) => (
            <OfferCard
              key={id}
              title={to(`items.${id}.title`)}
              badge={to(`items.${id}.badge`)}
              blurb={to(`items.${id}.blurb`)}
              price={to(`items.${id}.price`)}
              imageLabel={tc("imageLabel")}
              cta={tc("learnMore")}
            />
          ))}
        </div>
      </PageSection>

      {/* Gallery */}
      <PageSection id="gallery" label={t("gallery.title")}>
        <SectionHeader
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title")}
          intro={t("gallery.intro")}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          {reviews.map((r, i) => (
            <figure key={i} className="rounded-2xl border border-line bg-paper-raised p-6">
              <blockquote className="text-ink-soft">“{r.quote}”</blockquote>
              <figcaption className="mt-3 text-sm font-medium text-ink">— {r.author}</figcaption>
            </figure>
          ))}
        </div>
      </PageSection>

      {/* Location */}
      <PageSection id="location" label={t("location.title")} className="border-b-0">
        <SectionHeader eyebrow={t("location.eyebrow")} title={t("location.title")} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="text-ink-soft">
            <p className="font-medium text-ink">{t("location.address")}</p>
            <p className="mt-2">{t("location.directions")}</p>
          </div>
          <Placeholder label={tc("mapPlaceholder")} aspect="aspect-[16/9]" />
        </div>
      </PageSection>
    </>
  );
}
