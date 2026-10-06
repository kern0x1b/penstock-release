import fs from 'node:fs';
import path from 'node:path';
import { SITE, root } from './site.mjs';

const docs = path.join(root, 'docs');
const urls = new Set();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.html')) {
      if (entry.name === '404.html') continue;
      const html = fs.readFileSync(full, 'utf8');
      if (html.includes('http-equiv="refresh"')) continue;
      const match = html.match(/<link rel="canonical" href="([^"]+)">/);
      if (match) {
        urls.add(match[1]);
      } else {
        console.warn(`warning: ${path.relative(docs, full)} has no canonical URL`);
      }
    }
  }
}

walk(docs);

const rootUrl = `${SITE}/`;
const sortedUrls = Array.from(urls).sort((a, b) => {
  if (a === rootUrl) return -1;
  if (b === rootUrl) return 1;
  return a.localeCompare(b);
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sortedUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(docs, 'sitemap.xml'), sitemapXml);
console.log(`wrote docs/sitemap.xml with ${sortedUrls.length} URLs`);

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

fs.writeFileSync(path.join(docs, 'robots.txt'), robotsTxt);
console.log('wrote docs/robots.txt');
