"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { reviewSchema, type ReviewInput } from "@/lib/validation";
import { upsertReview, deleteReview } from "@/lib/actions/admin";
import type { Review } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const blank: ReviewInput = {
  author: "",
  rating: 5,
  bodyEn: "",
  bodyBn: "",
  source: "",
  published: true,
  sortOrder: 0,
};

const ta =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

export function ReviewsManager({ rows }: { rows: Review[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ReviewInput>(blank);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), values: editing });

  async function onSubmit(values: ReviewInput) {
    const res = await upsertReview(values);
    if (res.ok) {
      toast.success("Saved");
      setEditing(blank);
      router.refresh();
    } else toast.error(res.error);
  }
  async function onDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const res = await deleteReview(id);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Author</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Published</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-ink">{r.author}</td>
                <td className="p-3">{"★".repeat(r.rating)}</td>
                <td className="p-3">{r.published ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <button
                    className="mr-3 text-forest hover:underline"
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        author: r.author,
                        rating: r.rating,
                        bodyEn: r.bodyEn,
                        bodyBn: r.bodyBn,
                        source: r.source ?? "",
                        published: r.published,
                        sortOrder: r.sortOrder,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="text-red-700 hover:underline" onClick={() => onDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-ink-soft">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid h-fit gap-3 rounded-2xl border border-line bg-paper-raised p-5"
      >
        <h3 className="font-display text-lg text-ink">
          {editing.id ? "Edit review" : "New review"}
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-author">Author</Label>
          <Input id="rv-author" {...register("author")} />
          {errors.author && <p className="text-sm text-red-700">{errors.author.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-rating">Rating (1–5)</Label>
          <Input id="rv-rating" type="number" min={1} max={5} {...register("rating")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-bodyEn">Review (EN)</Label>
          <textarea id="rv-bodyEn" rows={3} className={ta} {...register("bodyEn")} />
          {errors.bodyEn && <p className="text-sm text-red-700">{errors.bodyEn.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-bodyBn">Review (BN)</Label>
          <textarea id="rv-bodyBn" rows={3} className={ta} {...register("bodyBn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-source">Source</Label>
          <Input id="rv-source" {...register("source")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rv-order">Sort order</Label>
          <Input id="rv-order" type="number" {...register("sortOrder")} />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" {...register("published")} /> Published
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
          {editing.id && (
            <Button type="button" variant="outline" onClick={() => setEditing(blank)}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
