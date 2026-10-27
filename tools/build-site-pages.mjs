// Builds the pages that are not part of the guide: pricing, install, faq, about, privacy, terms, for-teams.
// Source: tools/site-pages/<slug>.html (front matter, then the body). Output: docs/<slug>/index.html.
// Facts that appear on several pages come from tools/site.config.json and tools/prices.json.
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG, CONTACT, analyticsNote, REPO, SITE, STORES, VENDOR, escapeHtml, root, shell } from './site.mjs';
import { buyLinksHtml, checkoutUrl, plansHtml, priceSummaryHtml } from './plans.mjs';
import { readPrices } from './fetch-prices.mjs';
import { resolveTokens } from './build-pages.mjs';

const sourceDir = path.join(import.meta.dirname, 'site-pages');
const prices = readPrices();

export const NODE = 'Node.js 22.22.2 or later in 22, 24.15.0 or later in 24, or 26 and later';

export function priceText(tier, interval) {
  const plan = prices.plans[tier];
  const price = plan?.prices.find((entry) => entry.interval === interval);
  if (!price) throw new Error(`no ${interval} price for ${tier} in tools/prices.json`);
  const major = price.amount / 100;
  const symbol = price.currency.toLowerCase() === 'usd' ? '$' : `${price.currency.toUpperCase()} `;
  return `${symbol}${Number.isInteger(major) ? major : major.toFixed(2)}`;
}

function parse(source, file) {
  const match = source.match(/^<!--\n([\s\S]*?)\n-->\n?/);
  if (!match) throw new Error(`${file} has no front matter`);
  const meta = {};
  for (const line of match[1].split('\n')) {
    const at = line.indexOf(':');
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body: source.slice(match[0].length) };
}

export function fill(text) {
  return text
    .replace(/\{\{price:(pro|team):(month|year)\}\}/g, (_, tier, interval) => priceText(tier, interval))
    .replace(/\{\{config:([\w.]+)\}\}/g, (_, keyPath) => {
      const value = keyPath.split('.').reduce((node, key) => node?.[key], CONFIG);
      if (value === undefined || value === '') throw new Error(`{{config:${keyPath}}} is empty in tools/site.config.json`);
      return String(value);
    })
    .replaceAll('{{contact}}', `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`)
    .replaceAll('{{contact-email}}', CONTACT.email)
    .replaceAll('{{issues}}', CONTACT.issues)
    .replaceAll('{{vendor}}', escapeHtml(VENDOR.name))
    .replaceAll('{{updated}}', CONFIG.updated)
    .replaceAll('{{node}}', NODE)
    .replaceAll('{{analytics-note}}', analyticsNote())
    .replaceAll('{{openvsx}}', STORES.openvsx ? ` <a href="${STORES.openvsx}">Penstock is on Open VSX</a>.` : '')
    .replaceAll('{{store:jetbrains}}', STORES.jetbrains)
    .replaceAll('{{store:vscode}}', STORES.vscode)
    .replaceAll('{{store:npm}}', STORES.npm)
    .replaceAll('{{repo}}', REPO)
    .replaceAll('{{buy:pro}}', checkoutUrl(prices, prices.plans.pro))
    .replaceAll('{{buy:team}}', checkoutUrl(prices, prices.plans.team));
}

const plain = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();

export function faqPairs(html) {
  return [...html.matchAll(/<details class="faq"[^>]*><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((match) => ({
    '@type': 'Question',
    name: plain(match[1]),
    acceptedAnswer: { '@type': 'Answer', text: plain(match[2]) },
  }));
}

function offers(tiers) {
  const out = [];
  if (tiers.includes('free')) out.push({ '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' });
  for (const [tier, plan] of Object.entries(prices.plans)) {
    if (!tiers.includes(tier)) continue;
    for (const price of plan.prices) {
      const label = price.interval === 'month' ? 'monthly' : 'yearly';
      out.push({
        '@type': 'Offer',
        name: `${plan.name}, ${label}${plan.seat ? ', per seat' : ''}`,
        price: (price.amount / 100).toFixed(2),
        priceCurrency: price.currency.toUpperCase(),
        availability: 'https://schema.org/InStock',
        url: checkoutUrl(prices, plan),
      });
    }
  }
  return out;
}

const publisher = { '@type': 'Person', name: VENDOR.name, url: `${SITE}/about/` };

function graph(meta, slug, html, title, description) {
  const url = `${SITE}/${slug}/`;
  const kinds = (meta.jsonld ?? '').split(',').map((entry) => entry.trim()).filter(Boolean);
  const nodes = [];
  for (const kind of kinds) {
    if (kind === 'faq') nodes.push({ '@type': 'FAQPage', mainEntity: faqPairs(html) });
    else if (kind === 'product-pricing') nodes.push({ '@type': 'Product', name: 'Penstock', description, brand: { '@type': 'Brand', name: 'Penstock' }, offers: offers(['free', 'pro', 'team']) });
    else if (kind === 'product-team') nodes.push({ '@type': 'Product', name: 'Penstock Team', description, brand: { '@type': 'Brand', name: 'Penstock' }, offers: offers(['team']) });
    else if (kind === 'software')
      nodes.push({
        '@type': 'SoftwareApplication',
        name: 'Penstock',
        alternateName: ['Camunda BPMN Editor'],
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        softwareRequirements: `JetBrains IDE 2023.1 or later, VS Code 1.88 or later, ${NODE}`,
        installUrl: STORES.jetbrains,
        downloadUrl: STORES.vscode,
        publisher,
        offers: offers(['free', 'pro', 'team']),
      });
    else if (kind === 'about') nodes.push({ '@type': 'AboutPage', name: title, url, mainEntity: { ...publisher, sameAs: [REPO, STORES.jetbrains, STORES.vscode, STORES.npm] } });
    else if (kind === 'webpage') nodes.push({ '@type': 'WebPage', name: title, url, description, inLanguage: 'en', publisher });
    else throw new Error(`${slug}: unknown jsonld kind ${kind}`);
  }
  nodes.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Penstock', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: meta.crumb ?? title, item: url },
    ],
  });
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function buildSitePages() {
  const written = [];
  for (const file of fs.readdirSync(sourceDir).filter((name) => name.endsWith('.html')).sort()) {
    const slug = file.replace(/\.html$/, '');
    const { meta, body: source } = parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'), file);
    const title = fill(meta.title);
    const description = plain(fill(meta.description));
    if (title.length > 60) console.warn(`${slug}: title is ${title.length} characters (max 60)`);
    if (description.length > 155) console.warn(`${slug}: description is ${description.length} characters (max 155)`);
    const rendered = fill(
      resolveTokens(source)
        .replace('{{plans}}', plansHtml({ freeHref: '../install/', securityHref: '../guide/security.html#checkout', freeLabel: 'Install free' }))
        .replace('{{prices}}', priceSummaryHtml())
        .replace('{{buy}}', buyLinksHtml()),
    );
    const heading = meta.h1 ?? title;
    const wide = meta.wide === 'true' ? ' wide-doc' : '';
    const inner = `<div class="layout single">
<main class="doc${wide}" id="content">
<h1>${heading}</h1>
<p class="lede">${fill(meta.lede)}</p>
${rendered}</main>
</div>`;
    const html = shell({
      depth: 1,
      title,
      description,
      canonical: `${slug}/`,
      body: inner,
      key: `site/${slug}`,
      withSidebar: false,
      wrap: 'bare',
      section: 'site',
      jsonLd: graph(meta, slug, rendered, title, description),
    });
    const out = path.join(root, 'docs', slug);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'index.html'), html);
    written.push(slug);
  }
  console.log(`wrote ${written.length} site pages: ${written.join(', ')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) buildSitePages();
