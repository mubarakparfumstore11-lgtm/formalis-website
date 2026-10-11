"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function tandaiLunas(formData) {
  const supabase = await createClient();

  await supabase.from("kas").insert({
    pengurus_id: formData.get("pengurus_id"),
    bulan: formData.get("bulan"),
    tanggal_bayar: new Date().toISOString().slice(0, 10),
  });

  revalidatePath("/admin/kas");
}

export async function batalkanLunas(formData) {
  const supabase = await createClient();

  await supabase
    .from("kas")
    .delete()
    .eq("pengurus_id", formData.get("pengurus_id"))
    .eq("bulan", formData.get("bulan"));

  revalidatePath("/admin/kas");
}
