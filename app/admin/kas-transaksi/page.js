import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import { formatRupiah, IURAN_PER_BULAN } from "@/lib/kas";
import { tambahTransaksi, hapusTransaksi } from "./actions";

export const metadata = { title: "Pemasukan dan Pengeluaran Kas - FORMALIS" };

export default async function KasTransaksiPage() {
  const profilSaya = await getProfilSaya();
  if (!profilSaya || profilSaya.role === "pengurus_departemen") return <AksesDitolak />;

  const supabase = await createClient();
  const [{ data: transaksi }, { count: jumlahIuranLunas }] = await Promise.all([
    supabase.from("kas_transaksi").select("*").order("tanggal", { ascending: false }),
    supabase.from("kas").select("*", { count: "exact", head: true }),
  ]);

  const totalIuran = (jumlahIuranLunas ?? 0) * IURAN_PER_BULAN;
  const totalMasuk = (transaksi ?? [])
    .filter((t) => t.jenis === "masuk")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalKeluar = (transaksi ?? [])
    .filter((t) => t.jenis === "keluar")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const saldoAkhir = totalIuran + totalMasuk - totalKeluar;

  return (
    <div>
      <h1 className="font-heading text-2xl text-primary">Pemasukan dan Pengeluaran Kas</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Iuran Bulanan Terkumpul</p>
          <p className="mt-1 text-xl font-bold text-primary">{formatRupiah(totalIuran)}</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Pemasukan + Pengeluaran Lain</p>
          <p className="mt-1 text-xl font-bold text-primary">
            {formatRupiah(totalMasuk)} / -{formatRupiah(totalKeluar)}
          </p>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold/10 p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Saldo Akhir</p>
          <p className="mt-1 text-xl font-bold text-primary-dark">{formatRupiah(saldoAkhir)}</p>
        </div>
      </div>

      <form
        action={tambahTransaksi}
        className="mt-6 grid gap-3 rounded-xl border border-border-soft bg-surface p-5 shadow-sm sm:grid-cols-4"
      >
        <input name="tanggal" type="date" required className="rounded-lg border border-border-soft bg-background px-3 py-2" />
        <select name="jenis" required className="rounded-lg border border-border-soft bg-background px-3 py-2">
          <option value="masuk">Pemasukan</option>
          <option value="keluar">Pengeluaran</option>
        </select>
        <input name="jumlah" type="number" placeholder="Jumlah (Rp)" required className="rounded-lg border border-border-soft bg-background px-3 py-2" />
        <input name="keterangan" placeholder="Keterangan" required className="rounded-lg border border-border-soft bg-background px-3 py-2" />
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-primary-light sm:col-span-4">
          Tambah Transaksi
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-soft bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-cream">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3">Dicatat Oleh</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(transaksi ?? []).map((t) => (
              <tr key={t.id} className="border-t border-border-soft">
                <td className="px-4 py-3">{t.tanggal}</td>
                <td className="px-4 py-3 capitalize">{t.jenis}</td>
                <td className="px-4 py-3">{formatRupiah(t.jumlah)}</td>
                <td className="px-4 py-3">{t.keterangan}</td>
                <td className="px-4 py-3">{t.dicatat_oleh}</td>
                <td className="px-4 py-3">
                  <form action={hapusTransaksi}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-red-600 hover:underline">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!transaksi || transaksi.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-foreground/60">
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
