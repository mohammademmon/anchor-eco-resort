import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/Container";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12">
      <AdminDashboard />
    </Container>
  );
}
