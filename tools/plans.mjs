import fs from 'node:fs';
import path from 'node:path';
import { escapeHtml } from './site.mjs';
import { readPrices } from './fetch-prices.mjs';

export const checkoutSettings = () => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'checkout.json'), 'utf8'));

export function money(amount, currency) {
  const format = new Intl.NumberFormat('en', { style: 'currency', currency: currency.toUpperCase(), currencyDisplay: 'code' });
  const digits = format.resolvedOptions().maximumFractionDigits;
  return format.format(amount / 10 ** digits).replace(/ /g, ' ');
}

const EVERY = { day: 'day', week: 'week', month: 'month', year: 'year' };

export function every(price) {
  const unit = EVERY[price.interval];
  if (!unit) return 'once';
  return price.intervalCount > 1 ? `every ${price.intervalCount} ${unit}s` : `per ${unit}`;
}

export function readDate(readAt) {
  return new Date(readAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const checkoutUrl = (prices, plan) => `${prices.api.replace(/\/$/, '')}/v1/checkout-links/${encodeURIComponent(plan.checkoutLink)}/redirect`;

function buyLink(prices, plan, embed) {
  const label = `Buy ${escapeHtml(plan.name)}`;
  const href = checkoutUrl(prices, plan);
  if (!embed) return `<a class="btn" href="${href}" rel="noopener">${label}</a>`;
  return [
    `<a class="btn buy buy-light" href="${href}" rel="noopener" data-polar-checkout data-polar-checkout-theme="light">${label}</a>`,
    `<a class="btn buy buy-dark" href="${href}" rel="noopener" data-polar-checkout data-polar-checkout-theme="dark">${label}</a>`,
  ].join('\n      ');
}

const ABOUT = {
  pro: 'For your own machine. Adds what only Penstock does: auto layout, flow analysis, code links, test-case runs, the visual diagram diff and more.',
  team: 'Everything in Pro, inside a pipeline as well: the review bot, pull request reports, baselines and SARIF.',
};

export function plansHtml({ prices = readPrices(), checkout = checkoutSettings() } = {}) {
  const embed = checkout.embed === true;
  const cards = Object.entries(prices.plans)
    .map(([tier, plan]) => {
      const lines = plan.prices.map((price, index) => `<p class="${index === 0 ? 'price' : 'price alt'}">${money(price.amount, price.currency)} <span>${plan.seat ? 'per seat ' : ''}${every(price)}</span></p>`).join('\n      ');
      return `  <div class="plan" id="buy-${tier}">
      <p class="name"><span class="tag ${tier === 'team' ? 'team' : 'pro'}">${escapeHtml(plan.name)}</span></p>
      ${lines}
      <p class="about">${ABOUT[tier] ?? ''}</p>
      ${buyLink(prices, plan, embed)}
    </div>`;
    })
    .join('\n');
  const intervals = new Set(Object.values(prices.plans).flatMap((plan) => plan.prices.map((price) => price.interval)));
  const facts = [
    prices.readAt
      ? `Prices read from Polar on ${readDate(prices.readAt)}. The price you pay is the one shown at checkout.`
      : 'The price you pay is the one shown at checkout.',
    intervals.size > 1 ? 'You choose monthly or yearly at checkout.' : '',
    'A Buy button opens the checkout on Polar\'s own page. See <a href="security.html#checkout">Security and privacy</a>.',
  ].filter(Boolean);
  const testMode = prices.sandbox
    ? `\n<div class="callout warn">
  <span class="label">Test mode</span>
  <p>This checkout runs in Polar's sandbox. No real payment is taken and the licence it makes is a test licence.</p>
</div>\n`
    : '';
  return `<div class="plans">
  <div class="plan" id="buy-free">
      <p class="name"><span class="tag free">Free</span></p>
      <p class="price">No charge</p>
      <p class="about">The editors, checks, deploy, Monitor, export, share and import. Every new machine also starts with 30 days of Pro.</p>
      <a class="btn quiet" href="getting-started.html">Get Penstock</a>
    </div>
${cards}
</div>
${testMode}
<p class="note">${facts.join(' ')}</p>`;
}
