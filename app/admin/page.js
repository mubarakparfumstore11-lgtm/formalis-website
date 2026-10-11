import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  const cards = [];
  if (profile?.role === "admin") {
    cards.push({
      href: "/admin/pengurus",
      label: "Kelola Pengurus",
      desc: "Tambah, ubah, atau hapus data pengurus dan atur status aktif.",
    });
  }
  cards.push({
    href: "/admin/program-kerja",
    label: "Kelola Program Kerja",
    desc:
      profile?.role === "pengurus_departemen"
        ? "Kelola program kerja dan foto departemen Anda."
        : "Kelola program kerja dan foto seluruh departemen.",
  });
  if (profile?.role === "admin" || profile?.role === "bendahara") {
    cards.push({
      href: "/admin/kas",
      label: "Kelola Kas",
      desc: "Catat iuran bulanan pengurus (Desember 2025 - September 2026).",
    });
    cards.push({
      href: "/admin/kas-transaksi",
      label: "Pemasukan & Pengeluaran",
      desc: "Catat transaksi kas di luar iuran bulanan dan lihat saldo akhir.",
    });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-primary">Dashboard</h1>
      <p className="mt-1 text-foreground/70">
        Selamat datang di panel pengurus. Pilih menu di bawah untuk mengelola data.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-border-soft bg-surface p-5 shadow-sm hover:border-gold transition-colors"
          >
            <p className="font-semibold text-primary">{card.label}</p>
            <p className="mt-1 text-sm text-foreground/70">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
