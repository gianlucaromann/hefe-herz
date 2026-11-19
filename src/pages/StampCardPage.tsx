import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StampCard } from '../components/StampCard';

export default function StampCardPage() {
  const [shared, setShared] = useState(false);
  const share = async () => {
    const data = { title: 'Hefe & Herz', text: 'Pendler Zmorge vorbestellen und ohne Anstehen abholen. Mit meinem Link bekommen wir beide einen Extra-Stempel!', url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      setShared(true);
    } catch {
      /* abgebrochen */
    }
  };
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="eyebrow">Für alle, gratis</p>
        <h1 className="text-4xl font-semibold">Sammelkarte</h1>
        <p className="mt-2 max-w-prose text-lg text-kruste-muted">
          Pro Pendler Zmorge gibts einen Stempel. Bei 10 Stempeln ist dein 11. Pendler Zmorge gratis. Kein Konto, kein Plastik: Die Karte lebt in deinem Browser.
        </p>
      </div>
      <StampCard />
      <section className="card grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center" aria-labelledby="friend-titel">
        <div>
          <h2 id="friend-titel" className="text-xl font-semibold">
            Bring a Friend
          </h2>
          <p className="text-sm text-kruste-muted">Teil deinen Link. Bestellt dein:e Freund:in das erste Pendler Zmorge, gibts für euch beide einen Extra-Stempel.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={share}>
          {shared ? '✓ Geteilt' : 'Link teilen'}
        </button>
      </section>
      <Link to="/sortiment" className="btn-primary">
        Stempel sammeln
      </Link>
    </div>
  );
}
