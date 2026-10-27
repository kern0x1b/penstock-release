import fs from 'node:fs';
import path from 'node:path';
import { ANALYTICS_TOKEN, root, THEME_SCRIPT } from './site.mjs';

const BEACON = 'https://static.cloudflareinsights.com/beacon.min.js';
import { checkoutSettings } from './plans.mjs';
import { readPrices } from './fetch-prices.mjs';
import { contrastFailures } from './check-contrast.mjs';
import { readPages, depthOf } from './coverage.mjs';

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
    if (ANALYTICS_TOKEN && url === BEACON) continue;
    if (/\.(css|js|woff2?|png|svg)(\?|$)/.test(url) || /fonts\.(googleapis|gstatic)/.test(url)) problems.push(`${relative}: loads ${url} from another site`);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map((match) => match[0]);
  const allowed = [path.join('guide', 'plans.html'), path.join('pricing', 'index.html')].includes(relative) && checkoutSettings().embed === true;
  for (const script of scripts) {
    if (/type=["']application\/ld\+json["']/i.test(script)) continue;
    if (script === '<script>' && html.includes(`<script>${THEME_SCRIPT}</script>`)) continue;
    if (ANALYTICS_TOKEN && script.startsWith(`<script defer src="${BEACON}" data-cf-beacon=`)) continue;
    if (!(allowed && /src="(\.\.\/)+vendor\/polar-checkout\/embed\.global\.js"/.test(script))) problems.push(`${relative}: has a script that is not the vendored checkout: ${script}`);
  }
  if (html.includes('data-polar-checkout') && !allowed) problems.push(`${relative}: has a checkout button but no checkout script, or the embed is off`);
  const legal = /^(license|notices)\//.test(relative);
  if (!legal && html.includes('—')) problems.push(`${relative}: has an em dash`);
  if (!legal && /–/.test(html)) problems.push(`${relative}: has an en dash`);
}

for (const page of pages) {
  const redirect = fs.readFileSync(page, 'utf8').includes('http-equiv="refresh"');
  if (!linked.has(page) && path.basename(page) !== 'index.html' && !redirect) problems.push(`${path.relative(docs, page)}: no page links to it`);
}

const HOST_WORDS = /Settings \||Tools \||Run Penstock|\bCmd\b|\bCtrl\b|[Tt]ool window|[Gg]utter|Run window|IntelliJ|Code Vision|[Ss]tatus bar|Marketplace|\bIDEs?\b|JetBrains(?! Mono)/;
const HOST_PAGES_OK = new Set(['faq.html', 'glossary.html', 'index.html']);
for (const page of pages) {
  const relative = path.relative(docs, page);
  if (!relative.startsWith(`guide${path.sep}`) || HOST_PAGES_OK.has(path.basename(page))) continue;
  const main = fs.readFileSync(page, 'utf8').match(/<main class="doc"[\s\S]*?<\/main>/)?.[0] ?? '';
  const core = main
    .replace(/<div class="hosts">[\s\S]*?<\/section>\n<\/div>\n<\/div>/g, '')
    .replace(/<div class="related">[\s\S]*?<\/div>/, '')
    .replace(/<nav class="pager"[\s\S]*?<\/nav>/, '');
  const found = core.match(HOST_WORDS);
  if (found) problems.push(`${relative}: host-specific wording in the core guide: "${found[0]}" near "${core.slice(Math.max(0, found.index - 40), found.index + 60).replace(/\s+/g, ' ')}"`);
}

const contrast = contrastFailures();
for (const failure of contrast.failures) problems.push(`docs/style.css: ${failure}`);

const coverageFile = path.join(root, 'tools', 'coverage.json');
const coverage = fs.existsSync(coverageFile) ? JSON.parse(fs.readFileSync(coverageFile, 'utf8')) : null;
if (!coverage) problems.push('tools/coverage.json is missing. Run node tools/build-coverage.mjs <product path>.');
else {
  const coveragePages = readPages(docs);
  for (const row of coverage.rows ?? coverage) {
    if (row.userFacing && depthOf(row.terms, coveragePages, row.only, docs).depth === 'none') problems.push(`coverage: ${row.kind} "${row.row}" is not in the documentation`);
  }
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
