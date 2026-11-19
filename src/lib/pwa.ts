/** Service Worker nur im GitHub-Pages-Build registrieren (nicht im Dev-Server, nicht in der Artifact-Vorschau). */
export function registerServiceWorker(): void {
  if (import.meta.env.VITE_ROUTER !== 'hash' || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* ohne Service Worker läuft die Seite normal weiter, nur nicht offline */
    });
  });
}

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
}
