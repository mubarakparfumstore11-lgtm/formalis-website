"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function ambilData(formData) {
  const anggaranRaw = formData.get("anggaran");
  return {
    nama: formData.get("nama"),
    departemen_id: formData.get("departemen_id"),
    tujuan: formData.get("tujuan") || null,
    deskripsi: formData.get("deskripsi") || null,
    sasaran: formData.get("sasaran") || null,
    indikator_keberhasilan: formData.get("indikator_keberhasilan") || null,
    waktu: formData.get("waktu") || null,
    anggaran: anggaranRaw ? Number(anggaranRaw) : null,
    penanggung_jawab: formData.get("penanggung_jawab") || null,
    status: formData.get("status"),
  };
}

export async function tambahProgramKerja(formData) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("program_kerja")
    .insert(ambilData(formData))
    .select("id")
    .single();

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
  if (data) redirect(`/admin/program-kerja/${data.id}`);
}

export async function ubahProgramKerja(id, formData) {
  const supabase = await createClient();
  await supabase.from("program_kerja").update(ambilData(formData)).eq("id", id);

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
  revalidatePath(`/program-kerja/${id}`);
  redirect(`/admin/program-kerja/${id}`);
}

export async function hapusProgramKerja(formData) {
  const supabase = await createClient();
  const id = formData.get("id");

  await supabase.from("program_kerja").delete().eq("id", id);

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
}
