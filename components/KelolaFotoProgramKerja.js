"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAKS_DIMENSI = 1600;

async function kompresGambar(file) {
  const img = await createImageBitmap(file);
  let { width, height } = img;

  if (width > MAKS_DIMENSI || height > MAKS_DIMENSI) {
    if (width > height) {
      height = Math.round(height * (MAKS_DIMENSI / width));
      width = MAKS_DIMENSI;
    } else {
      width = Math.round(width * (MAKS_DIMENSI / height));
      height = MAKS_DIMENSI;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);

  return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
}

export default function KelolaFotoProgramKerja({ programKerjaId, foto }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of files) {
      const blob = await kompresGambar(file);
      const path = `${programKerjaId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("foto")
        .upload(path, blob, { contentType: "image/jpeg" });

      if (uploadError) continue;

      const { data } = supabase.storage.from("foto").getPublicUrl(path);
      await supabase
        .from("program_kerja_foto")
        .insert({ program_kerja_id: programKerjaId, url: data.publicUrl });
    }

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleHapus(f) {
    const supabase = createClient();
    const path = f.url.split("/storage/v1/object/public/foto/")[1];
    if (path) await supabase.storage.from("foto").remove([path]);
    await supabase.from("program_kerja_foto").delete().eq("id", f.id);
    router.refresh();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-primary-dark">
        Unggah Foto (otomatis dikompres maksimal 1600px, bisa pilih banyak sekaligus)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="mt-1 text-sm"
      />
      {uploading && <p className="mt-1 text-sm text-gold">Mengunggah...</p>}

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {(foto ?? []).map((f) => (
          <div key={f.id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.url} alt="" className="h-24 w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => handleHapus(f)}
              className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
