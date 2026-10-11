import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import { tambahPengurus, hapusPengurus } from "./actions";

export const metadata = { title: "Kelola Pengurus - FORMALIS" };

export default async function AdminPengurusPage() {
  const profilSaya = await getProfilSaya();
  if (profilSaya?.role !== "admin") return <AksesDitolak />;

  const supabase = await createClient();
  const [{ data: pengurus }, { data: departemen }] = await Promise.all([
    supabase
      .from("pengurus")
      .select("*, departemen(nama)")
      .order("departemen_id")
      .order("urutan"),
    supabase.from("departemen").select("*").order("urutan"),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-primary">Kelola Pengurus</h1>

      <form
        action={tambahPengurus}
        className="mt-6 grid gap-3 rounded-xl border border-border-soft bg-surface p-5 shadow-sm sm:grid-cols-4"
      >
        <input
          name="nama"
          placeholder="Nama"
          required
          className="rounded-lg border border-border-soft bg-background px-3 py-2 sm:col-span-2"
        />
        <select
          name="departemen_id"
          required
          className="rounded-lg border border-border-soft bg-background px-3 py-2"
        >
          {(departemen ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>
        <input
          name="jabatan"
          placeholder="Jabatan (default: Anggota)"
          className="rounded-lg border border-border-soft bg-background px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm sm:col-span-4">
          <input type="checkbox" name="status_aktif" defaultChecked />
          Status aktif
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-cream hover:bg-primary-light sm:col-span-4"
        >
          Tambah Pengurus
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-soft bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-cream">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Departemen</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(pengurus ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border-soft">
                <td className="px-4 py-3">{p.nama}</td>
                <td className="px-4 py-3">{p.departemen?.nama}</td>
                <td className="px-4 py-3">{p.jabatan}</td>
                <td className="px-4 py-3">
                  {p.status_aktif ? (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Aktif</span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">Tidak Aktif</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/pengurus/${p.id}`} className="text-primary hover:underline">
                      Ubah
                    </Link>
                    <form action={hapusPengurus}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-600 hover:underline">
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
