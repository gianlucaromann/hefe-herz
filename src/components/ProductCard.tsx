import { chf } from '../lib/format';
import type { Product } from '../lib/types';
import { useApp } from '../state/AppState';
import { ProductArt } from './ProductArt';
import { QtyStepper, TagBadge } from './ui';

export function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, setQty } = useApp();
  const qty = cart.find((l) => l.productId === product.id)?.qty ?? 0;
  return (
    <article className="card flex overflow-hidden sm:flex-col" aria-labelledby={`p-${product.id}`}>
      <ProductArt art={product.art} className="h-auto w-28 shrink-0 object-cover sm:h-36 sm:w-full" />
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <h3 id={`p-${product.id}`} className="text-lg font-semibold leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-kruste-muted">{product.description}</p>
        {product.tags.length > 0 && (
          <p className="flex flex-wrap gap-1">
            {product.tags.includes('vegan') ? <TagBadge tag="vegan" /> : product.tags.map((t) => <TagBadge key={t} tag={t} />)}
          </p>
        )}
        <p className="text-xs text-kruste-muted">
          <span className="font-semibold">Allergene:</span> {product.allergens.length ? product.allergens.join(', ') : 'keine deklarationspflichtigen'}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-semibold tabular-nums">{chf(product.price)}</span>
          {qty === 0 ? (
            <button type="button" className="btn-primary px-4" onClick={() => addToCart(product.id)} aria-label={`${product.name} in den Warenkorb, ${chf(product.price)}`}>
              <span aria-hidden="true" className="text-lg leading-none">+</span> Dazu
            </button>
          ) : (
            <QtyStepper qty={qty} label={product.name} onChange={(q) => (q > qty ? addToCart(product.id) : setQty(product.id, q))} />
          )}
        </div>
      </div>
    </article>
  );
}
