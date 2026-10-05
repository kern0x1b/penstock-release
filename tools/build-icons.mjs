import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { root } from './site.mjs';

const require = createRequire(path.join(process.env.PUPPETEER_FROM ?? path.resolve(root, '..', 'jetbrains-bpmn-editor'), 'package.json'));
const puppeteer = require('puppeteer');

const docs = path.join(root, 'docs');
const svg = fs.readFileSync(path.join(docs, 'icon.svg'), 'utf8');
const plusAt = { 16: { bar: 2, from: 4.5, to: 11.5 }, 32: { bar: 4, from: 10, to: 22 } };
const sized = (size) => {
  const fit = plusAt[size];
  const scaled = svg.replace(/width="40" height="40"/, `width="${size}" height="${size}"`);
  if (!fit) return scaled;
  const centre = size / 2;
  const half = fit.bar / 2;
  const plus = `<path d="M${centre} ${fit.from}V${fit.to}M${fit.from} ${centre}H${fit.to}" fill="none" stroke="#fff" stroke-width="${fit.bar}" stroke-linecap="butt"/>`;
  return scaled.replace(/<path d="M20 12\.5[^>]*\/>/, '').replace('viewBox="0 0 40 40"', `viewBox="0 0 40 40"`).replace('</svg>', `<g transform="scale(${40 / size})">${plus}</g></svg>`);
};
const mark = (size) => `<div style="width:${size}px;height:${size}px">${sized(size)}</div>`;
const font = (name, weight) => `@font-face{font-family:"JetBrains Mono";font-weight:${weight};src:url("file://${path.join(docs, 'fonts', name)}")}`;

const jobs = [
  { file: 'favicon-16.png', width: 16, height: 16, html: mark(16), transparent: true },
  { file: 'favicon-32.png', width: 32, height: 32, html: mark(32), transparent: true },
  { file: 'favicon-48.png', width: 48, height: 48, html: mark(48), transparent: true },
  { file: 'apple-touch-icon.png', width: 180, height: 180, html: `<div style="width:180px;height:180px;background:#f7f8f9;display:grid;place-items:center">${mark(140)}</div>` },
  {
    file: 'og-image.png',
    width: 1200,
    height: 630,
    html: `<style>${font('JetBrainsMono-SemiBold.woff2', 600)}${font('JetBrainsMono-Regular.woff2', 400)}
      body{margin:0}.card{width:1200px;height:630px;background:#191a1c;color:#d1d3d9;font-family:"JetBrains Mono",monospace;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box}
      .row{display:flex;align-items:center;gap:32px}h1{margin:0;font-size:72px;font-weight:600;color:#d1d3d9}p{margin:32px 0 0;font-size:32px;line-height:48px;color:#b5b7bd;max-width:900px}</style>
      <div class="card"><div class="row">${mark(128)}<h1>Penstock</h1></div><p>BPMN, DMN and forms for Camunda, in JetBrains IDEs, VS Code and the command line.</p></div>`,
  },
];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
  const source = path.join(os.tmpdir(), `penstock-${job.file}.html`);
  fs.writeFileSync(source, `<body style="margin:0">${job.html}</body>`);
  await page.goto(`file://${source}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(docs, job.file), omitBackground: job.transparent === true });
  console.log(`wrote docs/${job.file}`);
}
await browser.close();

const png = fs.readFileSync(path.join(docs, 'favicon-32.png'));
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(docs, 'favicon.ico'), Buffer.concat([header, png]));
console.log('wrote docs/favicon.ico');
