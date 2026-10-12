const TITIK = {
  matahari: { x: 380, y: 562 },
  buku: { x: 500, y: 643 },
  tulisan: { x: 452, y: 716 },
};

const KOTAK = [
  {
    key: "matahari",
    judul: "Matahari Terbit",
    teks: "Melambangkan bahwa organisasi ini akan menyebarkan cahaya dakwah ke seluruh alam.",
    x: 15,
    y: 15,
    w: 300,
    h: 115,
    garisDari: { x: 165, y: 130 },
  },
  {
    key: "buku",
    judul: "Buku Terbuka dengan Tulisan Qur'an Hadits",
    teks: "Menunjukkan bahwa landasan kita adalah Al-Qur'an dan Al-Hadits.",
    x: 685,
    y: 15,
    w: 300,
    h: 130,
    garisDari: { x: 835, y: 145 },
  },
  {
    key: "tulisan",
    judul: "Tulisan FORMALIS dengan Huruf R Berbentuk Pulau Sulawesi",
    teks: "Menandakan asal organisatoris FORMALIS, yaitu seluruh provinsi yang ada di Sulawesi.",
    x: 330,
    y: 850,
    w: 340,
    h: 130,
    garisDari: { x: 500, y: 850 },
  },
];

export default function MaknaLambangDiagram() {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="hidden w-full sm:block"
      role="img"
      aria-label="Diagram makna lambang FORMALIS"
    >
      {KOTAK.map((k) => {
        const titik = TITIK[k.key];
        return (
          <g key={k.key}>
            <line
              x1={k.garisDari.x}
              y1={k.garisDari.y}
              x2={titik.x}
              y2={titik.y}
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
            <circle cx={titik.x} cy={titik.y} r="7" fill="var(--color-gold)" />
          </g>
        );
      })}

      <image
        href="/logo-formalis.jpg"
        x="260"
        y="420"
        width="480"
        height="405"
      />

      {KOTAK.map((k) => (
        <g key={k.key}>
          <rect
            x={k.x}
            y={k.y}
            width={k.w}
            height={k.h}
            rx="14"
            fill="var(--color-surface)"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <foreignObject x={k.x + 14} y={k.y + 10} width={k.w - 28} height={k.h - 20}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-primary-dark)", margin: 0, lineHeight: 1.25 }}>
                {k.judul}
              </p>
              <p style={{ fontSize: "19px", color: "var(--foreground)", opacity: 0.85, margin: "6px 0 0 0", lineHeight: 1.3 }}>
                {k.teks}
              </p>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}
