# Bild-Designcode «Hefe & Herz» (Perplexity)

Ziel: alle Produktbilder wirken wie aus einem Shooting. Prompts auf Englisch (bessere Resultate), immer **Stil-Block + Produktzeile** kombinieren.

## 1. Stil-Block (immer anhängen)

```
Style: warm editorial food photography for a small Swiss artisan bakery.
Soft natural morning window light from the left, gentle shadows.
Background: warm cream (#FBF5EA), light oak wood or pale linen surface, no clutter.
Color palette: crust brown (#3E2A1A), golden grain (#E9B44C), small red accent (#C8323C) via one detail (napkin, cup rim or berry).
Camera: 45° angle, 50mm, shallow depth of field, product centered and in sharp focus, fills 60–70% of frame.
Mood: cozy, honest, fresh, appetizing, handmade. Realistic textures, visible crumbs.
Format: square 1:1, high resolution.
Avoid: text, logos, watermarks, hands, people, plastic packaging, busy props, oversaturated colors, cartoon or 3D look.
```

## 2. Produktzeilen (vor den Stil-Block setzen)

| Produkt | Prompt-Zeile |
|---|---|
| Buttergipfeli | `A single Swiss butter croissant (Gipfeli), flaky golden-brown layers, slightly curved, a few flakes on the surface.` |
| Vollkorngipfeli | `A whole-grain spelt croissant, darker crust, sprinkled with oats, small drizzle of honey beside it.` |
| Nussgipfel | `A large Swiss hazelnut croissant (Nussgipfel), glossy glaze, cut in half showing nut filling.` |
| Zimtschnecke | `A cinnamon roll with visible spiral, light white glaze, brown sugar crystals.` |
| Laugenbrezel | `A Swiss pretzel, deep mahogany crust, coarse salt crystals.` |
| Herzknoten | `A heart-shaped braided butter bread knot, shiny egg-washed golden crust.` |
| Sauerteig-Ruchbrot | `A rustic sourdough loaf, dark crackled crust with flour dusting, one slice cut showing open crumb.` |
| Käsestange | `Two puff pastry cheese sticks with melted mountain cheese, crispy layers.` |
| Kaffee Crème | `A Swiss café crème in a white ceramic cup on saucer, golden crema, light steam.` |
| Hafer-Cappuccino | `A cappuccino with oat milk in a white ceramic cup, simple heart latte art, fine microfoam.` |
| Eistee | `A glass of homemade peach-mint iced tea, ice cubes, fresh mint leaf, condensation drops.` |
| Orangensaft | `A small glass of freshly squeezed orange juice, half orange beside it.` |
| Bircher | `Bircher muesli in a small glass jar, oats, grated apple, yogurt, fresh berries on top, wooden spoon.` |
| Laugen-Sandwich | `A pretzel-bread sandwich with ham, cucumber and mustard butter, cut in half.` |
| Pendler-Zmorge | `A butter croissant next to a café crème cup on a small tray, morning commuter breakfast.` |

Neues Produkt: gleiches Muster → *was + Form + Oberfläche/Textur + 1 Detail*.

## 3. Regeln für Konsistenz

- Immer gleicher Stil-Block, nur Produktzeile wechseln.
- Ein Produkt pro Bild (ausser Sets).
- Gleiches Tassen-Set: weisse Keramik.
- Rot nur als kleines Detail, nie als Fläche.
- Gutes Bild gefunden → als Referenz hochladen + «same style, lighting and background as the reference image».
- Export: 1:1, min. 1024 px, als WebP in `public/products/<id>.webp` (id aus `src/data/products.json`).

## 4. Beispiel (komplett)

```
A cappuccino with oat milk in a white ceramic cup, simple heart latte art, fine microfoam.
Style: warm editorial food photography for a small Swiss artisan bakery. [… Stil-Block …]
```

> Hinweis: Bilder sind KI-generiert – im Schulprojekt/Impressum kennzeichnen.
