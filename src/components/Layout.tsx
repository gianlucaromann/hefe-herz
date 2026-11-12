import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { chf } from '../lib/format';
import { productById, useApp } from '../state/AppState';
import { Logo } from './Logo';
import { PinIcon } from './ui';

function DemoBanner() {
  return (
    <div className="bg-kruste px-4 py-1.5 text-center text-xs font-medium text-teig sm:text-sm">
      Fiktives Schulprojekt, keine echten Bestellungen
    </div>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function Header() {
  const { store, cartCount, lastAdded } = useApp();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-semibold min-h-[44px] inline-flex items-center ${isActive ? 'bg-getreide-light' : 'hover:bg-getreide-light/60'}`;
  return (
    <header className="sticky top-0 z-30 border-b border-linie bg-teig/95 backdrop-blur">
      <div className="container-page flex items-center gap-2 py-2">
        <Link to="/" className="mr-auto shrink-0 rounded-lg" aria-label="Hefe & Herz, zur Startseite">
          <Logo className="h-8 sm:h-9" />
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 md:flex">
          <NavLink to="/sortiment" className={navClass}>Sortiment</NavLink>
          <NavLink to="/sammelkarte" className={navClass}>Sammelkarte</NavLink>
          <NavLink to="/filialen" className={navClass}>Filialen</NavLink>
        </nav>
        <Link
          to="/filialen"
          className="hidden min-h-[44px] items-center gap-1 rounded-full border-2 border-linie bg-mehl px-3 text-sm font-semibold sm:inline-flex"
          aria-label={store ? `Filiale: ${store.name}. Ändern` : 'Filiale wählen'}
        >
          <PinIcon /> {store ? store.name : 'Filiale wählen'}
        </Link>
        <Link to="/kasse" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-getreide-light" aria-label={`Warenkorb, ${cartCount} Artikel`}>
          <CartIcon />
          {cartCount > 0 && (
            <span key={lastAdded?.at} className="animate-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-herz px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      <nav aria-label="Navigation mobil" className="container-page flex gap-0.5 overflow-x-auto pb-2 text-[13px] md:hidden">
        <NavLink to="/sortiment" className={navClass}>Sortiment</NavLink>
        <NavLink to="/sammelkarte" className={navClass}>Sammelkarte</NavLink>
        <NavLink to="/filialen" className={(a) => `${navClass(a)} gap-1 whitespace-nowrap`}>
          <PinIcon /> {store ? store.name : 'Filiale wählen'}
        </NavLink>
      </nav>
    </header>
  );
}

function CartBar() {
  const { cartCount, cartTotal } = useApp();
  const { pathname } = useLocation();
  if (cartCount === 0 || pathname.startsWith('/kasse') || pathname.startsWith('/bestellung') || pathname.startsWith('/backstube')) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linie bg-teig/95 p-3 backdrop-blur" style={{ paddingBottom: 'max(.75rem, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto max-w-xl">
        <Link to="/kasse" className="btn-primary w-full justify-between text-base">
          <span className="flex items-center gap-2">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm tabular-nums">{cartCount}</span>
            Zur Kasse
          </span>
          <span className="tabular-nums">{chf(cartTotal)}</span>
        </Link>
      </div>
    </div>
  );
}

/** Ansage für Screenreader bei Warenkorb-Änderungen. */
function CartAnnouncer() {
  const { lastAdded, cartCount, cartTotal } = useApp();
  const [msg, setMsg] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (lastAdded) setMsg(`${productById(lastAdded.id)?.name ?? 'Produkt'} hinzugefügt. Warenkorb: ${cartCount} Artikel, ${chf(cartTotal)}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded]);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {msg}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-linie pb-28 pt-8 text-sm text-kruste-muted">
      <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>Hefe &amp; Herz ist eine erfundene Bäckerei. Demo für ein Hochschulmodul.</p>
        <nav aria-label="Fusszeile" className="flex flex-wrap gap-x-4">
          <Link className="inline-flex min-h-[44px] items-center underline" to="/datenschutz">Datenschutz</Link>
          <Link className="inline-flex min-h-[44px] items-center underline" to="/filialen">Filialen &amp; Öffnungszeiten</Link>
          <Link className="inline-flex min-h-[44px] items-center underline" to="/backstube">Backstube (Demo)</Link>
        </nav>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#inhalt" className="sr-only z-50 rounded bg-mehl px-4 py-2 focus:not-sr-only focus:absolute focus:left-2 focus:top-2">
        Zum Inhalt springen
      </a>
      <DemoBanner />
      <Header />
      <main id="inhalt" className="container-page flex-1 pt-6" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CartBar />
      <CartAnnouncer />
    </div>
  );
}
