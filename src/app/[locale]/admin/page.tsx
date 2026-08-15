import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-20">
      <AdminLoginForm />
    </Container>
  );
}
