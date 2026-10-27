import fs from 'node:fs';
import path from 'node:path';
import { CONTACT, DRAFTS, analyticsNote, PAGES, REDIRECTS, SECTIONS, SITE, STORES, escapeHtml, pagesDir, root, sectionOf, shell, toolsRow, urlOf } from './site.mjs';
import { buyLinksHtml, plansHtml, priceSummaryHtml } from './plans.mjs';
import { refreshPrices } from './fetch-prices.mjs';
import { missingBlocks, renderHostBlocks, unusedBlocks } from './blocks.mjs';

function parse(source) {
  const match = source.match(/^<!--\n([\s\S]*?)\n-->\n?/);
  if (!match) throw new Error('page has no front matter');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const at = line.indexOf(':');
    meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body: source.slice(match[0].length) };
}

const slugify = (text) =>
  text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function anchorHeadings(body) {
  const seen = new Set();
  const headings = [];
  const html = body.replace(/<h([23])(?: id="([^"]+)")?>([\s\S]*?)<\/h\1>/g, (_, level, given, text) => {
    let id = given ?? slugify(text);
    while (seen.has(id)) id += '-2';
    seen.add(id);
    if (level === '2') headings.push({ id, text });
    return `<h${level} id="${id}"><a href="#${id}">${text}</a></h${level}>`;
  });
  return { html, headings };
}

const wrapTables = (html) => html.replace(/<table/g, '<div class="table-wrap"><table').replace(/<\/table>/g, '</table></div>');

const TAGS = { free: 'Free', pro: 'Pro', team: 'Team in a pipeline', new: 'New', error: 'Error', warning: 'Advice', off: 'Off by default' };

function tagsOf(value) {
  if (!value) return '';
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => `<span class="tag ${tag === 'team' ? 'team' : tag}">${TAGS[tag] ?? tag}</span>`)
    .join('');
}

function contents(sectionId) {
  const section = sectionOf(sectionId);
  return section.groups
    .map(
      (group) =>
        `<h2>${escapeHtml(group.title)}</h2>\n<div class="cards">\n${group.pages
          .filter((page) => page.slug !== 'index' && !page.unlisted)
          .map((page) => `<a class="card" href="${urlOf({ ...page, section: sectionId }, '../')}"><strong>${escapeHtml(page.title)}</strong><span>${escapeHtml(page.about ?? '')}</span></a>`)
          .join('\n')}\n</div>`,
    )
    .join('\n');
}

const SECTION_TOKEN = /@(guide|jetbrains|cli|vscode|desktop|rules)\//g;

export function resolveTokens(body) {
  return body.replaceAll('@img/', '../img/').replace(SECTION_TOKEN, '../$1/').replace(/<!-- image:[^>]*-->\n?/g, '');
}

const pageOf = (from, ref) => {
  const qualified = ref.includes('/') ? ref : `${from}/${ref}`;
  return PAGES.find((page) => page.key === qualified);
};

export function pageHtml({ section, slug, meta, body }) {
  const base = '../';
  const key = `${section}/${slug}`;
  const { html, headings } = anchorHeadings(resolveTokens(body));
  const toc =
    headings.length >= 5
      ? `<nav class="toc" aria-label="On this page">\n<h2>On this page</h2>\n<ul>\n${headings.map(({ id, text }) => `<li><a href="#${id}">${text}</a></li>`).join('\n')}\n</ul>\n</nav>\n`
      : '';
  const siblings = PAGES.filter((page) => page.section === section && (!page.unlisted || page.key === key));
  const index = siblings.findIndex((page) => page.key === key);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  const pager =
    previous || next
      ? `<nav class="pager" aria-label="Previous and next">\n${previous ? `<a class="prev" href="${urlOf(previous, base)}"><span>Previous</span>${escapeHtml(previous.title)}</a>` : '<span></span>'}\n${next ? `<a class="next" href="${urlOf(next, base)}"><span>Next</span>${escapeHtml(next.title)}</a>` : ''}\n</nav>\n`
      : '';
  const related = meta.related
    ? `<div class="related">\n<h2>See also</h2>\n<ul>\n${meta.related
        .split(',')
        .map((item) => item.trim())
        .map((item) => {
          const page = pageOf(section, item);
          if (!page) {
            console.warn(`${key}: related page ${item} has no source yet`);
            return '';
          }
          return `<li><a href="${urlOf(page, base)}">${escapeHtml(page.title)}</a> - ${escapeHtml(page.about ?? '')}</li>`;
        })
        .filter(Boolean)
        .join('\n')}\n</ul>\n</div>\n`
    : '';
  const own = sectionOf(section);
  const crumbs = `<p class="crumbs"><a href="${base}${section}/">${escapeHtml(own.title)}</a>${meta.group ? ` / ${escapeHtml(meta.group)}` : ''}</p>`;
  const tags = tagsOf(meta.tags);
  const main = `<main class="doc" id="content">
${slug === 'index' ? '' : `${crumbs}\n`}<h1>${meta.title}</h1>
<p class="lede">${meta.lede}</p>
${tags || meta.needs ? `<p class="meta">${tags}${meta.needs ? ` <span>${meta.needs}</span>` : ''}</p>\n` : ''}${toc}${wrapTables(html)}${related}${pager}</main>`;
  const canonical = meta.canonical ?? (slug === 'index' ? `${section}/` : `${section}/${slug}.html`);
  return shell({
    depth: 1,
    title: `${meta.title.replace(/<[^>]+>/g, '')} - Penstock`,
    description: (meta.description ?? meta.lede).replace(/<[^>]+>/g, ''),
    canonical,
    body: main,
    key,
    section,
    checkout: meta.checkout === 'true',
  });
}

function redirectHtml(from, to) {
  const back = '../'.repeat(from.split('/').length - 1);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>This page has moved - Penstock</title>
<link rel="canonical" href="${SITE}/${to}">
<meta http-equiv="refresh" content="0; url=${back}${to}">
</head>
<body>
<p>This page has moved to <a href="${back}${to}">${SITE}/${to}</a>.</p>
</body>
</html>
`;
}

export function buildAll() {
  let count = 0;
  for (const section of SECTIONS) {
    const out = path.join(root, 'docs', section.id);
    fs.mkdirSync(out, { recursive: true });
    for (const stale of fs.readdirSync(out)) if (stale.endsWith('.html')) fs.rmSync(path.join(out, stale));
    const dir = path.join(pagesDir, section.id);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => file.endsWith('.html') && !DRAFTS.has(`${section.id}/${file.replace(/\.html$/, '')}`)) : [];
    const known = new Set(PAGES.filter((page) => page.section === section.id).map((page) => page.slug));
    for (const file of files) {
      const slug = file.replace(/\.html$/, '');
      if (DRAFTS.has(`${section.id}/${slug}`)) continue;
      if (!known.has(slug)) throw new Error(`tools/pages/${section.id}/${file} is not listed in tools/nav.json`);
      const parsed = parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      const { meta } = parsed;
      meta.group = PAGES.find((page) => page.key === `${section.id}/${slug}`).group;
      const body = renderHostBlocks(parsed.body, `${section.id}/${slug}`)
        .replace('{{contents}}', contents(section.id))
        .replace('{{tools}}', toolsRow('../'))
        .replaceAll('{{analytics-note}}', analyticsNote())
        .replaceAll('{{contact-email}}', CONTACT.email)
        .replaceAll('{{contact}}', `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`)
        .replaceAll('{{issues}}', CONTACT.issues)
        .replace('{{plans}}', plansHtml())
        .replace('{{prices}}', priceSummaryHtml())
        .replace('{{buy}}', buyLinksHtml())
        .replaceAll('{{store:jetbrains}}', STORES.jetbrains)
        .replaceAll('{{store:vscode}}', STORES.vscode)
        .replaceAll('{{store:npm}}', STORES.npm);
      fs.writeFileSync(path.join(out, slug === 'index' ? 'index.html' : `${slug}.html`), pageHtml({ section: section.id, slug, meta, body }));
      count += 1;
    }
    for (const page of PAGES.filter((entry) => entry.section === section.id && !entry.slug.startsWith('rules/'))) {
      if (!files.includes(`${page.slug}.html`)) console.warn(`no source for ${page.key}`);
    }
  }
  for (const { from, to } of REDIRECTS) {
    fs.writeFileSync(path.join(root, 'docs', from), redirectHtml(from, to));
  }
  if (missingBlocks.length > 0) {
    throw new Error(`Some tools have no block for a page that works the same everywhere. Add these files to tools/blocks/, and write "unavailable: <reason>" in the header when the feature does not exist in that tool:\n  ${[...new Set(missingBlocks)].sort().join('\n  ')}`);
  }
  const unused = unusedBlocks();
  if (unused.length > 0) console.warn(`blocks that no page uses: ${unused.join(', ')}`);
  console.log(`wrote ${count} pages in ${SECTIONS.length} sections${REDIRECTS.length ? `, ${REDIRECTS.length} redirect` : ''}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.env.POLAR_ACCESS_TOKEN) await refreshPrices();
  buildAll();
}
