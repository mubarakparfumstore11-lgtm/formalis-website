"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const menu = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/departemen", label: "Departemen" },
  { href: "/program-kerja", label: "Program Kerja" },
  { href: "/pengurus", label: "Pengurus" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative sticky top-0 z-50 overflow-hidden bg-primary text-cream shadow-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, var(--color-gold) 0, transparent 2px), radial-gradient(circle at 30% 60%, var(--color-gold) 0, transparent 2px), radial-gradient(circle at 50% 15%, var(--color-gold) 0, transparent 2px), radial-gradient(circle at 70% 55%, var(--color-gold) 0, transparent 2px), radial-gradient(circle at 90% 25%, var(--color-gold) 0, transparent 2px)",
          backgroundSize: "140px 60px",
        }}
      />
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream">
            <Image
              src="/logo-formalis.jpg"
              alt="Logo FORMALIS"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-heading text-lg tracking-wide text-gold">
            FORMALIS
          </span>
        </Link>

        <button
          className="rounded p-2 md:hidden"
          aria-label="Buka menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-cream mb-1.5"></span>
          <span className="block h-0.5 w-6 bg-cream mb-1.5"></span>
          <span className="block h-0.5 w-6 bg-cream"></span>
        </button>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="relative flex flex-col gap-1 border-t border-primary-light px-4 pb-4 md:hidden">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-2 hover:bg-primary-light"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
