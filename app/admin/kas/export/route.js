import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { hitungRekapKas, DAFTAR_BULAN_KAS } from "@/lib/kas";

export async function GET() {
  const supabase = await createClient();
  const { data: pengurus } = await supabase
    .from("pengurus")
    .select("*, departemen(nama)")
    .order("departemen_id")
    .order("urutan");
  const { data: kas } = await supabase.from("kas").select("*");

  const { baris, totalTerkumpul, targetTotal } = hitungRekapKas(pengurus ?? [], kas ?? []);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Rekap Kas FORMALIS");

  const header = ["Nama", "Departemen", ...DAFTAR_BULAN_KAS.map((b) => b.label), "Total Dibayar", "Status"];
  sheet.addRow(header).font = { bold: true };

  for (const b of baris) {
    const row = [b.pengurus.nama, b.pengurus.departemen?.nama ?? ""];
    for (const bln of DAFTAR_BULAN_KAS) {
      row.push(b.bulanMap.has(bln.value) ? "Lunas" : "Belum");
    }
    row.push(b.jumlahLunas * 10000);
    row.push(b.lunasPenuh ? "Lunas" : "Belum Lunas");
    sheet.addRow(row);
  }

  sheet.addRow([]);
  sheet.addRow(["Total Terkumpul", totalTerkumpul]).font = { bold: true };
  sheet.addRow(["Target Total", targetTotal]).font = { bold: true };

  sheet.columns.forEach((col) => {
    col.width = 14;
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rekap-kas-formalis.xlsx"',
    },
  });
}
