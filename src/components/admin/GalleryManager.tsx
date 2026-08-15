"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { gallerySchema, type GalleryInput } from "@/lib/validation";
import { upsertGallery, deleteGallery } from "@/lib/actions/admin";
import type { GalleryImage } from "@/lib/db/schema";
import { GALLERY_CATEGORIES } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

const blank: GalleryInput = {
  url: "",
  category: "pool",
  captionEn: "",
  captionBn: "",
  published: true,
  sortOrder: 0,
};

const field =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

export function GalleryManager({ rows }: { rows: GalleryImage[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<GalleryInput>(blank);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GalleryInput>({ resolver: zodResolver(gallerySchema), values: editing });
  const url = watch("url");

  async function onSubmit(values: GalleryInput) {
    const res = await upsertGallery(values);
    if (res.ok) {
      toast.success("Saved");
      setEditing(blank);
      router.refresh();
    } else toast.error(res.error);
  }
  async function onDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const res = await deleteGallery(id);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rows.map((r) => (
            <figure key={r.id} className="overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="flex items-center justify-between p-2 text-xs">
                <span className="text-ink-soft">{r.category}</span>
                <span>
                  <button
                    className="mr-2 text-forest hover:underline"
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        url: r.url,
                        category: r.category,
                        captionEn: r.captionEn ?? "",
                        captionBn: r.captionBn ?? "",
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
                </span>
              </figcaption>
            </figure>
          ))}
          {rows.length === 0 && <p className="text-ink-soft">No images yet.</p>}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid h-fit gap-3 rounded-2xl border border-line bg-paper-raised p-5"
      >
        <h3 className="font-display text-lg text-ink">
          {editing.id ? "Edit image" : "New image"}
        </h3>
        <div className="grid gap-1.5">
          <Label>Image</Label>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
          ) : null}
          <ImageUploader folder="gallery" onUploaded={(u) => setValue("url", u)} />
          <input type="hidden" {...register("url")} />
          {errors.url && <p className="text-sm text-red-700">{errors.url.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ga-cat">Category</Label>
          <select id="ga-cat" className={field} {...register("category")}>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ga-capEn">Caption (EN)</Label>
          <Input id="ga-capEn" {...register("captionEn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ga-capBn">Caption (BN)</Label>
          <Input id="ga-capBn" {...register("captionBn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ga-order">Sort order</Label>
          <Input id="ga-order" type="number" {...register("sortOrder")} />
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
