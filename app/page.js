import Link from "next/link";
import Image from "next/image";
import { profil } from "@/lib/data";
import { getAllDepartemen, getFotoKegiatanTerbaru, getRingkasanBeranda } from "@/lib/queries";

export default async function BerandaPage() {
  const [departemen, ringkasan, fotoKegiatan] = await Promise.all([
    getAllDepartemen({ tipe: "fungsional" }),
    getRingkasanBeranda(),
    getFotoKegiatanTerbaru(8),
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
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-cream shadow-lg">
            <Image
              src="/logo-formalis.jpg"
              alt="Logo FORMALIS"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <h1 className="mt-6 font-heading text-4xl text-primary-light md:text-5xl">
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
        {fotoKegiatan.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {fotoKegiatan.map((f) => (
              <Link
                key={f.id}
                href={f.program_kerja ? `/program-kerja/${f.program_kerja.id}` : "/program-kerja"}
                className="group block overflow-hidden rounded-xl border border-border-soft bg-surface shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.url}
                  alt={f.program_kerja?.nama ?? "Foto kegiatan"}
                  className="h-32 w-full object-cover transition-transform group-hover:scale-105 sm:h-40"
                />
                {f.program_kerja && (
                  <p className="truncate px-2 py-2 text-xs text-foreground/70">
                    {f.program_kerja.nama}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-border-soft bg-surface p-8 text-center text-sm text-foreground/60">
            Belum ada foto kegiatan. Foto akan tampil otomatis di sini setelah
            pengurus mengunggahnya lewat panel admin.
          </p>
        )}
      </section>
    </div>
  );
}
