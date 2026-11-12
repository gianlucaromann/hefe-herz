import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { AppProvider } from './state/AppState';

// memory: Artifact-Vorschau (Einzeldatei) · hash: GitHub Pages (kein SPA-Fallback nötig)
const Router = { memory: MemoryRouter, hash: HashRouter }[import.meta.env.VITE_ROUTER as string] ?? BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </StrictMode>,
);
