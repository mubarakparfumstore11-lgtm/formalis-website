import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import KelolaFotoProgramKerja from "@/components/KelolaFotoProgramKerja";
import { ubahProgramKerja } from "../actions";

export const metadata = { title: "Ubah Program Kerja - FORMALIS" };

export default async function UbahProgramKerjaPage({ params }) {
  const { id } = await params;
  const profilSaya = await getProfilSaya();
  if (!profilSaya || profilSaya.role === "bendahara") return <AksesDitolak />;

  const supabase = await createClient();
  const [{ data: item }, { data: departemen }] = await Promise.all([
    supabase.from("program_kerja").select("*, program_kerja_foto(*)").eq("id", id).single(),
    supabase.from("departemen").select("*").order("urutan"),
  ]);

  if (!item) {
    return <p className="text-foreground/70">Program kerja tidak ditemukan.</p>;
  }

  if (profilSaya.role === "pengurus_departemen" && item.departemen_id !== profilSaya.departemen_id) {
    return <AksesDitolak />;
  }

  const ubah = ubahProgramKerja.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-primary">Ubah Program Kerja</h1>

      <form action={ubah} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-dark">Nama Program</label>
          <input
            name="nama"
            defaultValue={item.nama}
            required
            className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark">Departemen</label>
          {profilSaya.role === "admin" ? (
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
          ) : (
            <input type="hidden" name="departemen_id" value={item.departemen_id} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark">Tujuan</label>
          <textarea name="tujuan" defaultValue={item.tujuan ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Deskripsi</label>
          <textarea name="deskripsi" defaultValue={item.deskripsi ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Sasaran</label>
          <input name="sasaran" defaultValue={item.sasaran ?? ""} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Indikator Keberhasilan</label>
          <textarea name="indikator_keberhasilan" defaultValue={item.indikator_keberhasilan ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark">Waktu</label>
            <input name="waktu" defaultValue={item.waktu ?? ""} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-dark">Anggaran (Rp)</label>
            <input name="anggaran" type="number" defaultValue={item.anggaran ?? ""} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Penanggung Jawab</label>
          <input name="penanggung_jawab" defaultValue={item.penanggung_jawab ?? ""} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-dark">Status</label>
          <select name="status" defaultValue={item.status} className="mt-1 w-full rounded-lg border border-border-soft bg-background px-3 py-2">
            <option value="belum_diisi">Belum Diisi</option>
            <option value="belum_terlaksana">Belum Terlaksana</option>
            <option value="berjalan">Berjalan</option>
            <option value="terlaksana">Terlaksana</option>
          </select>
        </div>

        <button type="submit" className="rounded-lg bg-primary px-4 py-2 font-semibold text-cream hover:bg-primary-light">
          Simpan Perubahan
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-primary-dark">Galeri Foto</h2>
        <div className="mt-4">
          <KelolaFotoProgramKerja programKerjaId={item.id} foto={item.program_kerja_foto} />
        </div>
      </section>
    </div>
  );
}
