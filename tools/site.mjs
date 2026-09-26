import fs from 'node:fs';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '..');
export const SITE = 'https://kern0x1b.github.io/penstock-release';
export const REPO = 'https://github.com/kern0x1b/penstock-release';
export const MARKETPLACE = 'https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor';

export const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sourceExists = (slug) => slug === 'index' || slug.startsWith('rules/') || fs.existsSync(path.join(import.meta.dirname, 'pages', `${slug}.html`));

export const NAV = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'nav.json'), 'utf8'))
  .map((group) => ({ ...group, pages: group.pages.filter((page) => sourceExists(page.slug)) }))
  .filter((group) => group.pages.length > 0);

export const PAGES = NAV.flatMap((group) => group.pages.map((page) => ({ ...page, group: group.title })));

const TOP_LINKS = [
  { href: 'guide/', label: 'Guide', key: 'guide' },
  { href: 'guide/plans.html', label: 'Plans', key: 'plans' },
  { href: 'guide/cli.html', label: 'Command line', key: 'cli' },
  { href: 'license/', label: 'Licence', key: 'license' },
  { href: `${REPO}/issues`, label: 'Support', key: 'support' },
];

function up(depth) {
  return '../'.repeat(depth);
}

function href(base, target) {
  return /^https?:/.test(target) ? target : base + target;
}

export function urlOf(page, base) {
  if (page.slug === 'index') return `${base}guide/`;
  if (page.href) return `${base}${page.href}`;
  return `${base}guide/${page.slug}.html`;
}

export function sidebar({ base, current }) {
  const items = NAV.map((group) => {
    const links = group.pages
      .map((page) => {
        const isCurrent = page.slug === current;
        const isParent = current && current.startsWith('rules/') && page.slug === 'rules/index';
        const attributes = isCurrent ? ' aria-current="page"' : isParent ? ' class="parent"' : '';
        return `      <li><a href="${urlOf(page, base)}"${attributes}>${escapeHtml(page.title)}</a></li>`;
      })
      .join('\n');
    return `    <h2>${escapeHtml(group.title)}</h2>\n    <ul>\n${links}\n    </ul>`;
  }).join('\n');
  return `  <nav class="side" id="menu" aria-label="Guide">\n${items}\n  </nav>`;
}

export function shell({ depth, title, description, canonical, body, current, withSidebar = true, section = 'guide', wrap = 'layout' }) {
  const base = up(depth);
  const links = TOP_LINKS.map(({ href: target, label, key }) => {
    const current = key === section ? ' aria-current="true"' : '';
    return `      <a href="${href(base, target)}"${current}>${label}</a>`;
  }).join('\n');
  const inner =
    wrap === 'layout'
      ? `<div class="layout">\n${withSidebar ? sidebar({ base, current }) : ''}\n${body}\n</div>`
      : body;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="icon" href="${base}icon.svg" type="image/svg+xml">
<link rel="canonical" href="${SITE}/${canonical}">
<link rel="preload" href="${base}fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}style.css">
</head>
<body>
<a class="skip" href="#content">Skip to the content</a>

<header class="top">
  <div class="bar">
    <a class="brand" href="${base}"><img src="${base}icon.svg" alt="">Penstock</a>
    <nav aria-label="Site">
${links}
${wrap === 'layout' && withSidebar ? '      <a class="menu-link" href="#menu">Menu</a>\n' : ''}
    </nav>
  </div>
</header>

${inner}

<footer>
  <div class="links">
    <a href="${base}">Home</a>
    <a href="${base}guide/">Guide</a>
    <a href="${MARKETPLACE}">Marketplace</a>
    <a href="${REPO}/issues">Issues</a>
    <a href="${REPO}/blob/main/CHANGELOG.md">Changelog</a>
    <a href="${base}license/">Licence</a>
    <a href="${base}notices/">Third-party notices</a>
    <a href="${REPO}/blob/main/SECURITY.md">Security policy</a>
  </div>
  <p>Penstock was published as Camunda BPMN Editor until 2026. Same plugin, same vendor, new name. It updates in place and nothing needs to be reinstalled.</p>
  <p>Penstock is an independent product. It is not affiliated with, endorsed by, or sponsored by Camunda Services GmbH. "Camunda" and "BPMN" are used only to describe the process engines and the notation the plugin works with. Camunda is a trademark of Camunda Services GmbH. BPMN is a trademark of the Object Management Group.</p>
  <p>This site sets no cookies, runs no scripts and loads nothing from other sites. It is set in <a href="https://github.com/JetBrains/JetBrainsMono">JetBrains Mono</a>, under the <a href="${base}fonts/OFL.txt">SIL Open Font License 1.1</a>.</p>
  <p>Copyright 2024-2026 kern0x1b. All rights reserved.</p>
</footer>

</body>
</html>
`;
}
