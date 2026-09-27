import fs from 'node:fs';
import path from 'node:path';
import { ALL_SECTIONS, blocksDir, pagesDir } from './site.mjs';

const wanted = process.argv[2];
const slots = new Map();
for (const section of fs.readdirSync(pagesDir)) {
  for (const file of fs.readdirSync(path.join(pagesDir, section)).filter((name) => name.endsWith('.html'))) {
    const text = fs.readFileSync(path.join(pagesDir, section, file), 'utf8');
    for (const [, id, title] of text.matchAll(/\{\{host:([a-z0-9-]+)\|([^}]+)\}\}/g)) slots.set(id, { title, page: `${section}/${file}` });
  }
}

const hosts = ALL_SECTIONS.filter((section) => section.kind === 'host' && (!wanted || section.id === wanted));
for (const host of hosts) {
  const dir = path.join(blocksDir, host.id);
  const missing = [...slots].filter(([id]) => !fs.existsSync(path.join(dir, `${id}.html`)));
  console.log(`${host.id}: ${slots.size - missing.length} of ${slots.size} blocks written${host.enabled === false ? ' (not enabled)' : ''}`);
  for (const [id, { title, page }] of missing) console.log(`  missing ${id}  "${title}"  on ${page}`);
}
