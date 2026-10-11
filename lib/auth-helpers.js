import { createClient } from "@/lib/supabase/server";

// Mengambil profil pengurus yang sedang login beserta departemennya.
export async function getProfilSaya() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nama, role, departemen_id")
    .eq("id", userData.user.id)
    .single();

  return profile ?? null;
}
