export type Category = 'zmorge' | 'zmittag' | 'gebaeck' | 'suesses' | 'getraenke';
export type Tag = 'vegan' | 'vegetarisch';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  allergens: string[];
  tags: Tag[];
  art: string;
}

export interface DayHours {
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}

export interface Store {
  id: string;
  name: string;
  type: 'bahnhof' | 'quartier';
  address: string;
  city: string;
  note: string;
  hours: Record<string, DayHours | null>; // 0 = Sonntag … 6 = Samstag
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type PaymentMethod = 'twint' | 'karte' | 'abholung';
export type OrderStatus = 'eingegangen' | 'zubereitung' | 'abholbereit' | 'abgeholt';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string; // Bestellnummer, z. B. "HH-4821"
  pickupCode: string; // 4-stelliger Abholcode
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number; // Gratis-Produkt aus Sammelkarte
  total: number;
  slot: string; // ISO-Zeit der Abholung
  firstName: string;
  phone?: string;
  payment: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  statusChangedManually?: boolean;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'zmorge', label: 'Zmorge' },
  { id: 'zmittag', label: 'Zmittag' },
  { id: 'gebaeck', label: 'Gebäck' },
  { id: 'suesses', label: 'Süsses' },
  { id: 'getraenke', label: 'Getränke' },
];
