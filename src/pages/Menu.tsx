import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/ui';
import { CATEGORIES, type Category, type Tag } from '../lib/types';
import { PRODUCTS } from '../state/AppState';

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function Menu() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'alle'>('alle');
  const [tags, setTags] = useState<Tag[]>([]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return PRODUCTS.filter(
      (p) =>
        (category === 'alle' || p.category === category) &&
        tags.every((t) => p.tags.includes(t)) &&
        (!q || normalize(`${p.name} ${p.description}`).includes(q)),
    );
  }, [query, category, tags]);

  const toggleTag = (t: Tag) => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const chip = (active: boolean) => `chip whitespace-nowrap ${active ? 'border-kruste bg-kruste text-teig' : 'border-linie bg-mehl hover:border-kruste/40'}`;

  return (
    <div>
      <h1 className="text-3xl font-semibold sm:text-4xl">Sortiment</h1>
      <p className="mt-1 max-w-prose text-kruste-muted">Alles frisch aus der Backstube Lindenhof. Wähl aus, wir packen ein.</p>

      <div className="mt-4 space-y-2">
        <label htmlFor="suche" className="sr-only">
          Sortiment durchsuchen
        </label>
        <input id="suche" type="search" className="input" placeholder="Suchen, z. B. Gipfeli" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Kategorie">
          <button type="button" className={chip(category === 'alle')} aria-pressed={category === 'alle'} onClick={() => setCategory('alle')}>
            Alle
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={chip(category === c.id)} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-linie" aria-hidden="true" />
          {(['vegan', 'vegetarisch'] as Tag[]).map((t) => (
            <button key={t} type="button" className={chip(tags.includes(t))} aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}>
              {tags.includes(t) ? '✓ ' : ''}
              {t === 'vegan' ? 'Vegan' : 'Vegetarisch'}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} Produkte gefunden
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Nichts gefunden"
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setQuery('');
                  setTags([]);
                  setCategory('alle');
                }}
              >
                Filter zurücksetzen
              </button>
            }
          >
            Zu «{query || 'diesen Filtern'}» haben wir gerade nichts im Ofen.
          </EmptyState>
        </div>
      ) : (
        CATEGORIES.map((c) => {
          const items = filtered.filter((p) => p.category === c.id);
          if (!items.length) return null;
          return (
            <section key={c.id} aria-labelledby={`k-${c.id}`} className="mt-6">
              <h2 id={`k-${c.id}`} className="mb-3 text-2xl font-semibold">
                {c.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
