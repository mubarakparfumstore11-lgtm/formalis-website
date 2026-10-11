import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDepartemenBySlug,
  getPengurusByDepartemen,
  getProgramKerjaByDepartemen,
} from "@/lib/queries";
import { statusProgramLabel } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dept = await getDepartemenBySlug(slug);
  return { title: dept ? `${dept.nama} - FORMALIS` : "Departemen - FORMALIS" };
}

export default async function DepartemenDetailPage({ params }) {
  const { slug } = await params;
  const dept = await getDepartemenBySlug(slug);

  if (!dept) notFound();

  const [pengurus, programKerja] = await Promise.all([
    getPengurusByDepartemen(dept.id),
    getProgramKerjaByDepartemen(dept.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">{dept.nama}</h1>
      <p className="mt-2 leading-relaxed text-foreground/80">{dept.deskripsi}</p>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-primary-dark">Pengurus</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pengurus.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border-soft bg-surface p-4"
            >
              <p className="font-medium text-foreground">{p.nama}</p>
              <p className="text-sm text-gold">{p.jabatan}</p>
            </div>
          ))}
          {pengurus.length === 0 && (
            <p className="text-sm text-foreground/60">Belum ada data pengurus.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-primary-dark">Program Kerja</h2>
        <div className="mt-4 space-y-3">
          {programKerja.map((pk) => {
            const label = statusProgramLabel[pk.status];
            return (
              <Link
                key={pk.id}
                href={`/program-kerja/${pk.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface p-4 transition-colors hover:border-gold"
              >
                <p className="font-medium text-foreground">{pk.nama}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${label.kelas}`}>
                  {label.teks}
                </span>
              </Link>
            );
          })}
          {programKerja.length === 0 && (
            <p className="text-sm text-foreground/60">Belum ada program kerja.</p>
          )}
        </div>
      </section>
    </div>
  );
}
