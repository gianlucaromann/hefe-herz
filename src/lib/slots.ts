import type { DayHours } from './types';

export const SLOT_MINUTES = 10;
export const LEAD_MINUTES = 10;
export const SLOT_CAPACITY = 8;

export type SlotState = 'frei' | 'voll' | 'vorbei';

export interface Slot {
  /** Startzeit des Zeitfensters */
  start: Date;
  /** Schlüssel "HH:MM" */
  key: string;
  booked: number;
  remaining: number;
  state: SlotState;
}

export interface SlotOptions {
  /** Aktuelle Zeit */
  now: Date;
  /** Tag, für den Slots berechnet werden (Uhrzeit wird ignoriert) */
  day: Date;
  hours: DayHours | null | undefined;
  /** Anzahl Bestellungen pro Slot-Schlüssel "HH:MM" */
  bookings?: Record<string, number>;
  capacity?: number;
  leadMinutes?: number;
  slotMinutes?: number;
}

export function parseHHMM(value: string): number {
  const [h, m] = value.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) throw new Error(`Ungültige Zeit: ${value}`);
  return h * 60 + m;
}

export function toKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function atMinutes(day: Date, minutes: number): Date {
  const d = new Date(day);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}

/**
 * Erzeugt alle Abhol-Zeitfenster eines Tages im 10-Minuten-Raster.
 * - Erstes Fenster: Öffnungszeit (auf Raster aufgerundet)
 * - Letztes Fenster: spätestens Ladenschluss minus ein Raster (Abholung vor Ladenschluss)
 * - Fenster, die früher als `now + leadMinutes` beginnen, sind "vorbei"
 * - Fenster mit `booked >= capacity` sind "voll"
 */
export function generateSlots(opts: SlotOptions): Slot[] {
  const {
    now,
    day,
    hours,
    bookings = {},
    capacity = SLOT_CAPACITY,
    leadMinutes = LEAD_MINUTES,
    slotMinutes = SLOT_MINUTES,
  } = opts;
  if (!hours) return [];

  const open = parseHHMM(hours.open);
  const close = parseHHMM(hours.close);
  const first = Math.ceil(open / slotMinutes) * slotMinutes;
  const earliest = now.getTime() + leadMinutes * 60_000;

  const slots: Slot[] = [];
  for (let m = first; m + slotMinutes <= close; m += slotMinutes) {
    const start = atMinutes(day, m);
    const key = toKey(start);
    const booked = bookings[key] ?? 0;
    const remaining = Math.max(0, capacity - booked);
    let state: SlotState = 'frei';
    if (start.getTime() < earliest) state = 'vorbei';
    else if (remaining === 0) state = 'voll';
    slots.push({ start, key, booked, remaining, state });
  }
  return slots;
}

/** Nächstes wählbares Zeitfenster oder `undefined`. */
export function nextFreeSlot(slots: Slot[]): Slot | undefined {
  return slots.find((s) => s.state === 'frei');
}

export function isSlotBookable(slot: Slot | undefined): boolean {
  return !!slot && slot.state === 'frei';
}
