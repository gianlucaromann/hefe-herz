/** Herz aus einem Teigstrang geknotet – eigenes Zeichen von Hefe & Herz. */
export function HeartKnot({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 40C15 34 7 27.5 7 18.5 7 12.7 11.3 9 16 9c3.6 0 6.3 2 8 5 1.7-3 4.4-5 8-5 4.7 0 9 3.7 9 9.5C41 27.5 33 34 24 40z"
        fill="#E9B44C"
        stroke="#3E2A1A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Knotenlinien = Teigstrang */}
      <path d="M24 14c-2.5 4.5-2.8 10 0 16M24 14c2.5 4.5 2.8 10 0 16" fill="none" stroke="#3E2A1A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Wortlogo «Hefe & Herz» (SVG, eigene Gestaltung). */
export function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 48" className={className} role="img" aria-label="Hefe & Herz">
      <title>Hefe &amp; Herz</title>
      <text x="0" y="34" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="30" fontWeight="650" fill="#3E2A1A" letterSpacing="-0.5">
        Hefe
      </text>
      <g transform="translate(72 4) scale(0.82)">
        <path
          d="M24 40C15 34 7 27.5 7 18.5 7 12.7 11.3 9 16 9c3.6 0 6.3 2 8 5 1.7-3 4.4-5 8-5 4.7 0 9 3.7 9 9.5C41 27.5 33 34 24 40z"
          fill="#C8323C"
        />
        <text x="24" y="31" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontStyle="italic" fontSize="20" fontWeight="600" fill="#FFFFFF">
          &amp;
        </text>
      </g>
      <text x="113" y="34" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="30" fontWeight="650" fill="#3E2A1A" letterSpacing="-0.5">
        Herz
      </text>
    </svg>
  );
}
