import { STAMPS_FOR_REWARD, useApp } from '../state/AppState';
import { HeartKnot } from './Logo';

export function StampCard({ compact = false }: { compact?: boolean }) {
  const { stamps } = useApp();
  const left = STAMPS_FOR_REWARD - stamps.count;
  return (
    <section className="card p-4 sm:p-5" aria-labelledby="sammelkarte-titel">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="sammelkarte-titel" className="text-xl font-semibold">
          Deine Sammelkarte
        </h2>
        <span className="text-sm text-kruste-muted tabular-nums">
          {stamps.count}/{STAMPS_FOR_REWARD}
        </span>
      </div>
      <ol className={`mt-3 grid grid-cols-5 gap-2 ${compact ? 'max-w-xs' : 'max-w-md'}`} aria-label={`${stamps.count} von ${STAMPS_FOR_REWARD} Stempeln`}>
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
      <p className="mt-3 text-sm">
        {stamps.rewards > 0 ? (
          <strong className="text-herz">
            {stamps.rewards === 1 ? 'Ein Gratis-Produkt wartet' : `${stamps.rewards} Gratis-Produkte warten`} auf dich. Löse es an der Kasse ein.
          </strong>
        ) : (
          <>
            Noch <strong>{left}</strong> {left === 1 ? 'Bestellung' : 'Bestellungen'} bis zu deinem Gratis-Produkt.
          </>
        )}
      </p>
    </section>
  );
}
