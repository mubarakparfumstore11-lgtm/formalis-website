import Image from "next/image";
import { profil } from "@/lib/data";
import MaknaLambangDiagram from "@/components/MaknaLambangDiagram";

export const metadata = { title: "Profil - FORMALIS" };

export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl text-primary">Profil Organisasi</h1>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Sejarah Singkat</h2>
        <p className="mt-2 leading-relaxed text-foreground/90">{profil.sejarah}</p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-soft bg-surface p-4">
          <p className="text-sm font-semibold text-gold">Kedudukan</p>
          <p className="mt-1 text-sm text-foreground/80">{profil.kedudukan}</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4">
          <p className="text-sm font-semibold text-gold">Azas</p>
          <p className="mt-1 text-sm text-foreground/80">{profil.azas}</p>
        </div>
        <div className="rounded-xl border border-border-soft bg-surface p-4">
          <p className="text-sm font-semibold text-gold">Sifat</p>
          <p className="mt-1 text-sm text-foreground/80">{profil.sifat}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Makna Lambang</h2>

        <div className="mt-4">
          <MaknaLambangDiagram />
        </div>

        <div className="mt-4 flex flex-col items-center gap-6 sm:hidden">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-surface shadow-sm">
            <Image
              src="/logo-formalis.jpg"
              alt="Logo FORMALIS"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
          <ul className="w-full flex-1 space-y-3">
            {profil.maknaLambang.map((item) => (
              <li
                key={item.simbol}
                className="rounded-xl border border-border-soft bg-surface p-4"
              >
                <p className="font-semibold text-primary-dark">{item.simbol}</p>
                <p className="mt-1 text-sm text-foreground/80">{item.makna}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Jenis Anggota</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90">
          {profil.jenisAnggota.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl text-primary-dark">Kewajiban Anggota</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90">
          {profil.kewajibanAnggota.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
