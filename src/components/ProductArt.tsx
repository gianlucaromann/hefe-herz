import { useId, type ReactNode } from 'react';

/**
 * Produktillustrationen (eigene SVGs) mit Verläufen, Glanzlichtern und Schatten
 * für einen möglichst realistischen, ruhigen Look. viewBox 120 × 90.
 */

export const BG: Record<string, string> = {
  zmorge: '#F8EEDC',
  kreation: '#F9E4E2',
  zmittag: '#E6F0E2',
  gebaeck: '#F8EEDC',
  suesses: '#F9E4E2',
  getraenke: '#E3EDF5',
};

type G = (name: string) => string;

function Defs({ id }: { id: string }) {
  const lin = (name: string, stops: [number, string, number?][], x2 = 0, y2 = 1) => (
    <linearGradient id={`${id}-${name}`} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c, op], i) => (
        <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
      ))}
    </linearGradient>
  );
  return (
    <defs>
      {lin('crust', [[0, '#F7D08A'], [0.45, '#DE9F4A'], [1, '#A8622A']])}
      {lin('crustDeep', [[0, '#E9B26A'], [0.5, '#C47F36'], [1, '#86491F']])}
      {lin('whole', [[0, '#C99158'], [0.5, '#9C6331'], [1, '#673C1A']])}
      {lin('laugen', [[0, '#A8663A'], [0.5, '#7A4220'], [1, '#4A2610']])}
      {lin('loaf', [[0, '#B87437'], [0.6, '#8A4F22'], [1, '#5E3416']])}
      {lin('ciabatta', [[0, '#F4E2C2'], [0.6, '#E2C08E'], [1, '#C69A62']])}
      {lin('crumb', [[0, '#FFF6E2'], [1, '#EFD9AE']])}
      {lin('cup', [[0, '#FFFFFF'], [0.7, '#F1ECE4'], [1, '#DCD3C6']], 1, 0)}
      {lin('kraft', [[0, '#D5AE7E'], [1, '#B48A5A']], 1, 0)}
      {lin('coffee', [[0, '#8A5531'], [1, '#3E2213']])}
      {lin('foam', [[0, '#FBF0DE'], [1, '#E7CFA8']])}
      {lin('choc', [[0, '#6E3F22'], [1, '#3A1E0E']])}
      {lin('glass', [[0, '#FFFFFF', 0.75], [0.5, '#FFFFFF', 0.25], [1, '#FFFFFF', 0.6]], 1, 0)}
      {lin('juice', [[0, '#FFC24A'], [1, '#F08A1C']])}
      {lin('tea', [[0, '#F6B98A'], [1, '#D9783F']])}
      {lin('soup', [[0, '#F2A04A'], [1, '#D9762A']])}
      {lin('ceramic', [[0, '#FFFFFF'], [1, '#E4DDD2']])}
      {lin('lettuce', [[0, '#9CCB5E'], [1, '#4F8A2C']])}
      {lin('cheese', [[0, '#FBDA6A'], [1, '#EBB33A']])}
      {lin('ham', [[0, '#F3B2AE'], [1, '#D97F7C']])}
      {lin('tomato', [[0, '#F06A4E'], [1, '#C83A2A']])}
      {lin('cream', [[0, '#FFFBF2'], [1, '#EFE4CF']])}
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0" stopColor="#3E2A1A" stopOpacity=".28" />
        <stop offset="1" stopColor="#3E2A1A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-vignette`} cx=".5" cy=".42" r=".75">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const Shadow = ({ g, cx = 60, cy = 76, rx = 40, ry = 6 }: { g: G; cx?: number; cy?: number; rx?: number; ry?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={g('shadow')} />
);

const Shine = ({ d, o = 0.45 }: { d: string; o?: number }) => <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={o} strokeWidth="2" strokeLinecap="round" />;

/* ---------- Gipfeli ---------- */
function Croissant({ g, fill = 'crust', x = 0, y = 0, s = 1, glaze = false, seeds = false }: { g: G; fill?: string; x?: number; y?: number; s?: number; glaze?: boolean; seeds?: boolean }) {
  const f = g(fill);
  const edge = fill === 'whole' ? '#5A3214' : '#9A5A22';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="17" cy="62" rx="8" ry="4.5" transform="rotate(-38 17 62)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="103" cy="62" rx="8" ry="4.5" transform="rotate(38 103 62)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="29" cy="56" rx="12" ry="8" transform="rotate(-32 29 56)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="91" cy="56" rx="12" ry="8" transform="rotate(32 91 56)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="43" cy="49" rx="15" ry="12" transform="rotate(-18 43 49)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="77" cy="49" rx="15" ry="12" transform="rotate(18 77 49)" fill={f} stroke={edge} strokeWidth=".8" />
      <ellipse cx="60" cy="46" rx="17" ry="15" fill={f} stroke={edge} strokeWidth=".8" />
      <Shine d="M50 38c5-4 15-4 20 0" />
      <Shine d="M35 43c3-3 8-4 12-3" o={0.3} />
      <Shine d="M73 40c4-1 9 0 12 3" o={0.3} />
      {glaze && <path d="M30 50l6-6 6 6 6-7 6 7 6-7 6 7 6-7 6 6 6-6" fill="none" stroke="#FFF8EC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />}
      {glaze &&
        [40, 52, 64, 76, 58, 46, 70].map((cx, i) => <ellipse key={i} cx={cx} cy={40 + (i % 3) * 4} rx="1.6" ry="1.1" fill="#C8894A" />)}
      {seeds &&
        [44, 52, 60, 68, 76, 56, 64, 48, 72].map((cx, i) => (
          <ellipse key={i} cx={cx} cy={38 + (i % 3) * 5} rx="1.4" ry=".7" transform={`rotate(${i * 25} ${cx} ${38 + (i % 3) * 5})`} fill="#F3DFB5" />
        ))}
    </g>
  );
}

/* ---------- Becher to go ---------- */
function TakeawayCup({ g, x = 0 }: { g: G; x?: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M78 28h28l-4 48H82z" fill={g('cup')} stroke="#CFC5B6" strokeWidth=".8" />
      <path d="M79.3 44h25.4l-1.4 16H80.7z" fill={g('kraft')} />
      <path d="M92 49.5c-1.2-1.4-3.6-.6-3.6 1.3 0 1.8 3.6 3.9 3.6 3.9s3.6-2.1 3.6-3.9c0-1.9-2.4-2.7-3.6-1.3z" fill="#C8323C" />
      <rect x="75.5" y="23" width="33" height="6" rx="3" fill="#4A3424" />
      <path d="M79 23c1-4 3-5 6-5h14c3 0 5 1 6 5z" fill="#5B4130" />
      <rect x="88" y="17" width="8" height="2" rx="1" fill="#2E2016" />
      <path d="M83 32l3 40" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Brötli / Sandwich ---------- */
type Filling = 'salat' | 'kaese' | 'schinken' | 'tomate' | 'gurke' | 'hummus' | 'gemuese' | 'falafel' | 'mozzarella';

function Sandwich({
  g,
  bun = 'crust',
  fillings,
  x = 0,
  y = 0,
  s = 1,
  salt = false,
  flour = false,
  seeds = false,
  pick = false,
  flat = false,
}: {
  g: G;
  bun?: string;
  fillings: Filling[];
  x?: number;
  y?: number;
  s?: number;
  salt?: boolean;
  flour?: boolean;
  seeds?: boolean;
  pick?: boolean;
  flat?: boolean;
}) {
  const b = g(bun);
  const edge = bun === 'laugen' ? '#3A1E0C' : bun === 'ciabatta' ? '#B48A55' : '#8E5121';
  const topH = flat ? 9 : 17;
  let yy = 53;
  const layers: ReactNode[] = [];
  for (const [i, f] of fillings.entries()) {
    const k = `${f}-${i}`;
    if (f === 'salat') {
      layers.push(<path key={k} d={`M18 ${yy}q5.25 -4 10.5 0t10.5 0t10.5 0t10.5 0t10.5 0t10.5 0t10.5 0t10.5 0v4H18z`} fill={g('lettuce')} />);
      yy += 3;
    } else if (f === 'kaese') {
      layers.push(<path key={k} d={`M20 ${yy}h80v4l-4 0-3 5-3-5H58l-3 6-3-6H34l-3 4-3-4h-8z`} fill={g('cheese')} />);
      yy += 4;
    } else if (f === 'mozzarella') {
      layers.push(<ellipse key={k + 'a'} cx="40" cy={yy + 2} rx="13" ry="3.2" fill="#FFFDF6" stroke="#E7E0D0" strokeWidth=".6" />);
      layers.push(<ellipse key={k + 'b'} cx="76" cy={yy + 2} rx="13" ry="3.2" fill="#FFFDF6" stroke="#E7E0D0" strokeWidth=".6" />);
      yy += 4;
    } else if (f === 'schinken') {
      layers.push(<path key={k} d={`M19 ${yy}q8 3 16 0t16 0t16 0t16 0t17 0v5q-8 3-16 0t-16 0t-16 0t-16 0t-17 0z`} fill={g('ham')} />);
      yy += 5;
    } else if (f === 'tomate') {
      for (const cx of [32, 54, 76, 94])
        layers.push(<ellipse key={k + cx} cx={cx} cy={yy + 2} rx="9" ry="3" fill={g('tomato')} stroke="#A32A1E" strokeWidth=".5" />);
      yy += 4;
    } else if (f === 'gurke') {
      for (const cx of [28, 46, 64, 82, 98])
        layers.push(<ellipse key={k + cx} cx={cx} cy={yy + 1.5} rx="7" ry="2.4" fill="#CFE6A8" stroke="#4E7D2A" strokeWidth="1.2" />);
      yy += 3;
    } else if (f === 'hummus') {
      layers.push(<path key={k} d={`M19 ${yy}q20 4 41 1t41 0v4H19z`} fill="#E9D3A4" />);
      yy += 4;
    } else if (f === 'gemuese') {
      const c = ['#E8732E', '#F2C43D', '#8C3B5A', '#6FA34A', '#E8732E'];
      [26, 42, 58, 74, 90].forEach((cx, j) => layers.push(<rect key={k + cx} x={cx - 6} y={yy - 1} width="12" height="5" rx="2" fill={c[j]} />));
      yy += 4;
    } else if (f === 'falafel') {
      [32, 52, 72, 90].forEach((cx) => layers.push(<circle key={k + cx} cx={cx} cy={yy + 2} r="5" fill="#8A5A2B" stroke="#5E3A18" strokeWidth=".6" />));
      yy += 6;
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Unterteil */}
      <path d={`M18 ${yy}h84c0 ${flat ? 7 : 10}-18 ${flat ? 13 : 17}-42 ${flat ? 13 : 17}S18 ${yy + (flat ? 7 : 10)} 18 ${yy}z`} fill={b} stroke={edge} strokeWidth=".8" />
      <rect x="18" y={yy - 1} width="84" height="3" rx="1.5" fill={g('crumb')} />
      {layers.reverse()}
      {/* Oberteil */}
      <path d={`M16 50c0-${topH * 0.55} 20-${topH} 44-${topH}s44 ${topH * 0.45} 44 ${topH}c0 3-2 4-5 4H21c-3 0-5-1-5-4z`} fill={b} stroke={edge} strokeWidth=".8" />
      <path d="M21 50.5h78" stroke={g('crumb')} strokeWidth="2.4" strokeLinecap="round" />
      <Shine d={flat ? 'M38 44c8-3 26-3 40 0' : 'M36 40c8-6 28-7 44-2'} o={0.4} />
      {salt && [34, 46, 58, 70, 82, 52, 64, 40, 76].map((cx, i) => <rect key={i} x={cx} y={(flat ? 42 : 37) + (i % 3) * 3} width="2.2" height="1.6" rx=".4" fill="#FFFFFF" transform={`rotate(${i * 30} ${cx} ${40})`} />)}
      {flour && <path d="M34 42c10-6 30-7 50-2" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="5" strokeLinecap="round" fill="none" />}
      {seeds && [36, 44, 52, 60, 68, 76, 84, 48, 64, 56, 72].map((cx, i) => <ellipse key={i} cx={cx} cy={38 + (i % 3) * 3} rx="1.5" ry=".8" fill="#F5E6C4" transform={`rotate(${i * 33} ${cx} ${38 + (i % 3) * 3})`} />)}
      {pick && (
        <g>
          <path d="M60 16v26" stroke="#B9874F" strokeWidth="1.4" />
          <path d="M60 15c-1.6-1.9-5-1-5 1.6 0 2.6 5 5.4 5 5.4s5-2.8 5-5.4c0-2.6-3.4-3.5-5-1.6z" fill="#C8323C" />
        </g>
      )}
    </g>
  );
}

/* ---------- Tassen & Gläser ---------- */
function CeramicCup({ g, top }: { g: G; top: 'crema' | 'herz' }) {
  return (
    <g>
      <ellipse cx="60" cy="72" rx="34" ry="7" fill={g('ceramic')} stroke="#D3CABC" strokeWidth=".8" />
      <ellipse cx="60" cy="71" rx="16" ry="3" fill="#E6DED1" />
      <path d="M86 42c10 0 12 14 1 16" fill="none" stroke={g('ceramic')} strokeWidth="5" />
      <path d="M86 42c10 0 12 14 1 16" fill="none" stroke="#D3CABC" strokeWidth=".8" />
      <path d="M34 36h52c0 22-8 34-26 34S34 58 34 36z" fill={g('ceramic')} stroke="#D3CABC" strokeWidth=".8" />
      <ellipse cx="60" cy="36" rx="26" ry="6.5" fill="#EFE7DB" stroke="#D3CABC" strokeWidth=".8" />
      <ellipse cx="60" cy="37" rx="23" ry="5.2" fill={top === 'crema' ? g('coffee') : g('foam')} />
      {top === 'crema' ? (
        <ellipse cx="60" cy="37" rx="18" ry="3.6" fill="#C9884E" opacity=".75" />
      ) : (
        <path d="M60 39.6c-3-2.6-8-2.4-8-.4s8 3.8 8 3.8 8-1.8 8-3.8-5-2.2-8 .4z" fill="#8A5531" opacity=".8" transform="translate(0 -3.5)" />
      )}
      <path d="M39 42c1 10 5 18 11 22" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M52 26c-3-4 3-6 0-10M64 26c-3-4 3-6 0-10" stroke="#B9A994" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".55" />
    </g>
  );
}

function Shape({ art, g }: { art: string; g: G }) {
  switch (art) {
    case 'gipfeli':
      return (
        <>
          <Shadow g={g} cy={72} rx={44} />
          <Croissant g={g} y={4} />
        </>
      );
    case 'vollkorngipfeli':
      return (
        <>
          <Shadow g={g} cy={72} rx={44} />
          <Croissant g={g} y={4} fill="whole" seeds />
        </>
      );
    case 'nussgipfel':
      return (
        <>
          <Shadow g={g} cy={72} rx={44} />
          <Croissant g={g} y={4} fill="crustDeep" glaze />
        </>
      );
    case 'set':
      return (
        <>
          <Shadow g={g} cx={40} cy={74} rx={34} />
          <Shadow g={g} cx={92} cy={77} rx={16} ry={4} />
          <Croissant g={g} x={-6} y={22} s={0.72} />
          <TakeawayCup g={g} />
        </>
      );
    case 'set-brot':
      return (
        <>
          <Shadow g={g} cx={40} cy={75} rx={34} />
          <Shadow g={g} cx={92} cy={77} rx={16} ry={4} />
          <Sandwich g={g} fillings={['salat', 'kaese', 'schinken']} x={-6} y={22} s={0.68} seeds />
          <TakeawayCup g={g} />
        </>
      );
    case 'broetli-kaese':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} bun="laugen" fillings={['salat', 'kaese']} y={2} salt />
        </>
      );
    case 'broetli-schinken':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} bun="crustDeep" fillings={['gurke', 'schinken']} y={2} flour />
        </>
      );
    case 'broetli-hummus':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} bun="whole" fillings={['salat', 'gemuese', 'hummus']} y={2} seeds />
        </>
      );
    case 'laugen-sandwich':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} bun="laugen" fillings={['salat', 'gurke', 'schinken', 'schinken']} y={0} salt flat />
        </>
      );
    case 'ciabatta':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} bun="ciabatta" fillings={['salat', 'tomate', 'mozzarella']} y={0} flour flat />
        </>
      );
    case 'sandwich':
    case 'kreation':
      return (
        <>
          <Shadow g={g} />
          <Sandwich g={g} fillings={['salat', 'tomate', 'kaese', 'schinken']} y={4} seeds pick={art === 'kreation'} />
        </>
      );
    case 'becher':
      return (
        <>
          <Shadow g={g} rx={26} />
          <path d="M42 22h36l-4 52H46z" fill="#FFFFFF" fillOpacity=".35" stroke="#C9D2D8" strokeWidth="1" />
          <path d="M44.6 56h30.8l-1.4 18H46z" fill={g('cream')} />
          <path d="M43.5 42h33l-1.1 14H44.6z" fill="#E8D2A6" />
          {[48, 54, 60, 66, 72, 51, 63, 69].map((cx, i) => (
            <ellipse key={i} cx={cx} cy={46 + (i % 3) * 3} rx="1.6" ry="1" fill="#C9A66E" />
          ))}
          <path d="M43 34h34l-.6 8H43.5z" fill={g('cream')} />
          <circle cx="50" cy="30" r="4" fill="#C2263A" />
          <circle cx="58" cy="28.5" r="3.6" fill="#3B3F8C" />
          <circle cx="66" cy="30.5" r="4" fill="#C2263A" />
          <path d="M68 33c2-6 10-6 10 0z" fill="#F4E39A" stroke="#C8323C" strokeWidth="1" />
          <path d="M46 26l3 44" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'wrap':
      return (
        <>
          <Shadow g={g} rx={42} />
          {[
            { x: -10, y: -10 },
            { x: 6, y: 4 },
          ].map(({ x, y }, i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(-14 60 52)`}>
              <path d="M28 40h46v26H28c-7 0-11-6-11-13s4-13 11-13z" fill="#F1DDB0" stroke="#CDAE76" strokeWidth=".8" />
              {[[30, 46], [42, 58], [56, 44], [64, 60], [36, 62]].map(([cx, cy], j) => (
                <ellipse key={j} cx={cx} cy={cy} rx="2.2" ry="1.4" fill="#C39456" opacity=".6" />
              ))}
              <path d="M24 44c10-2 30-2 48-1" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="74" cy="53" rx="7" ry="13" fill="#F1DDB0" stroke="#CDAE76" strokeWidth=".8" />
              <ellipse cx="74" cy="53" rx="5.6" ry="11" fill="#7F4C82" />
              <circle cx="73" cy="47" r="2.8" fill="#8A5A2B" />
              <circle cx="75" cy="55" r="2.8" fill="#8A5A2B" />
              <circle cx="72.5" cy="60" r="1.8" fill="#9CCB5E" />
              <circle cx="76" cy="50" r="1.6" fill="#E9D3A4" />
              <circle cx="72" cy="53" r="1.4" fill="#6FA34A" />
            </g>
          ))}
        </>
      );
    case 'quiche':
      return (
        <>
          <Shadow g={g} rx={44} />
          <path d="M20 46v12c0 8 18 14 40 14s40-6 40-14V46z" fill={g('crustDeep')} />
          {Array.from({ length: 13 }, (_, i) => 22 + i * 6.3).map((x) => (
            <path key={x} d={`M${x} 50v14`} stroke="#9A5A22" strokeOpacity=".45" strokeWidth="1.2" />
          ))}
          <ellipse cx="60" cy="46" rx="40" ry="14" fill={g('crust')} />
          <ellipse cx="60" cy="45.5" rx="35" ry="11" fill="#F6DC86" />
          {[[44, 44], [58, 40], [72, 46], [52, 50], [68, 52], [80, 41], [38, 49]].map(([cx, cy], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx="3.4" ry="1.8" fill="#9CCB5E" />
              <ellipse cx={cx} cy={cy} rx="1.6" ry=".8" fill="#EAF4D2" />
            </g>
          ))}
          {[[48, 39], [64, 47], [76, 50], [42, 45]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx="3" ry="1.4" fill="#D99A44" opacity=".55" />
          ))}
        </>
      );
    case 'bowl':
      return (
        <>
          <Shadow g={g} rx={44} cy={77} />
          <path d="M18 44c0 18 18 30 42 30s42-12 42-30z" fill={g('ceramic')} stroke="#D3CABC" strokeWidth=".8" />
          <ellipse cx="60" cy="44" rx="42" ry="13" fill="#F3EEE6" stroke="#D3CABC" strokeWidth=".8" />
          <ellipse cx="60" cy="45" rx="37" ry="10" fill="#3F3530" />
          {Array.from({ length: 26 }, (_, i) => [30 + ((i * 37) % 60), 39 + ((i * 13) % 12)]).map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.3" fill="#1F1814" opacity=".7" />
          ))}
          <rect x="34" y="38" width="9" height="7" rx="2" fill="#E8732E" transform="rotate(-12 38 41)" />
          <rect x="46" y="44" width="8" height="6" rx="2" fill="#E8732E" transform="rotate(10 50 47)" />
          <path d="M60 37c6 0 10 3 10 6-4-2-7-2-10-1z" fill="#6FA34A" />
          <rect x="72" y="41" width="9" height="6" rx="2" fill="#C2263A" transform="rotate(14 76 44)" />
          <path d="M82 46c3 0 6 2 5 4-3-1-5-1-7 0z" fill="#6FA34A" />
          <path d="M38 48c8-3 14 2 22-1s12-4 22 0" stroke="#F5ECD9" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M24 50c4 10 14 16 26 18" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      );
    case 'suppe':
      return (
        <>
          <Shadow g={g} rx={44} cy={77} />
          <path d="M92 66l14-34 6 2-12 36z" fill={g('loaf')} />
          <path d="M94 64l12-30 3 1-11 31z" fill={g('crumb')} />
          <path d="M20 46c0 16 16 28 38 28s38-12 38-28z" fill={g('ceramic')} stroke="#D3CABC" strokeWidth=".8" />
          <ellipse cx="58" cy="46" rx="38" ry="11" fill="#F3EEE6" stroke="#D3CABC" strokeWidth=".8" />
          <ellipse cx="58" cy="47" rx="33" ry="8.5" fill={g('soup')} />
          <path d="M44 47c4-4 12-4 14 0s10 4 14 0" stroke="#FFF4E2" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[50, 62, 68].map((cx, i) => (
            <ellipse key={i} cx={cx} cy={44 + i} rx="1.6" ry=".9" fill="#4F8A2C" />
          ))}
          <path d="M26 52c4 10 14 16 26 18" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M48 30c-3-4 3-6 0-10M60 30c-3-4 3-6 0-10M72 30c-3-4 3-6 0-10" stroke="#B9A994" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".5" />
        </>
      );
    case 'brezel': {
      const d = 'M38 62C30 72 50 78 60 76s30-4 22-14M38 62C24 48 30 26 46 26c12 0 16 14 20 34M82 62c14-14 8-36-8-36-12 0-16 14-20 34';
      return (
        <>
          <Shadow g={g} rx={40} cy={78} />
          <path d={d} fill="none" stroke="#3A1E0C" strokeWidth="12.5" strokeLinecap="round" />
          <path d={d} fill="none" stroke={g('laugen')} strokeWidth="11" strokeLinecap="round" />
          <path d="M40 34c2-4 8-5 11-1M70 33c3-4 9-3 11 1M48 72c6 2 18 2 26-2" fill="none" stroke="#E9B07A" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
          {[[44, 29], [52, 31], [72, 29], [79, 34], [55, 74], [66, 74], [36, 44], [86, 46], [58, 52], [63, 46]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="2.6" height="1.8" rx=".4" fill="#FFFFFF" transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </>
      );
    }
    case 'knoten': {
      const d = 'M60 74C46 64 28 54 28 38c0-10 7-16 15-16 7 0 12 5 17 12 5-7 10-12 17-12 8 0 15 6 15 16 0 16-18 26-32 36z';
      return (
        <>
          <Shadow g={g} rx={36} cy={78} />
          <path d={d} fill="none" stroke="#9A5A22" strokeWidth="14.5" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={g('crust')} strokeWidth="13" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#9A5A22" strokeOpacity=".35" strokeWidth="13" strokeDasharray="1.6 6.4" strokeLinejoin="round" />
          <path d="M36 32c3-4 9-4 12 0M72 32c3-4 9-4 12 0" fill="none" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="2.2" strokeLinecap="round" />
          {[[40, 22], [80, 22], [27, 40], [93, 40], [44, 62], [76, 62], [60, 34]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.3" fill="#FFFFFF" opacity=".9" />
          ))}
        </>
      );
    }
    case 'brot':
      return (
        <>
          <Shadow g={g} rx={46} cy={76} />
          <path d="M14 58c0-18 20-32 46-32s46 14 46 32c0 8-8 14-18 14H32c-10 0-18-6-18-14z" fill={g('loaf')} stroke="#4E2A12" strokeWidth=".8" />
          <path d="M30 36c20-10 48-10 62 2" stroke="#FFFFFF" strokeOpacity=".35" strokeWidth="9" strokeLinecap="round" fill="none" />
          {[[36, 52, 48, 38], [54, 50, 66, 36], [72, 52, 84, 40]].map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <path d={`M${x1} ${y1}Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2 + 2} ${x2} ${y2}`} stroke="#E8C48C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d={`M${x1} ${y1}Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2 + 2} ${x2} ${y2}`} stroke="#5E3416" strokeWidth="1" strokeLinecap="round" fill="none" transform="translate(1.5 1)" />
            </g>
          ))}
        </>
      );
    case 'stange':
      return (
        <>
          <Shadow g={g} rx={46} cy={70} />
          <g transform="rotate(-10 60 50)">
            <rect x="14" y="42" width="92" height="16" rx="8" fill={g('crust')} stroke="#9A5A22" strokeWidth=".8" />
            {Array.from({ length: 10 }, (_, i) => 20 + i * 9).map((x) => (
              <path key={x} d={`M${x} 43l6 14`} stroke="#9A5A22" strokeOpacity=".45" strokeWidth="1.4" />
            ))}
            {[[30, 46], [48, 50], [66, 45], [84, 51], [40, 53], [74, 52]].map(([cx, cy], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx="4" ry="2.2" fill="#F2B640" stroke="#C47F36" strokeWidth=".5" />
            ))}
            <path d="M22 45h76" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
          </g>
        </>
      );
    case 'schnecke':
      return (
        <>
          <Shadow g={g} rx={34} cy={76} />
          <ellipse cx="60" cy="56" rx="30" ry="18" fill={g('crustDeep')} />
          <ellipse cx="60" cy="50" rx="30" ry="18" fill={g('crust')} stroke="#9A5A22" strokeWidth=".8" />
          <path d="M60 50c0-3 5-3 5 0s-7 6-10 1 5-11 12-8 9 12 2 16-18 3-20-6 6-16 16-16" fill="none" stroke="#7A4220" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 46c6 4 10-2 16 2s8 6 14 2 10-2 14 2M44 56c6-3 10 2 16-1s10-3 14 0" fill="none" stroke="#FFFBF2" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case 'brownie':
      return (
        <>
          <Shadow g={g} rx={40} cy={74} />
          <path d="M24 44l36-10 36 10v18L60 72 24 62z" fill="#3A1E0E" />
          <path d="M24 44l36 10v18L24 62z" fill="#55301A" />
          <path d="M24 44l36-10 36 10-36 10z" fill={g('choc')} />
          <path d="M38 42l8 2-4 3M58 38l6 3-5 2M72 44l7 1-3 3M52 47l6 1" fill="none" stroke="#8A5A3A" strokeWidth="1" strokeLinecap="round" />
          {[[44, 40], [62, 42], [70, 39], [50, 45], [80, 45]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="2.4" height="1.6" rx=".3" fill="#FFFFFF" opacity=".9" transform={`rotate(${i * 40} ${x} ${y})`} />
          ))}
        </>
      );
    case 'wähe':
      return (
        <>
          <Shadow g={g} rx={42} cy={74} />
          <path d="M20 62L74 26c12 4 22 12 28 24L20 62v6l82-12v-6z" fill={g('crustDeep')} />
          <path d="M20 62L74 26c12 4 22 12 28 24z" fill={g('crust')} stroke="#9A5A22" strokeWidth=".8" />
          <path d="M30 59L74 31c9 3 17 10 22 19z" fill="#F7E7B8" />
          {[0, 1, 2, 3, 4].map((i) => {
            const ex = 76 + i * 5;
            const ey = 32 + i * 4.4;
            return (
              <g key={i}>
                <path d={`M34 57.5Q${(34 + ex) / 2} ${(57.5 + ey) / 2 - 7} ${ex} ${ey}`} fill="none" stroke="#F2D27A" strokeWidth="4.2" strokeLinecap="round" />
                <path d={`M34 57.5Q${(34 + ex) / 2} ${(57.5 + ey) / 2 - 9} ${ex} ${ey - 1.5}`} fill="none" stroke="#C8323C" strokeOpacity=".45" strokeWidth="1" strokeLinecap="round" />
              </g>
            );
          })}
          <path d="M76 29c10 4 18 10 24 20" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      );
    case 'kaffee':
      return (
        <>
          <Shadow g={g} rx={38} cy={78} />
          <CeramicCup g={g} top="crema" />
        </>
      );
    case 'cappuccino':
      return (
        <>
          <Shadow g={g} rx={38} cy={78} />
          <CeramicCup g={g} top="herz" />
        </>
      );
    case 'eistee':
      return (
        <>
          <Shadow g={g} rx={20} cy={78} />
          <rect x="51" y="12" width="18" height="7" rx="2" fill="#4E8A2C" />
          <path d="M52 19h16v8c8 4 10 10 10 18v28c0 2-2 4-4 4H46c-2 0-4-2-4-4V45c0-8 2-14 10-18z" fill={g('tea')} />
          <path d="M42 50h36v16H42z" fill="#FFF8EE" />
          <path d="M56 56c2-4 8-4 8 0-4 2-6 2-8 0z" fill="#6FA34A" />
          <path d="M52 19h16v8c8 4 10 10 10 18v28c0 2-2 4-4 4H46c-2 0-4-2-4-4V45c0-8 2-14 10-18z" fill={g('glass')} stroke="#C4A58A" strokeWidth=".8" />
          <path d="M47 42v28" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case 'osaft':
    case 'flasche':
    default:
      return (
        <>
          <Shadow g={g} rx={22} cy={78} />
          <path d="M42 24h36l-4 52H46z" fill={g('juice')} />
          <path d="M42 24h36l-.6 7H42.6z" fill="#FFE29A" />
          <path d="M42 24h36l-4 52H46z" fill={g('glass')} stroke="#C9D2D8" strokeWidth=".8" />
          <circle cx="76" cy="24" r="10" fill="#F7A21B" />
          <circle cx="76" cy="24" r="8" fill="#FFD27A" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M76 24l0-7" stroke="#F7A21B" strokeWidth="1" transform={`rotate(${a} 76 24)`} />
          ))}
          <path d="M47 30l3 40" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
  }
}

export function ProductArt({ art, category, className = '' }: { art: string; category?: string; className?: string }) {
  const id = useId().replace(/:/g, '');
  const g: G = (name) => `url(#${id}-${name})`;
  const bg = BG[category ?? ''] ?? BG.zmorge;
  return (
    <svg viewBox="0 0 120 90" className={className} style={{ background: bg }} aria-hidden="true" focusable="false">
      <Defs id={id} />
      <rect width="120" height="90" fill={g('vignette')} />
      <Shape art={art} g={g} />
    </svg>
  );
}
