import fs from 'node:fs';
import path from 'node:path';
import { NAV, PAGES, escapeHtml, root, shell, urlOf } from './site.mjs';

const pagesDir = path.join(import.meta.dirname, 'pages');
const outDir = path.join(root, 'docs', 'guide');

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

function contents() {
  return NAV.map(
    (group) =>
      `<h2>${escapeHtml(group.title)}</h2>\n<div class="cards">\n${group.pages
        .filter((page) => page.slug !== 'index')
        .map((page) => `<a class="card" href="${urlOf(page, '../')}"><strong>${escapeHtml(page.title)}</strong><span>${escapeHtml(page.about ?? '')}</span></a>`)
        .join('\n')}\n</div>`,
  ).join('\n');
}


export function pageHtml({ slug, meta, body }) {
  const base = '../';
  const { html, headings } = anchorHeadings(body.replaceAll('@img/', `${base}img/`));
  const toc =
    headings.length >= 4
      ? `<nav class="toc" aria-label="On this page">\n<h2>On this page</h2>\n<ul>\n${headings.map(({ id, text }) => `<li><a href="#${id}">${text}</a></li>`).join('\n')}\n</ul>\n</nav>\n`
      : '';
  const index = PAGES.findIndex((page) => page.slug === slug);
  const previous = index > 0 ? PAGES[index - 1] : null;
  const next = index >= 0 && index < PAGES.length - 1 ? PAGES[index + 1] : null;
  const pager =
    previous || next
      ? `<nav class="pager" aria-label="Previous and next">\n${previous ? `<a class="prev" href="${urlOf(previous, base)}"><span>Previous</span>${escapeHtml(previous.title)}</a>` : '<span></span>'}\n${next ? `<a class="next" href="${urlOf(next, base)}"><span>Next</span>${escapeHtml(next.title)}</a>` : ''}\n</nav>\n`
      : '';
  const related = meta.related
    ? `<div class="related">\n<h2>See also</h2>\n<ul>\n${meta.related
        .split(',')
        .map((item) => item.trim())
        .map((item) => {
          const page = PAGES.find((candidate) => candidate.slug === item);
          if (!page) {
            console.warn(`${slug}: related page ${item} has no source yet`);
            return '';
          }
          return `<li><a href="${urlOf(page, base)}">${escapeHtml(page.title)}</a> - ${escapeHtml(page.about ?? '')}</li>`;
        })
        .filter(Boolean)
        .join('\n')}\n</ul>\n</div>\n`
    : '';
  const crumbs = `<p class="crumbs"><a href="${base}guide/">Guide</a>${meta.group ? ` / ${escapeHtml(meta.group)}` : ''}</p>`;
  const tags = tagsOf(meta.tags);
  const main = `<main class="doc" id="content">
${slug === 'index' ? '' : `${crumbs}\n`}<h1>${meta.title}</h1>
<p class="lede">${meta.lede}</p>
${tags || meta.needs ? `<p class="meta">${tags}${meta.needs ? ` <span>${meta.needs}</span>` : ''}</p>\n` : ''}${toc}${wrapTables(html)}${related}${pager}</main>`;
  return shell({
    depth: 1,
    title: `${meta.title.replace(/<[^>]+>/g, '')} - Penstock`,
    description: (meta.description ?? meta.lede).replace(/<[^>]+>/g, ''),
    canonical: slug === 'index' ? 'guide/' : slug === 'rules/index' ? 'rules/' : slug.startsWith('rules/') ? `${slug}` : `guide/${slug}.html`,
    body: main,
    current: slug,
    section: slug === 'plans' ? 'plans' : slug === 'cli' ? 'cli' : 'guide',
  });
}

export function buildHandWritten() {
  const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.html'));
  const known = new Set(PAGES.map((page) => page.slug));
  for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    if (!known.has(slug)) throw new Error(`${file} is not listed in tools/nav.json`);
    const parsed = parse(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
    const { meta } = parsed;
    const body = parsed.body.replace('{{contents}}', contents());
    meta.group = PAGES.find((page) => page.slug === slug).group;
    const target = path.join(outDir, slug === 'index' ? 'index.html' : `${slug}.html`);
    fs.writeFileSync(target, pageHtml({ slug, meta, body }));
  }
  for (const page of PAGES) {
    if (page.slug.startsWith('rules/')) continue;
    if (!files.includes(`${page.slug}.html`)) console.warn(`no source for ${page.slug}`);
  }
  console.log(`wrote ${files.length} guide pages`);
}

if (import.meta.url === `file://${process.argv[1]}`) buildHandWritten();
