import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/** Baut die App als eine einzige HTML-Datei (für die Vorschau als Artifact). */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: { 'import.meta.env.VITE_ROUTER': JSON.stringify('memory') },
  build: { outDir: 'dist-artifact', assetsInlineLimit: 100_000_000 },
});
