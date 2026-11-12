import { isSameDay } from './format';
import { SLOT_CAPACITY, toKey } from './slots';
import type { Order, OrderStatus } from './types';

/** Kleiner, deterministischer Hash (FNV-1a) für die Demo-Auslastung. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Simulierte Auslastung durch «andere Kundschaft», damit volle Slots in der Demo sichtbar sind.
 * Deterministisch pro Filiale, Tag und Zeitfenster. Stosszeiten (Pendelverkehr) sind voller.
 */
export function simulatedBookings(storeId: string, day: Date, key: string): number {
  const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
  const h = hash(`${storeId}|${dayKey}|${key}`);
  const hour = Number(key.slice(0, 2));
  const rush = (hour >= 6 && hour < 9) || (hour >= 11 && hour < 13) || (hour >= 16 && hour < 18);
  const base = h % (rush ? 10 : 6); // Stosszeit: 0–9, sonst 0–5
  return Math.min(SLOT_CAPACITY, base);
}

export function bookingsFor(storeId: string, day: Date, orders: Order[], keys: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of keys) result[key] = simulatedBookings(storeId, day, key);
  for (const o of orders) {
    const d = new Date(o.slot);
    if (o.storeId !== storeId || !isSameDay(d, day)) continue;
    const key = toKey(d);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

export const STATUS_FLOW: OrderStatus[] = ['eingegangen', 'zubereitung', 'abholbereit', 'abgeholt'];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  eingegangen: 'Eingegangen',
  zubereitung: 'In Zubereitung',
  abholbereit: 'Abholbereit',
  abgeholt: 'Abgeholt',
};

/** Simulierter Fortschritt: nach 12 s in Zubereitung, nach 40 s abholbereit – ausser die Backstube hat manuell gesetzt. */
export function effectiveStatus(order: Order, now = Date.now()): OrderStatus {
  if (order.statusChangedManually) return order.status;
  const elapsed = (now - new Date(order.createdAt).getTime()) / 1000;
  const simulated: OrderStatus = elapsed < 12 ? 'eingegangen' : elapsed < 40 ? 'zubereitung' : 'abholbereit';
  return STATUS_FLOW.indexOf(simulated) > STATUS_FLOW.indexOf(order.status) ? simulated : order.status;
}

export function nextStatus(status: OrderStatus): OrderStatus {
  const i = STATUS_FLOW.indexOf(status);
  return STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
}

export function randomDigits(n: number): string {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}
