"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Uploads an image to the public "media" bucket (admin-only per storage RLS)
// and returns its public URL.
export function ImageUploader({
  onUploaded,
  folder = "uploads",
}: {
  onUploaded: (url: string) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onUploaded(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink hover:bg-sand/40">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={busy}
      />
      {busy ? "Uploading…" : "Upload image"}
    </label>
  );
}
