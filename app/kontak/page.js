import { kontak } from "@/lib/data";

export const metadata = { title: "Kontak - FORMALIS" };

const items = [
  { label: "Instagram", value: kontak.instagram },
  { label: "TikTok", value: kontak.tiktok },
  { label: "WhatsApp", value: kontak.whatsapp },
];

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">Kontak</h1>
      <p className="mt-2 text-foreground/80">
        Hubungi kami melalui media sosial di bawah ini.
      </p>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-primary/10 bg-white p-4 shadow-sm"
          >
            <span className="font-semibold text-primary-dark">
              {item.label}
            </span>
            <span className="text-foreground/70">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
