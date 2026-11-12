import { Link, useParams } from 'react-router-dom';
import { QrCode } from '../components/QrCode';
import { StatusTracker } from '../components/StatusTracker';
import { EmptyState } from '../components/ui';
import { chf, dayLabel, time } from '../lib/format';
import { downloadIcs } from '../lib/ics';
import { effectiveStatus } from '../lib/orders';
import { storeById, useApp, useNow } from '../state/AppState';

const PAYMENT_LABEL = { twint: 'Twint (simuliert)', karte: 'Karte (simuliert)', abholung: 'Bei Abholung bezahlen' } as const;

export default function Confirmation() {
  const { id } = useParams();
  const { orders } = useApp();
  const now = useNow(2_000);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <EmptyState
        title="Bestellung nicht gefunden"
        action={
          <Link to="/" className="btn-primary">
            Zur Startseite
          </Link>
        }
      >
        Bestellungen werden nur in diesem Browser gespeichert. Vielleicht wurde die Demo zurückgesetzt?
      </EmptyState>
    );
  }

  const store = storeById(order.storeId);
  const status = effectiveStatus(order, now.getTime());
  const slot = new Date(order.slot);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="animate-rise text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-herz">Danke, {order.firstName}!</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Bestellung {order.id}</h1>
        <p className="mt-2 text-lg">
          Abholung <strong>{dayLabel(slot, now)} um {time(slot)}</strong>
          <br />
          bei <strong>{store?.name ?? 'unbekannte Filiale'}</strong>
        </p>
      </div>

      <section className="card p-5" aria-labelledby="status-titel">
        <h2 id="status-titel" className="sr-only">
          Status
        </h2>
        <StatusTracker status={status} />
        <p className="mt-3 text-center text-xs text-kruste-muted">Status wird für die Demo simuliert.</p>
      </section>

      <section className="card grid items-center gap-5 p-5 sm:grid-cols-[180px_1fr]" aria-labelledby="code-titel">
        <div className="mx-auto w-44 sm:w-full">
          <QrCode value={`HEFEHERZ:${order.id}:${order.pickupCode}`} label={`QR-Code zur Abholung, Code ${order.pickupCode}`} />
        </div>
        <div className="text-center sm:text-left">
          <h2 id="code-titel" className="text-sm font-semibold uppercase tracking-wide text-kruste-muted">
            Abholcode
          </h2>
          <p className="font-display text-5xl font-semibold tracking-widest tabular-nums">{order.pickupCode}</p>
          <p className="mt-2 text-sm text-kruste-muted">
            Am Abholregal den QR-Code scannen oder den Code nennen. {store?.note}
          </p>
          <button type="button" className="btn-secondary mt-4" onClick={() => store && downloadIcs(order, store)}>
            Zum Kalender hinzufügen
          </button>
        </div>
      </section>

      <section className="card p-5" aria-labelledby="zus-titel">
        <h2 id="zus-titel" className="text-xl font-semibold">
          Zusammenfassung
        </h2>
        <ul className="mt-3 divide-y divide-linie">
          {order.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3 py-2">
              <span>
                {i.qty}× {i.name}
              </span>
              <span className="tabular-nums">{chf(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-1 border-t border-linie pt-3">
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <dt>Sammelkarte (Gratis-Produkt)</dt>
              <dd className="tabular-nums">− {chf(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{chf(order.total)}</dd>
          </div>
          <div className="flex justify-between text-sm text-kruste-muted">
            <dt>Zahlung</dt>
            <dd>{PAYMENT_LABEL[order.payment]}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm">
          <strong>+1 Stempel</strong> auf deiner{' '}
          <Link to="/sammelkarte" className="underline">
            Sammelkarte
          </Link>
          .
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-ghost underline">
          Zur Startseite
        </Link>
        <Link to="/sortiment" className="btn-secondary">
          Nochmals bestellen
        </Link>
      </div>
    </div>
  );
}
