import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'docs');
const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.html')) files.push(full);
  }
}

walk(root);

const anchors = new Map();
const external = [];
const missing = [];
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  anchors.set(file, ids);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].trim();
    if (!target || target.startsWith('#')) {
      if (target.startsWith('#') && target.length > 1) {
        checked += 1;
        if (!anchors.get(file).has(decodeURIComponent(target.slice(1)))) missing.push(`${file} -> ${target}`);
      }
      continue;
    }
    if (/^[a-z]+:/i.test(target) || target.startsWith('//')) {
      external.push(target);
      continue;
    }
    checked += 1;
    const [path, hash] = target.split('#');
    const resolved = resolve(dirname(file), decodeURIComponent(path));
    if (!exists(resolved)) {
      missing.push(`${file} -> ${target}`);
      continue;
    }
    if (hash && resolved.endsWith('.html')) {
      const other = anchors.get(resolved);
      if (other && !other.has(decodeURIComponent(hash))) missing.push(`${file} -> ${target}`);
    }
  }
}

function exists(path) {
  try {
    if (statSync(path).isFile()) return true;
    return statSync(join(path, 'index.html')).isFile();
  } catch {
    return false;
  }
}

console.log(`pages: ${files.length}, internal targets checked: ${checked}, external links: ${new Set(external).size}`);
if (missing.length) {
  console.log(`\nBROKEN (${missing.length}):`);
  for (const item of missing) console.log(`  ${item}`);
  process.exit(1);
}
console.log('all internal links and image paths resolve');
