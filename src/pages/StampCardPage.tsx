import { Link } from 'react-router-dom';
import { StampCard } from '../components/StampCard';

export default function StampCardPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold sm:text-4xl">Sammelkarte</h1>
      <p className="mt-1 max-w-prose text-kruste-muted">
        Pro Bestellung gibts einen Stempel. Bei 10 Stempeln schenken wir dir ein Produkt deiner Wahl aus dem Warenkorb (wir ziehen das günstigste ab). Ganz
        ohne Konto: Die Karte lebt nur in deinem Browser.
      </p>
      <div className="mt-5">
        <StampCard />
      </div>
      <Link to="/sortiment" className="btn-primary mt-6">
        Stempel sammeln
      </Link>
    </div>
  );
}
