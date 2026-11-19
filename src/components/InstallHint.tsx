import { useEffect, useState } from 'react';
import { isIos, isStandalone } from '../lib/pwa';
import { load, save } from '../lib/storage';
import { BrandMark } from './Logo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const KEY = 'hh.installhinweis';

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="inline h-5 w-5 align-text-bottom" aria-label="Teilen-Symbol" role="img" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}

/** Hinweis «Als App installieren» – nur im Browser, nicht wenn bereits installiert. */
export function InstallHint() {
  const [dismissed, setDismissed] = useState(() => load(KEY, false));
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone] = useState(isStandalone);
  const ios = isIos();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (standalone || dismissed || (!ios && !prompt)) return null;

  const close = () => {
    setDismissed(true);
    save(KEY, true);
  };

  return (
    <section className="card flex items-start gap-3 p-4" aria-labelledby="install-titel">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-linie bg-teig">
        <BrandMark className="h-10 w-10" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id="install-titel" className="text-lg font-semibold">
          Hefe &amp; Herz als App
        </h2>
        {prompt ? (
          <>
            <p className="text-sm text-kruste-muted">Direkt vom Home-Bildschirm bestellen, auch ohne Netz im Tunnel.</p>
            <button
              type="button"
              className="btn-primary mt-2"
              onClick={async () => {
                await prompt.prompt();
                await prompt.userChoice;
                setPrompt(null);
              }}
            >
              Installieren
            </button>
          </>
        ) : (
          <p className="text-sm text-kruste-muted">
            Tipp in Safari auf <ShareIcon /> <strong className="text-kruste">Teilen</strong> und dann auf{' '}
            <strong className="text-kruste">Zum Home-Bildschirm</strong>. Dann bestellst du mit einem Tipp, auch ohne Netz im Tunnel.
          </p>
        )}
      </div>
      <button type="button" onClick={close} className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl hover:bg-getreide-light" aria-label="Hinweis schliessen">
        ×
      </button>
    </section>
  );
}
