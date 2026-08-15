import { getTranslations, setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const headingFont = locale === "bn" ? "font-bn-display" : "font-display";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-paper px-6 py-24 text-center">
      <h1
        className={`${headingFont} max-w-3xl text-balance text-4xl leading-tight text-ink sm:text-6xl`}
      >
        {t("title")}
      </h1>
      <LanguageSwitcher />
    </main>
  );
}
