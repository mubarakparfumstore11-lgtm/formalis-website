import { kontak } from "@/lib/data";

export const metadata = { title: "Kontak - FORMALIS" };

const items = [
  { label: "Instagram", value: kontak.instagram, url: kontak.instagramUrl },
  { label: "Facebook", value: kontak.facebook, url: null },
  { label: "WhatsApp", value: kontak.whatsapp, url: kontak.whatsappUrl },
];

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Kontak</h1>
      <p className="mt-2 text-foreground/80">
        Hubungi kami melalui media sosial di bawah ini.
      </p>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-border-soft bg-surface p-4 shadow-sm"
          >
            <span className="font-semibold text-primary-dark">{item.label}</span>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary-light"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-foreground/70">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
