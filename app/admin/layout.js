import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseSiap } from "@/lib/supabase/config";
import { logout } from "@/app/login/actions";

function menuUntukRole(role) {
  const menu = [{ href: "/admin", label: "Dashboard" }];
  if (role === "admin") {
    menu.push({ href: "/admin/pengurus", label: "Pengurus" });
  }
  menu.push({ href: "/admin/program-kerja", label: "Program Kerja" });
  if (role === "admin" || role === "bendahara") {
    menu.push({ href: "/admin/kas", label: "Kas" });
    menu.push({ href: "/admin/kas-transaksi", label: "Pemasukan/Pengeluaran" });
  }
  return menu;
}

export default async function AdminLayout({ children }) {
  if (!supabaseSiap) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-heading text-xl text-primary">
          Database Belum Disambungkan
        </h1>
        <p className="mt-2 text-foreground/70">
          Panel pengurus belum bisa dipakai karena website belum terhubung ke
          database Supabase. Hubungi pengembang website untuk menyambungkannya.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nama, role, departemen_id, departemen(nama)")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const menu = menuUntukRole(profile?.role);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary-dark text-cream">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-heading text-lg text-gold">Panel Pengurus FORMALIS</p>
            {profile && (
              <p className="text-xs text-cream/70">
                {profile.nama} &middot; {profile.role}
                {profile.departemen?.nama ? ` (${profile.departemen.nama})` : ""}
              </p>
            )}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-gold/50 px-3 py-1.5 text-sm text-gold hover:bg-gold hover:text-primary-dark transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 hover:bg-primary-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
