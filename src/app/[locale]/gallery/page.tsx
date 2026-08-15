import { getTranslations, setRequestLocale } from "next-intl/server";
import { GALLERY_CATEGORIES } from "@/lib/content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { Placeholder } from "@/components/Placeholder";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tg = await getTranslations("Gallery");
  const tc = await getTranslations("Common");

  return (
    <PageSection label={tg("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={tg("header.eyebrow")}
        title={tg("header.title")}
        intro={tg("header.intro")}
      />

      {/* Category filter tabs (non-functional in Phase 1) */}
      <div
        role="tablist"
        aria-label={tg("header.title")}
        className="mb-8 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="rounded-full border border-forest bg-forest px-4 py-1.5 text-sm font-medium text-paper"
        >
          {tg("all")}
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected="false"
            className="rounded-full border border-line px-4 py-1.5 text-sm text-ink hover:bg-paper-raised"
          >
            {tg(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Image grid placeholders */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Placeholder key={i} label={`${tc("imageLabel")} ${i + 1}`} />
        ))}
      </div>
    </PageSection>
  );
}
