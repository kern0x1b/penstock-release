import fs from 'node:fs';
import path from 'node:path';
import { HOSTS, blocksDir, escapeHtml } from './site.mjs';

const PLACEHOLDER = /\{\{host:([a-z0-9-]+)\|([^}]+)\}\}/g;

function readBlock(host, id) {
  const file = path.join(blocksDir, host.id, `${id}.html`);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^<!--\n([\s\S]*?)\n-->\n?/);
  const meta = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const at = line.indexOf(':');
      meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
  }
  return { meta, body: match ? text.slice(match[0].length) : text };
}

export const usedBlocks = new Set();
export const missingBlocks = [];

export function renderHostBlocks(body, page) {
  return body.replace(PLACEHOLDER, (_, id, title) => {
    usedBlocks.add(id);
    const cards = HOSTS.map((host) => {
      const block = readBlock(host, id);
      if (!block) {
        missingBlocks.push(`${host.id}/${id}  (needed by ${page})`);
        return '';
      }
      const inner = block.meta.unavailable ? `<p class="unavailable">Not available ${escapeHtml(host.where ?? `in ${host.title}`)}. ${escapeHtml(block.meta.unavailable)}</p>` : block.body.trim();
      return `<section class="host" aria-label="${escapeHtml(host.title)}">\n<h3>${escapeHtml(host.title)}</h3>\n${inner}\n</section>`;
    });
    return `<div class="hosts">\n<p class="hosts-title">${escapeHtml(title)}</p>\n<div class="host-grid">\n${cards.join('\n')}\n</div>\n</div>`;
  });
}

export function unusedBlocks() {
  const unused = [];
  for (const host of HOSTS) {
    const dir = path.join(blocksDir, host.id);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      const id = file.replace(/\.html$/, '');
      if (!usedBlocks.has(id)) unused.push(`${host.id}/${id}`);
    }
  }
  return unused;
}
