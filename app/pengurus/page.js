import { getAllDepartemen, getAllPengurus } from "@/lib/queries";

export const metadata = { title: "Pengurus - FORMALIS" };

export default async function PengurusPage({ searchParams }) {
  const params = await searchParams;
  const departemenSlug = params?.departemen || "";
  const search = params?.q || "";

  const [departemen, pengurus] = await Promise.all([
    getAllDepartemen(),
    getAllPengurus({ departemenSlug, search }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Pengurus</h1>
      <p className="mt-2 text-foreground/70">{pengurus.length} pengurus ditemukan.</p>

      <form className="mt-6 grid gap-3 rounded-xl border border-border-soft bg-surface p-4 sm:grid-cols-3">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Cari nama pengurus..."
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
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-primary-light sm:col-span-3"
        >
          Cari
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border-soft bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-cream">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Departemen</th>
              <th className="px-4 py-3">Jabatan</th>
            </tr>
          </thead>
          <tbody>
            {pengurus.map((p) => (
              <tr key={p.id} className="border-t border-border-soft">
                <td className="px-4 py-3">{p.nama}</td>
                <td className="px-4 py-3">{p.departemen?.nama}</td>
                <td className="px-4 py-3">{p.jabatan}</td>
              </tr>
            ))}
            {pengurus.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-foreground/60">
                  Tidak ada pengurus yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
