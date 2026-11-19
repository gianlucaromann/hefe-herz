import { Link } from 'react-router-dom';
import { GIFT_STAMPS, STAMPS_FOR_REWARD, useApp } from '../state/AppState';
import { BrandMark } from './Logo';

export function StampCard({ compact = false }: { compact?: boolean }) {
  const { stamps } = useApp();
  const left = STAMPS_FOR_REWARD - stamps.count;
  return (
    <section className="card overflow-hidden" aria-labelledby="sammelkarte-titel">
      <div className="flex items-center justify-between gap-2 bg-pastell-blau px-4 py-3 sm:px-5">
        <h2 id="sammelkarte-titel" className="text-xl font-semibold">
          Sammelkarte
        </h2>
        <span className="rounded-full bg-mehl px-2 py-0.5 text-xs font-bold">13. Zmorge gratis</span>
      </div>
      <div className="p-4 sm:p-5">
        <ol className={`grid grid-cols-6 gap-1.5 sm:gap-2 ${compact ? 'max-w-sm' : 'max-w-lg'}`} aria-label={`${stamps.count} von ${STAMPS_FOR_REWARD} Stempeln`}>
          {Array.from({ length: STAMPS_FOR_REWARD }, (_, i) => {
            const filled = i < stamps.count;
            const gift = filled && stamps.gift && i < GIFT_STAMPS;
            return (
              <li
                key={i}
                className={`flex aspect-square items-center justify-center rounded-full border-2 border-dashed ${gift ? 'animate-rise border-transparent bg-pastell-rosa' : filled ? 'animate-rise border-transparent bg-getreide-light' : 'border-linie'}`}
                style={filled ? { animationDelay: `${i * 40}ms` } : undefined}
                aria-label={gift ? `Stempel ${i + 1}: geschenkt` : filled ? `Stempel ${i + 1}: gesetzt` : `Stempel ${i + 1}: offen`}
              >
                {filled ? <BrandMark className="h-3/4 w-3/4" /> : <span className="text-xs text-kruste-muted">{i + 1}</span>}
              </li>
            );
          })}
        </ol>
        {stamps.gift && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-pastell-rosa px-3 py-1 text-xs font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-herz" aria-hidden="true" /> 2 Stempel von uns geschenkt
          </p>
        )}
        <p className="mt-3 text-sm">
          {stamps.rewards > 0 ? (
            <strong className="text-herz">
              {stamps.rewards === 1 ? 'Dein Gratis-Zmorge wartet' : `${stamps.rewards} Gratis-Zmorge warten`} auf dich. Einfach an der Kasse einlösen.
            </strong>
          ) : (
            <>
              Noch <strong>{left}</strong> Pendler Zmorge bis zu deinem Gratis-Zmorge.
            </>
          )}
        </p>
        {compact && (
          <Link to="/sammelkarte" className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-herz underline">
            So funktioniert die Sammelkarte
          </Link>
        )}
      </div>
    </section>
  );
}
