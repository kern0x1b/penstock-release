import fs from 'node:fs';
import path from 'node:path';
import { CONFIG, CONTACT, REPO, SITE, STORES, VENDOR, root, shell } from './site.mjs';
import { checkoutUrl } from './plans.mjs';
import { NODE, priceText } from './build-site-pages.mjs';
import { readPrices } from './fetch-prices.mjs';

const proof = [CONFIG.facts?.jetbrainsDownloads ? `${CONFIG.facts.jetbrainsDownloads} downloads on the JetBrains Marketplace` : '', 'No telemetry', 'Camunda 7, Camunda 8, Operaton, CIB seven'].filter(Boolean);

const price = (tier, interval) => priceText(tier, interval);

const body = `<main id="content">
<div class="wide">

<section class="hero">
  <p class="eyebrow">Formerly Camunda BPMN Editor. Same plugin, same installs, new name.</p>
  <h1>The BPMN editor that lives in your IDE.</h1>
  <p class="lede">Draw, check, test and deploy BPMN, DMN and forms for Camunda 7 and 8, next to your code. Free to use, with no time limit. Pro if you want more.</p>
  <div class="cta">
    <a class="btn" href="${STORES.jetbrains}">Install for JetBrains</a>
    <a class="btn" href="${STORES.vscode}">Install for VS Code</a>
    <a class="btn quiet" href="${STORES.npm}">npm i -g CLI</a>
  </div>
  <p class="tools-line">Works in IntelliJ IDEA, WebStorm, PyCharm, GoLand, Rider and VS Code, and on the command line. <a href="install/">All install options</a> | <a href="pricing/">Pricing</a> | <a href="guide/getting-started.html">Ten-minute quick start</a></p>
  <p class="tools-line">${proof.join(' | ')}</p>
</section>

<figure class="shot" id="demo">
  <img src="img/editor-overview.png" alt="A Camunda 8 diagram open in the editor, with a service task selected, its properties in the sidebar and the raw XML one tab away">
  <figcaption>Open a .bpmn file, run Check, deploy to a local engine. No window switching. The toolbar on top, the palette beside the canvas, the properties of the selected task in the sidebar, and the XML one tab away.</figcaption>
</figure>

<section class="band" id="plans">
  <h2>Free, with no time limit. Pro when you want more.</h2>
  <p class="prose-note">Everything you need to model, check and deploy is free. Pro adds what only Penstock does.</p>
  <div class="cards">
    <div class="card"><strong>Free</strong><span>Visual BPMN, DMN and form editors. Properties panels for each engine. Check and bpmnlint. Deploy and Monitor. Token simulation. Visual diagram diff. Export, share and import. Camunda 7 to 8 analysis. MCP tools that list, show and check.</span></div>
    <div class="card"><strong>Pro, ${price('pro', 'month')} a month or ${price('pro', 'year')} a year</strong><span>Auto layout. Flow analysis. Code links. Scenarios and test-case runs. Camunda 7 to 8 conversion. Sending messages in the AI chat. MCP tools that analyse and edit.</span></div>
    <div class="card"><strong>Team, ${price('team', 'month')} per seat a month</strong><span>Everything in Pro, inside your pipeline as well: the review bot on pull requests, reports, baselines and SARIF.</span></div>
  </div>
  <p class="prose-note">Every new machine starts with 30 days of Pro. No sign-up, no card. <a href="pricing/">See the full comparison, refunds and VAT</a>. <a href="pricing/#if-you-used-the-old-plugin">Used Camunda BPMN Editor before?</a></p>
</section>

<section class="band" id="tasks">
  <h2>What do you want to do?</h2>
  <div class="cards">
    <a class="card" href="guide/migration.html"><strong>Move from Camunda 7 to 8</strong><span>See what does not carry over, convert, and get a report. The analysis is free.</span></a>
    <a class="card" href="cli/ci.html"><strong>Check BPMN on every pull request</strong><span>The free check in GitHub, GitLab, Azure, Bitbucket and Gitea pipelines.</span></a>
    <a class="card" href="cli/mcp.html"><strong>Let your AI assistant read diagrams</strong><span>An MCP server for AI assistants, and an AI chat in the editors with the agent of your choice.</span></a>
    <a class="card" href="for-teams/"><strong>Review diagrams as a team</strong><span>A review bot, pull request reports, baselines and SARIF.</span></a>
    <a class="card" href="guide/scenarios.html"><strong>Test a process</strong><span>Plan every way through a process and run the test cases on a local engine.</span></a>
    <a class="card" href="guide/code-links.html"><strong>Link diagrams and code</strong><span>Jump from a task to the worker that runs it, and back.</span></a>
  </div>
</section>

<section class="band" id="install">
  <h2>Install it in your tool</h2>
  <p class="prose-note">The features, the licence and the trial are the same in all three.</p>
  <div class="cards install">
    <div class="card"><strong><a href="${STORES.jetbrains}">JetBrains IDEs</a></strong><span>Any JetBrains IDE from 2023.1. Open <span class="ui">Settings | Plugins | Marketplace</span>, search for <code>Penstock</code> and press <span class="ui">Install</span>. <a href="jetbrains/quick-start.html">Quick start</a>.</span></div>
    <div class="card"><strong><a href="${STORES.vscode}">VS Code</a></strong><span>Run <code>code --install-extension penstock.penstock</code>, or press Install on the <a href="${STORES.vscode}">Marketplace page</a>. <a href="vscode/quick-start.html">Quick start</a>.</span></div>
    <div class="card"><strong><a href="${STORES.npm}">Command line</a></strong><span>Run <code>npm install -g @kern0x1b/penstock-cli</code>, or try it once with <code>npx @kern0x1b/penstock-cli</code>. It needs ${NODE}. <a href="cli/quick-start.html">Quick start</a>.</span></div>
  </div>
  <p class="prose-note">Then follow <a href="guide/getting-started.html">Get started</a>: from nothing installed to a checked, deployed process in about ten minutes. <a href="install/">All install options</a>.</p>
</section>

<section class="band" id="trust">
  <h2>What you can rely on</h2>
  <div class="cards">
    <a class="card" href="guide/security.html"><strong>No telemetry</strong><span>Nothing leaves your machine except a deployment to your own engine, the licence check and, if you use it, your AI agent.</span></a>
    <a class="card" href="guide/sign-in.html"><strong>Licence checked offline</strong><span>One signed token, three machines, and it keeps working for up to 30 days without a connection.</span></a>
    <a class="card" href="about/"><strong>Independent</strong><span>Made by one person, and not affiliated with Camunda.</span></a>
  </div>
</section>

<section class="band" id="faq">
  <h2>Questions</h2>
  <div class="prose">
    <details class="faq"><summary>What happened to Camunda BPMN Editor?</summary>
    <p>It was renamed Penstock in 2026. It is the same plugin from the same author, so it updates in place and nothing needs to be reinstalled.</p></details>
    <details class="faq"><summary>Is it really free?</summary>
    <p>Yes, with no time limit. The editors, check, deploy, Monitor, token simulation, export and import are free. Pro and Team are optional.</p></details>
    <details class="faq"><summary>What happens after the 30-day trial?</summary>
    <p>The machine goes back to Free. Nothing is deleted, and a Pro feature asks you to buy when you reach it.</p></details>
    <details class="faq"><summary>Does it send my diagrams anywhere?</summary>
    <p>No. A diagram goes only to the engine you deploy to, and to the AI agent you choose if you use the AI chat. There is no telemetry.</p></details>
    <p><a href="faq/">More questions</a></p>
  </div>
</section>

<section class="band" id="requirements">
  <h2>Requirements and support</h2>
  <div class="table-wrap"><table class="facts">
    <tbody>
    <tr><td>VS Code</td><td>The extension <code>penstock.penstock</code>, for VS Code 1.88 or later.</td></tr>
    <tr><td>JetBrains IDEs</td><td>Any JetBrains IDE from 2023.1 with JCEF, which the standard downloads bundle: IntelliJ IDEA, WebStorm, PyCharm, GoLand, Rider and the rest.</td></tr>
    <tr><td>Engines</td><td>Camunda 7, Camunda 8, Operaton, CIB seven, Flowable, Activiti and plain BPMN 2.0.</td></tr>
    <tr><td>Command line</td><td>${NODE}.</td></tr>
    <tr><td>Licence</td><td>Free, with 30 days of Pro on every new machine. One licence covers the JetBrains plugin, the VS Code extension and the command line. Read the <a href="license/">end user licence</a>, the <a href="terms/">terms</a> and the <a href="notices/">third-party notices</a>.</td></tr>
    <tr><td>Bugs and requests</td><td><a href="${CONTACT.issues}">GitHub issues</a>. A <code>.bpmn</code> file that shows the problem saves the most time.</td></tr>
    <tr><td>Questions</td><td><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></td></tr>
    <tr><td>Vulnerabilities</td><td>Reported privately. See <a href="${REPO}/blob/main/SECURITY.md">SECURITY.md</a>. Please do not open a public issue.</td></tr>
    <tr><td>Changelog</td><td><a href="${REPO}/blob/main/CHANGELOG.md">CHANGELOG.md</a></td></tr>
    </tbody>
  </table></div>
</section>

<section class="band" id="try">
  <h2>Try it on your own diagram.</h2>
  <div class="cta">
    <a class="btn" href="${STORES.jetbrains}">Install for JetBrains</a>
    <a class="btn" href="${STORES.vscode}">Install for VS Code</a>
    <a class="btn quiet" href="pricing/">Pricing</a>
  </div>
</section>

</div>
</main>`;

const prices = readPrices();
const offers = [{ '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }];
for (const plan of Object.values(prices.plans ?? {})) {
  for (const entry of plan.prices ?? []) {
    offers.push({
      '@type': 'Offer',
      name: `${plan.name}, ${entry.interval === 'month' ? 'monthly' : 'yearly'}${plan.seat ? ', per seat' : ''}`,
      price: (entry.amount / 100).toFixed(2),
      priceCurrency: entry.currency.toUpperCase(),
      availability: 'https://schema.org/InStock',
      url: checkoutUrl(prices, plan),
    });
  }
}

const publisher = { '@type': 'Person', name: VENDOR.name, url: `${SITE}/about/` };
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Penstock',
      alternateName: ['Camunda BPMN Editor'],
      url: `${SITE}/`,
      description: 'BPMN, DMN and form editor for Camunda 7 and Camunda 8 inside JetBrains IDEs and VS Code, with a command line for pipelines.',
      image: `${SITE}/og-image.png`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux',
      softwareRequirements: `JetBrains IDE 2023.1 or later, VS Code 1.88 or later, ${NODE}`,
      installUrl: STORES.jetbrains,
      downloadUrl: STORES.vscode,
      publisher,
      offers,
    },
    { '@type': 'WebSite', name: 'Penstock', url: `${SITE}/`, publisher },
  ],
};

const html = shell({
  depth: 0,
  title: 'Penstock: BPMN and DMN editor for Camunda in your IDE',
  description: 'Edit, check and deploy BPMN, DMN and forms for Camunda 7 and 8 inside IntelliJ and VS Code. Free to use with no time limit, with an optional Pro plan.',
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
