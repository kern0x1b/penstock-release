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
    .map((group, index) => {
      const holdsCurrent = group.pages.some((page) => `${section}/${page.slug}` === key || (page.slug === 'rules/index' && key.startsWith(`${section}/rules/`)));
      const open = holdsCurrent || (index === 0 && !own.groups.some((other) => other.pages.some((page) => `${section}/${page.slug}` === key || (page.slug === 'rules/index' && key.startsWith(`${section}/rules/`)))));
      const links = group.pages
        .map((page) => {
          const pageKey = `${section}/${page.slug}`;
          const isCurrent = pageKey === key;
          const isParent = page.slug === 'rules/index' && key.startsWith(`${section}/rules/`) && !isCurrent;
          const attributes = isCurrent ? ' aria-current="page"' : isParent ? ' class="parent"' : '';
          return `      <li><a href="${urlOf({ ...page, section }, base)}"${attributes}>${escapeHtml(page.title)}</a></li>`;
        })
        .join('\n');
      return `    <details${open ? ' open' : ''}>\n    <summary>${escapeHtml(group.title)}</summary>\n    <ul>\n${links}\n    </ul>\n    </details>`;
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

export function pngDimensions(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(24);
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);
    if (buffer.toString('ascii', 12, 16) === 'IHDR') {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
  } catch {}
  return null;
}

export function optimizeImages(html) {
  let screenshotIndex = 0;
  return html.replace(/<img\b([^>]*)>/gi, (imgTag, attrs) => {
    const srcMatch = attrs.match(/\bsrc="([^"]+)"/i);
    if (!srcMatch) return imgTag;
    const src = srcMatch[1];
    if (!src.endsWith('.png')) return imgTag;

    const isFirst = screenshotIndex === 0;
    screenshotIndex++;

    const imgName = path.basename(src);
    const imgPath = path.join(root, 'docs', 'img', imgName);
    const dimensions = pngDimensions(imgPath);

    let newAttrs = attrs;
    if (dimensions) {
      if (!/\bwidth=/i.test(newAttrs)) newAttrs += ` width="${dimensions.width}"`;
      if (!/\bheight=/i.test(newAttrs)) newAttrs += ` height="${dimensions.height}"`;
    }
    if (!isFirst) {
      if (!/\bloading=/i.test(newAttrs)) newAttrs += ' loading="lazy"';
      if (!/\bdecoding=/i.test(newAttrs)) newAttrs += ' decoding="async"';
    }
    return `<img${newAttrs}>`;
  });
}

export const THEME_SCRIPT = `(function(){var d=document,r=d.documentElement,k='penstock-theme';r.classList.add('js');try{var t=localStorage.getItem(k);if(t==='light'||t==='dark')r.dataset.theme=t}catch(e){}d.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-theme-toggle]');if(b){var n=(r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark'?'light':'dark';r.dataset.theme=n;try{localStorage.setItem(k,n)}catch(x){}return}var o=d.querySelector('.products[open]');if(o&&!o.contains(e.target))o.removeAttribute('open')});d.addEventListener('keydown',function(e){var o=d.querySelector('.products[open]');if(e.key==='Escape'&&o){o.removeAttribute('open');o.querySelector('summary').focus()}})})();`;

export function shell({ depth, title, description, canonical, body, key = '', withSidebar = true, section = 'guide', wrap = 'layout', checkout = false, base: absoluteBase, jsonLd }) {
  const base = absoluteBase ?? '../'.repeat(depth);
  const link = (href, label, { keep = false, current = false } = {}) => {
    const url = /^https?:/.test(href) ? href : base + href;
    return `      <a href="${url}"${keep ? ' class="keep"' : ''}${current ? ' aria-current="true"' : ''}>${label}</a>`;
  };
  const inProducts = HOSTS.some((entry) => entry.id === section);
  const products = [
    `      <details class="products"${inProducts ? ' data-current="true"' : ''}>`,
    '        <summary>Products</summary>',
    '        <div class="drop">',
    ...HOSTS.map((entry) => {
      const mark = entry.id === section ? ' aria-current="true"' : '';
      return `          <a href="${base}${entry.id}/"${mark}><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(entry.summary ?? '')}</span></a>`;
    }),
    '        </div>',
    '      </details>',
  ].join('\n');
  const links = [
    link('guide/getting-started.html', 'Get started', { keep: true, current: key === 'guide/getting-started' }),
    link('guide/', 'Guide', { keep: true, current: section === 'guide' && key !== 'guide/getting-started' && key !== 'guide/plans' }),
    products,
    link('guide/plans.html', 'Plans', { current: key === 'guide/plans' }),
  ].join('\n');
  const optimizedBody = optimizeImages(body);
  const inner =
    wrap === 'layout'
      ? `<div class="layout">\n${withSidebar ? sidebar({ base, section, key }) : ''}\n${optimizedBody}\n</div>`
      : optimizedBody;
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
<link rel="icon" href="${base}favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="${base}favicon-16.png" type="image/png" sizes="16x16">
<link rel="icon" href="${base}favicon-48.png" type="image/png" sizes="48x48">
<link rel="shortcut icon" href="${base}favicon.ico">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Penstock">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/og-image.png">
<link rel="canonical" href="${SITE}/${canonical}">
<link rel="preload" href="${base}fonts/InterVariable-latin.woff2" as="font" type="font/woff2" crossorigin>
<script>${THEME_SCRIPT}</script>
<link rel="stylesheet" href="${base}style.css">
${jsonLd ? `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>\n` : ''}</head>
<body>
<a class="skip" href="#content">Skip to the content</a>

<header class="top">
  <div class="bar">
    <a class="brand" href="${base}"><img src="${base}icon.svg" alt="">Penstock</a>
    <nav aria-label="Site">
${links}
      <button type="button" class="theme-toggle" data-theme-toggle aria-label="Switch between light and dark" title="Switch between light and dark"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11" /><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" stroke="none"/></svg></button>
    </nav>
  </div>
</header>

${inner}

<footer>
  <div class="links">
    <a href="${base}">Home</a>
    <a href="${base}guide/getting-started.html">Get started</a>
    <a href="${base}guide/">Guide</a>
    ${hostLinks}
    <a href="${base}guide/plans.html">Plans</a>
    <a href="${MARKETPLACE}">Marketplace</a>
    <a href="${REPO}/issues">Support</a>
    <a href="${REPO}/blob/main/CHANGELOG.md">Changelog</a>
    <a href="${base}license/">Licence</a>
    <a href="${base}notices/">Third-party notices</a>
    <a href="${REPO}/blob/main/SECURITY.md">Security policy</a>
  </div>
  <p>Penstock was published as Camunda BPMN Editor until 2026. Same plugin, same vendor, new name. It updates in place and nothing needs to be reinstalled.</p>
  <p>Penstock is an independent product. It is not affiliated with, endorsed by, or sponsored by Camunda Services GmbH. "Camunda" and "BPMN" are used only to describe the process engines and the notation the plugin works with. Camunda is a trademark of Camunda Services GmbH. BPMN is a trademark of the Object Management Group.</p>
  <p>This site sets no cookies and loads nothing from other sites. ${EMBED ? 'Its one script, on the Plans page, opens the checkout, and it is served from this site.' : 'It runs no scripts.'} It is set in <a href="https://github.com/rsms/inter">Inter</a> and <a href="https://github.com/JetBrains/JetBrainsMono">JetBrains Mono</a>, under the SIL Open Font License 1.1 (<a href="${base}fonts/OFL-Inter.txt">Inter</a>, <a href="${base}fonts/OFL.txt">JetBrains Mono</a>).</p>
  <p>Copyright 2024-2026 kern0x1b. All rights reserved.</p>
</footer>
${checkout && EMBED ? `\n<script src="${base}vendor/polar-checkout/embed.global.js" data-auto-init defer></script>\n` : ''}
</body>
</html>
`;
}
