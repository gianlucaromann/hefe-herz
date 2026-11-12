import type { Order, Store } from './types';

function utcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(order: Order, store: Store, now = new Date()): string {
  const start = new Date(order.slot);
  const end = new Date(start.getTime() + 10 * 60_000);
  const items = order.items.map((i) => `${i.qty}× ${i.name}`).join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hefe & Herz//Click & Collect Demo//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${order.id}@hefe-herz.demo`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escape(`Abholen bei Hefe & Herz (${order.id})`)}`,
    `LOCATION:${escape(`Hefe & Herz ${store.name}, ${store.address}, ${store.city}`)}`,
    `DESCRIPTION:${escape(`Abholcode: ${order.pickupCode}\n${items}\n\nDemo – fiktives Schulprojekt.`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Gleich Zmorge abholen',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(order: Order, store: Store): void {
  const blob = new Blob([buildIcs(order, store)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hefe-herz-${order.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
