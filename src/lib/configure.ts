import type { Product } from './types';

export type Selection = Record<string, string[]>;

/** Schlüssel einer zusammengestellten Variante: "kreation|brot=laugen|topping=rucola,gurke" */
export function variantKey(baseId: string, sel: Selection): string {
  const parts = Object.entries(sel)
    .filter(([, v]) => v.length)
    .map(([g, v]) => `${g}=${v.join(',')}`);
  return [baseId, ...parts].join('|');
}

export function baseId(key: string): string {
  return key.split('|')[0];
}

export function defaultSelection(p: Product): Selection {
  const sel: Selection = {};
  for (const g of p.options ?? []) sel[g.id] = g.min > 0 ? [g.options[0].id] : [];
  return sel;
}

export function priceOf(p: Product, sel: Selection): number {
  let total = p.price;
  for (const g of p.options ?? []) for (const o of g.options) if (sel[g.id]?.includes(o.id)) total += o.price ?? 0;
  return Math.round(total * 100) / 100;
}

export function variantLabel(p: Product, sel: Selection): string {
  return (p.options ?? [])
    .flatMap((g) => g.options.filter((o) => sel[g.id]?.includes(o.id)).map((o) => o.label))
    .join(' · ');
}

/** Löst einen Warenkorb-Schlüssel in ein (ggf. zusammengestelltes) Produkt auf. */
export function resolve(key: string, products: Product[]): Product | undefined {
  const [id, ...parts] = key.split('|');
  const base = products.find((p) => p.id === id);
  if (!base || !base.options) return parts.length ? undefined : base;
  const sel = defaultSelection(base);
  for (const part of parts) {
    const [g, v] = part.split('=');
    const group = base.options.find((x) => x.id === g);
    if (!group) return undefined;
    const ids = (v ?? '').split(',').filter((x) => group.options.some((o) => o.id === x));
    if (ids.length < group.min || ids.length > group.max) return undefined;
    sel[g] = ids;
  }
  return { ...base, id: variantKey(base.id, sel), price: priceOf(base, sel), variant: variantLabel(base, sel), priceFrom: false };
}
