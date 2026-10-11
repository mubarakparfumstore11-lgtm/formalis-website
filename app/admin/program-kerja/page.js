import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";
import { statusProgramLabel } from "@/lib/data";
import { hapusProgramKerja } from "./actions";

export const metadata = { title: "Kelola Program Kerja - FORMALIS" };

export default async function AdminProgramKerjaPage() {
  const profilSaya = await getProfilSaya();
  if (!profilSaya || profilSaya.role === "bendahara") return <AksesDitolak />;

  const supabase = await createClient();
  let query = supabase
    .from("program_kerja")
    .select("*, departemen(nama)")
    .order("created_at", { ascending: false });

  if (profilSaya.role === "pengurus_departemen") {
    query = query.eq("departemen_id", profilSaya.departemen_id);
  }

  const { data: programKerja } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Kelola Program Kerja</h1>
        <Link
          href="/admin/program-kerja/baru"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-cream hover:bg-primary-light"
        >
          + Tambah Baru
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {(programKerja ?? []).map((pk) => {
          const label = statusProgramLabel[pk.status];
          return (
            <div
              key={pk.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-foreground">{pk.nama}</p>
                <p className="text-sm text-foreground/60">{pk.departemen?.nama}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${label.kelas}`}>
                  {label.teks}
                </span>
                <Link href={`/admin/program-kerja/${pk.id}`} className="text-primary hover:underline">
                  Ubah
                </Link>
                <form action={hapusProgramKerja}>
                  <input type="hidden" name="id" value={pk.id} />
                  <button type="submit" className="text-red-600 hover:underline">
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {(!programKerja || programKerja.length === 0) && (
          <p className="text-center text-foreground/60">Belum ada program kerja.</p>
        )}
      </div>
    </div>
  );
}
