import { spawnSync } from 'node:child_process';
import path from 'node:path';

const steps = ['build-pages.mjs', 'build-home.mjs', 'build-legal-pages.mjs', 'build-rules.mjs', 'build-sitemap.mjs'];

for (const step of steps) {
  const args = step === 'build-rules.mjs' ? process.argv.slice(2) : [];
  const run = spawnSync(process.execPath, [path.join(import.meta.dirname, step), ...args], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
