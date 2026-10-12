"use client";

import Link from "next/link";
import { kontak } from "@/lib/data";
import { useEffect, useState } from "react";

export default function Footer() {
  const [tahun, setTahun] = useState(null);

  useEffect(() => {
    setTahun(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto bg-primary-dark text-cream">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm">
        <p className="font-heading text-lg text-gold">FORMALIS</p>
        <p className="mt-1 text-cream/80">
          Forum Komunikasi Mahasiswa LIPIA se-Sulawesi
        </p>
        <p className="mt-3 text-cream/70">
          Instagram:{" "}
          <a href={kontak.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            {kontak.instagram}
          </a>{" "}
          &middot; Facebook: {kontak.facebook} &middot; WhatsApp:{" "}
          <a href={kontak.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            {kontak.whatsapp}
          </a>
        </p>
        <p className="mt-4 text-xs text-cream/50">
          &copy; {tahun ?? ""} FORMALIS &middot;{" "}
          <Link href="/login" className="underline hover:text-gold">
            Login Pengurus
          </Link>
        </p>
      </div>
    </footer>
  );
}
