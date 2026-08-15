"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { offerSchema, type OfferInput } from "@/lib/validation";
import { upsertOffer, deleteOffer } from "@/lib/actions/admin";
import type { Offer } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

const blank: OfferInput = {
  slug: "",
  titleEn: "",
  titleBn: "",
  descriptionEn: "",
  descriptionBn: "",
  badgeEn: "",
  badgeBn: "",
  price: "",
  image: "",
  published: true,
  sortOrder: 0,
};

const ta =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

export function OffersManager({ rows }: { rows: Offer[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<OfferInput>(blank);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfferInput>({ resolver: zodResolver(offerSchema), values: editing });
  const image = watch("image");

  async function onSubmit(values: OfferInput) {
    const res = await upsertOffer(values);
    if (res.ok) {
      toast.success("Saved");
      setEditing(blank);
      router.refresh();
    } else toast.error(res.error);
  }
  async function onDelete(id: string) {
    if (!confirm("Delete this offer?")) return;
    const res = await deleteOffer(id);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-sand/40 text-left text-ink-soft">
            <tr>
              <th className="p-3">Title (EN)</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Published</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-ink">{r.titleEn}</td>
                <td className="p-3 text-ink-soft">{r.slug}</td>
                <td className="p-3">{r.published ? "Yes" : "No"}</td>
                <td className="p-3 text-right">
                  <button
                    className="mr-3 text-forest hover:underline"
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        slug: r.slug,
                        titleEn: r.titleEn,
                        titleBn: r.titleBn,
                        descriptionEn: r.descriptionEn,
                        descriptionBn: r.descriptionBn,
                        badgeEn: r.badgeEn ?? "",
                        badgeBn: r.badgeBn ?? "",
                        price: r.price ?? "",
                        image: r.image ?? "",
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
                  No offers yet.
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
          {editing.id ? "Edit offer" : "New offer"}
        </h3>
        <div className="grid gap-1.5">
          <Label htmlFor="of-slug">Slug</Label>
          <Input id="of-slug" {...register("slug")} />
          {errors.slug && <p className="text-sm text-red-700">{errors.slug.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-titleEn">Title (EN)</Label>
          <Input id="of-titleEn" {...register("titleEn")} />
          {errors.titleEn && <p className="text-sm text-red-700">{errors.titleEn.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-titleBn">Title (BN)</Label>
          <Input id="of-titleBn" {...register("titleBn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-descEn">Description (EN)</Label>
          <textarea id="of-descEn" rows={2} className={ta} {...register("descriptionEn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-descBn">Description (BN)</Label>
          <textarea id="of-descBn" rows={2} className={ta} {...register("descriptionBn")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="of-badgeEn">Badge (EN)</Label>
            <Input id="of-badgeEn" {...register("badgeEn")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="of-badgeBn">Badge (BN)</Label>
            <Input id="of-badgeBn" {...register("badgeBn")} />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-price">Price</Label>
          <Input id="of-price" placeholder="from ৳12,000" {...register("price")} />
        </div>
        <div className="grid gap-1.5">
          <Label>Image</Label>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
          ) : null}
          <div className="flex items-center gap-2">
            <ImageUploader folder="offers" onUploaded={(url) => setValue("image", url)} />
            {image ? (
              <Button type="button" variant="outline" onClick={() => setValue("image", "")}>
                Remove
              </Button>
            ) : null}
          </div>
          <input type="hidden" {...register("image")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-order">Sort order</Label>
          <Input id="of-order" type="number" {...register("sortOrder")} />
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
