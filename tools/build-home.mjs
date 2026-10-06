import fs from 'node:fs';
import path from 'node:path';
import { REPO, STORES, root, shell, toolsRow } from './site.mjs';
import { buyLinksHtml, priceSummaryHtml } from './plans.mjs';
import { readPrices } from './fetch-prices.mjs';

const NODE = 'Node.js 22.22.2 or later in 22, 24.15.0 or later in 24, or 26 and later';

const body = `<main id="content">
<div class="wide">

<section class="hero">
  <img class="mark" src="icon.svg" alt="" width="48" height="48">
  <h1>BPMN diagrams, in the tools you already use.</h1>
  <p class="lede">Penstock edits BPMN, DMN and forms for Camunda 7, Camunda 8, Operaton and CIB seven, next to the raw XML. Diagrams stay in your project and in version control, so they are reviewed like code. It runs inside JetBrains IDEs, and a <code>penstock</code> command does the same checks in a pipeline.</p>
  <div class="cta">
    <a class="btn" href="guide/">Read the guide</a>
    <a class="btn quiet" href="#install">Install</a>
    ${buyLinksHtml({ primary: false })}
    <span class="note">Any JetBrains IDE from 2024.2. Free, with 30 days of Pro on every new machine.</span>
  </div>
</section>

<figure class="shot">
  <img src="img/editor-overview.png" alt="A Camunda 8 diagram open in the editor, with a service task selected, its properties in the sidebar and the raw XML one tab away">
  <figcaption>A diagram open in the editor: the toolbar on top, the palette beside the canvas, the properties of the selected task in the sidebar, and the XML one tab away.</figcaption>
</figure>

<section class="band" id="features">
  <h2>What it does</h2>
  <p class="prose-note">One guide, written once. It works the same in every tool.</p>
  <div class="cards">
    <a class="card" href="guide/bpmn-editor.html"><strong>Edit BPMN, DMN and forms</strong><span>Visual editors with a properties panel. Every change is written to the file at once.</span></a>
    <a class="card" href="guide/engine-profiles.html"><strong>Five engines</strong><span>Camunda 7, Camunda 8, Operaton and CIB seven, plus Classic BPMN 2.0.</span></a>
    <a class="card" href="guide/sidebar.html"><strong>One sidebar</strong><span>Properties, scenarios, problems, comments, Monitor and code, beside the canvas in every editor.</span></a>
    <a class="card" href="guide/toolbar.html"><strong>A toolbar you arrange</strong><span>Every action in one searchable palette, with a pin that puts it on the bar or takes it off.</span></a>
    <a class="card" href="guide/diagram-check.html"><strong>Check every diagram</strong><span>Drawing problems, bpmnlint rules and, with Pro, how the process runs. Every check has a page.</span></a>
    <a class="card" href="guide/deployment.html"><strong>Deploy in one click</strong><span>One popover, then one click, to the engine your <code>penstock.yaml</code> names. Secrets stay in the secret store of your tool.</span></a>
    <a class="card" href="guide/auto-layout.html"><strong>Auto layout</strong><span>Draw a messy diagram again, left to right, in one click. Undo takes it back.</span></a>
    <a class="card" href="guide/scenarios.html"><strong>Scenarios</strong><span>Plan every way through a process, then run the test cases on a local engine and see every step.</span></a>
    <a class="card" href="guide/code-links.html"><strong>Link diagrams and code</strong><span>Jump from a task to its worker and back. Find tasks nothing implements.</span></a>
    <a class="card" href="guide/migration.html"><strong>Camunda 7 to 8</strong><span>See what does not carry over, convert, and write a report to hand on.</span></a>
    <a class="card" href="guide/share-html.html"><strong>Share and import</strong><span>One offline HTML file to send. Bring in draw.io, Visio, Signavio and Bizagi files.</span></a>
    <a class="card" href="cli/"><strong>A command line</strong><span>The same checks in a terminal, a pull request comment and an MCP server for AI assistants.</span></a>
  </div>
</section>

<section class="band" id="install">
  <h2>Install Penstock</h2>
  <p class="prose-note">Pick the tool you use. All three share one licence and one trial.</p>
  <div class="cards install">
    <div class="card"><strong><a href="${STORES.jetbrains}">JetBrains IDEs</a></strong><span>Any JetBrains IDE from 2024.2. Open <span class="ui">Settings | Plugins | Marketplace</span>, search for <code>Penstock</code> and press <span class="ui">Install</span>. <a href="jetbrains/installing.html">Installing</a>.</span></div>
    <div class="card"><strong><a href="${STORES.vscode}">VS Code</a></strong><span>Run <code>code --install-extension penstock.penstock</code>, or install it from the <a href="${STORES.vscode}">Marketplace page</a>.</span></div>
    <div class="card"><strong><a href="${STORES.npm}">Command line</a></strong><span>Run <code>npm install -g @kern0x1b/penstock-cli</code>, or try it once with <code>npx @kern0x1b/penstock-cli</code>. It needs ${NODE}. <a href="cli/">Command line</a>.</span></div>
  </div>
  <p class="prose-note">Then <a href="guide/getting-started.html">get started</a>. Every new machine has 30 days of Pro, so you can try everything before you buy.</p>
</section>

<section class="band" id="tools">
  <h2>Pick your tool</h2>
  ${toolsRow('')}
</section>

<section class="band" id="start">
  <h2>Start in five minutes</h2>
  <ol class="steps prose">
    <li><strong>Get Penstock.</strong> In a JetBrains IDE, install the plugin from the Marketplace (<a href="jetbrains/installing.html">Installing</a>). On the command line, run <code>npx @kern0x1b/penstock-cli</code> (<a href="cli/">Command line</a>). In VS Code, run <code>code --install-extension penstock.penstock</code>.</li>
    <li><strong>Open a <code>.bpmn</code> file.</strong> It opens in the diagram editor, and the XML is one tab away. Only an empty new diagram asks which engine it is for.</li>
    <li><strong>Or try the example.</strong> Write it into an empty folder. See <a href="guide/example-project.html">The example project</a>.</li>
    <li><strong>Press Check.</strong> It lists what is wrong and how to fix it.</li>
    <li><strong>Press Deploy.</strong> Read the popover, give it your engine address once, and press Deploy in it.</li>
  </ol>
</section>

<section class="band" id="plans">
  <h2>Free, Pro and Team</h2>
  <div class="prose">
    <p>Everything a modeller needs is free: the editors, the properties panels, the command palette, the sidebar, templates, token simulation, the check and its lint, deploy, Monitor, export, share and import. <strong>Pro</strong> adds what only Penstock does: auto layout, flow analysis, code links, scenarios, the visual diagram diff, converting Camunda 7 to Camunda 8 and more. One rule decides which plan a feature needs: Pro on your machine, Team in a pipeline. Every machine starts with 30 days of Pro, and the licence is a signed token the plugin, the command line and the editor check offline.</p>
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
  title: 'Penstock - BPMN editor for Camunda in JetBrains IDEs',
  description: 'Penstock edits BPMN, DMN and forms for Camunda 7, Camunda 8, Operaton and CIB seven inside JetBrains IDEs, with checks, deployment, tests, auto layout and a command line.',
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
