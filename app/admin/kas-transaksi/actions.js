"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function tambahTransaksi(formData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama")
    .eq("id", userData.user.id)
    .single();

  await supabase.from("kas_transaksi").insert({
    tanggal: formData.get("tanggal"),
    jenis: formData.get("jenis"),
    jumlah: Number(formData.get("jumlah")),
    keterangan: formData.get("keterangan"),
    dicatat_oleh: profile?.nama ?? null,
  });

  revalidatePath("/admin/kas-transaksi");
}

export async function hapusTransaksi(formData) {
  const supabase = await createClient();
  await supabase.from("kas_transaksi").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/kas-transaksi");
}
