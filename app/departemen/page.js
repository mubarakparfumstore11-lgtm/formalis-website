import Link from "next/link";
import { getAllDepartemen } from "@/lib/queries";

export const metadata = { title: "Departemen - FORMALIS" };

export default async function DepartemenPage() {
  const departemen = await getAllDepartemen();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Departemen</h1>
      <p className="mt-2 text-foreground/70">
        Struktur departemen FORMALIS periode 2024-2025.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departemen.map((dept) => (
          <Link
            key={dept.id}
            href={`/departemen/${dept.slug}`}
            className="rounded-xl border border-border-soft bg-surface p-5 shadow-sm transition-colors hover:border-gold"
          >
            <p className="font-semibold text-primary">{dept.nama}</p>
            <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
              {dept.deskripsi}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
