import { createClient } from "@/lib/supabase/server";

export async function getAllDepartemen() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departemen")
    .select("*")
    .order("urutan");
  return data ?? [];
}

export async function getDepartemenBySlug(slug) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departemen")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

export async function getPengurusByDepartemen(departemenId, { hanyaAktif = true } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("pengurus")
    .select("*")
    .eq("departemen_id", departemenId)
    .order("urutan");
  if (hanyaAktif) query = query.eq("status_aktif", true);
  const { data } = await query;
  return data ?? [];
}

export async function getProgramKerjaByDepartemen(departemenId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("program_kerja")
    .select("*, program_kerja_foto(*)")
    .eq("departemen_id", departemenId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllProgramKerja({ departemenSlug, status, search } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("program_kerja")
    .select("*, program_kerja_foto(*), departemen(nama, slug)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("nama", `%${search}%`);

  const { data } = await query;
  let hasil = data ?? [];

  if (departemenSlug) {
    hasil = hasil.filter((item) => item.departemen?.slug === departemenSlug);
  }

  return hasil;
}

export async function getProgramKerjaById(id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("program_kerja")
    .select("*, program_kerja_foto(*), departemen(nama, slug)")
    .eq("id", id)
    .single();
  return data ?? null;
}

export async function getAllPengurus({ departemenSlug, search, hanyaAktif = true } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("pengurus")
    .select("*, departemen(nama, slug)")
    .order("urutan");

  if (hanyaAktif) query = query.eq("status_aktif", true);
  if (search) query = query.ilike("nama", `%${search}%`);

  const { data } = await query;
  let hasil = data ?? [];

  if (departemenSlug) {
    hasil = hasil.filter((item) => item.departemen?.slug === departemenSlug);
  }

  return hasil;
}

export async function getFotoKegiatanTerbaru(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("program_kerja_foto")
    .select("id, url, program_kerja(id, nama)")
    .order("urutan", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRingkasanBeranda() {
  const supabase = await createClient();

  const [{ count: jumlahDepartemen }, { count: jumlahPengurus }, { count: jumlahProgram }, { count: jumlahTerlaksana }] =
    await Promise.all([
      supabase.from("departemen").select("*", { count: "exact", head: true }),
      supabase.from("pengurus").select("*", { count: "exact", head: true }).eq("status_aktif", true),
      supabase.from("program_kerja").select("*", { count: "exact", head: true }),
      supabase
        .from("program_kerja")
        .select("*", { count: "exact", head: true })
        .eq("status", "terlaksana"),
    ]);

  return {
    jumlahDepartemen: jumlahDepartemen ?? 0,
    jumlahPengurus: jumlahPengurus ?? 0,
    jumlahProgram: jumlahProgram ?? 0,
    jumlahTerlaksana: jumlahTerlaksana ?? 0,
  };
}
