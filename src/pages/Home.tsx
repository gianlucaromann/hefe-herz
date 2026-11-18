import { Link, useNavigate } from 'react-router-dom';
import { InstallHint } from '../components/InstallHint';
import { Hefi } from '../components/Logo';
import { ProductCard } from '../components/ProductCard';
import { ProductArt } from '../components/ProductArt';
import { StampCard } from '../components/StampCard';
import { StorePicker, todayHours } from '../components/StorePicker';
import { chf, dayLabel, time } from '../lib/format';
import { effectiveStatus, STATUS_LABEL } from '../lib/orders';
import { PRODUCTS, storeById, useApp, useNow } from '../state/AppState';

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-herz" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function Home() {
  const { store, lastOrder, orders, fillCartFromOrder, setStoreId, profile } = useApp();
  const navigate = useNavigate();
  const now = useNow(10_000);
  const hour = now.getHours();
  const featuredCat = hour < 10 ? 'zmorge' : hour < 14 ? 'zmittag' : 'suesses';
  const featured = PRODUCTS.filter((p) => p.category === featuredCat && !p.stamp).slice(0, 4);
  const combos = PRODUCTS.filter((p) => p.stamp);
  const active = orders.filter((o) => effectiveStatus(o, now.getTime()) !== 'abgeholt' && new Date(o.slot).getTime() > now.getTime() - 60 * 60_000);
  const greeting = hour < 11 ? 'Guete Morge' : hour < 17 ? 'Hoi' : 'Guete Abig';

  const reorder = () => {
    if (!lastOrder) return;
    fillCartFromOrder(lastOrder);
    if (storeById(lastOrder.storeId)) setStoreId(lastOrder.storeId);
    navigate('/kasse');
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {profile.firstName && (
        <p className="-mb-8 flex items-center gap-2 text-sm font-semibold">
          <Hefi className="h-7 w-7" /> {greeting}, {profile.firstName}! Hefi hat den Ofen schon an.
        </p>
      )}

      <section className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] lg:gap-16" aria-labelledby="hero-titel">
        <div>
          <h1 id="hero-titel" className="text-[2.5rem] font-semibold leading-[1.03] sm:text-6xl xl:text-7xl">
            Dein Morgen darf chaotisch sein.
            <span className="mt-1 block text-herz">Dein Zmorge nicht.</span>
          </h1>
          <p className="mt-5 max-w-prose text-lg text-kruste-muted xl:text-xl">
            Im Zug vorbestellen, am Abholtresen Code zeigen, in unter einer Minute weiter. Frisch und warm aus unserer eigenen Backstube.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/sortiment" className="btn-primary text-base">
              Pendler Zmorge bestellen
            </Link>
            <Link to="/kreation" className="btn-secondary text-base">
              Kreation zusammenstellen
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {['Ohne Anstehen', 'Twint & Apple Pay', 'Studi Card: 11. Zmorge gratis'].map((t) => (
              <li key={t} className="flex items-center gap-1.5 font-semibold">
                <Check /> {t}
              </li>
            ))}
          </ul>
        </div>
        <Link to="/sortiment" className="group relative block w-full max-w-2xl justify-self-center overflow-hidden rounded-[2rem] shadow-hoch" aria-label="Pendler Zmorge ab CHF 4.90 ansehen">
          <ProductArt art="set" category="zmorge" className="aspect-[4/3] h-auto w-full transition duration-500 group-hover:scale-[1.03]" />
          <span className="absolute bottom-4 left-4 rounded-2xl bg-mehl/95 px-4 py-2 shadow-karte">
            <span className="block text-xs font-semibold text-kruste-muted">Pendler Zmorge</span>
            <span className="font-display text-xl font-semibold">ab CHF 4.90</span>
          </span>
        </Link>
      </section>

      <InstallHint />

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
                  <Link to={`/bestellung/${o.id}`} className="card card-hover flex items-center justify-between gap-3 p-4">
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
            Mit einem Tap nachbestellen
          </button>
        </section>
      )}

      <section aria-labelledby="combo-titel">
        <h2 id="combo-titel" className="text-3xl font-semibold">
          Pendler Zmorge
        </h2>
        <p className="mt-1 max-w-prose text-kruste-muted">Getränk plus Gipfeli oder Brötli, günstiger als einzeln.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {combos.map((p) => (
            <ProductCard key={p.id} product={p} wide />
          ))}
        </div>
      </section>

      <section className="grid items-center gap-6 overflow-hidden rounded-[2rem] bg-pastell-rosa p-6 sm:p-10 md:grid-cols-[1fr_1fr] lg:gap-12" aria-labelledby="kreation-titel">
        <div>
          <p className="eyebrow">Deine Kreation</p>
          <h2 id="kreation-titel" className="text-3xl font-semibold">
            Nach deinem Geschmack, mit Herz gebacken.
          </h2>
          <p className="mt-2 max-w-prose">Stell dein Brötli selbst zusammen. Wir backen, belegen und machen es warm, bevor du da bist.</p>
          <ol className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            {['Brot', 'Füllung', 'Sauce', 'Topping'].map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-full bg-mehl px-3 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-herz text-xs text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <Link to="/kreation" className="btn-primary mt-5">
            Jetzt zusammenstellen · ab CHF 5.50
          </Link>
        </div>
        <ProductArt art="kreation" category="kreation" className="aspect-[4/3] h-auto w-full max-w-md justify-self-center rounded-3xl" />
      </section>

      <section aria-labelledby="empf-titel">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="empf-titel" className="text-2xl font-semibold">
            {featuredCat === 'zmorge' ? 'Frisch fürs Zmorge' : featuredCat === 'zmittag' ? 'Fürs Zmittag' : 'Für den Zvieri'}
          </h2>
          <Link to="/sortiment" className="inline-flex min-h-[44px] items-center font-semibold text-herz underline">
            Ganzes Sortiment
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="sofunktionierts" className="grid gap-8 md:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 id="sofunktionierts" className="text-2xl font-semibold">
            So gehts
          </h2>
          <ol className="mt-3 space-y-4">
            {[
              ['Auswählen', 'Pendler Zmorge, Kreation oder Zmittag. Am Vorabend oder im Bus.'],
              ['Im Voraus zahlen', 'Mit Twint, Apple Pay oder Karte. Nächste freie Zeit ist vorausgewählt.'],
              ['Code zeigen', 'Am Abholtresen. Wir geben dir die Tüte persönlich, du erwischst den Zug.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-herz font-bold text-white">{i + 1}</span>
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

      <section aria-labelledby="filiale-titel">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 id="filiale-titel" className="text-2xl font-semibold">
            {store ? 'Deine Filiale' : 'Wo holst du ab?'}
          </h2>
          {store && <span className="text-sm text-kruste-muted">{todayHours(store, now)}</span>}
        </div>
        <StorePicker />
      </section>

    </div>
  );
}
