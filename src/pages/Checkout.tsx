import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductArt } from '../components/ProductArt';
import { SlotPicker } from '../components/SlotPicker';
import { StorePicker } from '../components/StorePicker';
import { Alert, EmptyState, QtyStepper } from '../components/ui';
import { chf, time } from '../lib/format';
import { bookingsFor } from '../lib/orders';
import { generateSlots, nextFreeSlot, type Slot } from '../lib/slots';
import { KEYS, load } from '../lib/storage';
import type { Order, PaymentMethod, Store } from '../lib/types';
import { cheapestItemPrice, productById, useApp, useNow } from '../state/AppState';

/** Slots für heute oder – falls heute nichts mehr frei ist – den nächsten Öffnungstag. */
function computeSlots(store: Store, orders: Order[], now: Date): { day: Date; slots: Slot[] } {
  for (let offset = 0; offset < 7; offset++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const hours = store.hours[String(day.getDay())];
    const base = generateSlots({ now, day, hours });
    const bookings = bookingsFor(store.id, day, orders, base.map((s) => s.key));
    const slots = generateSlots({ now, day, hours, bookings });
    if (nextFreeSlot(slots)) return { day, slots };
  }
  return { day: now, slots: [] };
}

const PAYMENTS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'twint', label: 'Twint', hint: 'simuliert' },
  { id: 'karte', label: 'Karte', hint: 'simuliert' },
  { id: 'abholung', label: 'Bei Abholung bezahlen', hint: 'bar oder Karte im Laden' },
];

export default function Checkout() {
  const { cart, cartTotal, store, orders, setQty, removeFromCart, placeOrder, profile, stamps } = useApp();
  const navigate = useNavigate();
  const now = useNow(20_000);

  const { day, slots } = useMemo(() => (store ? computeSlots(store, orders, now) : { day: now, slots: [] }), [store, orders, now]);
  const [slotKey, setSlotKey] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [phone, setPhone] = useState(profile.phone);
  const [payment, setPayment] = useState<PaymentMethod>('twint');
  const [redeem, setRedeem] = useState(stamps.rewards > 0);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; slot?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Nächsten freien Slot vorauswählen; wenn der gewählte nicht mehr frei ist, Hinweis zeigen.
  useEffect(() => {
    const current = slots.find((s) => s.key === slotKey);
    if (current?.state === 'frei') return;
    const next = nextFreeSlot(slots);
    if (slotKey && current && next) {
      setErrors((e) => ({ ...e, slot: `${slotKey} ist gerade vergeben oder abgelaufen. Wir haben dir ${next.key} vorgeschlagen.` }));
    }
    setSlotKey(next?.key ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Dein Warenkorb ist leer"
        action={
          <Link to="/sortiment" className="btn-primary">
            Zum Sortiment
          </Link>
        }
      >
        Noch nichts drin. Ein Gipfeli für unterwegs?
      </EmptyState>
    );
  }

  const discount = redeem && stamps.rewards > 0 ? cheapestItemPrice(cart) : 0;
  const total = Math.max(0, cartTotal - discount);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (firstName.trim().length < 2) next.name = 'Bitte gib deinen Vornamen an (für das Abholregal).';
    if (phone.trim() && !/^\+?[0-9 ]{9,16}$/.test(phone.trim())) next.phone = 'Diese Nummer sieht nicht richtig aus, z. B. 079 123 45 67.';
    if (!store) next.slot = 'Bitte wähl zuerst eine Filiale.';
    else if (!slotKey) next.slot = 'Bitte wähl eine Abholzeit.';
    setErrors(next);
    if (Object.keys(next).length || !store) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    // Zahlung simulieren (kurzer Ladezustand)
    await new Promise((r) => setTimeout(r, payment === 'abholung' ? 300 : 900));

    // Kapazität unmittelbar vor dem Abschicken erneut prüfen (z. B. Bestellung aus anderem Tab)
    const fresh = computeSlots(store, load<Order[]>(KEYS.orders, []), new Date());
    const chosen = fresh.slots.find((s) => s.key === slotKey);
    if (!chosen || chosen.state !== 'frei' || fresh.day.toDateString() !== day.toDateString()) {
      const alt = nextFreeSlot(fresh.slots);
      setErrors({ slot: `Slot gerade vergeben. ${alt ? `Wie wärs mit ${alt.key}?` : 'Heute ist leider nichts mehr frei.'}` });
      setSlotKey(alt?.key ?? null);
      setSubmitting(false);
      return;
    }

    const order = placeOrder({ slot: chosen.start, firstName, phone, payment, redeemReward: redeem });
    navigate(`/bestellung/${order.id}`, { replace: true });
  };

  const selectedSlot = slots.find((s) => s.key === slotKey);

  return (
    <form id="checkout" onSubmit={onSubmit} noValidate className="mx-auto max-w-2xl space-y-6 pb-24">
      <h1 className="text-3xl font-semibold sm:text-4xl">Kasse</h1>

      <section className="card p-4 sm:p-5" aria-labelledby="wk-titel">
        <h2 id="wk-titel" className="text-xl font-semibold">
          Warenkorb
        </h2>
        <ul className="mt-3 divide-y divide-linie">
          {cart.map((l) => {
            const p = productById(l.productId);
            if (!p) return null;
            return (
              <li key={l.productId} className="flex flex-wrap items-center gap-3 py-3">
                <ProductArt art={p.art} className="h-12 w-16 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-tight">{p.name}</p>
                  <p className="text-sm text-kruste-muted tabular-nums">{chf(p.price * l.qty)}</p>
                </div>
                <QtyStepper qty={l.qty} label={p.name} onChange={(q) => setQty(p.id, q)} />
                <button type="button" onClick={() => removeFromCart(p.id)} className="btn-ghost px-3 text-sm underline" aria-label={`${p.name} entfernen`}>
                  Entfernen
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex justify-between border-t border-linie pt-3 font-semibold">
          <span>Zwischensumme</span>
          <span className="tabular-nums">{chf(cartTotal)}</span>
        </div>
        <Link to="/sortiment" className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-herz underline">
          + Noch etwas dazu
        </Link>
      </section>

      <section className="card p-4 sm:p-5" aria-labelledby="zeit-titel">
        <h2 id="zeit-titel" className="text-xl font-semibold">
          Abholzeit {store && <span className="font-sans text-base font-normal text-kruste-muted">· {store.name}</span>}
        </h2>
        {!store ? (
          <div className="mt-3">
            <p className="mb-3 text-sm">Wähl zuerst, wo du abholst:</p>
            <StorePicker />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {errors.slot && <Alert tone="error">{errors.slot}</Alert>}
            {slots.length === 0 ? (
              <Alert tone="info">In den nächsten Tagen sind keine Abholzeiten frei. Versuch es später nochmals.</Alert>
            ) : (
              <SlotPicker
                slots={slots}
                day={day}
                selectedKey={slotKey}
                onSelect={(k) => {
                  setSlotKey(k);
                  setErrors((e) => ({ ...e, slot: undefined }));
                }}
              />
            )}
            <Link to="/filialen" className="inline-flex min-h-[44px] items-center text-sm underline">
              Andere Filiale wählen
            </Link>
          </div>
        )}
      </section>

      <section className="card space-y-4 p-4 sm:p-5" aria-labelledby="angaben-titel">
        <h2 id="angaben-titel" className="text-xl font-semibold">
          Deine Angaben
        </h2>
        <p className="text-sm text-kruste-muted">Kein Konto nötig. Wir merken uns deinen Vornamen nur in diesem Browser.</p>
        <div>
          <label htmlFor="vorname" className="mb-1 block font-semibold">
            Vorname
          </label>
          <input
            id="vorname"
            className="input"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'vorname-fehler' : undefined}
            required
          />
          {errors.name && (
            <p id="vorname-fehler" className="mt-1 text-sm font-semibold text-herz">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="handy" className="mb-1 block font-semibold">
            Handynummer <span className="font-normal text-kruste-muted">(optional, für Rückfragen)</span>
          </label>
          <input
            id="handy"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="079 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'handy-fehler' : undefined}
          />
          {errors.phone && (
            <p id="handy-fehler" className="mt-1 text-sm font-semibold text-herz">
              {errors.phone}
            </p>
          )}
        </div>
      </section>

      <section className="card space-y-3 p-4 sm:p-5" aria-labelledby="zahlung-titel">
        <h2 id="zahlung-titel" className="text-xl font-semibold">
          Zahlung
        </h2>
        <Alert tone="info">
          <strong>Demo, es wird nichts bezahlt.</strong> Twint und Karte sind nur simuliert.
        </Alert>
        <fieldset className="grid gap-2 sm:grid-cols-3">
          <legend className="sr-only">Zahlungsart</legend>
          {PAYMENTS.map((p) => (
            <label
              key={p.id}
              className={`flex min-h-[56px] cursor-pointer flex-col justify-center rounded-xl border-2 px-4 py-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-herz ${
                payment === p.id ? 'border-herz bg-[#FBE9EA]' : 'border-linie bg-mehl'
              }`}
            >
              <input type="radio" name="zahlung" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
              <span className="font-semibold">{p.label}</span>
              <span className="text-xs text-kruste-muted">{p.hint}</span>
            </label>
          ))}
        </fieldset>
        {stamps.rewards > 0 && (
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl bg-getreide-light px-4 py-2">
            <input type="checkbox" checked={redeem} onChange={(e) => setRedeem(e.target.checked)} className="h-5 w-5 accent-herz" />
            <span>
              <strong>Gratis-Produkt einlösen</strong> (Sammelkarte voll) · minus {chf(cheapestItemPrice(cart))}
            </span>
          </label>
        )}
        <dl className="space-y-1 border-t border-linie pt-3">
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <dt>Sammelkarte</dt>
              <dd className="tabular-nums">− {chf(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{chf(total)}</dd>
          </div>
        </dl>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linie bg-teig/95 p-3 backdrop-blur" style={{ paddingBottom: 'max(.75rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <p className="hidden text-sm leading-tight min-[400px]:block">
            <span className="block font-semibold">{selectedSlot ? `Abholung ${time(selectedSlot.start)}` : 'Keine Zeit gewählt'}</span>
            <span className="text-kruste-muted">{store?.name ?? 'Filiale wählen'}</span>
          </p>
          <button type="submit" form="checkout" className="btn-primary flex-1 text-base" disabled={submitting || !store || !slotKey} aria-busy={submitting}>
            {submitting ? (payment === 'abholung' ? 'Bestellung wird gesendet …' : 'Zahlung wird simuliert …') : `Bestellen · ${chf(total)}`}
          </button>
        </div>
      </div>
    </form>
  );
}
