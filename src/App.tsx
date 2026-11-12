import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner } from './components/ui';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';

const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const StampCardPage = lazy(() => import('./pages/StampCardPage'));
const Stores = lazy(() => import('./pages/Stores'));
const Backstube = lazy(() => import('./pages/Backstube'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner label="Seite wird geladen …" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sortiment" element={<Menu />} />
          <Route path="/kasse" element={<Checkout />} />
          <Route path="/bestellung/:id" element={<Confirmation />} />
          <Route path="/sammelkarte" element={<StampCardPage />} />
          <Route path="/filialen" element={<Stores />} />
          <Route path="/backstube" element={<Backstube />} />
          <Route path="/datenschutz" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
