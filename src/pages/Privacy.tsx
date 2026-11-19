export default function Privacy() {
  return (
    <article className="max-w-prose space-y-4">
      <h1 className="text-3xl font-semibold sm:text-4xl">Datenschutz</h1>
      <p>
        Diese Website ist ein <strong>fiktives Schulprojekt</strong>. «Hefe &amp; Herz» gibt es nicht. Es werden keine echten Bestellungen ausgelöst und
        nichts bezahlt.
      </p>
      <h2 className="text-xl font-semibold">Was gespeichert wird</h2>
      <p>
        Gewählte Filiale, Warenkorb, Bestellungen, Sammelkarte sowie Vorname und optionale Handynummer werden ausschliesslich im{' '}
        <code>localStorage</code> deines Browsers gespeichert. Nichts davon verlässt dein Gerät.
      </p>
      <h2 className="text-xl font-semibold">Was nicht passiert</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Kein Server, keine Datenbank, kein Konto.</li>
        <li>Keine Cookies, keine Tracker, keine Analyse-Tools.</li>
        <li>Schriften sind lokal eingebunden, es werden keine externen Dienste geladen.</li>
      </ul>
      <h2 className="text-xl font-semibold">Daten löschen</h2>
      <p>Lösche die Website-Daten in deinem Browser oder nutze «Demo zurücksetzen» in der Backstube-Ansicht.</p>
    </article>
  );
}
