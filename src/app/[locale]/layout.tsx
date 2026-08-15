import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
  const bodyFont = locale === "bn" ? "font-bn-body" : "font-body";

  return (
    <html lang={locale} className={`${fontVars} h-full antialiased`}>
      <body className={`flex min-h-full flex-col ${bodyFont}`}>
        <NextIntlClientProvider>
          <Navbar settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsAppButton variant="floating" number={settings?.whatsapp} />
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
