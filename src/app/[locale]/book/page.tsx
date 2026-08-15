import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedRooms, getSettings, safe } from "@/lib/queries";
import { loc } from "@/lib/i18n-content";
import { WHATSAPP_NUMBER } from "@/lib/content";
import { PageSection } from "@/components/PageSection";
import { SectionHeader } from "@/components/SectionHeader";
import { BookingForm } from "@/components/BookingForm";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ room?: string }>;
}) {
  const { locale } = await params;
  const { room } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("Book");
  const [rooms, settings] = await Promise.all([
    safe(getPublishedRooms, []),
    safe(getSettings, null),
  ]);
  const roomOptions = rooms.map((r) => ({
    slug: r.slug,
    name: loc(r.nameEn, r.nameBn, locale),
  }));
  const defaultRoomSlug =
    room && rooms.some((r) => r.slug === room) ? room : "";
  const waUrl = `https://wa.me/${settings?.whatsapp || WHATSAPP_NUMBER}`;

  return (
    <PageSection label={t("header.title")} className="border-b-0">
      <SectionHeader
        as="h1"
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        intro={t("header.intro")}
      />
      <BookingForm rooms={roomOptions} defaultRoomSlug={defaultRoomSlug} />
      <p className="mt-6 text-sm text-ink-soft">
        {t("whatsappNudge")}{" "}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-forest hover:underline"
        >
          WhatsApp
        </a>
      </p>
    </PageSection>
  );
}
