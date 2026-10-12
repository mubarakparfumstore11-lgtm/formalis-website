import Link from "next/link";
import { getAllDepartemen } from "@/lib/queries";

export const metadata = { title: "Departemen - FORMALIS" };

function KartuGrup({ dept }) {
  return (
    <Link
      href={`/departemen/${dept.slug}`}
      className="rounded-xl border border-border-soft bg-surface p-5 shadow-sm transition-colors hover:border-gold"
    >
      <p className="font-semibold text-primary">{dept.nama}</p>
      <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
        {dept.deskripsi}
      </p>
    </Link>
  );
}

export default async function DepartemenPage() {
  const [bph, departemen] = await Promise.all([
    getAllDepartemen({ tipe: "bph" }),
    getAllDepartemen({ tipe: "fungsional" }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Departemen</h1>
      <p className="mt-2 text-foreground/70">
        Struktur pimpinan dan departemen FORMALIS periode 2025-2026.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Pimpinan (BPH)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bph.map((dept) => (
            <KartuGrup key={dept.id} dept={dept} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-primary-dark">Departemen</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departemen.map((dept) => (
            <KartuGrup key={dept.id} dept={dept} />
          ))}
        </div>
      </section>
    </div>
  );
}
