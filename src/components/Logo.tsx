/* Logo-Farben (aus dem Logo übernommen) */
const LOGO = { herz: '#B8392E', korn: '#EBCB94', aehre: '#8B5226', text: '#2E211A', muted: '#6B5544' };

/** Bildzeichen: Ähre mit Herz (viewBox 60 × 220). */
function MarkShapes() {
  const rows = [
    { y: 74, s: 0.82 },
    { y: 106, s: 0.94 },
    { y: 140, s: 1 },
    { y: 174, s: 1 },
  ];
  return (
    <>
      <path
        d="M30 44C20 37 9 29.5 9 18.5 9 11.6 14 7 20 7c4.4 0 8 2.5 10 6.2C32 9.5 35.6 7 40 7c6 0 11 4.6 11 11.5C51 29.5 40 37 30 44z"
        fill={LOGO.herz}
      />
      <path d="M30 56V214" stroke={LOGO.aehre} strokeWidth="4" strokeLinecap="round" />
      {rows.map(({ y, s }) =>
        [-1, 1].map((side) => (
          <ellipse
            key={`${y}${side}`}
            cx={30 + side * 9.5 * s}
            cy={y}
            rx={8.6 * s}
            ry={15 * s}
            transform={`rotate(${side * 28} ${30 + side * 9.5 * s} ${y})`}
            fill={LOGO.korn}
            stroke={LOGO.aehre}
            strokeWidth="3.4"
          />
        )),
      )}
    </>
  );
}

/** Bildzeichen allein (für Icons, Ladezustände, Stempel). */
export function BrandMark({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 220" className={className} aria-hidden="true" focusable="false">
      <MarkShapes />
    </svg>
  );
}

const SERIF = "'Fraunces Variable', Georgia, 'Times New Roman', serif";

/** Logo quer: Ähre + «Hefe & Herz» auf einer Zeile (Kopfzeile). */
export function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 236 60" className={className} role="img" aria-label="Hefe & Herz">
      <title>Hefe &amp; Herz</title>
      <g transform="translate(2 1) scale(0.262)">
        <MarkShapes />
      </g>
      <text x="28" y="42" fontFamily={SERIF} fontSize="34" fontWeight="560" fill={LOGO.text} letterSpacing="-0.6">
        Hefe{' '}
        <tspan fill={LOGO.herz} fontStyle="italic" fontWeight="500">
          &amp;
        </tspan>{' '}
        Herz
      </text>
    </svg>
  );
}

/** Logo gestapelt wie im Original, mit Linie und Unterzeile (Fusszeile). */
export function LogoStacked({ className = 'h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 372 224" className={className} role="img" aria-label="Hefe & Herz, Bäckerei aus der Region">
      <title>Hefe &amp; Herz – Bäckerei · aus der Region</title>
      <g transform="translate(4 2)">
        <MarkShapes />
      </g>
      <text fontFamily={SERIF} fontSize="70" fontWeight="540" fill={LOGO.text} letterSpacing="-1">
        <tspan x="98" y="86">
          Hefe{' '}
          <tspan fill={LOGO.herz} fontStyle="italic" fontWeight="460">
            &amp;
          </tspan>
        </tspan>
        <tspan x="98" y="156">
          Herz
        </tspan>
      </text>
      <path d="M100 178h62" stroke={LOGO.aehre} strokeWidth="3" />
      <text x="100" y="210" fontFamily="'Inter Variable', system-ui, sans-serif" fontSize="13" fontWeight="500" letterSpacing="3.4" fill={LOGO.muted}>
        BÄCKEREI · AUS DER REGION
      </text>
    </svg>
  );
}

/** Hefi – das Maskottchen: der Herzknoten mit Gesicht. */
export function Hefi({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 42C15 36 6 29 6 19.5 6 13.4 10.6 9 16 9c3.6 0 6.3 2 8 5 1.7-3 4.4-5 8-5 5.4 0 10 4.4 10 10.5C42 29 33 36 24 42z"
        fill="#E9B44C"
        stroke="#3E2A1A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="22" r="2.2" fill="#3E2A1A" />
      <circle cx="30" cy="22" r="2.2" fill="#3E2A1A" />
      <circle cx="14.5" cy="27" r="2.4" fill="#F4A3AB" />
      <circle cx="33.5" cy="27" r="2.4" fill="#F4A3AB" />
      <path d="M20 28c2.4 2.6 5.6 2.6 8 0" fill="none" stroke="#3E2A1A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
