import { useNavigate } from 'react-router-dom';
import { HoursTable, StorePicker } from '../components/StorePicker';
import { STORES, useApp } from '../state/AppState';

export default function Stores() {
  const { cartCount } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-semibold sm:text-4xl">Wo holst du ab?</h1>
      <p className="mt-1 max-w-prose text-kruste-muted">Wir merken uns deine Filiale für das nächste Mal.</p>
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
            <div className="mt-3">
              <HoursTable store={s} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
