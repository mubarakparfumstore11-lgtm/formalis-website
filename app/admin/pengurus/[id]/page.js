import { createClient } from "@/lib/supabase/server";
import { ubahPengurus } from "../actions";

export const metadata = { title: "Ubah Pengurus - FORMALIS" };

export default async function UbahPengurusPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, { data: departemen }] = await Promise.all([
    supabase.from("pengurus").select("*").eq("id", id).single(),
    supabase.from("departemen").select("*").order("urutan"),
  ]);

  if (!item) {
    return <p className="text-foreground/70">Data pengurus tidak ditemukan.</p>;
  }

  const ubah = ubahPengurus.bind(null, id);

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl text-primary">Ubah Pengurus</h1>

      <form action={ubah} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-dark">Nama</label>
          <input
            name="nama"
            defaultValue={item.nama}
            required
            className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Departemen</label>
          <select
            name="departemen_id"
            defaultValue={item.departemen_id}
            required
            className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
          >
            {(departemen ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Jabatan</label>
          <input
            name="jabatan"
            defaultValue={item.jabatan}
            className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="status_aktif" defaultChecked={item.status_aktif} />
          Status aktif
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-cream hover:bg-primary-light"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
