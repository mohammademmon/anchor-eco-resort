import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { display, body, bnDisplay, bnBody } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Anchor Eco Resort & Spa",
  description: "Anchor Eco Resort & Spa — eco-luxe retreat.",
};

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

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const fontVars = `${display.variable} ${body.variable} ${bnDisplay.variable} ${bnBody.variable}`;
  const bodyFont = locale === "bn" ? "font-bn-body" : "font-body";

  return (
    <html lang={locale} className={`${fontVars} h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${bodyFont}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
