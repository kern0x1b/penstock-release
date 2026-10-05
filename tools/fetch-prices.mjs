import fs from 'node:fs';
import path from 'node:path';
import { root } from './site.mjs';

export const PRICES_FILE = path.join(import.meta.dirname, 'prices.json');

export const isSandbox = (api) => /sandbox/i.test(new URL(api).hostname);

const TIERS = { pro: 'Pro', team: 'Team' };

export function readPrices() {
  return JSON.parse(fs.readFileSync(PRICES_FILE, 'utf8'));
}

function licensingPath() {
  return (
    process.env.PENSTOCK_LICENSING ??
    path.resolve(root, '..', 'jetbrains-bpmn-editor', 'libs', 'core', 'src', 'node', 'licensing.json')
  );
}

async function get(api, route, token) {
  const response = await fetch(`${api}${route}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20000),
  });
  const text = await response.text();
  if (!response.ok) {
    const hint = response.status === 401 || response.status === 403 ? ' Check that the token belongs to this organisation and may read products and checkout links.' : '';
    throw new Error(`Polar answered ${response.status} for ${route}.${hint}`);
  }
  return JSON.parse(text);
}

function pricesOf(product) {
  return (product.prices ?? [])
    .filter((price) => !price.is_archived && price.amount_type === 'fixed' && typeof price.price_amount === 'number')
    .map((price) => ({
      currency: String(price.price_currency).toLowerCase(),
      amount: price.price_amount,
      interval: price.recurring_interval ?? product.recurring_interval ?? null,
      intervalCount: product.recurring_interval_count ?? 1,
    }));
}

const intervalRank = { day: 0, week: 1, month: 2, year: 3 };

function sorted(prices) {
  return [...prices].sort(
    (a, b) => a.currency.localeCompare(b.currency) || (intervalRank[a.interval] ?? 9) - (intervalRank[b.interval] ?? 9),
  );
}

export async function fetchPrices({ token, apiUrl, licensing = JSON.parse(fs.readFileSync(licensingPath(), 'utf8')), now = new Date() } = {}) {
  if (!token) throw new Error('POLAR_ACCESS_TOKEN is not set.');
  const api = (apiUrl ?? licensing.api).replace(/\/$/, '');
  const plans = {};
  const notes = [];
  let organisationProducts = null;

  for (const [tier, title] of Object.entries(TIERS)) {
    const link = licensing.checkoutLinks?.[tier];
    if (!link) throw new Error(`The licensing settings have no checkout link for ${title}.`);
    let products = [];
    try {
      products = (await get(api, `/v1/checkout-links/${encodeURIComponent(link)}`, token)).products ?? [];
    } catch (failure) {
      notes.push(`${title}: ${failure.message} Falling back to the products of the organisation.`);
    }
    if (products.length === 0) {
      organisationProducts ??= (await get(api, `/v1/products/?organization_id=${encodeURIComponent(licensing.organizationId)}&is_archived=false&limit=100`, token)).items ?? [];
      products = organisationProducts.filter((product) => new RegExp(`\\b${title}\\b`, 'i').test(product.name));
    }
    products = products.filter((product) => !product.is_archived);
    const prices = sorted(products.flatMap(pricesOf));
    if (prices.length === 0) throw new Error(`No fixed price was found for ${title}. Products: ${products.map((product) => product.name).join(', ') || 'none'}.`);
    plans[tier] = {
      name: title,
      checkoutLink: link,
      products: products.map((product) => ({ id: product.id, name: product.name })),
      prices,
    };
  }

  notes.forEach((note) => console.warn(note));
  return {
    schema: 1,
    origin: 'polar',
    readAt: now.toISOString(),
    api,
    sandbox: isSandbox(api),
    organizationId: licensing.organizationId,
    plans,
  };
}

export async function refreshPrices(options = {}) {
  const token = options.token ?? process.env.POLAR_ACCESS_TOKEN;
  const prices = await fetchPrices({ ...options, token, apiUrl: options.apiUrl ?? process.env.POLAR_API_URL });
  const text = `${JSON.stringify(prices, null, 2)}\n`;
  if (token && text.includes(token)) throw new Error('Refusing to write prices.json: it contains the access token.');
  fs.writeFileSync(options.file ?? PRICES_FILE, text);
  console.log(`wrote ${path.relative(root, options.file ?? PRICES_FILE)}: ${Object.entries(prices.plans).map(([tier, plan]) => `${plan.name} ${plan.prices.length} price(s)`).join(', ')}, read from ${prices.api}${prices.sandbox ? ' (sandbox)' : ''}`);
  return prices;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await refreshPrices();
  } catch (failure) {
    console.error(failure.message);
    process.exit(1);
  }
}
