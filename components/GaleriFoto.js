"use client";

import { useState } from "react";

export default function GaleriFoto({ foto }) {
  const [aktif, setAktif] = useState(null);

  if (!foto || foto.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-soft bg-surface p-6 text-center text-sm text-foreground/60">
        Belum ada foto untuk program kerja ini.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {foto.map((f, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.id}
            src={f.url}
            alt=""
            onClick={() => setAktif(idx)}
            className="h-32 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
          />
        ))}
      </div>

      {aktif !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setAktif(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={foto[aktif].url}
            alt=""
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={() => setAktif(null)}
            className="absolute top-4 right-4 rounded-full bg-cream/90 px-3 py-1 text-sm font-semibold text-primary-dark"
          >
            Tutup
          </button>
        </div>
      )}
    </>
  );
}
