import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, process.argv[2] ?? 'THIRD-PARTY-NOTICES.md');
const page = resolve(root, 'docs/notices/index.html');

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const body = escape(readFileSync(source, 'utf8').replace(/\n+$/, ''));

const before = readFileSync(page, 'utf8');
const replaced = before.replace(/(<pre class="legal"><code>)[\s\S]*?(<\/code><\/pre>)/, `$1${body}$2`);
if (replaced === before) throw new Error(`no <pre class="legal"><code> block in ${page}`);
writeFileSync(page, replaced);

process.stdout.write(`rendered ${source.replace(`${root}/`, '')} into ${page.replace(`${root}/`, '')} (${body.length} bytes)\n`);
