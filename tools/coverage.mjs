import fs from 'node:fs';
import path from 'node:path';
import { root } from './site.mjs';

const ENTITIES = { '&hellip;': '…', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&rarr;': '→' };
const decode = (text) => text.replace(/&[a-z#0-9]+;/g, (entity) => ENTITIES[entity] ?? entity);
const plain = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/…/g, '').replace(/\s+/g, ' ').trim();

const BLOCK = /<(p|li|dd|dt|tr|h[1-6]|pre|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/g;
const LABEL = /<(span class="ui"|strong|em|code|td|th|kbd|a)[^>]*>([\s\S]*?)<\/(?:span|strong|em|code|td|th|kbd|a)>/g;

export function blocksOf(html) {
  const main = html.match(/<main class="doc"[\s\S]*?<\/main>/)?.[0] ?? '';
  const blocks = [];
  for (const [, tag, inner] of main.matchAll(BLOCK)) {
    const text = plain(inner);
    if (!text) continue;
    const labels = [...inner.matchAll(LABEL)].flatMap((label) => plain(label[2]).split(/,\s+|\s+and\s+|\s+\/\s+/));
    if (/^h[1-6]$/.test(tag)) labels.push(text);
    blocks.push({ tag, text, labels, words: text.split(' ').length });
  }
  return blocks;
}

export function readPages(docs = path.join(root, 'docs')) {
  const pages = [];
  for (const section of ['guide', 'cli', 'jetbrains', 'vscode', 'rules']) {
    const directory = path.join(docs, section);
    if (!fs.existsSync(directory)) continue;
    for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.html')).sort()) {
      pages.push({ page: `${section}/${name}`, blocks: blocksOf(fs.readFileSync(path.join(directory, name), 'utf8')) });
    }
  }
  return pages;
}

function hits(term, block) {
  const kind = term.slice(0, 1);
  const value = term.slice(2).replace(/…/g, '');
  const lower = value.toLowerCase();
  if (kind === 'L') return block.labels.some((label) => label.toLowerCase() === lower);
  if (kind === 'T') return block.text.toLowerCase().includes(lower);
  if (kind === 'R') return new RegExp(value, 'i').test(block.text);
  if (kind === 'A') return value.split('&').every((part) => block.text.toLowerCase().includes(part.toLowerCase()));
  throw new Error(`unknown term ${term}`);
}

export function depthOf(terms, pages, only = null) {
  let best = { page: null, depth: 'none', rank: 0 };
  for (const { page, blocks } of pages) {
    if (only && !only.includes(page)) continue;
    for (const block of blocks) {
      if (!terms.some((term) => hits(term, block))) continue;
      const explained = /^h[1-6]$/.test(block.tag) || (block.tag !== 'pre' && block.words >= 10);
      const rank = (explained ? 2 : 1) * 10 + (page.startsWith('guide/') ? 2 : page.startsWith('cli/') ? 1 : 0);
      if (rank > best.rank) best = { page, depth: explained ? 'explained' : 'mention', rank };
    }
  }
  return { page: best.page, depth: best.depth };
}
