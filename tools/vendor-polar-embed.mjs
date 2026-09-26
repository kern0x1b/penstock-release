import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root } from './site.mjs';

const ACCEPTED = ['MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0'];
const version = process.argv[2] ?? '0.4.1';
const target = path.join(root, 'docs', 'vendor', 'polar-checkout');

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'polar-checkout-'));
try {
  const packed = execFileSync('npm', ['pack', `@polar-sh/checkout@${version}`, '--silent'], { cwd: work, encoding: 'utf8' }).trim().split('\n').pop();
  execFileSync('tar', ['xzf', packed], { cwd: work });
  const manifest = JSON.parse(fs.readFileSync(path.join(work, 'package', 'package.json'), 'utf8'));
  if (!ACCEPTED.includes(manifest.license)) {
    console.error(`@polar-sh/checkout ${manifest.version} is licensed ${manifest.license}. Only ${ACCEPTED.join(', ')} may be vendored. Nothing was copied.`);
    process.exit(1);
  }
  const script = fs.readFileSync(path.join(work, 'package', 'dist', 'embed.global.js'));
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'embed.global.js'), script);
  const licenceFile = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((name) => path.join(work, 'package', name)).find((file) => fs.existsSync(file));
  const licence = licenceFile ?? path.join(import.meta.dirname, 'licenses', `${manifest.license}.txt`);
  fs.copyFileSync(licence, path.join(target, 'LICENSE.txt'));
  fs.writeFileSync(
    path.join(target, 'README.txt'),
    `embed.global.js is dist/embed.global.js from the npm package ${manifest.name} ${manifest.version}, unchanged.
Licence: ${manifest.license}, the text is in LICENSE.txt. Source: ${manifest.repository.url.replace(/^git\\+/, '')} (${manifest.repository.directory}).
It is served from this site, not from a CDN. It only opens Polar's checkout page in a frame when a visitor
presses a Buy button. Update it with: node tools/vendor-polar-embed.mjs <version>
`,
  );
  console.log(`vendored ${manifest.name} ${manifest.version} (${manifest.license}) into ${path.relative(root, target)}`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
