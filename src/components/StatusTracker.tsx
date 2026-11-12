import { STATUS_LABEL } from '../lib/orders';
import type { OrderStatus } from '../lib/types';

const STEPS: OrderStatus[] = ['eingegangen', 'zubereitung', 'abholbereit'];
const HINT: Record<OrderStatus, string> = {
  eingegangen: 'Die Backstube hat deine Bestellung.',
  zubereitung: 'Wir packen gerade ein.',
  abholbereit: 'Liegt im Abholregal. Code zeigen, mitnehmen, fertig.',
  abgeholt: 'Abgeholt. En Guete!',
};

export function StatusTracker({ status }: { status: OrderStatus }) {
  const current = status === 'abgeholt' ? STEPS.length : STEPS.indexOf(status);
  return (
    <div>
      <ol className="flex items-start" aria-label="Bestellstatus">
        {STEPS.map((step, i) => {
          const done = i < current || status === 'abgeholt';
          const active = i === current;
          return (
            <li key={step} className="flex flex-1 flex-col items-center text-center" aria-current={active ? 'step' : undefined}>
              <div className="flex w-full items-center">
                <span className={`h-1 flex-1 rounded transition-colors duration-700 ${i === 0 ? 'opacity-0' : done || active ? 'bg-herz' : 'bg-linie'}`} />
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-bold transition-all duration-500 ${
                    done ? 'border-herz bg-herz text-white' : active ? 'animate-pulse-soft scale-110 border-herz bg-mehl text-herz' : 'border-linie bg-mehl text-kruste-muted'
                  }`}
                  aria-hidden="true"
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={`h-1 flex-1 rounded transition-colors duration-700 ${i === STEPS.length - 1 ? 'opacity-0' : done ? 'bg-herz' : 'bg-linie'}`} />
              </div>
              <span className={`mt-2 text-xs sm:text-sm ${active ? 'font-bold' : ''}`}>
                {STATUS_LABEL[step]}
                <span className="sr-only">{done ? ' (erledigt)' : active ? ' (aktuell)' : ' (offen)'}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-center font-semibold" aria-live="polite" key={status}>
        <span className="animate-rise inline-block">{HINT[status]}</span>
      </p>
    </div>
  );
}
