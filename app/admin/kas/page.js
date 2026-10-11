import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import { hitungRekapKas, formatRupiah, DAFTAR_BULAN_KAS } from "@/lib/kas";
import { tandaiLunas, batalkanLunas } from "./actions";

export const metadata = { title: "Kelola Kas - FORMALIS" };

export default async function AdminKasPage({ searchParams }) {
  const profilSaya = await getProfilSaya();
  if (!profilSaya || profilSaya.role === "pengurus_departemen") return <AksesDitolak />;

  const params = await searchParams;
  const departemenId = params?.departemen || "";

  const supabase = await createClient();
  const [{ data: departemen }, pengurusQuery, { data: kas }] = await Promise.all([
    supabase.from("departemen").select("*").order("urutan"),
    (() => {
      let q = supabase.from("pengurus").select("*, departemen(nama)").order("urutan");
      if (departemenId) q = q.eq("departemen_id", departemenId);
      return q;
    })(),
    supabase.from("kas").select("*"),
  ]);

  const pengurus = pengurusQuery.data ?? [];
  const { baris, totalTerkumpul, targetTotal, persentase, jumlahLunasPenuh, jumlahBelumLunas, menunggak } =
    hitungRekapKas(pengurus, kas ?? []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl text-primary">Kelola Kas</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/kas/export"
            className="rounded-lg border border-primary/30 px-3 py-1.5 text-sm text-primary hover:bg-primary/5"
          >
            Ekspor Excel
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        Iuran Rp10.000 per bulan, Desember 2025 - September 2026 (total Rp100.000 per pengurus).
      </p>

      <form className="mt-4 flex gap-2">
        <select
          name="departemen"
          defaultValue={departemenId}
          className="rounded-lg border border-border-soft bg-background px-3 py-2 text-sm"
        >
          <option value="">Semua Departemen</option>
          {(departemen ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-primary-light"
        >
          Tampilkan
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Terkumpul</p>
          <p className="mt-1 text-xl font-bold text-primary">{formatRupiah(totalTerkumpul)}</p>
          <p className="text-xs text-foreground/50">dari target {formatRupiah(targetTotal)}</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Persentase Target</p>
          <p className="mt-1 text-xl font-bold text-primary">{persentase}%</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Lunas Penuh</p>
          <p className="mt-1 text-xl font-bold text-primary">{jumlahLunasPenuh} / {baris.length}</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4 shadow-sm">
          <p className="text-sm text-foreground/60">Belum Lunas</p>
          <p className="mt-1 text-xl font-bold text-gold">{jumlahBelumLunas}</p>
        </div>
      </div>

      {menunggak.length > 0 && (
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <p className="font-semibold text-primary-dark">Daftar Menunggak</p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
            {menunggak.map((b) => (
              <li key={b.pengurus.id} className="flex justify-between">
                <span>{b.pengurus.nama}</span>
                <span className="text-foreground/70">Sisa {formatRupiah(b.sisaTagihan)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border-soft bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary text-cream">
            <tr>
              <th className="bg-primary px-4 py-3">Nama</th>
              {DAFTAR_BULAN_KAS.map((b) => (
                <th key={b.value} className="px-2 py-3 text-center">
                  {b.label}
                </th>
              ))}
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {baris.map((b) => (
              <tr key={b.pengurus.id} className="border-t border-border-soft">
                <td className="bg-surface px-4 py-2 font-medium whitespace-nowrap">{b.pengurus.nama}</td>
                {DAFTAR_BULAN_KAS.map((bln) => {
                  const tanggal = b.bulanMap.get(bln.value);
                  const lunas = Boolean(tanggal);
                  return (
                    <td key={bln.value} className="px-2 py-2 text-center">
                      <form action={lunas ? batalkanLunas : tandaiLunas}>
                        <input type="hidden" name="pengurus_id" value={b.pengurus.id} />
                        <input type="hidden" name="bulan" value={bln.value} />
                        <button
                          type="submit"
                          title={lunas ? `Lunas: ${tanggal}` : "Klik untuk tandai lunas"}
                          className={
                            lunas
                              ? "h-7 w-7 rounded-full bg-primary text-cream"
                              : "h-7 w-7 rounded-full border border-foreground/20 text-foreground/30 hover:border-primary"
                          }
                        >
                          {lunas ? "✓" : ""}
                        </button>
                      </form>
                    </td>
                  );
                })}
                <td className="px-4 py-2">
                  {b.lunasPenuh ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Lunas</span>
                  ) : (
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-primary-dark">Belum Lunas</span>
                  )}
                </td>
              </tr>
            ))}
            {baris.length === 0 && (
              <tr>
                <td colSpan={DAFTAR_BULAN_KAS.length + 2} className="px-4 py-6 text-center text-foreground/60">
                  Belum ada data pengurus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
