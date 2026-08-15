import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { SmoothScroll } from "@/components/SmoothScroll";
import { routing } from "@/i18n/routing";
import { getSettings, safe } from "@/lib/queries";
import { display, body, bnDisplay, bnBody } from "../fonts";
import "../globals.css";

// CMS-driven content is read at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return {
    title: t("default.title"),
    description: t("default.description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const settings = await safe(getSettings, null);

  const fontVars = `${display.variable} ${body.variable} ${bnDisplay.variable} ${bnBody.variable}`;
  const brand = settings?.brand || "Anchor Eco Resort & Spa";

  return (
    // data-lang drives the Bangla font swap in globals.css (§3, §9).
    <html
      lang={locale}
      data-lang={locale}
      className={`${fontVars} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body">
        {/* Scroll-reveals start at opacity:0 in the SSR markup; if JS never
            runs, show them anyway rather than leaving the page blank. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <NextIntlClientProvider>
          <SmoothScroll />
          <Navbar brand={brand} whatsapp={settings?.whatsapp} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <StickyWhatsApp number={settings?.whatsapp} />
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
