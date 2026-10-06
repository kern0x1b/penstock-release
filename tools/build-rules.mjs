import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { escapeHtml, root } from './site.mjs';
import { pageHtml } from './build-pages.mjs';

const product = path.resolve(process.argv[2] ?? process.env.PENSTOCK_PRODUCT ?? path.join(root, '..', 'jetbrains-bpmn-editor'));
const generator = path.join(product, 'libs', 'core', 'scripts', 'generate-rule-docs.ts');
const outDir = path.join(root, 'docs', 'rules');

if (!fs.existsSync(generator)) {
  console.error(`No product repository at ${product}. Pass its path as the first argument or set PENSTOCK_PRODUCT.`);
  process.exit(1);
}

const source = fs.mkdtempSync(path.join(os.tmpdir(), 'penstock-rules-'));
const run = spawnSync(process.execPath, ['--experimental-strip-types', generator, source], { cwd: path.dirname(path.dirname(generator)), encoding: 'utf8' });
if (run.status !== 0) {
  console.error(`The rule generator failed:\n${run.stderr}`);
  fs.rmSync(source, { recursive: true, force: true });
  process.exit(1);
}

const LEVELS = {
  error: 'Error: the diagram or the process is wrong',
  warning: 'Advice: it works, and reads or runs better without it',
  off: 'Off by default',
};

const inline = (text) => escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');

function parseRule(file) {
  const text = fs.readFileSync(path.join(source, file), 'utf8');
  let title = /^# (.+)$/m.exec(text)[1];
  const [, id, family, level] = /^`([^`]+)` · (.+?) · (.+)$/m.exec(text);
  const why = /^\*\*Why it matters\.\*\* (.+)$/m.exec(text)[1];
  const fix = /^\*\*How to fix it\.\*\* (.+)$/m.exec(text)[1];
  const shown = /^In `penstock check` and in the editor the rule is called `([^`]+)`\.$/m.exec(text)?.[1] ?? null;
  const severity = Object.keys(LEVELS).find((key) => LEVELS[key] === level);
  if (!severity) throw new Error(`${file}: unknown level "${level}"`);
  if (id === 'compat/no-multiple-none-start-events') {
    title = 'More than one blank start event in Camunda 8';
  }
  return { file, title, id, family, why, fix, shown, severity, slug: file.replace(/\.md$/, '') };
}

const FAMILIES = {
  bpmnlint: {
    pro: false,
    guide: ['validation', 'Validation with bpmnlint'],
    where: (rule) => `<p>The editor puts a marker on the element while you draw, and the <strong>Problems</strong> tab of the sidebar lists it under <strong>Rules</strong>, with the rule name <code>${rule.id}</code>. In a terminal, <code>penstock check --only rules</code> reports it.</p>
<p>To change how strict this rule is, set <code>${rule.id.replace('bpmnlint/', '')}</code> to <code>error</code>, <code>warn</code> or <code>off</code> in your <code>.bpmnlintrc</code>. See <a href="../guide/validation.html">Validation</a>.</p>`,
  },
  compat: {
    pro: false,
    guide: ['validation', 'Validation'],
    where: (rule) => `<p>The <strong>Problems</strong> tab lists it under <strong>Engine</strong>, the editor marks the element on the canvas, and <code>penstock check</code> reports it as <code>${rule.id}</code>. It checks the diagram against the engine and the version it is written for: the version in the file's <code>modeler:executionPlatformVersion</code>, or the newest one when the file has none. Operaton and CIB seven are checked as Camunda 7. This check is free.</p>
<p>To turn it off, set <code>${rule.id.replace('compat/', 'camunda-compat/')}</code> or <code>${rule.id}</code> to <code>off</code> in your <code>.bpmnlintrc</code>. See <a href="../guide/validation.html">Validation</a>.</p>`,
  },
  drawing: {
    pro: false,
    guide: ['diagram-check', 'Diagram check'],
    where: (rule) => `<p>The <strong>Problems</strong> tab lists it under <strong>${rule.severity === 'error' ? 'Problems' : 'Readability'}</strong>, and outlines the element on the canvas. In a terminal, <code>penstock check --only drawing</code> reports it as <code>${rule.shown}</code>. <a href="../guide/auto-layout.html">Auto layout</a> often fixes it for the whole diagram at once.</p>`,
  },
  flow: {
    pro: true,
    guide: ['flow-analysis', 'Flow analysis'],
    where: (rule) => `<p>The <strong>Problems</strong> tab lists it under <strong>How it runs</strong> and outlines the path that leads there. In a terminal, <code>penstock check --only flow</code> reports it as <code>${rule.shown}</code>. This check is part of Penstock Pro, and Team in a pipeline.</p>`,
  },
  table: {
    pro: true,
    guide: ['dmn-editor', 'The DMN editor'],
    where: (rule) => `<p>Press <span class="ui">Check</span> in the DMN editor. The <strong>Problems</strong> tab of the sidebar lists it. In a terminal, <code>penstock check</code> reports it as <code>${rule.shown}</code> for every <code>.dmn</code> file. This check is part of Penstock Pro, and Team in a pipeline.</p>`,
  },
  form: {
    pro: false,
    about: 'What a Camunda Form does with what the user enters. The form check is lint, so it is free.',
    guide: ['form-editor', 'The form editor'],
    where: (rule) => `<p>Press <span class="ui">Check</span> in the form editor. The <strong>Problems</strong> tab of the sidebar lists it. In a terminal, <code>penstock check</code> reports it as <code>${rule.shown}</code> for every form. The form check is lint, so it is free.</p>`,
  },
  code: {
    pro: true,
    guide: ['code-links', 'Code links'],
    where: () => `<p>The <strong>Problems</strong> tab lists it under <strong>Code</strong>. In a terminal, <code>penstock code</code> reports it with the file and line. This check is part of Penstock Pro, and Team in a pipeline.</p>`,
  },
  convention: {
    pro: true,
    guide: ['settings', 'penstock.yaml'],
    where: () => `<p>This is not a finding. It is a convention the editor applies while you model, set under <code>conventions</code> in <code>penstock.yaml</code>. It is part of Penstock Pro.</p>`,
  },
};

const rules = fs
  .readdirSync(source)
  .filter((file) => file.endsWith('.md') && file !== 'index.md')
  .sort()
  .map(parseRule);

const index = fs.readFileSync(path.join(source, 'index.md'), 'utf8');
const sections = [...index.matchAll(/^## (.+)\n\n(.+)\n\n\| Rule[\s\S]*?\n((?:\|.*\n?)+)/gm)].map((match) => ({
  title: match[1],
  about: match[2],
  ids: [...match[3].matchAll(/\[`([^`]+)`\]/g)].map((entry) => entry[1]),
}));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const byId = new Map(rules.map((rule) => [rule.id, rule]));
const familyOf = (rule) => rule.id.split('/')[0];

for (const rule of rules) {
  const family = FAMILIES[familyOf(rule)];
  const [guideSlug, guideTitle] = family.guide;
  const levelTags = [rule.severity, ...(family.pro ? ['pro'] : [])].join(',');
  const body = `<h2>Why it matters</h2>
<p>${inline(rule.why)}</p>

<h2>How to fix it</h2>
<p>${inline(rule.fix)}</p>

<h2>Where you see it</h2>
${family.where(rule)}

<h2>Rule details</h2>
<div class="table-wrap"><table class="facts">
  <tbody>
  <tr><td>Id</td><td><code>${rule.id}</code></td></tr>
  <tr><td>Group</td><td>${escapeHtml(rule.family)}</td></tr>
  <tr><td>Level</td><td>${escapeHtml(LEVELS[rule.severity])}</td></tr>
  ${rule.shown ? `<tr><td>Name in <code>penstock check</code></td><td><code>${rule.shown}</code></td></tr>` : ''}
  </tbody>
</table></div>

<p>Read more: <a href="../guide/${guideSlug}.html">${escapeHtml(guideTitle)}</a>. All rules: <a href="./">Every rule</a>.</p>`;
  const html = pageHtml({
    section: 'guide',
    slug: `rules/${rule.slug}`,
    meta: {
      canonical: `rules/${rule.slug}`,
      title: escapeHtml(rule.title),
      lede: `The check <code>${rule.id}</code>, in the group ${escapeHtml(rule.family)}.`,
      description: `${rule.title}. ${rule.why} ${rule.fix}`,
      tags: levelTags,
      group: 'Every rule',
    },
    body,
  });
  fs.writeFileSync(path.join(outDir, `${rule.slug}.html`), html);
}

const levelWord = { error: 'Error', warning: 'Advice', off: 'Off by default' };
const tables = sections
  .map((section) => {
    const rows = section.ids
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((rule) => `  <tr><td><a href="${rule.slug}"><code>${rule.id}</code></a></td><td>${escapeHtml(rule.title)}</td><td><span class="tag ${rule.severity}">${levelWord[rule.severity]}</span></td></tr>`)
      .join('\n');
    const about = FAMILIES[section.ids[0].split('/')[0]]?.about ?? section.about;
    return `<h2>${escapeHtml(section.title)}</h2>\n<p>${inline(about)}</p>\n<div class="table-wrap"><table>\n  <thead><tr><th>Rule</th><th>What</th><th>Level</th></tr></thead>\n  <tbody>\n${rows}\n  </tbody>\n</table></div>`;
  })
  .join('\n\n');

const listed = new Set(sections.flatMap((section) => section.ids));
const missing = rules.filter((rule) => !listed.has(rule.id));
if (missing.length > 0) throw new Error(`Not in the index: ${missing.map((rule) => rule.id).join(', ')}`);

const slugOf = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const familyOfSection = (section) => FAMILIES[section.ids[0].split('/')[0]];
const groupLink = (section) => `<a href="#${slugOf(section.title)}">${escapeHtml(section.title.toLowerCase())}</a>`;
const paidGroups = sections.filter((section) => familyOfSection(section).pro);
const paidNames = paidGroups.map((section) => escapeHtml(section.title.toLowerCase()));
const groupsSentence = `<p>${rules.length} rules in ${sections.length} groups: ${sections.map(groupLink).join(', ')}. The groups ${paidNames.length > 1 ? `${paidNames.slice(0, -1).join(', ')}, and ${paidNames.at(-1)}` : paidNames.join('')} are part of Pro. The rest is free.</p>`;

const indexBody = `<h2>How to read a rule page</h2>

<p>Every check Penstock makes has a page. It says <strong>why it matters</strong>, <strong>how to fix it</strong>, and where you see it. Select a finding in the <strong>Problems</strong> tab and its link opens the page. In <code>penstock check --format json</code>, SARIF and GitHub annotations, every finding carries the rule id and the address of its page.</p>

<div class="table-wrap"><table>
  <thead><tr><th>Level</th><th>Meaning</th></tr></thead>
  <tbody>
  <tr><td><span class="tag error">Error</span></td><td>The diagram or the process is wrong. <code>penstock check</code> fails on it.</td></tr>
  <tr><td><span class="tag warning">Advice</span></td><td>It works, and reads or runs better without it. It is shown as a note and does not fail the check.</td></tr>
  <tr><td><span class="tag off">Off by default</span></td><td>The rule exists but does nothing until you turn it on.</td></tr>
  </tbody>
</table></div>

${groupsSentence}

${tables}`;

fs.writeFileSync(
  path.join(outDir, 'index.html'),
  pageHtml({
    section: 'guide',
    slug: 'rules/index',
    meta: {
      canonical: 'rules/',
      title: 'Every rule',
      lede: 'One page for each check Penstock makes: why it matters and how to fix it.',
      description: 'Every Penstock check with its reason and its fix: modelling rules, engine compatibility, drawing, process flow, decision tables, forms, diagrams and code.',
      tags: 'free',
      group: 'Checking',
      related: 'diagram-check, validation, flow-analysis',
    },
    body: indexBody,
  }),
);

fs.rmSync(source, { recursive: true, force: true });
console.log(`wrote ${rules.length} rule pages and the index`);
