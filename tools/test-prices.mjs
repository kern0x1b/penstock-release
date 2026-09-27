import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fetchPrices, isSandbox, refreshPrices } from './fetch-prices.mjs';

const TOKEN = 'polar_oat_test_secret_value';
const licensing = {
  api: 'http://unused',
  organizationId: 'org_1',
  checkoutLinks: { pro: 'polar_cl_pro', team: 'polar_cl_team' },
};

function product(name, prices, extra = {}) {
  return { id: `prod_${name}`, name, is_archived: false, recurring_interval: null, prices, ...extra };
}

const fixed = (amount, interval, currency = 'eur', extra = {}) => ({ amount_type: 'fixed', price_amount: amount, price_currency: currency, recurring_interval: interval, is_archived: false, ...extra });

function serve(routes) {
  const seen = [];
  const server = http.createServer((request, response) => {
    seen.push({ url: request.url, authorization: request.headers.authorization });
    const handler = routes[request.url.split('?')[0]];
    if (!handler) {
      response.writeHead(404, { 'Content-Type': 'application/json' }).end('{"detail":"no"}');
      return;
    }
    response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(handler()));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, seen, url: `http://127.0.0.1:${server.address().port}` })));
}

test('reads the prices of the products behind each checkout link, with the token as a bearer header', async () => {
  const { server, seen, url } = await serve({
    '/v1/checkout-links/polar_cl_pro': () => ({ products: [product('Penstock Pro', [fixed(3000, 'year'), fixed(300, 'month'), fixed(0, 'month', 'eur', { is_archived: true })])] }),
    '/v1/checkout-links/polar_cl_team': () => ({ products: [product('Penstock Team', [fixed(12000, 'year'), fixed(1200, 'month'), { amount_type: 'custom' }])] }),
  });
  try {
    const result = await fetchPrices({ token: TOKEN, apiUrl: url, licensing, now: new Date('2026-09-26T10:00:00Z') });
    assert.equal(result.readAt, '2026-09-26T10:00:00.000Z');
    assert.equal(result.sandbox, false);
    assert.deepEqual(result.plans.pro.prices.map((price) => [price.currency, price.amount, price.interval]), [['eur', 300, 'month'], ['eur', 3000, 'year']]);
    assert.deepEqual(result.plans.team.prices.map((price) => price.amount), [1200, 12000]);
    assert.ok(seen.every((call) => call.authorization === `Bearer ${TOKEN}`));
    assert.ok(!JSON.stringify(result).includes(TOKEN));
  } finally {
    server.close();
  }
});

test('takes the interval from the product when a price does not carry one', async () => {
  const { server, url } = await serve({
    '/v1/checkout-links/polar_cl_pro': () => ({ products: [product('Penstock Pro monthly', [fixed(300, undefined)], { recurring_interval: 'month' })] }),
    '/v1/checkout-links/polar_cl_team': () => ({ products: [product('Penstock Team monthly', [fixed(1200, undefined)], { recurring_interval: 'month' })] }),
  });
  try {
    const result = await fetchPrices({ token: TOKEN, apiUrl: url, licensing });
    assert.equal(result.plans.pro.prices[0].interval, 'month');
  } finally {
    server.close();
  }
});

test('falls back to the organisation products by name when a checkout link cannot be read', async () => {
  const { server, url } = await serve({
    '/v1/products/': () => ({ items: [product('Penstock Pro', [fixed(300, 'month')]), product('Penstock Team', [fixed(1200, 'month')]), product('Something else', [fixed(1, 'month')])] }),
  });
  const warn = console.warn;
  console.warn = () => undefined;
  try {
    const result = await fetchPrices({ token: TOKEN, apiUrl: url, licensing });
    assert.equal(result.plans.pro.prices[0].amount, 300);
    assert.equal(result.plans.team.prices[0].amount, 1200);
  } finally {
    console.warn = warn;
    server.close();
  }
});

test('knows a sandbox API by its host, and refuses to run without a token', async () => {
  assert.equal(isSandbox('https://sandbox-api.polar.sh'), true);
  assert.equal(isSandbox('https://api.polar.sh'), false);
  await assert.rejects(fetchPrices({ token: '', licensing }), /POLAR_ACCESS_TOKEN/);
});

test('writes a file that holds no secret', async () => {
  const { server, url } = await serve({
    '/v1/checkout-links/polar_cl_pro': () => ({ products: [product('Pro', [fixed(300, 'month')])] }),
    '/v1/checkout-links/polar_cl_team': () => ({ products: [product('Team', [fixed(1200, 'month')])] }),
  });
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'prices-')), 'prices.json');
  const log = console.log;
  console.log = () => undefined;
  try {
    await refreshPrices({ token: TOKEN, apiUrl: url, licensing, file });
    assert.ok(!fs.readFileSync(file, 'utf8').includes(TOKEN));
    assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).plans.pro.checkoutLink, 'polar_cl_pro');
  } finally {
    console.log = log;
    server.close();
  }
});

test('reports a refusal from Polar with a hint about the token', async () => {
  const { server, url } = await serve({});
  try {
    await assert.rejects(fetchPrices({ token: TOKEN, apiUrl: url, licensing }), /Polar answered 404/);
  } finally {
    server.close();
  }
});
