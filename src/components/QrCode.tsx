import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export function QrCode({ value, label }: { value: string; label: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#3E2A1A', light: '#FFFFFF' } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [value]);

  if (error) return <p className="text-sm text-herz">QR-Code konnte nicht erzeugt werden. Zeig einfach den Code.</p>;
  if (!svg) return <div className="aspect-square w-full animate-pulse-soft rounded-xl bg-linie" role="status" aria-label="QR-Code wird erzeugt" />;
  return <div role="img" aria-label={label} className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
