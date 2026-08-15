import { getAllBookings } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { BookingsManager } from "@/components/admin/BookingsManager";

export default async function BookingsPage() {
  const rows = await safe(getAllBookings, []);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Bookings</h2>
      <BookingsManager rows={rows} />
    </div>
  );
}
