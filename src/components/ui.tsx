import type { ReactNode } from 'react';
import { HeartKnot } from './Logo';

export function Spinner({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-kruste-muted">
      <HeartKnot className="h-10 w-10 animate-pulse-soft" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
      <HeartKnot className="h-12 w-12 opacity-80" />
      <h2 className="text-xl font-semibold">{title}</h2>
      {children && <div className="max-w-prose text-kruste-muted">{children}</div>}
      {action}
    </div>
  );
}

export function Alert({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: ReactNode }) {
  const styles = {
    info: 'bg-getreide-light border-getreide',
    error: 'bg-[#FBE9EA] border-herz',
    success: 'bg-[#E8F2E0] border-[#5E8C3A]',
  }[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border-l-4 px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function QtyStepper({ qty, onChange, label }: { qty: number; onChange: (q: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border-2 border-linie bg-mehl" role="group" aria-label={`Menge ${label}`}>
      <button type="button" className="h-11 w-11 rounded-full text-xl font-bold hover:bg-getreide-light" onClick={() => onChange(qty - 1)} aria-label={`${label}: eins weniger`}>
        −
      </button>
      <span className="min-w-[2ch] text-center font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" className="h-11 w-11 rounded-full text-xl font-bold hover:bg-getreide-light" onClick={() => onChange(qty + 1)} aria-label={`${label}: eins mehr`} disabled={qty >= 20}>
        +
      </button>
    </div>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  const vegan = tag === 'vegan';
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${vegan ? 'bg-[#E8F2E0] text-[#2F5418]' : 'bg-getreide-light text-kruste'}`}>
      {vegan ? 'vegan' : 'vegetarisch'}
    </span>
  );
}

export function PinIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
