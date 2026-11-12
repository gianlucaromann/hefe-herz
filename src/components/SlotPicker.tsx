import { useState } from 'react';
import { dayLabel } from '../lib/format';
import type { Slot } from '../lib/slots';

interface Props {
  slots: Slot[];
  day: Date;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

const INITIAL = 12;

export function SlotPicker({ slots, day, selectedKey, onSelect }: Props) {
  const [showAll, setShowAll] = useState(false);
  const upcoming = slots.filter((s) => s.state !== 'vorbei');
  const visible = showAll ? upcoming : upcoming.slice(0, INITIAL);

  return (
    <fieldset>
      <legend className="mb-2 text-sm text-kruste-muted">
        Abholung <strong className="text-kruste">{dayLabel(day)}</strong> · 10-Minuten-Fenster, frühestens in 10 Minuten
      </legend>
      <div className="grid grid-cols-3 gap-2 min-[400px]:grid-cols-4 sm:grid-cols-6">
        {visible.map((s) => {
          const full = s.state === 'voll';
          const selected = s.key === selectedKey;
          return (
            <label
              key={s.key}
              className={`relative flex min-h-[52px] flex-col items-center justify-center rounded-xl border-2 text-center transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-herz ${
                full
                  ? 'cursor-not-allowed border-dashed border-linie bg-teig text-kruste-muted'
                  : selected
                    ? 'cursor-pointer border-herz bg-herz text-white'
                    : 'cursor-pointer border-linie bg-mehl hover:border-kruste/50'
              }`}
            >
              <input type="radio" name="slot" value={s.key} checked={selected} disabled={full} onChange={() => onSelect(s.key)} className="sr-only" />
              <span className={`font-semibold tabular-nums ${full ? 'line-through' : ''}`}>{s.key}</span>
              <span className="text-[11px] leading-tight">{full ? 'voll' : s.remaining <= 2 ? `noch ${s.remaining}` : selected ? 'gewählt' : ' '}</span>
            </label>
          );
        })}
      </div>
      {upcoming.length > INITIAL && (
        <button type="button" className="btn-ghost mt-2 text-sm underline" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
          {showAll ? 'Weniger Zeiten zeigen' : `Alle ${upcoming.length} Zeiten zeigen`}
        </button>
      )}
    </fieldset>
  );
}
