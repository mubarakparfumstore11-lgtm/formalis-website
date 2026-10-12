"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAKS_DIMENSI = 800;

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

  return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

export default function UnggahFotoPengurus({ pengurusId, fotoUrl }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();

    const blob = await kompresGambar(file);
    const path = `pengurus/${pengurusId}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("foto")
      .upload(path, blob, { contentType: "image/jpeg" });

    if (!uploadError) {
      const { data } = supabase.storage.from("foto").getPublicUrl(path);
      await supabase
        .from("pengurus")
        .update({ foto_url: data.publicUrl })
        .eq("id", pengurusId);
    }

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleHapus() {
    const supabase = createClient();
    const path = fotoUrl?.split("/storage/v1/object/public/foto/")[1];
    if (path) await supabase.storage.from("foto").remove([path]);
    await supabase.from("pengurus").update({ foto_url: null }).eq("id", pengurusId);
    router.refresh();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-primary-dark">Foto Pengurus</label>

      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-background">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-foreground/50">Belum ada</span>
          )}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="mt-1 text-sm text-gold">Mengunggah...</p>}
          {fotoUrl && !uploading && (
            <button
              type="button"
              onClick={handleHapus}
              className="mt-1 text-xs font-semibold text-red-600 hover:underline"
            >
              Hapus Foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
