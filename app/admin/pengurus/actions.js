"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function tambahPengurus(formData) {
  const supabase = await createClient();

  await supabase.from("pengurus").insert({
    nama: formData.get("nama"),
    departemen_id: formData.get("departemen_id"),
    jabatan: formData.get("jabatan") || "Anggota",
    status_aktif: formData.get("status_aktif") === "on",
  });

  revalidatePath("/admin/pengurus");
  revalidatePath("/pengurus");
  revalidatePath("/departemen");
}

export async function ubahPengurus(id, formData) {
  const supabase = await createClient();

  await supabase
    .from("pengurus")
    .update({
      nama: formData.get("nama"),
      departemen_id: formData.get("departemen_id"),
      jabatan: formData.get("jabatan") || "Anggota",
      status_aktif: formData.get("status_aktif") === "on",
    })
    .eq("id", id);

  revalidatePath("/admin/pengurus");
  revalidatePath("/pengurus");
  revalidatePath("/departemen");
  redirect("/admin/pengurus");
}

export async function hapusPengurus(formData) {
  const supabase = await createClient();
  const id = formData.get("id");

  await supabase.from("pengurus").delete().eq("id", id);

  revalidatePath("/admin/pengurus");
  revalidatePath("/pengurus");
  revalidatePath("/departemen");
}
