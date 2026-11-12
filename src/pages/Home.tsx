import { Link, useNavigate } from 'react-router-dom';
import { HeartKnot } from '../components/Logo';
import { ProductCard } from '../components/ProductCard';
import { StampCard } from '../components/StampCard';
import { StorePicker, todayHours } from '../components/StorePicker';
import { chf, dayLabel, time } from '../lib/format';
import { effectiveStatus, STATUS_LABEL } from '../lib/orders';
import { PRODUCTS, storeById, useApp, useNow } from '../state/AppState';

export function Home() {
  const { store, lastOrder, orders, fillCartFromOrder, setStoreId } = useApp();
  const navigate = useNavigate();
  const now = useNow(10_000);
  const hour = now.getHours();
  const featuredCat = hour < 10 ? 'zmorge' : hour < 14 ? 'zmittag' : 'suesses';
  const featured = PRODUCTS.filter((p) => p.category === featuredCat).slice(0, 4);
  const active = orders.filter((o) => effectiveStatus(o, now.getTime()) !== 'abgeholt' && new Date(o.slot).getTime() > now.getTime() - 60 * 60_000);

  const reorder = () => {
    if (!lastOrder) return;
    fillCartFromOrder(lastOrder);
    if (storeById(lastOrder.storeId)) setStoreId(lastOrder.storeId);
    navigate('/kasse');
  };

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr]" aria-labelledby="hero-titel">
        <div>
          <p className="mb-2 inline-block rounded-full bg-getreide-light px-3 py-1 text-sm font-semibold">Click &amp; Collect</p>
          <h1 id="hero-titel" className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Vorbestellen.
            <br />
            In <span className="text-herz">30 Sekunden</span> abholen.
          </h1>
          <p className="mt-4 max-w-prose text-lg text-kruste-muted">
            Fünf Minuten Umsteigezeit reichen für Zmorge. Bestell im Zug, schnapp dir die Tüte am Abholregal und erwisch den Anschluss.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/sortiment" className="btn-primary text-base">
              Jetzt bestellen
            </Link>
            {lastOrder && (
              <button type="button" onClick={reorder} className="btn-secondary text-base">
                Dasselbe wie letztes Mal
              </button>
            )}
          </div>
        </div>
        <div className="hidden justify-center md:flex" aria-hidden="true">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-getreide-light">
            <HeartKnot className="h-40 w-40" />
          </div>
        </div>
      </section>

      {active.length > 0 && (
        <section aria-labelledby="aktiv-titel">
          <h2 id="aktiv-titel" className="mb-3 text-2xl font-semibold">
            Deine offenen Bestellungen
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {active.map((o) => {
              const st = effectiveStatus(o, now.getTime());
              return (
                <li key={o.id}>
                  <Link to={`/bestellung/${o.id}`} className="card flex items-center justify-between gap-3 p-4 hover:ring-2 hover:ring-linie">
                    <span>
                      <span className="block font-semibold">
                        {o.id} · {dayLabel(new Date(o.slot), now)} {time(o.slot)}
                      </span>
                      <span className="text-sm text-kruste-muted">{storeById(o.storeId)?.name}</span>
                    </span>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st === 'abholbereit' ? 'bg-herz text-white' : 'bg-getreide-light'}`}>{STATUS_LABEL[st]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {lastOrder && (
        <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="nochmal-titel">
          <div>
            <h2 id="nochmal-titel" className="text-xl font-semibold">
              Dasselbe wie letztes Mal?
            </h2>
            <p className="text-kruste-muted">
              {lastOrder.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} · {chf(lastOrder.subtotal)}
              <br />
              <span className="text-sm">{storeById(lastOrder.storeId)?.name}</span>
            </p>
          </div>
          <button type="button" onClick={reorder} className="btn-primary shrink-0">
            Nochmals bestellen
          </button>
        </section>
      )}

      <section aria-labelledby="filiale-titel">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="filiale-titel" className="text-2xl font-semibold">
            {store ? 'Deine Filiale' : 'Wo holst du ab?'}
          </h2>
          {store && <span className="text-sm text-kruste-muted">{todayHours(store, now)}</span>}
        </div>
        <StorePicker />
      </section>

      <section aria-labelledby="empf-titel">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="empf-titel" className="text-2xl font-semibold">
            {featuredCat === 'zmorge' ? 'Fürs Zmorge' : featuredCat === 'zmittag' ? 'Fürs Zmittag' : 'Für den Zvieri'}
          </h2>
          <Link to="/sortiment" className="inline-flex min-h-[44px] items-center font-semibold text-herz underline">
            Ganzes Sortiment
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="sofunktionierts" className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 id="sofunktionierts" className="text-2xl font-semibold">
            So gehts
          </h2>
          <ol className="mt-3 space-y-3">
            {[
              ['Auswählen', 'Zmorge oder Zmittag in den Warenkorb.'],
              ['Zeit wählen', 'Nächster freier Slot ist schon vorausgewählt.'],
              ['Abholen', 'Code am Abholregal zeigen. Fertig.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-herz font-bold text-white">{i + 1}</span>
                <span>
                  <strong className="block">{t}</strong>
                  <span className="text-kruste-muted">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <StampCard compact />
      </section>
    </div>
  );
}
