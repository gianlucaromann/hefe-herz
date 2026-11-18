import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chf } from '../lib/format';
import type { Product } from '../lib/types';
import { useApp } from '../state/AppState';
import { ConfiguratorDialog } from './Configurator';
import { ProductArt } from './ProductArt';
import { QtyStepper, TagBadge } from './ui';

export function PriceTag({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-semibold tabular-nums ${large ? 'text-2xl' : ''}`}>
        {product.priceFrom ? 'ab ' : ''}
        {chf(product.priceFrom ? 5.5 : product.price)}
      </span>
      {product.compareAt && (
        <span className="text-sm text-kruste-muted">
          <span className="sr-only">statt</span>
          <s className="tabular-nums">{chf(product.compareAt)}</s>
        </span>
      )}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, setQty } = useApp();
  const [open, setOpen] = useState(false);
  const configurable = !!product.options;
  const qty = configurable
    ? cart.filter((l) => l.productId.split('|')[0] === product.id).reduce((n, l) => n + l.qty, 0)
    : (cart.find((l) => l.productId === product.id)?.qty ?? 0);
  const saving = product.compareAt ? product.compareAt - product.price : 0;

  return (
    <article className="card card-hover relative flex overflow-hidden sm:flex-col" aria-labelledby={`p-${product.id}`}>
      <div className="relative w-28 shrink-0 sm:w-full">
        <ProductArt art={product.art} category={product.category} className="h-full w-full sm:h-36" />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-kruste px-2 py-0.5 text-[11px] font-bold text-teig">{product.badge}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <h3 id={`p-${product.id}`} className="text-lg font-semibold leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-kruste-muted">{product.description}</p>
        {(product.tags.length > 0 || saving > 0) && (
          <p className="flex flex-wrap gap-1">
            {saving > 0 && <span className="rounded-full bg-herz px-2 py-0.5 text-xs font-semibold text-white">Du sparst {chf(saving)}</span>}
            {product.tags.includes('vegan') ? <TagBadge tag="vegan" /> : product.tags.map((t) => <TagBadge key={t} tag={t} />)}
          </p>
        )}
        <details className="text-xs text-kruste-muted">
          <summary className="cursor-pointer select-none py-1">Allergene</summary>
          {product.allergens.length ? product.allergens.join(', ') : 'keine deklarationspflichtigen'}
        </details>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <PriceTag product={product} />
          {product.id === 'kreation' ? (
            <Link to="/kreation" className="btn-primary px-4">
              Zusammenstellen
            </Link>
          ) : configurable ? (
            <button type="button" className="btn-primary px-4" onClick={() => setOpen(true)} aria-haspopup="dialog">
              {qty > 0 ? `Noch eins (${qty})` : 'Wählen'}
            </button>
          ) : qty === 0 ? (
            <button type="button" className="btn-primary px-4" onClick={() => addToCart(product.id)} aria-label={`Dazu: ${product.name}, ${chf(product.price)}`}>
              <span aria-hidden="true" className="text-lg leading-none">+</span> Dazu
            </button>
          ) : (
            <QtyStepper qty={qty} label={product.name} onChange={(q) => (q > qty ? addToCart(product.id) : setQty(product.id, q))} />
          )}
        </div>
      </div>
      {configurable && product.id !== 'kreation' && <ConfiguratorDialog product={product} open={open} onClose={() => setOpen(false)} />}
    </article>
  );
}
