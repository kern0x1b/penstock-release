import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2] ?? '../jetbrains-bpmn-editor/docs/rules';
const from = resolve(source);
const to = resolve(root, 'docs/rules');

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (text) =>
  escape(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_all, label, href) => `<a href="${href}">${label}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const PAGE = (title, description, canonical, body, current) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} - Penstock</title>
<meta name="description" content="${escape(description)}">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="canonical" href="${escape(canonical)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="../style.css">
</head>
<body>

<header>
  <div class="wrap bar">
    <a href="../" style="display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit">
      <img src="../icon.svg" alt="">
      <span class="name">Penstock</span>
    </a>
    <nav>
      <a href="../">Overview</a>
      <a href="../guide/">Documentation</a>
      <a href="index.html"${current ? ' aria-current="page"' : ''}>Rules</a>
      <a href="../license/">License</a>
      <a href="../notices/">Third-party notices</a>
      <a href="https://github.com/kern0x1b/penstock-release/issues">Support</a>
    </nav>
  </div>
</header>

<main class="wrap doc rules">
  <h1>${escape(title)}</h1>
${body}
</main>

<footer>
  <div class="wrap">
    <div class="links">
      <a href="../">Overview</a>
      <a href="../guide/">Documentation</a>
      <a href="index.html">Rules</a>
      <a href="https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor">Marketplace</a>
      <a href="https://github.com/kern0x1b/penstock-release/issues">Issues</a>
      <a href="https://github.com/kern0x1b/penstock-release/blob/main/CHANGELOG.md">Changelog</a>
      <a href="../license/">License</a>
      <a href="../notices/">Third-party notices</a>
    </div>
    <p>Copyright © 2024–2026 kern0x1b. All rights reserved.</p>
  </div>
</footer>

</body>
</html>
`;

const paragraphs = (text) =>
  text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `  <p>${inline(block)}</p>`)
    .join('\n\n');

function rulePage(markdown, slug) {
  const lines = markdown.split('\n').map((line) => line.trim());
  const title = lines[0].replace(/^#\s+/, '');
  if (!title || !lines[0].startsWith('# ')) throw new Error(`${slug}: no h1 title`);
  const meta = lines[2];
  const match = /^`([^`]+)` · (.+) · (.+)$/.exec(meta);
  if (!match) throw new Error(`${slug}: cannot read the id line, got ${JSON.stringify(meta)}`);
  const [, id, family, level] = match;
  const rest = lines.slice(4).join('\n').trim();
  if (!rest.startsWith('**Why it matters.**') || !rest.includes('**How to fix it.**')) {
    throw new Error(`${slug}: no Why and Fix lines`);
  }
  const why = /\*\*Why it matters\.\*\*\s*([\s\S]*?)\n\n/.exec(rest)?.[1].trim();
  const fix = /\*\*How to fix it\.\*\*\s*([\s\S]*?)(?:\n\n|$)/.exec(rest)?.[1].trim();
  const note = rest.split('\n\n').slice(2).find((block) => !block.startsWith('[All rules]'));
  if (!why || !fix) throw new Error(`${slug}: cannot read the Why and Fix lines`);

  const description = `${why.slice(0, 150).replace(/\s+/g, ' ')}`;
  const body = `  <p class="lede"><code>${escape(id)}</code> · ${escape(family)} · ${escape(level)}</p>

  <h2>Why it matters</h2>

  <p>${inline(why)}</p>

  <h2>How to fix it</h2>

  <p>${inline(fix)}</p>
${note ? `\n  <p class="rule-note">${inline(note)}</p>\n` : ''}
  <p><a href="index.html">All rules</a> · <a href="../guide/diagram-check.html">Check and problems</a></p>`;

  return PAGE(title, description, `https://kern0x1b.github.io/penstock-release/rules/${slug}.html`, body, false);
}

const anchor = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function indexPage(markdown) {
  const blocks = markdown.split(/\n## /);
  const head = blocks[0].replace(/^#\s+/, '').trim();
  const lede = head.split('\n\n').slice(1).join('\n\n').trim();

  const sections = blocks.slice(1).map((block) => {
    const lines = block.split('\n');
    const family = lines[0].trim();
    const about = lines.slice(1).join('\n').trim().split('\n\n')[0].trim();
    const rows = lines
      .filter((line) => line.startsWith('| [`'))
      .map((line) => {
        const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
        const id = /`([^`]+)`/.exec(cells[0])?.[1];
        const href = /\(([^)]+)\)/.exec(cells[0])?.[1]?.replace(/\.md$/, '.html');
        if (!id || !href) throw new Error(`index: cannot read the row ${line}`);
        return `        <tr><td><a href="${href}"><code>${escape(id)}</code></a></td><td>${escape(cells[1])}</td><td>${escape(cells[2])}</td></tr>`;
      });
    if (rows.length === 0) throw new Error(`index: no rules under ${family}`);
    return `    <h2 id="${anchor(family)}">${escape(family)}</h2>

    <p>${inline(about)}</p>

    <table class="facts rules">
      <tr><td>Rule</td><td>What it is</td><td>Level</td></tr>
${rows.join('\n')}
    </table>`;
  });

  const jumps = blocks
    .slice(1)
    .map((block) => {
      const family = block.split('\n')[0].trim();
      const count = block.split('\n').filter((line) => line.startsWith('| [`')).length;
      return `    <li><a href="#${anchor(family)}">${escape(family)}</a> <span class="rule-count">${count}</span></li>`;
    })
    .join('\n');

  const body = `  <p class="lede">${inline(lede)}</p>

  <ul class="rule-jumps">
${jumps}
  </ul>

${sections.join('\n\n')}

  <p>These pages are generated from the rule definitions in the plugin, so an id never changes
  meaning. A finding in the editor or in <span class="mono">penstock check</span> links to its own
  page. See <a href="../guide/diagram-check.html">Check and problems</a>.</p>`;

  return PAGE('Rules', 'Every check Penstock makes, with a line on why it matters and a line on how to fix it: the drawing, the modelling rules, engine compatibility, process flow, decision tables, forms, diagrams and code.', 'https://kern0x1b.github.io/penstock-release/rules/', body, true);
}

mkdirSync(to, { recursive: true });
for (const file of readdirSync(to).filter((name) => name.endsWith('.html'))) rmSync(join(to, file));

const markdown = readdirSync(from).filter((name) => name.endsWith('.md'));
let written = 0;
for (const name of markdown) {
  const body = readFileSync(join(from, name), 'utf8');
  const html = name === 'index.md' ? indexPage(body) : rulePage(body, name.replace(/\.md$/, ''));
  writeFileSync(join(to, `${name.replace(/\.md$/, '')}.html`), html);
  written += 1;
}

process.stdout.write(`wrote ${written} pages to ${to.replace(`${root}/`, '')}\n`);
