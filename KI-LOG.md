# KI-LOG – Deklaration KI-Unterstützung

Die Website wurde mit einem KI-Coding-Assistenten (Claude Code) auf Basis eines vorgegebenen Prompts erstellt.
Diese Datei dokumentiert getroffene Annahmen und was erfunden bzw. unsicher ist.

## Vorgaben aus dem Prompt (übernommen)

- Bäckerei «Hefe & Herz», 21 Mitarbeitende, 3 Filialen (2 Bahnhof, 1 Quartier), ca. CHF 3 Mio. Umsatz.
- Zielgruppe 18–30, Kernproblem: Umsteigezeit, Abholung < 30 s.
- Farben, Schriften (Fraunces/Inter), Tech-Stack, Funktionsumfang, Kapazität «z. B. 8» pro Slot.

## Erfunden (fiktiv)

| Bereich | Annahme |
|---|---|
| Orte | «Seewil» und «Birchfeld» sind erfundene Orte; PLZ 8999/8998 sind Platzhalter. |
| Filialen | Bahnhof Seewil (Unterführung), Bahnhof Birchfeld (Perronpassage), Lindenhof Seewil (Quartier + Backstube). |
| Öffnungszeiten | Bahnhöfe ab 05:30/06:00 (Pendelverkehr), Birchfeld und Lindenhof sonntags geschlossen. Orientiert an üblichen Bahnhof- bzw. Quartierbäckereien, nicht an realen Daten. |
| Sortiment | 23 Produkte in 5 Kategorien, Namen und Beschreibungen erfunden («Herzknoten» als Hausspezialität). |
| Preise | CHF 1.90 (Gipfeli) bis CHF 11.50 (Bowl). Geschätzt nach allgemeinem Schweizer Preisniveau für Bäckereien/Take-away 2025/26, nicht recherchiert. |
| Allergene | Plausible Zuordnung nach Zutaten (Gluten, Milch, Ei, Nüsse, Sesam, Soja, Senf, Sellerie). **Nicht verbindlich**, keine Lebensmittel-Deklaration. |
| Auslastung | Belegung durch «andere Kundschaft» wird per Hash pro Filiale/Tag/Slot simuliert, Stosszeiten 06–09, 11–13, 16–18 Uhr. |
| Status | Zeitbasiert simuliert (12 s / 40 s). |
| Sammelkarte | 1 Stempel pro Bestellung (nicht pro Artikel); Gratis-Produkt = günstigstes Produkt im Warenkorb. |
| Gestaltung | Logo, Herzknoten-Zeichen und Produktillustrationen sind eigene SVGs ohne Vorlage. |

## Eigene Auslegungen (unsicher / diskutierbar)

- «Bis Ladenschluss»: Das letzte Zeitfenster **endet** bei Ladenschluss (bei 19:30 also letzter Slot 19:20).
- Ist heute kein Slot mehr frei, wird automatisch der nächste Öffnungstag angeboten (nicht explizit im Prompt).
- Ein Slot gilt als «frei», wenn sein Beginn ≥ jetzt + 10 Minuten liegt (genau 10 Minuten sind erlaubt).
- «3 Taps nach Produktwahl»: Umgesetzt als Warenkorb-Leiste → Bestellen (2 Taps), da Slot und Vorname vorausgefüllt sind.
- Handynummer-Validierung bewusst locker (9–16 Ziffern, optional mit +).
- Lighthouse-Werte stammen aus einer lokalen Messung; auf anderem Hosting/Gerät können sie abweichen.

## Nicht umgesetzt / Grenzen

- Keine echte Zahlung, kein Server, keine Synchronisation zwischen Geräten (nur zwischen Tabs im selben Browser).
- Backstube ohne Login (bewusst, Demo).
- Bestellnummern sind 4-stellig zufällig; Kollisionen sind theoretisch möglich.
