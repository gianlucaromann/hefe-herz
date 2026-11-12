import { WEEKDAYS_SHORT } from '../lib/format';
import type { Store } from '../lib/types';
import { STORES, useApp } from '../state/AppState';

export function todayHours(store: Store, now = new Date()): string {
  const h = store.hours[String(now.getDay())];
  return h ? `heute ${h.open}–${h.close}` : 'heute geschlossen';
}

export function HoursTable({ store }: { store: Store }) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const today = new Date().getDay();
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Öffnungszeiten {store.name}</caption>
      <tbody>
        {order.map((d) => {
          const h = store.hours[String(d)];
          return (
            <tr key={d} className={d === today ? 'font-semibold' : ''}>
              <th scope="row" className="py-0.5 pr-4 text-left font-normal">
                {WEEKDAYS_SHORT[d]}
                {d === today && <span className="sr-only"> (heute)</span>}
              </th>
              <td className="py-0.5 tabular-nums">{h ? `${h.open}–${h.close}` : 'geschlossen'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function StorePicker({ onPicked }: { onPicked?: (id: string) => void }) {
  const { storeId, setStoreId } = useApp();
  return (
    <fieldset>
      <legend className="sr-only">Filiale wählen</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {STORES.map((s) => {
          const selected = s.id === storeId;
          return (
            <label
              key={s.id}
              className={`card flex cursor-pointer flex-col gap-1 border-2 p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-herz ${
                selected ? 'border-herz' : 'border-transparent hover:border-linie'
              }`}
            >
              <input
                type="radio"
                name="filiale"
                value={s.id}
                checked={selected}
                onChange={() => {
                  setStoreId(s.id);
                  onPicked?.(s.id);
                }}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-lg font-semibold">{s.name}</span>
                <span className="rounded-full bg-getreide-light px-2 py-0.5 text-xs font-semibold">{s.type === 'bahnhof' ? 'Bahnhof' : 'Quartier'}</span>
              </span>
              <span className="text-sm text-kruste-muted">
                {s.address}, {s.city}
              </span>
              <span className="text-sm">{todayHours(s)}</span>
              {selected && <span className="text-sm font-semibold text-herz">✓ Gewählt</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
