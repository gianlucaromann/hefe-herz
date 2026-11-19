import { describe, expect, it } from 'vitest';
import products from '../data/products.json';
import type { Product } from './types';
import { resolve, variantKey } from './configure';

const P = products as Product[];

describe('configure', () => {
  it('Pendler Zmorge bleibt beim Bündelpreis und kennt die Auswahl', () => {
    const p = resolve(variantKey('pendler-zmorge-brot', { brot: ['hummus'], getraenk: ['osaft'] }), P)!;
    expect(p.price).toBe(8.9);
    expect(p.variant).toContain('Orangensaft');
  });
  it('lehnt ungültige Auswahl ab', () => {
    expect(resolve('pendler-zmorge-gipfeli|getraenk=kaffee,hafer', P)).toBeUndefined();
    expect(resolve('buttergipfeli|x=y', P)).toBeUndefined();
  });
});
