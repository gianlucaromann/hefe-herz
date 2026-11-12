/** Einfache, eigene SVG-Illustrationen als Produktbild-Platzhalter. */
const K = '#3E2A1A'; // Kontur
const G = '#E9B44C'; // Getreide
const L = '#F6E2B3'; // hell
const R = '#C8323C'; // Herz-Rot
const W = '#FFFFFF';
const s = { stroke: K, strokeWidth: 2.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Shape({ art }: { art: string }) {
  switch (art) {
    case 'gipfeli':
      return (
        <g {...s}>
          <path d="M22 58c8-22 28-30 38-30s30 8 38 30c-8 4-16-2-20-6-6 8-30 8-36 0-4 4-12 10-20 6z" fill={G} />
          <path d="M48 32l4 22M60 28v26M72 32l-4 22" fill="none" />
        </g>
      );
    case 'becher':
      return (
        <g {...s}>
          <path d="M40 30h40l-5 42H45z" fill={W} />
          <path d="M42 44h36l-3 28H45z" fill={L} />
          <circle cx="52" cy="40" r="4" fill={R} />
          <circle cx="64" cy="38" r="4" fill={R} />
          <circle cx="70" cy="42" r="3" fill="#6B5544" />
        </g>
      );
    case 'set':
      return (
        <g {...s}>
          <path d="M14 62c5-14 18-20 25-20s20 6 25 20c-6 3-11-1-14-4-4 5-18 5-22 0-3 3-8 7-14 4z" fill={G} />
          <path d="M72 38h28l-3 34H75z" fill={W} />
          <path d="M70 38h32" />
          <path d="M80 30c0-4 4-4 4-8M90 30c0-4 4-4 4-8" fill="none" opacity=".6" />
        </g>
      );
    case 'sandwich':
      return (
        <g {...s}>
          <path d="M20 46c0-10 18-16 40-16s40 6 40 16z" fill={G} />
          <path d="M18 50c14 4 28-4 42 0s28-4 42 0" fill="none" stroke="#5E8C3A" strokeWidth="4" />
          <rect x="22" y="52" width="76" height="6" rx="3" fill={R} />
          <path d="M20 60h80c0 8-18 12-40 12s-40-4-40-12z" fill={G} />
        </g>
      );
    case 'wrap':
      return (
        <g {...s}>
          <path d="M30 70L56 22c10 0 24 8 34 18L46 76z" fill={L} />
          <path d="M56 22c4 10 16 20 34 18" fill="none" />
          <circle cx="62" cy="34" r="4" fill="#8A5A2B" />
          <circle cx="74" cy="38" r="3" fill="#5E8C3A" />
          <circle cx="66" cy="44" r="3" fill={R} />
        </g>
      );
    case 'quiche':
      return (
        <g {...s}>
          <path d="M24 50h72l-6 20H30z" fill={G} />
          <ellipse cx="60" cy="50" rx="36" ry="10" fill={L} />
          <path d="M44 48l4 2M64 46l4 3M56 54l4 1M76 52l3 1" stroke="#5E8C3A" strokeWidth="3" />
        </g>
      );
    case 'bowl':
      return (
        <g {...s}>
          <path d="M22 46h76c0 16-16 26-38 26S22 62 22 46z" fill={W} />
          <circle cx="44" cy="42" r="8" fill="#5E8C3A" />
          <circle cx="62" cy="40" r="8" fill={G} />
          <circle cx="78" cy="43" r="7" fill={R} />
        </g>
      );
    case 'suppe':
      return (
        <g {...s}>
          <path d="M26 46h68c0 14-14 24-34 24S26 60 26 46z" fill={W} />
          <ellipse cx="60" cy="46" rx="34" ry="6" fill={G} />
          <path d="M48 36c0-4 4-4 4-8M60 36c0-4 4-4 4-8M72 36c0-4 4-4 4-8" fill="none" opacity=".6" />
        </g>
      );
    case 'brezel':
      return (
        <g {...s} fill="none" strokeWidth="9" stroke="#8A5A2B">
          <path d="M40 66c-16-6-18-34 4-36 14-1 18 18 16 22-2-4 2-23 16-22 22 2 20 30 4 36M44 46l32 18M76 46L44 64" />
        </g>
      );
    case 'knoten':
      return (
        <g {...s}>
          <path d="M60 76C46 68 30 58 30 42c0-9 6-15 14-15 7 0 12 4 16 10 4-6 9-10 16-10 8 0 14 6 14 15 0 16-16 26-30 34z" fill={G} />
          <path d="M60 37c-5 9-5 22 0 32M60 37c5 9 5 22 0 32" fill="none" />
        </g>
      );
    case 'brot':
      return (
        <g {...s}>
          <path d="M18 60c0-18 18-30 42-30s42 12 42 30c0 6-6 10-12 10H30c-6 0-12-4-12-10z" fill="#B87A3D" />
          <path d="M40 40l8 10M58 36l8 12M76 40l8 10" stroke={L} />
        </g>
      );
    case 'stange':
      return (
        <g {...s}>
          <rect x="20" y="40" width="80" height="16" rx="8" fill={G} transform="rotate(-12 60 48)" />
          <path d="M34 50l6-6M50 47l6-6M66 44l6-6M82 41l6-6" stroke={L} />
        </g>
      );
    case 'schnecke':
      return (
        <g {...s}>
          <circle cx="60" cy="50" r="24" fill={G} />
          <path d="M60 50c0-4 6-4 6 0s-10 8-12 0 10-14 18-6 0 24-14 22-20-14-14-24" fill="none" stroke="#8A5A2B" />
        </g>
      );
    case 'brownie':
      return (
        <g {...s}>
          <path d="M30 40l40-8 20 12-40 10z" fill="#7A4A2A" />
          <path d="M30 40v16l20 12V54zM50 54v14l40-12V44z" fill="#5C3520" />
          <circle cx="58" cy="40" r="1.5" fill={W} stroke="none" />
          <circle cx="68" cy="43" r="1.5" fill={W} stroke="none" />
        </g>
      );
    case 'wähe':
      return (
        <g {...s}>
          <path d="M24 66L60 26l36 40z" fill={G} />
          <path d="M34 60L60 32l26 28z" fill={L} />
          <path d="M44 54c4-4 8-4 12 0M60 50c4-4 8-4 12 0" fill="none" stroke={R} />
        </g>
      );
    case 'kaffee':
      return (
        <g {...s}>
          <path d="M38 34h44l-4 40H42z" fill={W} />
          <rect x="36" y="28" width="48" height="8" rx="3" fill={K} />
          <rect x="41" y="46" width="38" height="14" fill={R} />
          <path d="M54 53c3-4 9-4 12 0" stroke={W} fill="none" />
        </g>
      );
    case 'flasche':
    default:
      return (
        <g {...s}>
          <path d="M52 22h16v10c8 4 10 10 10 18v24H42V50c0-8 2-14 10-18z" fill={W} />
          <path d="M42 50h36v24H42z" fill={G} />
          <rect x="50" y="16" width="20" height="8" rx="2" fill={R} />
        </g>
      );
  }
}

export function ProductArt({ art, className = '' }: { art: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" focusable="false">
      <rect width="120" height="90" fill="#FBF0DC" />
      <ellipse cx="60" cy="78" rx="44" ry="6" fill="#3E2A1A" opacity=".07" />
      <Shape art={art} />
    </svg>
  );
}
