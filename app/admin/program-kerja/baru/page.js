import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import { tambahProgramKerja } from "../actions";

export const metadata = { title: "Tambah Program Kerja - FORMALIS" };

export default async function TambahProgramKerjaPage() {
  const profilSaya = await getProfilSaya();
  if (!profilSaya || profilSaya.role === "bendahara") return <AksesDitolak />;

  const supabase = await createClient();
  const { data: departemen } = await supabase.from("departemen").select("*").order("urutan");

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-primary">Tambah Program Kerja</h1>

      <form action={tambahProgramKerja} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-dark">Nama Program</label>
          <input
            name="nama"
            required
            className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark">Departemen</label>
          {profilSaya.role === "admin" ? (
            <select
              name="departemen_id"
              required
              className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
            >
              {(departemen ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          ) : (
            <input type="hidden" name="departemen_id" value={profilSaya.departemen_id} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark">Tujuan</label>
          <textarea name="tujuan" rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Deskripsi</label>
          <textarea name="deskripsi" rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Sasaran</label>
          <input name="sasaran" className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Indikator Keberhasilan</label>
          <textarea name="indikator_keberhasilan" rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark">Waktu</label>
            <input name="waktu" className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-dark">Anggaran (Rp)</label>
            <input name="anggaran" type="number" className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Penanggung Jawab</label>
          <input name="penanggung_jawab" className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Status</label>
          <select name="status" defaultValue="belum_diisi" className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2">
            <option value="belum_diisi">Belum Diisi</option>
            <option value="belum_terlaksana">Belum Terlaksana</option>
            <option value="berjalan">Berjalan</option>
            <option value="terlaksana">Terlaksana</option>
          </select>
        </div>

        <button type="submit" className="rounded-lg bg-primary px-4 py-2 font-semibold text-cream hover:bg-primary-light">
          Simpan dan Lanjut Unggah Foto
        </button>
      </form>
    </div>
  );
}
