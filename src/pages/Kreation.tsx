import { Link } from 'react-router-dom';
import { ConfiguratorForm } from '../components/Configurator';
import { Hefi } from '../components/Logo';
import { ProductArt } from '../components/ProductArt';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, useApp } from '../state/AppState';

export default function Kreation() {
  const { cartCount } = useApp();
  const base = PRODUCTS.find((p) => p.id === 'kreation')!;
  const monat = PRODUCTS.find((p) => p.id === 'kreation-monat')!;
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="grid items-center gap-5 overflow-hidden rounded-[2rem] bg-pastell-rosa p-6 sm:grid-cols-[1fr_260px] sm:p-10">
        <div>
          <p className="eyebrow">Nur bei Hefe &amp; Herz</p>
          <h1 className="mt-1 text-4xl font-semibold leading-tight sm:text-5xl">Deine Kreation</h1>
          <p className="mt-2 max-w-prose text-lg">
            Nach deinem Geschmack, mit Herz gebacken. Brot, Füllung, Sauce, Topping: Du entscheidest, wir belegen frisch und machen es warm.
          </p>
          <p className="mt-2 text-sm text-kruste-muted">Tipp: Am Vorabend bestellen, am Morgen ohne Warten abholen.</p>
        </div>
        <ProductArt art="kreation" category="kreation" className="hidden aspect-[4/3] h-auto w-full rounded-3xl sm:block" />
      </section>

      <section className="card p-4 sm:p-6" aria-label="Kreation zusammenstellen">
        <ConfiguratorForm product={base} />
      </section>

      {cartCount > 0 && (
        <p className="text-center">
          <Link to="/kasse" className="btn-secondary">
            Zur Kasse ({cartCount})
          </Link>
        </p>
      )}

      <section className="grid items-center gap-6 sm:grid-cols-[1fr_1fr]" aria-labelledby="monat-titel">
        <div>
          <h2 id="monat-titel" className="text-2xl font-semibold">
            Kreation des Monats
          </h2>
          <p className="mt-2 text-kruste-muted">
            Poste deine Kreation als Instagram-Story mit <strong className="text-kruste">#ZeigDeineKreation</strong>. Dafür gibts beim nächsten Besuch ein
            Gratis-Topping. Die beliebteste Story kommt einen Monat lang ins Sortiment.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <Hefi className="h-8 w-8" /> Hefi drückt dir die Daumen.
          </p>
        </div>
        <ProductCard product={monat} />
      </section>
    </div>
  );
}
