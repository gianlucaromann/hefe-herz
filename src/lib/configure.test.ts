import { describe, expect, it } from 'vitest';
import products from '../data/products.json';
import type { Product } from './types';
import { resolve, variantKey } from './configure';

const P = products as Product[];

describe('configure', () => {
  it('berechnet den Preis einer Kreation', () => {
    const key = variantKey('kreation', { brot: ['dinkel'], fuellung: ['falafel'], sauce: ['tahini'], topping: ['rucola', 'gurke'], temp: ['warm'] });
    const p = resolve(key, P)!;
    expect(p.price).toBe(7.5);
    expect(p.variant).toContain('Falafel');
  });
  it('Pendler Zmorge bleibt beim Bündelpreis', () => {
    expect(resolve('pendler-zmorge-gipfeli|getraenk=hafer', P)!.price).toBe(4.9);
  });
  it('lehnt ungültige Auswahl ab', () => {
    expect(resolve('kreation|topping=rucola,gurke,birne', P)).toBeUndefined();
    expect(resolve('buttergipfeli|x=y', P)).toBeUndefined();
  });
});
