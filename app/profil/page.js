import { profil } from "@/lib/data";

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
        <p className="mt-2 leading-relaxed text-foreground/90">
          {profil.maknaLambang}
        </p>
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
