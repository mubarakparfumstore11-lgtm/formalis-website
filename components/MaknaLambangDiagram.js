const TITIK = {
  matahari: { x: 387, y: 588 },
  buku: { x: 500, y: 664 },
  tulisan: { x: 455, y: 732 },
};

const KOTAK = [
  {
    key: "matahari",
    judul: "Matahari Terbit",
    teks: "Melambangkan bahwa organisasi ini akan menyebarkan cahaya dakwah ke seluruh alam.",
    x: 15,
    y: 15,
    w: 330,
    h: 290,
    garisDari: { x: 180, y: 305 },
  },
  {
    key: "buku",
    judul: "Buku Terbuka dengan Tulisan Qur'an Hadits",
    teks: "Menunjukkan bahwa landasan kita adalah Al-Qur'an dan Al-Hadits.",
    x: 655,
    y: 15,
    w: 330,
    h: 290,
    garisDari: { x: 820, y: 305 },
  },
  {
    key: "tulisan",
    judul: "Tulisan FORMALIS dengan Huruf R Berbentuk Pulau Sulawesi",
    teks: "Menandakan asal organisatoris FORMALIS, yaitu seluruh provinsi yang ada di Sulawesi.",
    x: 290,
    y: 875,
    w: 420,
    h: 340,
    garisDari: { x: 500, y: 875 },
  },
];

export default function MaknaLambangDiagram() {
  return (
    <svg
      viewBox="0 0 1000 1240"
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
              strokeWidth="2.5"
            />
            <circle cx={titik.x} cy={titik.y} r="8" fill="var(--color-gold)" stroke="var(--color-surface)" strokeWidth="2" />
          </g>
        );
      })}

      <image
        href="/logo-formalis.jpg"
        x="275"
        y="455"
        width="450"
        height="380"
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
          <foreignObject x={k.x + 16} y={k.y + 12} width={k.w - 32} height={k.h - 24}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontFamily: "var(--font-body)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p style={{ fontSize: "25px", fontWeight: 700, color: "var(--color-primary-dark)", margin: 0, lineHeight: 1.25 }}>
                {k.judul}
              </p>
              <p style={{ fontSize: "19px", color: "var(--foreground)", opacity: 0.85, margin: "8px 0 0 0", lineHeight: 1.35 }}>
                {k.teks}
              </p>
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}
