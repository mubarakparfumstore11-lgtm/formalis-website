-- Skema database FORMALIS (versi proyek besar: 9 departemen, pengurus, program kerja, kas).
-- Jalankan di Supabase: menu "SQL Editor" > "New query" > paste > klik "Run".
-- CATATAN: skrip ini menghapus tabel anggota/program_kerja/berita/kas versi lama
-- (hanya berisi data uji coba, bukan data asli) dan menggantinya dengan struktur baru.

alter table if exists public.kas rename to kas_lama_tidak_dipakai;
alter table if exists public.program_kerja rename to program_kerja_lama_tidak_dipakai;
alter table if exists public.anggota rename to anggota_lama_tidak_dipakai;
alter table if exists public.berita rename to berita_lama_tidak_dipakai;

-- Tabel departemen (3 BPH: Ketum/Korwat, Sekretaris, Bendahara + departemen fungsional)
create table public.departemen (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi text,
  urutan smallint not null default 0,
  tipe text not null default 'fungsional' check (tipe in ('bph','fungsional'))
);

-- Tabel profil login pengurus (dibuat di Tahap 2, kolom baru ditambahkan di sini)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  role text not null,
  created_at timestamptz not null default now()
);
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','bendahara','pengurus_departemen'));
alter table public.profiles add column if not exists departemen_id uuid references public.departemen(id);

-- Tabel pengurus
create table public.pengurus (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  departemen_id uuid not null references public.departemen(id) on delete cascade,
  jabatan text not null default 'Anggota',
  status_aktif boolean not null default true,
  foto_url text,
  urutan smallint not null default 0,
  created_at timestamptz not null default now()
);

-- Tabel program kerja
create table public.program_kerja (
  id uuid primary key default gen_random_uuid(),
  departemen_id uuid not null references public.departemen(id) on delete cascade,
  nama text not null,
  tujuan text,
  deskripsi text,
  sasaran text,
  indikator_keberhasilan text,
  waktu text,
  anggaran bigint,
  penanggung_jawab text,
  status text not null default 'belum_diisi' check (status in ('belum_diisi','belum_terlaksana','berjalan','terlaksana')),
  created_at timestamptz not null default now()
);

-- Galeri foto program kerja
create table public.program_kerja_foto (
  id uuid primary key default gen_random_uuid(),
  program_kerja_id uuid not null references public.program_kerja(id) on delete cascade,
  url text not null,
  urutan smallint not null default 0
);

-- Kas: satu baris = satu pengurus sudah bayar satu bulan tertentu
create table public.kas (
  id uuid primary key default gen_random_uuid(),
  pengurus_id uuid not null references public.pengurus(id) on delete cascade,
  bulan date not null,
  tanggal_bayar date not null default current_date,
  unique (pengurus_id, bulan)
);

-- Catatan pemasukan/pengeluaran kas (selain iuran bulanan)
create table public.kas_transaksi (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null default current_date,
  jenis text not null check (jenis in ('masuk','keluar')),
  jumlah bigint not null,
  keterangan text not null,
  dicatat_oleh text,
  created_at timestamptz not null default now()
);

alter table public.departemen enable row level security;
alter table public.pengurus enable row level security;
alter table public.program_kerja enable row level security;
alter table public.program_kerja_foto enable row level security;
alter table public.profiles enable row level security;
alter table public.kas enable row level security;
alter table public.kas_transaksi enable row level security;

-- Data publik: semua orang boleh membaca departemen, pengurus, program kerja, foto
drop policy if exists "Publik bisa lihat departemen" on public.departemen;
create policy "Publik bisa lihat departemen" on public.departemen for select using (true);

drop policy if exists "Publik bisa lihat pengurus" on public.pengurus;
create policy "Publik bisa lihat pengurus" on public.pengurus for select using (true);

drop policy if exists "Publik bisa lihat program kerja" on public.program_kerja;
create policy "Publik bisa lihat program kerja" on public.program_kerja for select using (true);

drop policy if exists "Publik bisa lihat foto program kerja" on public.program_kerja_foto;
create policy "Publik bisa lihat foto program kerja" on public.program_kerja_foto for select using (true);

-- Hanya Admin yang boleh kelola departemen & pengurus
drop policy if exists "Admin kelola departemen" on public.departemen;
create policy "Admin kelola departemen" on public.departemen for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin kelola pengurus" on public.pengurus;
create policy "Admin kelola pengurus" on public.pengurus for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Admin kelola semua program kerja; pengurus departemen hanya program kerja departemennya sendiri
drop policy if exists "Kelola program kerja sesuai peran" on public.program_kerja;
create policy "Kelola program kerja sesuai peran" on public.program_kerja for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and (p.role = 'admin' or (p.role = 'pengurus_departemen' and p.departemen_id = program_kerja.departemen_id))));

drop policy if exists "Kelola foto program kerja sesuai peran" on public.program_kerja_foto;
create policy "Kelola foto program kerja sesuai peran" on public.program_kerja_foto for all
  using (exists (select 1 from public.profiles p join public.program_kerja pk on pk.id = program_kerja_foto.program_kerja_id where p.id = auth.uid() and (p.role = 'admin' or (p.role = 'pengurus_departemen' and p.departemen_id = pk.departemen_id))));

-- Profil: pengurus hanya bisa lihat profilnya sendiri; admin bisa lihat semua
drop policy if exists "Pengurus bisa lihat profil sendiri" on public.profiles;
create policy "Pengurus bisa lihat profil sendiri" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Admin bisa lihat semua profil" on public.profiles;
create policy "Admin bisa lihat semua profil" on public.profiles for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Kas: semua pengurus yang login boleh lihat, hanya admin & bendahara boleh kelola
drop policy if exists "Pengurus login bisa lihat kas" on public.kas;
create policy "Pengurus login bisa lihat kas" on public.kas for select using (exists (select 1 from public.profiles where id = auth.uid()));

drop policy if exists "Admin dan bendahara kelola kas" on public.kas;
create policy "Admin dan bendahara kelola kas" on public.kas for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','bendahara')));

drop policy if exists "Pengurus login bisa lihat transaksi kas" on public.kas_transaksi;
create policy "Pengurus login bisa lihat transaksi kas" on public.kas_transaksi for select using (exists (select 1 from public.profiles where id = auth.uid()));

drop policy if exists "Admin dan bendahara kelola transaksi kas" on public.kas_transaksi;
create policy "Admin dan bendahara kelola transaksi kas" on public.kas_transaksi for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','bendahara')));
