import { useEffect, useRef, useState } from 'react';
import { chf } from '../lib/format';
import { defaultSelection, priceOf, variantKey, variantLabel, type Selection } from '../lib/configure';
import type { Product } from '../lib/types';
import { useApp } from '../state/AppState';

export function ConfiguratorForm({ product, onDone, compact = false }: { product: Product; onDone?: () => void; compact?: boolean }) {
  const { addToCart } = useApp();
  const [sel, setSel] = useState<Selection>(() => defaultSelection(product));
  const [added, setAdded] = useState(false);
  const price = priceOf(product, sel);

  const toggle = (groupId: string, optionId: string, max: number) =>
    setSel((s) => {
      const cur = s[groupId] ?? [];
      if (max === 1) return { ...s, [groupId]: [optionId] };
      if (cur.includes(optionId)) return { ...s, [groupId]: cur.filter((x) => x !== optionId) };
      return cur.length >= max ? s : { ...s, [groupId]: [...cur, optionId] };
    });

  const submit = () => {
    addToCart(variantKey(product.id, sel));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    onDone?.();
  };

  return (
    <div className="space-y-5">
      {(product.options ?? []).map((g) => {
        const cur = sel[g.id] ?? [];
        return (
          <fieldset key={g.id}>
            <legend className="mb-2 font-display text-lg font-semibold">{g.label}</legend>
            <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {g.options.map((o) => {
                const on = cur.includes(o.id);
                const blocked = !on && g.max > 1 && cur.length >= g.max;
                return (
                  <label
                    key={o.id}
                    className={`flex min-h-[52px] cursor-pointer flex-col justify-center rounded-xl border-2 px-3 py-2 text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-herz ${
                      on ? 'border-herz bg-[#FBE9EA]' : blocked ? 'border-linie bg-teig opacity-60' : 'border-linie bg-mehl hover:border-kruste/40'
                    }`}
                  >
                    <input
                      type={g.max === 1 ? 'radio' : 'checkbox'}
                      name={`${product.id}-${g.id}`}
                      checked={on}
                      disabled={blocked}
                      onChange={() => toggle(g.id, o.id, g.max)}
                      className="sr-only"
                    />
                    <span className="font-semibold leading-tight">
                      {on && <span aria-hidden="true">✓ </span>}
                      {o.label}
                    </span>
                    <span className="text-xs text-kruste-muted">{o.price ? `+ ${chf(o.price)}` : g.min > 0 || g.max === 1 ? 'inklusive' : 'gratis'}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <div className="sticky bottom-0 -mx-1 flex items-center gap-3 rounded-2xl bg-mehl/95 p-1 pt-3 backdrop-blur">
        <p className="min-w-0 flex-1 text-sm text-kruste-muted">
          <span className="line-clamp-2">{variantLabel(product, sel)}</span>
        </p>
        <button type="button" className="btn-primary shrink-0 text-base" onClick={submit}>
          {added ? '✓ Im Warenkorb' : `Dazu · ${chf(price)}`}
        </button>
      </div>
    </div>
  );
}

export function ConfiguratorDialog({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={`dlg-${product.id}`}
      className="m-0 mt-auto max-h-[92vh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-mehl p-5 text-kruste shadow-hoch sm:m-auto sm:max-w-xl sm:rounded-3xl"
    >
      {open && (
        <>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Zusammenstellen</p>
              <h2 id={`dlg-${product.id}`} className="text-2xl font-semibold">
                {product.name}
              </h2>
              <p className="text-sm text-kruste-muted">{product.description}</p>
            </div>
            <button type="button" onClick={onClose} className="btn-ghost h-11 w-11 shrink-0 px-0 text-2xl" aria-label="Schliessen">
              ×
            </button>
          </div>
          <ConfiguratorForm product={product} onDone={onClose} compact />
        </>
      )}
    </dialog>
  );
}
