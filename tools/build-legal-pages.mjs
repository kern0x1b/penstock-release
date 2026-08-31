import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page({ title, description, heading, lede, body, slug }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<link rel="canonical" href="https://kern0x1b.github.io/penstock-release/${slug}/">
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
      <a href="../license/">License</a>
      <a href="../notices/">Third-party notices</a>
      <a href="https://github.com/kern0x1b/penstock-release/issues">Support</a>
    </nav>
  </div>
</header>

<main class="wrap doc">
  <h1>${heading}</h1>
  <p class="lede">${lede}</p>
  <pre class="legal"><code>${body}</code></pre>
</main>

<footer>
  <div class="wrap">
    <div class="links">
      <a href="../">Overview</a>
      <a href="https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor">Marketplace</a>
      <a href="https://github.com/kern0x1b/penstock-release/issues">Issues</a>
      <a href="https://github.com/kern0x1b/penstock-release/blob/main/CHANGELOG.md">Changelog</a>
    </div>
    <p>Copyright © 2024–2026 kern0x1b. All rights reserved.</p>
  </div>
</footer>

</body>
</html>
`;
}

const targets = [
  {
    source: 'LICENSE',
    slug: 'license',
    title: 'License — Penstock',
    description: 'The end-user license agreement for the Penstock plugin.',
    heading: 'End User License Agreement',
    lede:
      'These are the terms under which the Penstock plugin is licensed. Bundled open-source ' +
      'components keep their own licenses, listed under <a href="../notices/">third-party notices</a>.',
  },
  {
    source: 'THIRD-PARTY-NOTICES.md',
    slug: 'notices',
    title: 'Third-party notices — Penstock',
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
  const body = escape(fs.readFileSync(path.join(root, target.source), 'utf8').trimEnd());
  const dir = path.join(root, 'docs', target.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page({ ...target, body }));
  console.log(`wrote docs/${target.slug}/index.html from ${target.source}`);
}
