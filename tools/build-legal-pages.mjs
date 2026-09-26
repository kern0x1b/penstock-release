import fs from 'node:fs';
import path from 'node:path';
import { escapeHtml, root, shell } from './site.mjs';

function page({ title, description, heading, lede, body, slug }) {
  return shell({
    depth: 1,
    title,
    description,
    canonical: `${slug}/`,
    wrap: 'bare',
    section: 'license',
    body: `<main class="legal-wrap" id="content">
  <h1>${heading}</h1>
  <p class="lede">${lede}</p>
  <pre class="legal"><code>${body}</code></pre>
</main>`,
  });
}

const targets = [
  {
    source: 'LICENSE',
    slug: 'license',
    title: 'License - Penstock',
    description: 'The end-user license agreement for the Penstock plugin.',
    heading: 'End User License Agreement',
    lede:
      'These are the terms under which the Penstock plugin is licensed. Bundled open-source ' +
      'components keep their own licenses, listed under <a href="../notices/">third-party notices</a>.',
  },
  {
    source: 'THIRD-PARTY-NOTICES.md',
    slug: 'notices',
    title: 'Third-party notices - Penstock',
    description:
      'Licenses of the open-source components bundled with Penstock, and the written source offer for the LGPL-licensed ones.',
    heading: 'Third-party notices',
    lede:
      'Penstock bundles the open-source components below. Each stays under its own license; the ' +
      'terms here apply to those components only, not to Penstock itself. The same notices ship ' +
      'inside the plugin, under Settings | Tools | Penstock | About.',
  },
];

for (const target of targets) {
  const body = escapeHtml(fs.readFileSync(path.join(root, target.source), 'utf8').trimEnd());
  const dir = path.join(root, 'docs', target.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page({ ...target, body }));
  console.log(`wrote docs/${target.slug}/index.html from ${target.source}`);
}
