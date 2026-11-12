/** Robuster Zugriff auf localStorage (Private Mode, blockierter Speicher). */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Speicher nicht verfügbar: App funktioniert trotzdem für diese Sitzung */
  }
}

export const KEYS = {
  store: 'hh.filiale',
  cart: 'hh.warenkorb',
  orders: 'hh.bestellungen',
  stamps: 'hh.sammelkarte',
  profile: 'hh.profil',
} as const;
