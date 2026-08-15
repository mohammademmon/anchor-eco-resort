import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GALLERY_CATEGORIES } from "@/lib/content";
import { getPublishedGallery, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { cn } from "@/lib/utils";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const tg = await getTranslations("Gallery");
  const tc = await getTranslations("Common");

  const active = category && GALLERY_CATEGORIES.includes(category as never)
    ? category
    : "all";
  const all = await safe(getPublishedGallery, []);
  const images = active === "all" ? all : all.filter((g) => g.category === active);

  const tabClass = (isActive: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm",
      isActive
        ? "border-forest bg-forest text-paper"
        : "border-line text-ink hover:bg-paper-raised",
    );

  return (
    <PageSection label={tg("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={tg("header.eyebrow")}
        title={tg("header.title")}
        intro={tg("header.intro")}
      />

      {/* Category filter tabs */}
      <div role="tablist" aria-label={tg("header.title")} className="mb-8 flex flex-wrap gap-2">
        <Link href="/gallery" role="tab" aria-selected={active === "all"} className={tabClass(active === "all")}>
          {tg("all")}
        </Link>
        {GALLERY_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/gallery?category=${cat}`}
            role="tab"
            aria-selected={active === cat}
            className={tabClass(active === cat)}
          >
            {tg(`categories.${cat}`)}
          </Link>
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.length
          ? images.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={g.id}
                src={g.url}
                alt={loc(g.captionEn, g.captionBn, locale) || tc("imageLabel")}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ))
          : Array.from({ length: 8 }).map((_, i) => (
              <Placeholder key={i} label={`${tc("imageLabel")} ${i + 1}`} />
            ))}
      </div>
    </PageSection>
  );
}
