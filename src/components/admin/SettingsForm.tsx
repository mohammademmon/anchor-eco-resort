"use client";

import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { settingsSchema, type SettingsInput } from "@/lib/validation";
import { updateSettings } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ta =
  "rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal";

// Defined outside the form component so it is a stable component type
// (defining it inline would remount on each keystroke and drop focus).
function Field({
  register,
  id,
  label,
  type = "text",
}: {
  register: UseFormRegister<SettingsInput>;
  id: keyof SettingsInput;
  label: string;
  type?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      brand: settings?.brand ?? "Anchor Eco Resort & Spa",
      taglineEn: settings?.taglineEn ?? "",
      taglineBn: settings?.taglineBn ?? "",
      heroTitleEn: settings?.heroTitleEn ?? "",
      heroTitleBn: settings?.heroTitleBn ?? "",
      heroSubtitleEn: settings?.heroSubtitleEn ?? "",
      heroSubtitleBn: settings?.heroSubtitleBn ?? "",
      phone1: settings?.phone1 ?? "",
      phone2: settings?.phone2 ?? "",
      phone3: settings?.phone3 ?? "",
      whatsapp: settings?.whatsapp ?? "",
      email: settings?.email ?? "",
      addressEn: settings?.addressEn ?? "",
      addressBn: settings?.addressBn ?? "",
      mapLat: settings?.mapLat ? Number(settings.mapLat) : undefined,
      mapLng: settings?.mapLng ? Number(settings.mapLng) : undefined,
      facebook: settings?.facebook ?? "",
      instagram: settings?.instagram ?? "",
      youtube: settings?.youtube ?? "",
      checkIn: settings?.checkIn ?? "",
      checkOut: settings?.checkOut ?? "",
    },
  });

  async function onSubmit(values: SettingsInput) {
    const res = await updateSettings(values);
    if (res.ok) {
      toast.success("Settings saved");
      router.refresh();
    } else toast.error(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-5">
      <section className="grid gap-3 rounded-2xl border border-line bg-paper-raised p-5">
        <h3 className="font-display text-lg text-ink">Brand</h3>
        <Field register={register} id="brand" label="Brand name" />
        {errors.brand && <p className="text-sm text-red-700">{errors.brand.message}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="taglineEn" label="Tagline (EN)" />
          <Field register={register} id="taglineBn" label="Tagline (BN)" />
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-paper-raised p-5">
        <h3 className="font-display text-lg text-ink">Hero</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="heroTitleEn" label="Hero title (EN)" />
          <Field register={register} id="heroTitleBn" label="Hero title (BN)" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="heroSubtitleEn">Hero subtitle (EN)</Label>
          <textarea id="heroSubtitleEn" rows={2} className={ta} {...register("heroSubtitleEn")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="heroSubtitleBn">Hero subtitle (BN)</Label>
          <textarea id="heroSubtitleBn" rows={2} className={ta} {...register("heroSubtitleBn")} />
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-paper-raised p-5">
        <h3 className="font-display text-lg text-ink">Contact</h3>
        <div className="grid grid-cols-3 gap-3">
          <Field register={register} id="phone1" label="Phone 1" />
          <Field register={register} id="phone2" label="Phone 2" />
          <Field register={register} id="phone3" label="Phone 3" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="whatsapp" label="WhatsApp (no +)" />
          <Field register={register} id="email" label="Email" type="email" />
        </div>
        {errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="addressEn" label="Address (EN)" />
          <Field register={register} id="addressBn" label="Address (BN)" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="mapLat" label="Map latitude" type="number" />
          <Field register={register} id="mapLng" label="Map longitude" type="number" />
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-line bg-paper-raised p-5">
        <h3 className="font-display text-lg text-ink">Socials & stay</h3>
        <Field register={register} id="facebook" label="Facebook URL" />
        <Field register={register} id="instagram" label="Instagram URL" />
        <Field register={register} id="youtube" label="YouTube URL" />
        <div className="grid grid-cols-2 gap-3">
          <Field register={register} id="checkIn" label="Check-in" />
          <Field register={register} id="checkOut" label="Check-out" />
        </div>
      </section>

      <Button type="submit" className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
