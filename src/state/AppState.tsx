import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import productsData from '../data/products.json';
import storesData from '../data/stores.json';
import { KEYS, load, save } from '../lib/storage';
import { randomDigits } from '../lib/orders';
import { resolve } from '../lib/configure';
import type { CartLine, Order, OrderStatus, PaymentMethod, Product, Store } from '../lib/types';

export const PRODUCTS = productsData as Product[];
export const STORES = storesData as Store[];
export const STAMPS_FOR_REWARD = 10;

export const productById = (id: string) => resolve(id, PRODUCTS);
export const storeById = (id: string | null | undefined) => STORES.find((s) => s.id === id);

interface Stamps {
  count: number; // 0–9
  rewards: number; // einlösbare Gratis-Zmorge
  active?: boolean; // Studi Card aktiviert
}

interface Profile {
  firstName: string;
  phone: string;
}

export interface PlaceOrderInput {
  slot: Date;
  firstName: string;
  phone?: string;
  payment: PaymentMethod;
  redeemReward: boolean;
}

interface AppState {
  storeId: string | null;
  store: Store | undefined;
  setStoreId: (id: string) => void;

  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  fillCartFromOrder: (order: Order) => void;

  orders: Order[];
  lastOrder: Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  resetDemo: () => void;

  stamps: Stamps;
  studiActive: boolean;
  activateStudi: () => void;
  profile: Profile;
  lastAdded: { id: string; at: number } | null;
}

const Ctx = createContext<AppState | null>(null);

function lineTotal(cart: CartLine[]) {
  return cart.reduce((sum, l) => sum + (productById(l.productId)?.price ?? 0) * l.qty, 0);
}

/** Preis des günstigsten Pendler Zmorge im Warenkorb (Studi Card: 11. gratis), sonst 0. */
export function cheapestItemPrice(cart: CartLine[]): number {
  const prices = cart.map((l) => productById(l.productId)).filter((p) => p?.stamp).map((p) => p!.price);
  return prices.length ? Math.min(...prices) : 0;
}

export function stampsInCart(cart: CartLine[]): number {
  return cart.reduce((n, l) => n + (productById(l.productId)?.stamp ? l.qty : 0), 0);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreIdState] = useState<string | null>(() => load(KEYS.store, null));
  const [cart, setCart] = useState<CartLine[]>(() => load(KEYS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() => load(KEYS.orders, []));
  const [stamps, setStamps] = useState<Stamps>(() => load(KEYS.stamps, { count: 0, rewards: 0 }));
  const [profile, setProfile] = useState<Profile>(() => load(KEYS.profile, { firstName: '', phone: '' }));
  const [lastAdded, setLastAdded] = useState<{ id: string; at: number } | null>(null);

  useEffect(() => save(KEYS.store, storeId), [storeId]);
  useEffect(() => save(KEYS.cart, cart), [cart]);
  useEffect(() => save(KEYS.orders, orders), [orders]);
  useEffect(() => save(KEYS.stamps, stamps), [stamps]);
  useEffect(() => save(KEYS.profile, profile), [profile]);

  // Synchronisation zwischen Tabs (z. B. Backstube und Bestellstatus nebeneinander)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.orders) setOrders(load(KEYS.orders, []));
      if (e.key === KEYS.stamps) setStamps(load(KEYS.stamps, { count: 0, rewards: 0 }));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((l) => l.productId === productId);
      if (existing) return c.map((l) => (l.productId === productId ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...c, { productId, qty }];
    });
    setLastAdded({ id: productId, at: Date.now() });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => l.productId !== productId) : c.map((l) => (l.productId === productId ? { ...l, qty: Math.min(20, qty) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => setCart((c) => c.filter((l) => l.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const fillCartFromOrder = useCallback((order: Order) => {
    setCart(order.items.filter((i) => productById(i.productId)).map((i) => ({ productId: i.productId, qty: i.qty })));
  }, []);

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      if (!storeId) throw new Error('Keine Filiale gewählt');
      const items = cart
        .map((l) => {
          const p = productById(l.productId);
          return p ? { productId: p.id, name: p.variant ? `${p.name}: ${p.variant}` : p.name, price: p.price, qty: l.qty } : null;
        })
        .filter((i): i is NonNullable<typeof i> => i !== null);
      const subtotal = lineTotal(cart);
      const discount = input.redeemReward && stamps.rewards > 0 ? cheapestItemPrice(cart) : 0;
      const active = stamps.active ?? (stamps.count > 0 || stamps.rewards > 0);
      const earned = active ? Math.max(0, stampsInCart(cart) - (discount > 0 ? 1 : 0)) : 0;
      const order: Order = {
        id: `HH-${randomDigits(4)}`,
        pickupCode: randomDigits(4),
        storeId,
        items,
        subtotal,
        discount,
        total: Math.max(0, subtotal - discount),
        slot: input.slot.toISOString(),
        firstName: input.firstName.trim(),
        phone: input.phone?.trim() || undefined,
        payment: input.payment,
        status: 'eingegangen',
        createdAt: new Date().toISOString(),
        stampsEarned: earned,
      };
      setOrders((o) => [order, ...o]);
      setStamps((s) => {
        const rewards = s.rewards - (discount > 0 ? 1 : 0);
        const total = s.count + earned;
        return { ...s, count: total % STAMPS_FOR_REWARD, rewards: rewards + Math.floor(total / STAMPS_FOR_REWARD) };
      });
      setProfile({ firstName: input.firstName.trim(), phone: input.phone?.trim() ?? '' });
      setCart([]);
      return order;
    },
    [cart, storeId, stamps],
  );

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status, statusChangedManually: true } : o)));
  }, []);

  const resetDemo = useCallback(() => {
    setOrders([]);
    setStamps((s) => ({ count: 0, rewards: 0, active: s.active }));
    setCart([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      storeId,
      store: storeById(storeId),
      setStoreId: setStoreIdState,
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartTotal: lineTotal(cart),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      fillCartFromOrder,
      orders,
      lastOrder: orders[0],
      placeOrder,
      setOrderStatus,
      resetDemo,
      stamps,
      studiActive: stamps.active ?? (stamps.count > 0 || stamps.rewards > 0),
      activateStudi: () => setStamps((s) => ({ ...s, active: true })),
      profile,
      lastAdded,
    }),
    [storeId, cart, orders, stamps, profile, lastAdded, addToCart, setQty, removeFromCart, clearCart, fillCartFromOrder, placeOrder, setOrderStatus, resetDemo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp ausserhalb von AppProvider');
  return ctx;
}

/** Re-render in Intervallen (für Slot-Liste und simulierte Statusänderungen). */
export function useNow(intervalMs = 15_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
