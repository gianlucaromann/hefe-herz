// Setzt nach dem Pages-Build die Dateiliste und eine Version in docs/sw.js ein.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = 'docs';
const skip = new Set(['sw.js', 'CNAME', '.nojekyll', 'index.html', 'icon.svg']);
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (!skip.has(name) && !/(cyrillic|greek|vietnamese)/.test(name)) files.push('./' + relative(root, p).split('\\').join('/'));
  }
})(root);
files.sort();
const hash = createHash('sha256');
for (const f of files) hash.update(f);
hash.update(readFileSync(join(root, 'index.html')));
const version = hash.digest('hex').slice(0, 10);
const sw = readFileSync(join(root, 'sw.js'), 'utf8')
  .replace("const VERSION = 'dev';", `const VERSION = '${version}';`)
  .replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(files)};`);
writeFileSync(join(root, 'sw.js'), sw);
console.log(`sw.js: Version ${version}, ${files.length} Dateien`);
