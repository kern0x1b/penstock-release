import fs from 'node:fs';
import path from 'node:path';
import { root } from './site.mjs';

const css = fs.readFileSync(path.join(root, 'docs', 'style.css'), 'utf8');

function tokensIn(block) {
  const tokens = {};
  for (const match of block.matchAll(/(--theme-[a-z-]+):\s*([^;]+);/g)) tokens[match[1]] = match[2].trim();
  return tokens;
}

const darkStart = css.indexOf('@media screen and (prefers-color-scheme: dark)');
const lightBlock = css.slice(css.indexOf(':root'), darkStart);
const darkBlock = css.slice(darkStart, css.indexOf('\n}\n', darkStart));
const forcedStart = css.indexOf(':root[data-theme="dark"] {');
const forcedBlock = css.slice(forcedStart, css.indexOf('\n}\n', forcedStart));
if (JSON.stringify(tokensIn(forcedBlock)) !== JSON.stringify(tokensIn(darkBlock))) {
  console.error('the dark tokens of the system theme and of the chosen dark theme differ in docs/style.css');
  process.exit(1);
}
const light = tokensIn(lightBlock);
const dark = { ...light, ...tokensIn(darkBlock) };

function parse(value, tokens) {
  const reference = value.match(/^var\((--theme-[a-z-]+)\)$/);
  if (reference) return parse(tokens[reference[1]], tokens);
  const hex = value.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!hex) throw new Error(`cannot read colour ${value}`);
  const n = parseInt(hex[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: hex[2] ? parseInt(hex[2], 16) / 255 : 1 };
}

const over = (top, below) => ({
  r: top.r * top.a + below.r * (1 - top.a),
  g: top.g * top.a + below.g * (1 - top.a),
  b: top.b * top.a + below.b * (1 - top.a),
  a: 1,
});

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const FLAT = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-selected-inactive', 'bg-selected', 'accent-subtle', 'success-subtle', 'warning-subtle', 'error-subtle'];
const PAGE = ['bg-primary', 'bg-secondary', 'bg-tertiary'];
const HOVER = ['bg-hover', 'bg-hover-strong', 'bg-pressed'];

const TEXT = [
  { fg: 'fg-primary', on: [...FLAT, ...PAGE.flatMap((base) => HOVER.map((state) => `${state}@${base}`))] },
  { fg: 'fg-secondary', on: [...PAGE, 'bg-selected-inactive', ...PAGE.flatMap((base) => ['bg-hover', 'bg-hover-strong'].map((state) => `${state}@${base}`))] },
  { fg: 'fg-code', on: ['bg-secondary', 'bg-primary', 'bg-tertiary', 'bg-selected-inactive', 'bg-hover@bg-primary'] },
  { fg: 'link', on: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'accent-subtle', 'bg-selected-inactive', 'bg-hover@bg-primary'] },
  { fg: 'link-hover', on: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'accent-subtle', 'bg-selected-inactive'] },
  { fg: 'on-accent', on: ['accent-solid', 'accent-solid-hover', 'accent-solid-pressed'] },
  { fg: 'badge-fg', on: ['badge-bg'] },
  { fg: 'warning-text', on: ['warning-subtle'] },
  { fg: 'error-text', on: ['error-subtle'] },
];

const BOUNDARIES = [
  { fg: 'focus-ring', on: [...PAGE, 'accent-subtle', 'bg-selected-inactive'] },
  { fg: 'link', on: ['accent-subtle'] },
  { fg: 'success', on: ['success-subtle'] },
  { fg: 'warning', on: ['warning-subtle'] },
  { fg: 'error', on: ['error-subtle'] },
  { fg: 'icon-default', on: ['bg-selected-inactive'] },
];

function surface(spec, tokens) {
  const [name, base] = spec.split('@');
  const colour = parse(tokens[`--theme-${name}`], tokens);
  if (!base) return over(colour, parse(tokens['--theme-bg-primary'], tokens));
  return over(colour, surface(base, tokens));
}

export function contrastFailures() {
  const failures = [];
  let checked = 0;
  for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
    for (const [minimum, groups] of [[4.5, TEXT], [3, BOUNDARIES]]) {
      for (const group of groups) {
        const foreground = parse(tokens[`--theme-${group.fg}`], tokens);
        for (const spec of group.on) {
          const background = surface(spec, tokens);
          const value = ratio(over(foreground, background), background);
          checked += 1;
          if (value < minimum) failures.push(`${theme}: ${group.fg} on ${spec} is ${value.toFixed(2)}:1, needs ${minimum}:1`);
        }
      }
    }
  }
  return { failures, checked };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { failures, checked } = contrastFailures();
  console.log(`${checked} colour pairs checked in light and dark`);
  if (failures.length > 0) {
    console.log(failures.join('\n'));
    process.exit(1);
  }
  console.log('all text pairs meet 4.5:1 and all boundaries 3:1');
}
