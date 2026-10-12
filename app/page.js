import Link from "next/link";
import { profil } from "@/lib/data";
import { getAllDepartemen, getRingkasanBeranda } from "@/lib/queries";

export default async function BerandaPage() {
  const [departemen, ringkasan] = await Promise.all([
    getAllDepartemen(),
    getRingkasanBeranda(),
  ]);

  const statistik = [
    { label: "Departemen", nilai: ringkasan.jumlahDepartemen },
    { label: "Pengurus", nilai: ringkasan.jumlahPengurus },
    { label: "Program Kerja", nilai: ringkasan.jumlahProgram },
    { label: "Program Terlaksana", nilai: ringkasan.jumlahTerlaksana },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-primary to-primary-dark text-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cream text-2xl font-bold text-primary shadow-lg">
            F
          </div>
          <h1 className="mt-6 font-heading text-4xl text-gold md:text-5xl">
            {profil.nama}
          </h1>
          <p className="mt-2 text-lg md:text-xl">{profil.kepanjangan}</p>
          <p className="mt-4 font-heading text-lg italic text-cream/90">&ldquo;{profil.slogan}&rdquo;</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statistik.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border-soft bg-surface p-5 text-center shadow-sm"
            >
              <p className="font-heading text-3xl text-primary">{item.nilai}</p>
              <p className="mt-1 text-sm text-foreground/70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-4">
        <h2 className="font-heading text-2xl text-primary">Tujuan Organisasi</h2>
        <ul className="mt-4 space-y-2">
          {profil.tujuan.map((item) => (
            <li key={item} className="flex gap-2 text-foreground/90">
              <span className="text-gold">&#9670;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-heading text-2xl text-primary">Departemen</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departemen.map((dept) => (
            <Link
              key={dept.id}
              href={`/departemen/${dept.slug}`}
              className="rounded-xl border border-border-soft bg-surface p-5 shadow-sm transition-colors hover:border-gold"
            >
              <p className="font-semibold text-primary">{dept.nama}</p>
              <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
                {dept.deskripsi}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-heading text-2xl text-primary">Galeri Kegiatan</h2>
        <p className="mt-4 rounded-xl border border-dashed border-border-soft bg-surface p-8 text-center text-sm text-foreground/60">
          Belum ada foto kegiatan. Foto akan tampil otomatis di sini setelah
          pengurus mengunggahnya lewat panel admin.
        </p>
      </section>
    </div>
  );
}
