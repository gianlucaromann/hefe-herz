# Hefe & Herz – Click & Collect (Demo)

Mobile-first Click-&-Collect-Website für die **fiktive** Schweizer Bäckerei «Hefe & Herz».
Schulprojekt für ein Hochschulmodul: kein Backend, keine echte Zahlung, keine echten Personendaten.

## Start

```bash
npm install
npm run dev      # Entwicklungsserver auf http://localhost:5173
npm test         # Vitest (Slot-Logik)
npm run build    # Typprüfung + Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

Für Direktaufrufe von Unterseiten (z. B. `/backstube`) muss ein Hosting die SPA-Fallback-Regel auf `index.html` haben.

## Funktionen

| Route | Inhalt |
|---|---|
| `/` | Start: Hero, «Dasselbe wie letztes Mal», offene Bestellungen, Filialwahl, Empfehlungen nach Tageszeit, Sammelkarte |
| `/sortiment` | Sortiment nach Kategorien, Suche, Filter vegan/vegetarisch, Allergene |
| `/kasse` | Warenkorb, Abholzeit (nächster freier Slot vorausgewählt), Vorname/Handy, simulierte Zahlung, Gratis-Produkt einlösen |
| `/bestellung/:id` | Bestätigung mit Bestellnummer, Abholcode + QR, Kalender-Export (.ics), simulierter Status |
| `/sammelkarte` | 10 Stempel = 1 Gratis-Produkt (1 Stempel pro Bestellung) |
| `/filialen` | 3 Filialen mit Öffnungszeiten (gemerkt im Browser) |
| `/backstube` | Team-Ansicht ohne Login: Bestellungen nach Abholzeit, Status per Klick, Demo zurücksetzen |
| `/datenschutz` | Datenschutz-Hinweis |

**Kernpfad:** Produkt «Dazu» → Warenkorb-Leiste (Tap 1) → «Bestellen» (Tap 2). Slot und Vorname sind vorausgefüllt.
Stammkundschaft: «Dasselbe wie letztes Mal» → «Bestellen».

## Struktur

```
src/
  data/            products.json, stores.json (Sortiment, Filialen, Öffnungszeiten)
  lib/
    slots.ts       Slot-Logik (10-Min-Raster, Vorlauf, Kapazität, Ladenschluss) + slots.test.ts
    orders.ts      simulierte Auslastung, Status-Simulation
    ics.ts         Kalenderdatei
    format.ts      CHF, Zeiten, Tagesbezeichnungen
    storage.ts     robuster localStorage-Zugriff
    types.ts       Datenmodell
  state/AppState.tsx   Context: Filiale, Warenkorb, Bestellungen, Sammelkarte, Profil (persistiert)
  components/      Layout (Demo-Banner, Header, Warenkorb-Leiste, aria-live), Logo, ProductArt (SVG),
                   ProductCard, SlotPicker, StampCard, StatusTracker, QrCode, StorePicker, ui
  pages/           Home, Menu, Checkout, Confirmation, StampCardPage, Stores, Backstube, Privacy, NotFound
```

## Datenmodell (Kurzform)

- `Product { id, name, description, price, category, allergens[], tags[], art }`
- `Store { id, name, type: bahnhof|quartier, address, city, note, hours{0–6: {open, close} | null} }`
- `Order { id, pickupCode, storeId, items[], subtotal, discount, total, slot, firstName, phone?, payment, status, createdAt }`
- localStorage-Schlüssel: `hh.filiale`, `hh.warenkorb`, `hh.bestellungen`, `hh.sammelkarte`, `hh.profil`

## Designentscheidungen

- **Farben als Tokens** in `tailwind.config.js`: Teig-Creme `#FBF5EA`, Mehl-Weiss `#FFFFFF`, Krusten-Braun `#3E2A1A`,
  Herz-Rot `#C8323C`, Getreide-Gelb `#E9B44C`. Kontraste (WCAG 2.1):
  Braun auf Creme 12.5:1 · Weiss auf Herz-Rot 5.3:1 · Herz-Rot auf Creme 4.9:1 · Braun auf Gelb 7.2:1 ·
  Sekundärtext `#6B5544` auf Creme 6.4:1. Getreide-Gelb wird nie als Textfarbe verwendet.
- **Typografie:** Fraunces (Display-Serif) + Inter, lokal via Fontsource, System-Fallbacks. Fliesstext max. 65ch.
- **Marke:** eigenes SVG-Wortlogo, das «&» sitzt in einem Herz; Bildzeichen ist ein geknoteter Teigstrang in Herzform.
  Produktbilder sind eigene, einfache SVG-Illustrationen.
- **Slots:** 10-Min-Raster ab Öffnung (aufgerundet), letztes Fenster endet spätestens bei Ladenschluss,
  frühestens 10 Min nach jetzt, Kapazität 8. Ist heute nichts mehr frei, wird der nächste Öffnungstag angeboten.
  Vor dem Abschicken wird die Kapazität erneut geprüft («Slot gerade vergeben»).
- **Auslastung** anderer Kundschaft wird deterministisch simuliert (Stosszeiten voller), damit volle Slots sichtbar sind.
- **Status** wird simuliert (nach 12 s «In Zubereitung», nach 40 s «Abholbereit»), die Backstube kann manuell übersteuern.
  Tabs werden über das `storage`-Event synchronisiert.
- **Barrierefreiheit:** semantische Landmarks, Skip-Link, Labels, sichtbarer Fokus, Touch-Ziele ≥ 44 px,
  `aria-live` für Warenkorb und Status, `prefers-reduced-motion` respektiert.
- **Performance:** Unterseiten per Lazy Loading, keine externen Requests, keine Tracker/Cookies.

## Qualität (geprüft)

- `npm test`: 17 Tests grün · `npm run build`: fehlerfrei
- Lighthouse (mobil, lokaler Preview-Build): Start 90/100/100, Sortiment 98/100/100, Kasse 98/100/100 (Performance/Accessibility/Best Practices)
- E2E-Durchlauf mit Playwright bei 360 px: Bestellung, Status, .ics, Nachbestellen, Backstube; kein horizontales Scrollen

## GitHub Pages

```bash
npm run build:pages   # baut nach docs/ (Hash-Routing, relative Pfade)
```

Einstellungen: *Settings → Pages → Build and deployment → Source: Deploy from a branch*,
Branch `claude/youthful-allen-ti3awi`, Ordner `/docs`. Nach Änderungen `build:pages` erneut ausführen und committen.
