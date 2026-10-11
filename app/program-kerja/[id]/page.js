import { notFound } from "next/navigation";
import { getProgramKerjaById } from "@/lib/queries";
import { statusProgramLabel } from "@/lib/data";
import { formatRupiah } from "@/lib/kas";
import GaleriFoto from "@/components/GaleriFoto";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pk = await getProgramKerjaById(id);
  return { title: pk ? `${pk.nama} - FORMALIS` : "Program Kerja - FORMALIS" };
}

const baris = [
  ["Tujuan", "tujuan"],
  ["Deskripsi", "deskripsi"],
  ["Sasaran", "sasaran"],
  ["Indikator Keberhasilan", "indikator_keberhasilan"],
  ["Waktu", "waktu"],
  ["Penanggung Jawab", "penanggung_jawab"],
];

export default async function ProgramKerjaDetailPage({ params }) {
  const { id } = await params;
  const pk = await getProgramKerjaById(id);

  if (!pk) notFound();

  const label = statusProgramLabel[pk.status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-gold">{pk.departemen?.nama}</p>
      <h1 className="mt-1 font-heading text-3xl text-primary">{pk.nama}</h1>
      <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${label.kelas}`}>
        {label.teks}
      </span>

      <div className="mt-8 space-y-4 rounded-xl border border-border-soft bg-surface p-5">
        {baris.map(([judul, key]) =>
          pk[key] ? (
            <div key={key}>
              <p className="text-sm font-semibold text-primary-dark">{judul}</p>
              <p className="mt-1 text-sm text-foreground/80">{pk[key]}</p>
            </div>
          ) : null,
        )}
        {pk.anggaran != null && (
          <div>
            <p className="text-sm font-semibold text-primary-dark">Anggaran</p>
            <p className="mt-1 text-sm text-foreground/80">{formatRupiah(pk.anggaran)}</p>
          </div>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Galeri Foto</h2>
        <div className="mt-4">
          <GaleriFoto foto={pk.program_kerja_foto} />
        </div>
      </section>
    </div>
  );
}
