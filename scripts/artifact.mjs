// Entfernt das HTML-Grundgerüst, damit die Datei als Artifact-Seite veröffentlicht werden kann.
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('dist-artifact/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>|<link rel="icon"[^>]*>/g, '');
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
const scripts = head.match(/<script[\s\S]*?<\/script>/g) ?? [];
const rest = head.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<title>.*?<\/title>/, '<title>Hefe &amp; Herz<\/title>');
writeFileSync('dist-artifact/hefe-herz.html', `${rest.trim()}\n<style>body{background:#FBF5EA}</style>\n${body.trim()}\n${scripts.join('\n')}\n`);
