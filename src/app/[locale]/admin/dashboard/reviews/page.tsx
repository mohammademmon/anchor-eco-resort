import { getAllReviews } from "@/lib/admin-queries";
import { safe } from "@/lib/queries";
import { ReviewsManager } from "@/components/admin/ReviewsManager";

export default async function ReviewsAdminPage() {
  const rows = await safe(getAllReviews, []);
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-ink">Reviews</h2>
      <ReviewsManager rows={rows} />
    </div>
  );
}
