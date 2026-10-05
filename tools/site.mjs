import fs from 'node:fs';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '..');
export const SITE = 'https://kern0x1b.github.io/penstock-release';
export const REPO = 'https://github.com/kern0x1b/penstock-release';
export const STORES = {
  jetbrains: 'https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor',
  vscode: 'https://marketplace.visualstudio.com/items?itemName=penstock.penstock',
  npm: 'https://www.npmjs.com/package/@kern0x1b/penstock-cli',
};
export const MARKETPLACE = STORES.jetbrains;

export const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const pagesDir = path.join(import.meta.dirname, 'pages');
export const blocksDir = path.join(import.meta.dirname, 'blocks');

const config = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'nav.json'), 'utf8'));

export const REDIRECTS = config.redirects ?? [];

const sourceExists = (section, slug) => slug.startsWith('rules/') || fs.existsSync(path.join(pagesDir, section, `${slug}.html`));

export const ALL_SECTIONS = config.sections;

export const SECTIONS = config.sections
  .filter((section) => section.enabled !== false)
  .map((section) => ({
    ...section,
    groups: section.groups
      .map((group) => ({ ...group, pages: group.pages.filter((page) => sourceExists(section.id, page.slug)) }))
      .filter((group) => group.pages.length > 0),
  }));

export const HOSTS = SECTIONS.filter((section) => section.kind === 'host');
export const ANNOUNCED = config.sections.filter((section) => section.kind === 'host' && section.enabled === false && section.announce);

export const PAGES = SECTIONS.flatMap((section) =>
  section.groups.flatMap((group) => group.pages.map((page) => ({ ...page, section: section.id, group: group.title, key: `${section.id}/${page.slug}` }))),
);

export const sectionOf = (id) => SECTIONS.find((section) => section.id === id);

export function urlOf(page, base) {
  if (page.href) return `${base}${page.href}`;
  if (page.slug === 'index') return `${base}${page.section}/`;
  return `${base}${page.section}/${page.slug}.html`;
}

export function sectionUrl(section, base) {
  return `${base}${section.id}/`;
}

export function sidebar({ base, section, key }) {
  const own = sectionOf(section);
  const items = own.groups
    .map((group) => {
      const links = group.pages
        .map((page) => {
          const pageKey = `${section}/${page.slug}`;
          const isCurrent = pageKey === key;
          const isParent = page.slug === 'rules/index' && key.startsWith(`${section}/rules/`) && !isCurrent;
          const attributes = isCurrent ? ' aria-current="page"' : isParent ? ' class="parent"' : '';
          return `      <li><a href="${urlOf({ ...page, section }, base)}"${attributes}>${escapeHtml(page.title)}</a></li>`;
        })
        .join('\n');
      return `    <h2>${escapeHtml(group.title)}</h2>\n    <ul>\n${links}\n    </ul>`;
    })
    .join('\n');
  return `  <nav class="side" id="menu" aria-label="${escapeHtml(own.title)}">\n${items}\n  </nav>`;
}

export function toolsRow(base) {
  const cards = [
    ...HOSTS.map((host) => `<a class="card" href="${sectionUrl(host, base)}"><strong>${escapeHtml(host.title)}</strong><span>${escapeHtml(host.summary ?? '')}</span></a>`),
    ...ANNOUNCED.map((host) => `<div class="card soon"><strong>${escapeHtml(host.title)} <span class="tag off">Coming</span></strong><span>${escapeHtml(host.summary ?? '')}</span></div>`),
  ];
  return `<div class="cards tools">\n${cards.join('\n')}\n</div>`;
}

const EMBED = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'checkout.json'), 'utf8')).embed === true;

export function shell({ depth, title, description, canonical, body, key = '', withSidebar = true, section = 'guide', wrap = 'layout', checkout = false }) {
  const base = '../'.repeat(depth);
  const links = [
    ...SECTIONS.map((entry) => ({ href: `${entry.id}/`, label: entry.title, key: entry.id })),
    { href: 'guide/plans.html', label: 'Plans', key: 'plans' },
    { href: 'license/', label: 'Licence', key: 'license' },
    { href: `${REPO}/issues`, label: 'Support', key: 'support' },
  ]
    .map(({ href: target, label, key: linkKey }) => {
      const mark = linkKey === section ? ' aria-current="true"' : '';
      const url = /^https?:/.test(target) ? target : base + target;
      return `      <a href="${url}"${mark}>${label}</a>`;
    })
    .join('\n');
  const inner =
    wrap === 'layout'
      ? `<div class="layout">\n${withSidebar ? sidebar({ base, section, key }) : ''}\n${body}\n</div>`
      : body;
  const hostLinks = HOSTS.map((host) => `<a href="${sectionUrl(host, base)}">${escapeHtml(host.title)}</a>`).join('\n    ');
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
    ${hostLinks}
    <a href="${MARKETPLACE}">Marketplace</a>
    <a href="${REPO}/issues">Issues</a>
    <a href="${REPO}/blob/main/CHANGELOG.md">Changelog</a>
    <a href="${base}license/">Licence</a>
    <a href="${base}notices/">Third-party notices</a>
    <a href="${REPO}/blob/main/SECURITY.md">Security policy</a>
  </div>
  <p>Penstock was published as Camunda BPMN Editor until 2026. Same plugin, same vendor, new name. It updates in place and nothing needs to be reinstalled.</p>
  <p>Penstock is an independent product. It is not affiliated with, endorsed by, or sponsored by Camunda Services GmbH. "Camunda" and "BPMN" are used only to describe the process engines and the notation the plugin works with. Camunda is a trademark of Camunda Services GmbH. BPMN is a trademark of the Object Management Group.</p>
  <p>This site sets no cookies and loads nothing from other sites. ${EMBED ? 'Its one script, on the Plans page, opens the checkout, and it is served from this site.' : 'It runs no scripts.'} It is set in <a href="https://github.com/JetBrains/JetBrainsMono">JetBrains Mono</a>, under the <a href="${base}fonts/OFL.txt">SIL Open Font License 1.1</a>.</p>
  <p>Copyright 2024-2026 kern0x1b. All rights reserved.</p>
</footer>
${checkout && EMBED ? `\n<script src="${base}vendor/polar-checkout/embed.global.js" data-auto-init defer></script>\n` : ''}
</body>
</html>
`;
}
