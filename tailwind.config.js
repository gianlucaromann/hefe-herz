/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teig: '#FBF5EA', // Hintergrund Teig-Creme
        mehl: '#FFFFFF', // Flächen Mehl-Weiss
        kruste: { DEFAULT: '#3E2A1A', muted: '#6B5544' }, // Text
        herz: { DEFAULT: '#C8323C', dark: '#A3262F' }, // Akzent
        getreide: { DEFAULT: '#E9B44C', light: '#F6E2B3' }, // Zweitakzent
        linie: '#E8DCC8',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: { prose: '65ch' },
      boxShadow: { karte: '0 1px 2px rgba(62,42,26,.06), 0 4px 16px rgba(62,42,26,.06)' },
    },
  },
  plugins: [],
};
