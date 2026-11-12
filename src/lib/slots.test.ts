import { describe, expect, it } from 'vitest';
import { generateSlots, nextFreeSlot, parseHHMM, SLOT_CAPACITY } from './slots';

const day = new Date(2026, 10, 12); // Do, 12.11.2026
const at = (h: number, m: number) => new Date(2026, 10, 12, h, m);
const hours = { open: '06:00', close: '19:30' };

describe('parseHHMM', () => {
  it('rechnet Minuten seit Mitternacht', () => {
    expect(parseHHMM('06:30')).toBe(390);
  });
  it('wirft bei ungültiger Zeit', () => {
    expect(() => parseHHMM('abc')).toThrow();
  });
});

describe('generateSlots', () => {
  it('erzeugt 10-Minuten-Raster von Öffnung bis vor Ladenschluss', () => {
    const slots = generateSlots({ now: at(0, 0), day, hours });
    expect(slots[0].key).toBe('06:00');
    expect(slots[1].key).toBe('06:10');
    expect(slots.at(-1)!.key).toBe('19:20');
    expect(slots).toHaveLength((19 * 60 + 30 - 6 * 60) / 10);
  });

  it('rundet krumme Öffnungszeiten auf das Raster auf', () => {
    const slots = generateSlots({ now: at(0, 0), day, hours: { open: '06:05', close: '07:00' } });
    expect(slots.map((s) => s.key)).toEqual(['06:10', '06:20', '06:30', '06:40', '06:50']);
  });

  describe('Mindestvorlauf', () => {
    it('sperrt Fenster, die früher als 10 Minuten nach jetzt beginnen', () => {
      const slots = generateSlots({ now: at(7, 3), day, hours });
      const byKey = Object.fromEntries(slots.map((s) => [s.key, s.state]));
      expect(byKey['07:00']).toBe('vorbei');
      expect(byKey['07:10']).toBe('vorbei'); // nur 7 Minuten Vorlauf
      expect(byKey['07:20']).toBe('frei');
    });

    it('erlaubt genau 10 Minuten Vorlauf', () => {
      const slots = generateSlots({ now: at(7, 0), day, hours });
      expect(nextFreeSlot(slots)!.key).toBe('07:10');
    });

    it('wählt das nächste freie Fenster vor', () => {
      const slots = generateSlots({ now: at(12, 41), day, hours });
      expect(nextFreeSlot(slots)!.key).toBe('13:00');
    });
  });

  describe('Kapazität', () => {
    it('markiert volle Fenster als voll', () => {
      const slots = generateSlots({
        now: at(7, 0),
        day,
        hours,
        bookings: { '07:10': SLOT_CAPACITY, '07:20': SLOT_CAPACITY - 1 },
      });
      const s710 = slots.find((s) => s.key === '07:10')!;
      const s720 = slots.find((s) => s.key === '07:20')!;
      expect(s710.state).toBe('voll');
      expect(s710.remaining).toBe(0);
      expect(s720.state).toBe('frei');
      expect(s720.remaining).toBe(1);
    });

    it('überspringt volle Fenster bei der Vorauswahl', () => {
      const slots = generateSlots({
        now: at(7, 0),
        day,
        hours,
        bookings: { '07:10': 8, '07:20': 9 },
      });
      expect(nextFreeSlot(slots)!.key).toBe('07:30');
    });

    it('respektiert eine eigene Kapazität', () => {
      const slots = generateSlots({ now: at(7, 0), day, hours, capacity: 2, bookings: { '07:10': 2 } });
      expect(slots.find((s) => s.key === '07:10')!.state).toBe('voll');
    });

    it('vergangene Fenster bleiben "vorbei", auch wenn sie voll sind', () => {
      const slots = generateSlots({ now: at(7, 0), day, hours, bookings: { '06:00': 8 } });
      expect(slots[0].state).toBe('vorbei');
    });
  });

  describe('Ladenschluss', () => {
    it('bietet kein Fenster an, das nach Ladenschluss endet', () => {
      const slots = generateSlots({ now: at(0, 0), day, hours: { open: '06:00', close: '18:35' } });
      expect(slots.at(-1)!.key).toBe('18:20');
    });

    it('liefert kein freies Fenster kurz vor Ladenschluss', () => {
      const slots = generateSlots({ now: at(19, 15), day, hours });
      expect(nextFreeSlot(slots)).toBeUndefined();
    });

    it('letztes Fenster ist genau mit Vorlauf noch buchbar', () => {
      const slots = generateSlots({ now: at(19, 10), day, hours });
      expect(nextFreeSlot(slots)!.key).toBe('19:20');
    });

    it('liefert keine Fenster an geschlossenen Tagen', () => {
      expect(generateSlots({ now: at(0, 0), day, hours: null })).toEqual([]);
    });

    it('nach Ladenschluss ist alles vorbei', () => {
      const slots = generateSlots({ now: at(21, 0), day, hours });
      expect(slots.every((s) => s.state === 'vorbei')).toBe(true);
    });
  });

  it('berechnet Fenster für einen künftigen Tag ohne Vorlauf-Einschränkung', () => {
    const tomorrow = new Date(2026, 10, 13);
    const slots = generateSlots({ now: at(20, 0), day: tomorrow, hours });
    expect(nextFreeSlot(slots)!.key).toBe('06:00');
    expect(nextFreeSlot(slots)!.start.getDate()).toBe(13);
  });
});
