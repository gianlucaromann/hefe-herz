import { Link } from 'react-router-dom';
import { STAMPS_FOR_REWARD, useApp } from '../state/AppState';
import { HeartKnot } from './Logo';

export function StampCard({ compact = false }: { compact?: boolean }) {
  const { stamps, studiActive, activateStudi } = useApp();
  const left = STAMPS_FOR_REWARD - stamps.count;
  return (
    <section className="card overflow-hidden" aria-labelledby="sammelkarte-titel">
      <div className="flex items-center justify-between gap-2 bg-pastell-blau px-4 py-3 sm:px-5">
        <h2 id="sammelkarte-titel" className="text-xl font-semibold">
          Studi Card
        </h2>
        <span className="rounded-full bg-mehl px-2 py-0.5 text-xs font-bold">für Studis &amp; Lernende</span>
      </div>
      <div className="p-4 sm:p-5">
        <ol className={`grid grid-cols-5 gap-2 ${compact ? 'max-w-xs' : 'max-w-md'}`} aria-label={`${stamps.count} von ${STAMPS_FOR_REWARD} Stempeln`}>
          {Array.from({ length: STAMPS_FOR_REWARD }, (_, i) => {
            const filled = i < stamps.count;
            return (
              <li
                key={i}
                className={`flex aspect-square items-center justify-center rounded-full border-2 border-dashed ${filled ? 'animate-rise border-transparent bg-getreide-light' : 'border-linie'}`}
                style={filled ? { animationDelay: `${i * 40}ms` } : undefined}
                aria-label={filled ? `Stempel ${i + 1}: gesetzt` : `Stempel ${i + 1}: offen`}
              >
                {filled ? <HeartKnot className="h-3/4 w-3/4" /> : <span className="text-xs text-kruste-muted">{i + 1}</span>}
              </li>
            );
          })}
        </ol>
        {!studiActive ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="flex-1 text-sm">
              <strong>10 Pendler Zmorge, das 11. ist gratis.</strong> Einmal aktivieren, Ausweis bei der ersten Abholung kurz zeigen.
            </p>
            <button type="button" className="btn-primary" onClick={activateStudi}>
              Gratis aktivieren
            </button>
          </div>
        ) : (
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
        )}
        {compact && (
          <Link to="/studi-card" className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-herz underline">
            So funktioniert die Studi Card
          </Link>
        )}
      </div>
    </section>
  );
}
