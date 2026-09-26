import fs from 'node:fs';
import path from 'node:path';
import { root } from './site.mjs';
import { checkoutSettings } from './plans.mjs';
import { readPrices } from './fetch-prices.mjs';

const docs = path.join(root, 'docs');
const pages = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) pages.push(full);
  }
}
walk(docs);

const idsOf = new Map();
const ids = (file) => {
  if (!idsOf.has(file)) idsOf.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  return idsOf.get(file);
};

function resolveTarget(from, target) {
  const clean = target.split('#')[0].split('?')[0].replace(/^\/penstock-release\//, '/');
  if (clean === '') return from;
  const base = clean.startsWith('/') ? path.join(docs, clean) : path.resolve(path.dirname(from), clean);
  const candidates = [base, `${base}.html`, path.join(base, 'index.html')];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

const problems = [];
const linked = new Set();
let count = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const relative = path.relative(docs, page);
  for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    count += 1;
    const found = resolveTarget(page, target);
    if (!found) {
      problems.push(`${relative}: broken link ${target}`);
      continue;
    }
    linked.add(found);
    const fragment = target.includes('#') ? target.split('#')[1] : '';
    if (fragment && found.endsWith('.html') && !ids(found).has(fragment)) problems.push(`${relative}: no #${fragment} in ${path.relative(docs, found)}`);
  }
  const external = [...html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((match) => match[1]);
  for (const url of external) {
    if (/\.(css|js|woff2?|png|svg)(\?|$)/.test(url) || /fonts\.(googleapis|gstatic)/.test(url)) problems.push(`${relative}: loads ${url} from another site`);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map((match) => match[0]);
  const allowed = relative === path.join('guide', 'plans.html') && checkoutSettings().embed === true;
  for (const script of scripts) {
    if (!(allowed && /src="\.\.\/vendor\/polar-checkout\/embed\.global\.js"/.test(script))) problems.push(`${relative}: has a script that is not the vendored checkout: ${script}`);
  }
  if (html.includes('data-polar-checkout') && !allowed) problems.push(`${relative}: has a checkout button but no checkout script, or the embed is off`);
  const legal = /^(license|notices)\//.test(relative);
  if (!legal && html.includes('—')) problems.push(`${relative}: has an em dash`);
  if (!legal && /–/.test(html)) problems.push(`${relative}: has an en dash`);
}

for (const page of pages) {
  if (!linked.has(page) && path.basename(page) !== 'index.html') problems.push(`${path.relative(docs, page)}: no page links to it`);
}

const warnings = [];
const prices = readPrices();
if (prices.origin !== 'polar' || !prices.readAt) warnings.push('tools/prices.json was not read from Polar. Run node tools/fetch-prices.mjs with POLAR_ACCESS_TOKEN.');
if (prices.sandbox) warnings.push(`the prices and checkout links point at Polar's sandbox (${prices.api}). Production needs the production API URL, organisation id, checkout links and token.`);
if (checkoutSettings().embed !== true) warnings.push('the embedded checkout is off (tools/checkout.json). Buy buttons are plain links. Turn it on after Polar allows the site origin.');

console.log(`${pages.length} pages, ${count} internal links checked`);
if (problems.length > 0) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('all links resolve');
for (const warning of warnings) console.log(`WARNING: ${warning}`);
if (warnings.length > 0 && process.argv.includes('--release')) {
  console.log('Not ready to publish.');
  process.exit(1);
}
