export const IURAN_PER_BULAN = 10000;

export const DAFTAR_BULAN_KAS = [
  { value: "2025-12-01", label: "Des 2025" },
  { value: "2026-01-01", label: "Jan 2026" },
  { value: "2026-02-01", label: "Feb 2026" },
  { value: "2026-03-01", label: "Mar 2026" },
  { value: "2026-04-01", label: "Apr 2026" },
  { value: "2026-05-01", label: "Mei 2026" },
  { value: "2026-06-01", label: "Jun 2026" },
  { value: "2026-07-01", label: "Jul 2026" },
  { value: "2026-08-01", label: "Agu 2026" },
  { value: "2026-09-01", label: "Sep 2026" },
];

export const TOTAL_BULAN = DAFTAR_BULAN_KAS.length;
export const TARGET_PER_ORANG = IURAN_PER_BULAN * TOTAL_BULAN;

export function formatRupiah(angka) {
  return "Rp" + Number(angka).toLocaleString("id-ID");
}

// Menyusun data rekap kas dari daftar pengurus + daftar baris pembayaran.
export function hitungRekapKas(pengurus, kas) {
  const bayarPerPengurus = new Map();

  for (const item of kas) {
    if (!bayarPerPengurus.has(item.pengurus_id)) {
      bayarPerPengurus.set(item.pengurus_id, new Map());
    }
    bayarPerPengurus.get(item.pengurus_id).set(item.bulan, item.tanggal_bayar);
  }

  const baris = pengurus.map((p) => {
    const bulanMap = bayarPerPengurus.get(p.id) ?? new Map();
    const jumlahLunas = bulanMap.size;
    return {
      pengurus: p,
      bulanMap,
      jumlahLunas,
      sisaTagihan: (TOTAL_BULAN - jumlahLunas) * IURAN_PER_BULAN,
      lunasPenuh: jumlahLunas === TOTAL_BULAN,
    };
  });

  const totalTerkumpul = baris.reduce((sum, b) => sum + b.jumlahLunas * IURAN_PER_BULAN, 0);
  const targetTotal = baris.length * TARGET_PER_ORANG;
  const jumlahLunasPenuh = baris.filter((b) => b.lunasPenuh).length;
  const menunggak = baris.filter((b) => !b.lunasPenuh);

  return {
    baris,
    totalTerkumpul,
    targetTotal,
    persentase: targetTotal > 0 ? Math.round((totalTerkumpul / targetTotal) * 100) : 0,
    jumlahLunasPenuh,
    jumlahBelumLunas: menunggak.length,
    menunggak,
  };
}
