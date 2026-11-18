import { useNavigate } from 'react-router-dom';
import { HoursTable, StorePicker } from '../components/StorePicker';
import { STORES, useApp } from '../state/AppState';

export default function Stores() {
  const { cartCount } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-semibold sm:text-4xl">Wo holst du ab?</h1>
      <p className="mt-1 max-w-prose text-kruste-muted">
        Zwei Bahnhofsfilialen für den schnellen Zug-Start, eine Stammfiliale mit offener Backstube in der Winterthurer Altstadt. Wir merken uns deine Wahl.
      </p>
      <div className="mt-5">
        <StorePicker onPicked={() => cartCount > 0 && navigate('/kasse')} />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">Öffnungszeiten</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {STORES.map((s) => (
          <section key={s.id} className="card p-4" aria-labelledby={`f-${s.id}`}>
            <h3 id={`f-${s.id}`} className="text-lg font-semibold">
              {s.name}
            </h3>
            <p className="text-sm text-kruste-muted">
              {s.address}
              <br />
              {s.city}
            </p>
            <p className="mt-2 text-sm">{s.note}</p>
            {s.features && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {s.features.map((f) => (
                  <li key={f} className="rounded-full bg-pastell-blau px-2 py-0.5 text-xs font-semibold">
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <HoursTable store={s} />
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-3xl bg-pastell-mint p-5" aria-labelledby="tgtg-titel">
        <h2 id="tgtg-titel" className="text-xl font-semibold">
          Food Waste? Nicht mit uns.
        </h2>
        <p className="mt-1 text-sm">
          Restware gibts in allen Filialen als Überraschungspaket über Too Good To Go, abholbar in der letzten Stunde vor Ladenschluss.
        </p>
      </section>
    </div>
  );
}
