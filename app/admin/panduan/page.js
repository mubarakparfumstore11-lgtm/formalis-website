import { getProfilSaya } from "@/lib/auth-helpers";
import AksesDitolak from "@/components/AksesDitolak";

export const metadata = { title: "Panduan Penggunaan - FORMALIS" };

function Bagian({ judul, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl text-primary-dark">{judul}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

export default async function PanduanPage() {
  const profilSaya = await getProfilSaya();
  if (!profilSaya) return <AksesDitolak />;

  const { role } = profilSaya;

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl text-primary">Panduan Penggunaan Panel Admin</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Login Anda saat ini: <span className="font-semibold text-primary-dark">{profilSaya.nama}</span> (peran:{" "}
        <span className="font-semibold text-primary-dark">{role}</span>)
      </p>

      <Bagian judul="Peran dan Akses">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Admin</strong> — akses penuh: kelola pengurus, semua program kerja, kas, dan pemasukan/pengeluaran.</li>
          <li><strong>Bendahara</strong> — hanya akses Kas dan Pemasukan/Pengeluaran.</li>
          <li><strong>Pengurus Departemen</strong> — hanya bisa kelola program kerja departemennya sendiri.</li>
        </ul>
      </Bagian>

      {role === "admin" && (
        <Bagian judul="Mengelola Pengurus">
          <p>Menu <strong>Kelola Pengurus</strong> (hanya admin):</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Isi formulir di atas tabel untuk menambah pengurus baru (nama, departemen, jabatan, status aktif).</li>
            <li>Klik <strong>Ubah</strong> pada baris pengurus untuk mengubah data, mengganti departemen/jabatan, atau mengunggah foto pengurus (foto otomatis dikompres, tidak perlu diedit dulu).</li>
            <li>Klik <strong>Hapus</strong> untuk menghapus pengurus (data program kerja departemen tidak ikut terhapus).</li>
            <li>Nonaktifkan pengurus yang sudah tidak menjabat lewat centang &ldquo;Status aktif&rdquo; di halaman Ubah, tanpa perlu menghapus riwayatnya.</li>
          </ul>
        </Bagian>
      )}

      {role !== "bendahara" && (
        <Bagian judul="Mengelola Program Kerja">
          <p>Menu <strong>Kelola Program Kerja</strong>:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Klik <strong>+ Tambah Baru</strong> untuk membuat program kerja, lalu isi tujuan, deskripsi, sasaran, indikator keberhasilan, waktu, anggaran, dan penanggung jawab.</li>
            <li>Ubah <strong>Status</strong> sesuai perkembangan: Belum Diisi → Belum Terlaksana → Berjalan → Terlaksana.</li>
            <li>Di halaman Ubah program kerja, scroll ke bagian <strong>Galeri Foto</strong> untuk mengunggah foto kegiatan (bisa pilih banyak foto sekaligus). Foto ini otomatis muncul di Galeri Kegiatan Beranda.</li>
            {role === "pengurus_departemen" && (
              <li>Anda hanya bisa mengubah program kerja milik departemen Anda sendiri.</li>
            )}
          </ul>
        </Bagian>
      )}

      {role !== "pengurus_departemen" && (
        <>
          <Bagian judul="Mengelola Kas (Iuran Bulanan)">
            <ul className="list-disc space-y-1 pl-5">
              <li>Menu <strong>Kelola Kas</strong> menampilkan tabel pengurus x bulan. Klik lingkaran kosong pada kolom bulan untuk menandai pengurus tersebut sudah bayar iuran bulan itu (klik lagi untuk membatalkan).</li>
              <li>Bagian <strong>Daftar Menunggak</strong> otomatis menunjukkan siapa yang belum lunas dan sisa tagihannya.</li>
              <li>Klik <strong>Ekspor Excel</strong> untuk mengunduh rekap kas sebagai file Excel.</li>
            </ul>
          </Bagian>

          <Bagian judul="Pemasukan dan Pengeluaran Lain">
            <ul className="list-disc space-y-1 pl-5">
              <li>Menu <strong>Pemasukan/Pengeluaran</strong> untuk mencatat uang masuk/keluar di luar iuran bulanan (misalnya dana kegiatan atau donasi).</li>
              <li>Isi tanggal, jenis (pemasukan/pengeluaran), jumlah, dan keterangan, lalu klik <strong>Tambah Transaksi</strong>.</li>
              <li><strong>Saldo Akhir</strong> dihitung otomatis dari iuran yang lunas ditambah pemasukan lain, dikurangi pengeluaran.</li>
            </ul>
          </Bagian>
        </>
      )}

      <Bagian judul="Lain-lain">
        <ul className="list-disc space-y-1 pl-5">
          <li>Lupa password? Minta admin untuk membuatkan akun login baru lewat Supabase (hubungi pengembang website jika belum tahu caranya).</li>
          <li>Semua perubahan tersimpan otomatis ke database, tidak perlu menekan tombol &ldquo;Save&rdquo; terpisah selain tombol di setiap formulir.</li>
          <li>Klik <strong>Keluar</strong> di pojok kanan atas setelah selesai memakai panel, terutama jika memakai perangkat bersama.</li>
        </ul>
      </Bagian>
    </div>
  );
}
