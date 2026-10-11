import Link from "next/link";
import { getAllDepartemen, getAllProgramKerja } from "@/lib/queries";
import { statusProgramLabel } from "@/lib/data";

export const metadata = { title: "Program Kerja - FORMALIS" };

export default async function ProgramKerjaPage({ searchParams }) {
  const params = await searchParams;
  const departemenSlug = params?.departemen || "";
  const status = params?.status || "";
  const search = params?.q || "";

  const [departemen, programKerja] = await Promise.all([
    getAllDepartemen(),
    getAllProgramKerja({ departemenSlug, status, search }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Program Kerja</h1>
      <p className="mt-2 text-foreground/70">
        {programKerja.length} program kerja ditemukan.
      </p>

      <form className="mt-6 grid gap-3 rounded-xl border border-border-soft bg-surface p-4 sm:grid-cols-4">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Cari program kerja..."
          className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm sm:col-span-2"
        />
        <select
          name="departemen"
          defaultValue={departemenSlug}
          className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm"
        >
          <option value="">Semua Departemen</option>
          {departemen.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.nama}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm"
        >
          <option value="">Semua Status</option>
          {Object.entries(statusProgramLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label.teks}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-primary-light sm:col-span-4"
        >
          Terapkan Filter
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programKerja.map((pk) => {
          const label = statusProgramLabel[pk.status];
          const sampul = pk.program_kerja_foto?.[0]?.url;
          return (
            <Link
              key={pk.id}
              href={`/program-kerja/${pk.id}`}
              className="overflow-hidden rounded-xl border border-border-soft bg-surface shadow-sm transition-colors hover:border-gold"
            >
              <div className="flex h-32 items-center justify-center bg-primary/5 text-xs text-foreground/40">
                {sampul ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sampul} alt={pk.nama} className="h-full w-full object-cover" />
                ) : (
                  "Belum ada foto"
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gold">{pk.departemen?.nama}</p>
                <p className="mt-1 font-medium text-foreground">{pk.nama}</p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${label.kelas}`}>
                  {label.teks}
                </span>
              </div>
            </Link>
          );
        })}
        {programKerja.length === 0 && (
          <p className="text-sm text-foreground/60">Tidak ada program kerja yang cocok.</p>
        )}
      </div>
    </div>
  );
}
