import { useState } from 'react';
import { EmptyState } from '../components/ui';
import { chf, dayLabel, time } from '../lib/format';
import { effectiveStatus, nextStatus, STATUS_FLOW, STATUS_LABEL } from '../lib/orders';
import type { OrderStatus } from '../lib/types';
import { STORES, storeById, useApp, useNow } from '../state/AppState';

const STATUS_STYLE: Record<OrderStatus, string> = {
  eingegangen: 'bg-getreide-light',
  zubereitung: 'bg-getreide',
  abholbereit: 'bg-herz text-white',
  abgeholt: 'bg-linie text-kruste-muted',
};

export default function Backstube() {
  const { orders, setOrderStatus, resetDemo } = useApp();
  const now = useNow(3_000);
  const [filter, setFilter] = useState<string>('alle');
  const [hideDone, setHideDone] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  const list = orders
    .map((o) => ({ ...o, effective: effectiveStatus(o, now.getTime()) }))
    .filter((o) => (filter === 'alle' || o.storeId === filter) && (!hideDone || o.effective !== 'abgeholt'))
    .sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());

  return (
    <div>
      <h1 className="text-3xl font-semibold sm:text-4xl">Backstube</h1>
      <p className="mt-1 max-w-prose text-kruste-muted">
        Interne Ansicht für das Team (Demo, ohne Login). Sortiert nach Abholzeit. Status per Klick weiterschalten.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="filiale-filter" className="mb-1 block text-sm font-semibold">
            Filiale
          </label>
          <select id="filiale-filter" className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="alle">Alle Filialen</option>
            {STORES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex min-h-[44px] items-center gap-2">
          <input type="checkbox" className="h-5 w-5 accent-herz" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
          Abgeholte ausblenden
        </label>
        {orders.length > 0 &&
          (confirmReset ? (
            <span className="ml-auto flex flex-wrap items-center gap-2 text-sm">
              Alle Demo-Bestellungen und die Sammelkarte löschen?
              <button
                type="button"
                className="btn-primary text-sm"
                onClick={() => {
                  resetDemo();
                  setConfirmReset(false);
                }}
              >
                Ja, löschen
              </button>
              <button type="button" className="btn-ghost text-sm underline" onClick={() => setConfirmReset(false)}>
                Abbrechen
              </button>
            </span>
          ) : (
            <button type="button" className="btn-ghost ml-auto text-sm underline" onClick={() => setConfirmReset(true)}>
              Demo zurücksetzen
            </button>
          ))}
      </div>

      <div className="mt-5">
        {list.length === 0 ? (
          <EmptyState title="Keine offenen Bestellungen">Sobald jemand bestellt, erscheint die Bestellung hier. Tipp: Öffne den Shop in einem zweiten Tab.</EmptyState>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
            {list.map((o) => {
              const slot = new Date(o.slot);
              const late = o.effective !== 'abgeholt' && slot.getTime() < now.getTime() - 15 * 60_000;
              return (
                <li key={o.id} className={`card flex flex-col gap-3 p-4 ${late ? 'ring-2 ring-herz' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-2xl font-semibold tabular-nums">{time(slot)}</p>
                      <p className="text-sm text-kruste-muted">
                        {dayLabel(slot, now)} · {storeById(o.storeId)?.name}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[o.effective]}`}>{STATUS_LABEL[o.effective]}</span>
                  </div>
                  <p className="text-sm">
                    <strong>{o.id}</strong> · {o.firstName} · Code <span className="tabular-nums">{o.pickupCode}</span>
                    {late && <strong className="text-herz"> · überfällig</strong>}
                  </p>
                  <ul className="text-sm">
                    {o.items.map((i) => (
                      <li key={i.productId}>
                        <strong className="tabular-nums">{i.qty}×</strong> {i.name}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-kruste-muted">
                    {chf(o.total)} · {o.payment === 'abholung' ? 'zahlt bei Abholung' : 'bezahlt (simuliert)'}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {o.effective !== 'abgeholt' && (
                      <button type="button" className="btn-primary flex-1 text-sm" onClick={() => setOrderStatus(o.id, nextStatus(o.effective))}>
                        → {STATUS_LABEL[nextStatus(o.effective)]}
                      </button>
                    )}
                    <label className="sr-only" htmlFor={`st-${o.id}`}>
                      Status von {o.id} setzen
                    </label>
                    <select id={`st-${o.id}`} className="input w-auto text-sm" value={o.effective} onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}>
                      {STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
