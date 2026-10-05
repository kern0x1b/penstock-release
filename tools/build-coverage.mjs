import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './site.mjs';
import { depthOf, readPages } from './coverage.mjs';

const product = process.argv[2];
if (!product || !fs.existsSync(path.join(product, 'libs/core/src'))) {
  console.error('usage: node tools/build-coverage.mjs <path to the product repository>');
  process.exit(1);
}

const at = (...parts) => path.join(product, ...parts);
const load = (...parts) => import(pathToFileURL(at(...parts)).href);
const read = (...parts) => fs.readFileSync(at(...parts), 'utf8');
const en = JSON.parse(read('libs/core/src/i18n/locales/en.json')).app;
const lookup = (key) => key.replace(/^app\./, "").split('.').reduce((value, part) => value?.[part], en);
const rows = [];
const add = (kind, row, source, terms, extra = {}) => rows.push({ row, kind, source, userFacing: true, tier: 'free', terms, ...extra });
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const word = (text) => `R:${escape(text)}(?![\\w-])`;
const keys = (shortcut) => shortcut.split('+').map((part) => (part === 'Mod' ? '(Cmd|Ctrl)' : escape(part))).join('\\s?\\+\\s?');

const { allActions, actionManifest, PALETTE } = await load('libs/core/src/actions/index.ts');
const manifest = actionManifest(allActions);
for (const action of manifest) {
  const clean = action.title.replace(/…$/, '');
  add('action', `${action.section}: ${action.title}`, `libs/core/src/actions (${action.id})`, [`L:${clean}`, `T:${clean}`], { tier: action.tier ?? 'free' });
  if (action.shortcut) add('shortcut', `${action.title}: ${action.shortcut}`, `libs/core/src/actions (${action.id})`, [`R:${keys(action.shortcut)}`]);
}
add('shortcut', `${PALETTE.title}: ${PALETTE.shortcut}`, 'libs/core/src/actions/palette.ts', [`R:${keys(PALETTE.shortcut)}`]);

const { COMMANDS } = await load('apps/cli/src/help.ts');
const flags = new Map();
for (const command of COMMANDS) {
  const tier = /Pro/.test(command.licence) ? 'Pro' : 'free';
  const last = command.name.split(' ').at(-1);
  add('cli-command', `penstock ${command.name}`, 'apps/cli/src/help.ts', [`L:${command.name}`, `T:penstock ${command.name}`, `L:${last}`], { tier });
  for (const option of command.options) {
    const flag = option.flag.match(/^--[\w-]+/)?.[0];
    if (flag) flags.set(flag, [...(flags.get(flag) ?? []), command.name]);
  }
}
for (const [flag, used] of flags) add('cli-flag', flag, `apps/cli/src/help.ts (${used.join(', ')})`, [word(flag)]);

const mcp = read('apps/cli/src/mcp.ts');
for (const [, name, feature] of mcp.matchAll(/name: '(\w+)',\s+description[\s\S]*?feature: (null|'[\w-]+')/g)) {
  add('mcp-tool', name, 'apps/cli/src/mcp.ts', [`T:${name}`], { tier: feature === 'null' ? 'free' : 'Pro' });
}

const schema = JSON.parse(read('apps/jetbrains/src/main/resources/schema/penstock.schema.json'));
const walk = (prefix, node) => {
  for (const [key, value] of Object.entries(node.properties ?? {})) {
    const full = prefix + key;
    add('yaml-key', full, 'penstock.schema.json', prefix ? [`T:${full}`, `L:${full}`, `L:${key}`] : [`L:${key}`, `T:${full}`]);
    walk(`${full}.`, value);
  }
};
walk('', schema);

const { FEATURES, featureTitle } = await load('libs/core/src/node/features.ts');
const GATED = { 'auto-layout': 'Auto layout', 'flow-analysis': 'Flow analysis', docs: 'docs', paths: 'scenarios list', tests: 'junit', 'code-links': 'code links', 'element-templates': 'templates generate', 'changes-pictures': 'diff --images', edit: 'edit', 'pr-report': 'report', bot: 'review bot', baseline: 'baseline', 'ci-annotations': 'SARIF', 'test-runs': 'scenarios run', 'test-case-generation': 'scenarios generate', migration: 'migrate convert' };
for (const feature of FEATURES) add('tier-gate', `${feature}: ${featureTitle(feature)}`, 'libs/core/src/node/features.ts', [`T:${GATED[feature]}`], { tier: 'Pro', only: ['guide/plans.html'] });

const EDITOR_GATES = { AUTO_LAYOUT: 'Auto layout', CODE_LINKS: 'code links', VISUAL_DIFF: 'diagram diff', CONVENTIONS: 'Modelling conventions', FLOW_ANALYSIS: 'Flow analysis', MIGRATION: 'Converting Camunda 7', TEST_RUNS: 'Scenarios' };
const gates = read('apps/jetbrains/src/main/kotlin/jetbrains/bpmn/editor/license/PenstockLicenseService.kt');
for (const [, name] of gates.matchAll(/^\s+([A-Z_]+)\(Tier\.PRO,/gm)) add('tier-gate', `editor: ${name}`, 'apps/jetbrains/.../PenstockLicenseService.kt', [`T:${EDITOR_GATES[name] ?? name}`], { tier: 'Pro', only: ['guide/plans.html'] });

const { ENGINE_KEYS, profileOf } = await load('libs/core/src/config/engine.ts');
for (const key of ENGINE_KEYS) add('engine', `${key}: ${profileOf(key).label}`, 'libs/core/src/config/engine.ts', [`L:${profileOf(key).label}`, `T:${profileOf(key).label}`], { only: ['guide/engine-profiles.html'] });

for (const [file, editor] of [['editorTabs', 'bpmn'], ['form', 'form'], ['dmn', 'dmn']]) {
  for (const [, id] of read(`libs/webview/src/features/${file}/tabs.tsx`).matchAll(/\{ id: '([\w-]+)', icon/g)) {
    const title = { try: 'Try', scenarios: 'Scenarios' }[id] ?? id[0].toUpperCase() + id.slice(1);
    add('sidebar-tab', `${editor} editor: ${id}`, `libs/webview/src/features/${file}/tabs.tsx`, [`L:${title}`, `T:${title} tab`], { only: ['guide/sidebar.html'] });
  }
}

const GROUPS = ['guide/diagram-check.html', 'guide/validation.html'];
for (const [, key] of read('libs/webview/src/features/diagramCheck/FindingsList.tsx').matchAll(/<h3 class="diagram-check__heading">\{t\('(app\.[\w.]+)'\)\}/g)) {
  add('problems-group', lookup(key), 'libs/webview/src/features/diagramCheck/FindingsList.tsx', [`L:${lookup(key)}`, `A:${lookup(key)}&problems`], { only: GROUPS });
}
add('problems-group', 'Readability', 'libs/webview/src/features/diagramCheck/FindingsList.tsx', ['T:readability'], { only: GROUPS });

const { TOUR_STEPS } = await load('libs/webview/src/features/tour/tourSteps.ts');
TOUR_STEPS.forEach((step, index) => add('tour-step', `${index + 1}. ${lookup(`tour.${step.id}.title`)}`, 'libs/webview/src/features/tour/tourSteps.ts', [`A:tour&${lookup(`tour.${step.id}.title`)}`]));

const catalogue = read('libs/core/src/rules/catalog.ts');
for (const [, id, title] of catalogue.matchAll(/^  (\w+): \{\n    title: '([^']+)'/gm)) add('rule-group', title, `libs/core/src/rules/catalog.ts (${id})`, [`T:${title}`], { only: ['guide/diagram-check.html', 'guide/validation.html', 'rules/index.html'] });

const PRESENT = { recentActions: ['A:recent&action'], showCommentBadges: ['T:comment badges'], toolbarPinned: ['A:pin&action'], toolbarUnpinned: ['A:pin&action'] };
const PREFERENCES = { toolbarPinned: 'pin', toolbarUnpinned: 'pin', recentActions: 'Recent', rendering: 'Sketchy', toolWindowTree: 'flat', toolWindowGroupByFiles: 'file by file', tourSeen: 'tour', sidebarWidth: 'sidebar', sidebarByEditor: 'sidebar', showCommentBadges: 'comment badges', locale: 'language' };
for (const [, key] of read('apps/jetbrains/src/main/kotlin/jetbrains/bpmn/editor/preferences/PreferencesFile.kt').matchAll(/^\s+(\w+) = json\./gm)) {
  add('preference', key, 'apps/jetbrains/src/main/kotlin/jetbrains/bpmn/editor/preferences/PreferencesFile.kt', [`A:preferences.json&${PREFERENCES[key]}`, `T:${key}`, ...(PRESENT[key] ?? [])]);
}

const environment = new Set();
for (const dir of ['apps/cli/src', 'libs/core/src']) {
  for (const entry of fs.readdirSync(at(dir), { recursive: true }).filter((file) => /\.ts$/.test(file))) {
    for (const [name] of read(dir, entry).matchAll(/PENSTOCK_[A-Z_]+/g)) environment.add(name);
  }
}
const INTERNAL = new Set(['PENSTOCK_LICENSE_API', 'PENSTOCK_LICENSE_WORKER', 'PENSTOCK_ALLOW_EMPTY_LICENCE_KEYS', 'PENSTOCK_E', 'PENSTOCK_YAML']);
for (const name of [...environment].sort()) add('environment-variable', name, 'apps/cli/src, libs/core/src', [`T:${name}`], { userFacing: !INTERNAL.has(name) });

const vscode = JSON.parse(read('apps/vscode/package.json')).contributes;
const nls = JSON.parse(read('apps/vscode/package.nls.json'));
const LENSES = { 'penstock.openCodeLens': ['A:code lens&click'] };
for (const command of vscode.commands.filter((entry) => !entry.command.startsWith('penstock.action.'))) {
  const title = nls[command.title.replace(/%/g, '')].replace(/^Penstock: /, '').replace(/…$/, '');
  add('vscode-command', `${command.command}: ${title}`, 'apps/vscode/package.json', [`T:${title}`, ...(LENSES[command.command] ?? [])]);
}
for (const editor of vscode.customEditors) add('file-type', `${editor.viewType}: ${editor.selector.map((entry) => entry.filenamePattern).join(', ')}`, 'apps/vscode/package.json', [...editor.selector.map((entry) => `T:${entry.filenamePattern.replace(/^\*\*\//, '')}`), `T:${nls[editor.displayName.replace(/%/g, '')]}`]);
add('vscode-setting', 'configuration properties in package.json: none', 'apps/vscode/package.json', [], { userFacing: false, note: vscode.configuration ? 'declared' : 'none declared' });

const plugin = read('apps/jetbrains/src/main/resources/META-INF/plugin.xml') + read('apps/jetbrains/src/main/resources/META-INF/penstock-java.xml');
for (const [, text] of plugin.matchAll(/<action id="[\w.]+"[^>]*?\btext="([^"]+)"/g)) add('ide-action', text, 'apps/jetbrains/.../plugin.xml', [`T:${text}`]);
for (const [, name] of plugin.matchAll(/displayName="([^"]+)"/g)) add('ide-inspection', name, 'apps/jetbrains/.../plugin.xml', [`T:${name.slice(0, 30)}`]);
const about = read('apps/jetbrains/src/main/kotlin/jetbrains/bpmn/editor/ui/PenstockAboutConfigurable.kt');
add('ide-setting', 'Settings page: version and third-party licences', 'PenstockAboutConfigurable.kt', ['T:third-party'], { userFacing: about.includes('licenses') });
add('ide-setting', 'Settings page: trusted projects, with Remove', 'PenstockAboutConfigurable.kt', ['T:trusted projects']);

const CURATED = [
  ['project-file', 'penstock.yaml', 'libs/core/src/node/load.ts', 'penstock.yaml', ['L:penstock.yaml']],
  ['project-file', 'penstock.yml (accepted name)', 'libs/core/src/node/load.ts', 'penstock.yml', ['T:penstock.yml']],
  ['project-file', 'penstock.json (accepted name)', 'libs/core/src/node/load.ts', 'penstock.json', ['T:penstock.json']],
  ['project-file', 'test-cases/*.json in src/test/resources', 'libs/core/src/node/testCases.ts', '/src/test/resources/test-cases/', ['T:test-cases']],
  ['project-file', '.camunda/element-templates', 'libs/core/src/templates/template.ts', '.camunda/element-templates', ['T:.camunda/element-templates']],
  ['project-file', '.bpmnlintrc', 'libs/core/src/node/lint.ts', '.bpmnlintrc', ['T:.bpmnlintrc']],
  ['project-file', 'penstock-baseline.json', 'libs/core/src/node/baseline.ts', 'penstock-baseline.json', ['T:penstock-baseline.json']],
  ['project-file', 'penstock-migration-baseline.json', 'libs/core/src/node/baseline.ts', 'penstock-migration-baseline.json', ['T:penstock-migration-baseline.json']],
  ['project-file', '.penstock/runs/<run>/<case>.json', 'libs/core/src/testCases/trace.ts', '.penstock/runs/', ['T:.penstock/runs']],
  ['project-file', '.penstock/images', 'apps/cli/src/index.ts', '.penstock/images', ['T:.penstock/images']],
  ['project-file', '.penstock/penstock-bot', 'apps/cli/src/bot.ts', 'penstock-bot', ['T:penstock-bot']],
  ['project-file', '.penstock-diff/*.bpmn (VS Code diff)', 'apps/vscode/package.json', '.penstock-diff', ['T:.penstock-diff', 'T:Compare with']],
  ['project-file', 'penstockw and penstockw.cmd wrapper', 'apps/cli/src/wrapper.ts', 'penstockw', ['T:penstockw']],
  ['project-file', '.gitea and .forgejo workflows written by init', 'apps/cli/src/init.ts', '.forgejo', ['T:forgejo']],
  ['user-file', '~/.penstock/preferences.json', 'apps/jetbrains/src/main/kotlin/jetbrains/bpmn/editor/preferences/PreferencesFile.kt', 'preferences.json', ['T:preferences.json']],
  ['user-file', '~/.penstock/trusted-projects.json', 'apps/cli/src/trust.ts', 'trusted-projects.json', ['T:trusted-projects.json']],
  ['project-file', 'penstock.local.yaml', 'libs/core/src/node/load.ts', 'penstock.local.yaml', ['T:penstock.local.yaml']],
  ['project-file', 'penstock-report.md', 'apps/cli/src/index.ts', 'penstock-report.md', ['T:penstock-report.md']],
  ['project-file', 'penstock-wrapper.properties', 'apps/cli/src/wrapper.ts', 'penstock-wrapper.properties', ['T:penstock-wrapper.properties']],
  ['user-file', '~/.penstock/license.json', 'libs/core/src/node/license.ts', 'license.json', ['T:license.json']],
  ['user-file', '~/.penstock/clock.json', 'libs/core/src/node/license.ts', 'clock.json', ['T:clock.json']],
  ['user-file', '~/.penstock/pipeline.json', 'libs/core/src/node/license.ts', 'pipeline.json', ['T:pipeline.json']],
  ['user-file', '~/.penstock/test-builds.json', 'libs/core/src/node/testCases.ts', 'test-builds.json', ['T:test-builds.json']],
  ['user-file', '~/.penstock/wrapper/dists', 'apps/cli/src/wrapper/penstockw', 'wrapper/dists', ['T:wrapper/dists']],
  ['bpmn-extension', 'penstock:Comments namespace in the BPMN file', 'libs/webview/src/features/comments/penstockModdle.ts', 'https://penstock.dev/schema/1.0/bpmn', ['T:penstock:comments', 'T:penstock.dev/schema']],
  ['import-format', 'draw.io', 'libs/core/src/import/drawio.ts', 'fromDrawio', ['T:draw.io']],
  ['import-format', 'Visio', 'libs/core/src/import/visio.ts', 'fromVisio', ['T:Visio']],
  ['import-format', 'Signavio', 'libs/core/src/import/dialect.ts', 'Signavio', ['T:Signavio']],
  ['import-format', 'Bizagi', 'libs/core/src/import/dialect.ts', 'Bizagi', ['T:Bizagi']],
  ['export-format', 'SVG and PNG from the command line', 'apps/cli/src/export.ts', "['svg', 'png']", ['T:penstock export']],
];
for (const [kind, row, source, needle, terms] of CURATED) {
  if (!read(source).includes(needle)) console.error(`stale: ${row} (${needle} not in ${source})`);
  else add(kind, row, source, terms);
}

const guide = read('libs/core/src/docs/guide.ts');
for (const [, topic, target] of guide.matchAll(/^\s+(\w+): '([^']+)',?$/gm)) add('product-link', `the product opens ${target}`, `libs/core/src/docs/guide.ts (${topic})`, [`P:${target}`]);
add('product-link', 'the schema address in penstock.yaml files', 'apps/jetbrains/src/main/resources/schema/penstock.schema.json', ['P:schema/penstock.schema.json']);

const { INSTRUCTION_SCHEMA } = await load('libs/core/src/testCases/schema.ts');
for (const name of Object.keys(INSTRUCTION_SCHEMA)) add('test-case-instruction', name, 'libs/core/src/testCases/schema.ts', [`T:${name}`]);

const pages = readPages();
for (const entry of rows) Object.assign(entry, depthOf(entry.terms, pages, entry.only));
fs.writeFileSync(path.join(root, 'tools', 'coverage.json'), `${JSON.stringify(rows, null, 1)}\n`);

const tally = {};
for (const entry of rows) {
  tally[entry.kind] ??= { rows: 0, none: 0, mention: 0, explained: 0 };
  tally[entry.kind].rows += 1;
  tally[entry.kind][entry.depth] += 1;
}
console.table(tally);
console.log(`${rows.length} rows`);
