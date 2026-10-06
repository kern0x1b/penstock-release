import fs from 'node:fs';
import path from 'node:path';
import { REPO, STORES, root, shell } from './site.mjs';
import { buyLinksHtml, priceSummaryHtml } from './plans.mjs';
import { readPrices } from './fetch-prices.mjs';

const NODE = 'Node.js 22.22.2 or later in 22, 24.15.0 or later in 24, or 26 and later';

const body = `<main id="content">
<div class="wide">

<section class="hero">
  <h1>Edit, check and deploy BPMN diagrams where you already work.</h1>
  <p class="lede">Penstock is a visual editor for BPMN, DMN and Camunda forms, for Camunda 7, Camunda 8, Operaton and CIB seven. It runs in JetBrains IDEs and in VS Code, and a command line runs the same checks in your pipeline. Diagrams stay in your project, next to the code.</p>
  <div class="cta">
    <a class="btn" href="guide/getting-started.html">Get started</a>
    <a class="btn quiet" href="guide/">Read the guide</a>
  </div>
  <p class="tools-line">Free. Every new machine gets 30 days of Pro, with nothing to sign up for.</p>
</section>

<figure class="shot">
  <img src="img/editor-overview.png" alt="A Camunda 8 diagram open in the editor, with a service task selected, its properties in the sidebar and the raw XML one tab away">
  <figcaption>A diagram open in the editor: the toolbar on top, the palette beside the canvas, the properties of the selected task in the sidebar, and the XML one tab away.</figcaption>
</figure>

<section class="band" id="install">
  <h2>Install it in your tool</h2>
  <p class="prose-note">The features, the licence and the trial are the same in all three.</p>
  <div class="cards install">
    <div class="card"><strong><a href="${STORES.jetbrains}">JetBrains IDEs</a></strong><span>Any JetBrains IDE from 2024.2. Open <span class="ui">Settings | Plugins | Marketplace</span>, search for <code>Penstock</code> and press <span class="ui">Install</span>. <a href="jetbrains/installing.html">More on installing</a>.</span></div>
    <div class="card"><strong><a href="${STORES.vscode}">VS Code</a></strong><span>Run <code>code --install-extension penstock.penstock</code>, or press Install on the <a href="${STORES.vscode}">Marketplace page</a>. <a href="vscode/installing.html">More on installing</a>.</span></div>
    <div class="card"><strong><a href="${STORES.npm}">Command line</a></strong><span>Run <code>npm install -g @kern0x1b/penstock-cli</code>, or try it once with <code>npx @kern0x1b/penstock-cli</code>. It needs ${NODE}. <a href="cli/">More on the command line</a>.</span></div>
  </div>
  <p class="prose-note">Then follow <a href="guide/getting-started.html">Get started</a>: from nothing installed to a checked, deployed process in about ten minutes.</p>
</section>

<section class="band" id="features">
  <h2>From drawing to running</h2>
  <p class="prose-note">One guide, written once. It describes the same editor in every tool.</p>
  <div class="cards">
    <a class="card" href="guide/bpmn-editor.html"><strong>Draw and edit</strong><span>Visual editors for BPMN, DMN and forms, with a properties panel for each engine. Every change is written to the file at once.</span></a>
    <a class="card" href="guide/diagram-check.html"><strong>Check your work</strong><span>Drawing problems, bpmnlint rules and, with Pro, how the process runs and where it can get stuck.</span></a>
    <a class="card" href="guide/scenarios.html"><strong>Test and run</strong><span>Plan every way through a process, run the test cases on a local engine, deploy in one click and watch the instances.</span></a>
    <a class="card" href="guide/code-links.html"><strong>Link diagrams and code</strong><span>Jump from a task to the worker that runs it, and back. Find the tasks nothing implements.</span></a>
    <a class="card" href="guide/migration.html"><strong>Share and move</strong><span>One offline HTML file to send. Import from draw.io, Visio, Signavio and Bizagi. Convert Camunda 7 to Camunda 8.</span></a>
    <a class="card" href="cli/"><strong>In your pipeline</strong><span>The same checks from a terminal or a pull request, and an MCP server for AI assistants.</span></a>
  </div>
</section>

<section class="band" id="plans">
  <h2>Free, Pro and Team</h2>
  <div class="prose">
    <p>Everything a modeller needs is free: the editors, the properties panels, the command palette, the sidebar, templates, token simulation, the check and its lint, deploy, Monitor, export, share and import.</p>
    <p><strong>Pro</strong> adds what only Penstock does: auto layout, flow analysis, code links, scenarios, the visual diagram diff, converting Camunda 7 to Camunda 8 and more. One rule decides which plan a feature needs: Pro on your machine, Team in a pipeline.</p>
    <p>Every machine starts with 30 days of Pro. The licence is a signed token that the plugin, the extension and the command line check offline.</p>
    ${priceSummaryHtml()}
    <p>Prices are per plan. Team is priced for each seat. <a href="guide/sign-in.html">How buying and signing in work</a>.</p>
    <div class="cta">
    ${buyLinksHtml({ primary: false })}
    </div>
    <p><a href="guide/plans.html">See exactly what each plan includes</a>. <a href="guide/security.html">See exactly what leaves your machine</a>: nothing but a deployment to your engine, and no telemetry.</p>
  </div>
</section>

<section class="band" id="requirements">
  <h2>Requirements and support</h2>
  <div class="table-wrap"><table class="facts">
    <tbody>
    <tr><td>VS Code</td><td>The extension <code>penstock.penstock</code>, for VS Code 1.88 or later.</td></tr>
    <tr><td>JetBrains IDEs</td><td>Any JetBrains IDE from 2024.2 with JCEF, which the standard downloads bundle: IntelliJ IDEA, WebStorm, PyCharm, GoLand, Rider and the rest.</td></tr>
    <tr><td>Engines</td><td>Camunda 7, Camunda 8, Operaton, CIB seven, and plain BPMN 2.0.</td></tr>
    <tr><td>Command line</td><td>${NODE}.</td></tr>
    <tr><td>Licence</td><td>Free, with 30 days of Pro on every new machine. One licence covers the JetBrains plugin, the VS Code extension and the command line. Read the <a href="license/">end user licence</a> and the <a href="notices/">third-party notices</a>.</td></tr>
    <tr><td>Bugs and requests</td><td><a href="${REPO}/issues">GitHub issues</a>. A <code>.bpmn</code> file that shows the problem saves the most time.</td></tr>
    <tr><td>Vulnerabilities</td><td>Reported privately. See <a href="${REPO}/blob/main/SECURITY.md">SECURITY.md</a>. Please do not open a public issue.</td></tr>
    <tr><td>Changelog</td><td><a href="${REPO}/blob/main/CHANGELOG.md">CHANGELOG.md</a></td></tr>
    </tbody>
  </table></div>
</section>

</div>
</main>`;

const prices = readPrices();
const offers = [
  {
    '@type': 'Offer',
    name: 'Free',
    price: '0',
    priceCurrency: 'USD',
  },
];
for (const plan of Object.values(prices.plans ?? {})) {
  for (const price of plan.prices ?? []) {
    const val = (price.amount / 100).toFixed(2);
    const intervalLabel = price.interval === 'month' ? 'Monthly' : price.interval === 'year' ? 'Yearly' : price.interval;
    offers.push({
      '@type': 'Offer',
      name: intervalLabel ? `${plan.name} (${intervalLabel})` : plan.name,
      price: val,
      priceCurrency: price.currency.toUpperCase(),
      ...(price.interval === 'month' ? { billingDuration: 'P1M' } : price.interval === 'year' ? { billingDuration: 'P1Y' } : {}),
    });
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Penstock',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers,
};

const html = shell({
  depth: 0,
  title: 'Penstock - BPMN, DMN and form editor for Camunda in JetBrains IDEs and VS Code',
  description: 'Penstock edits BPMN, DMN and forms for Camunda 7, Camunda 8, Operaton and CIB seven inside JetBrains IDEs and VS Code, with checks, deployment, tests, auto layout and a command line.',
  canonical: '',
  body,
  wrap: 'bare',
  section: 'home',
  jsonLd,
});

fs.writeFileSync(path.join(root, 'docs', 'index.html'), html);
console.log('wrote docs/index.html');

const missing = shell({
  depth: 0,
  title: 'Page not found - Penstock',
  description: 'This page does not exist.',
  canonical: '404.html',
  base: '/penstock-release/',
  wrap: 'bare',
  section: 'home',
  body: `<main id="content">
<div class="wide">
<section class="hero">
  <img class="mark" src="/penstock-release/icon.svg" alt="" width="48" height="48">
  <h1>This page does not exist.</h1>
  <p class="lede">The address may be old or mistyped. Every page of the guide is listed on the contents page.</p>
  <div class="cta">
    <a class="btn" href="/penstock-release/guide/">Open the guide</a>
    <a class="btn quiet" href="/penstock-release/">Go to the home page</a>
  </div>
</section>
</div>
</main>`,
});

fs.writeFileSync(path.join(root, 'docs', '404.html'), missing);
console.log('wrote docs/404.html');
