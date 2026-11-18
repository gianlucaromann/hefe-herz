export type Category = 'zmorge' | 'kreation' | 'zmittag' | 'gebaeck' | 'suesses' | 'getraenke';
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
  /** Streichpreis (Summe Einzelpreise) für Bündel */
  compareAt?: number;
  /** Preis ist Grundpreis («ab») */
  priceFrom?: boolean;
  badge?: string;
  /** Zählt für die Studi Card */
  stamp?: boolean;
  options?: OptionGroup[];
  /** Nur bei zusammengestellten Produkten: gewählte Optionen als Text */
  variant?: string;
}

export interface Option {
  id: string;
  label: string;
  price?: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  min: number;
  max: number;
  options: Option[];
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
  features?: string[];
  hours: Record<string, DayHours | null>; // 0 = Sonntag … 6 = Samstag
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type PaymentMethod = 'twint' | 'applepay' | 'karte' | 'abholung';
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
  discount: number; // Gratis-Zmorge aus Studi Card
  total: number;
  slot: string; // ISO-Zeit der Abholung
  firstName: string;
  phone?: string;
  payment: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  statusChangedManually?: boolean;
  stampsEarned?: number;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'zmorge', label: 'Zmorge' },
  { id: 'kreation', label: 'Deine Kreation' },
  { id: 'zmittag', label: 'Zmittag' },
  { id: 'gebaeck', label: 'Gebäck' },
  { id: 'suesses', label: 'Süsses' },
  { id: 'getraenke', label: 'Getränke' },
];
