import fs from 'node:fs';
import path from 'node:path';
import { MARKETPLACE, REPO, root, shell, toolsRow } from './site.mjs';

const body = `<main id="content">
<div class="wide">

<section class="hero">
  <h1>BPMN diagrams, in the tools you already use.</h1>
  <p class="lede">Penstock edits BPMN, DMN and forms for Camunda 7, Camunda 8, Operaton and CIB seven, next to the raw XML. Diagrams stay in your project and in version control, so they are reviewed like code. It runs inside JetBrains IDEs, and a <code>penstock</code> command does the same checks in a pipeline.</p>
  <div class="cta">
    <a class="btn" href="guide/">Read the guide</a>
    <a class="btn quiet" href="${MARKETPLACE}">Install from JetBrains Marketplace</a>
    <span class="note">Any JetBrains IDE from 2025.2. Free, with 30 days of Pro on every new machine.</span>
  </div>
</section>

<figure class="shot" style="margin:0 0 32px">
  <img src="img/migration/02-check-card-camunda-8-section.png" alt="A BPMN collaboration open in the diagram editor inside IntelliJ IDEA">
  <figcaption>A diagram open in the editor, with the check card open and the XML one tab away.</figcaption>
</figure>

<section class="band" id="features">
  <h2>What it does</h2>
  <p class="prose-note">One guide, written once. It works the same in every tool.</p>
  <div class="cards">
    <a class="card" href="guide/bpmn-editor.html"><strong>Edit BPMN, DMN and forms</strong><span>Visual editors with a properties panel. Every change is written to the file at once.</span></a>
    <a class="card" href="guide/engine-profiles.html"><strong>Four engines</strong><span>Camunda 7, Camunda 8, Operaton and CIB seven, plus plain BPMN 2.0.</span></a>
    <a class="card" href="guide/diagram-check.html"><strong>Check every diagram</strong><span>Drawing problems, bpmnlint rules and, with Pro, how the process runs. Every rule has a page.</span></a>
    <a class="card" href="guide/deployment.html"><strong>Deploy in one click</strong><span>To the engine your <code>penstock.yaml</code> names. Secrets stay in the secret store of your tool.</span></a>
    <a class="card" href="guide/auto-layout.html"><strong>Auto layout</strong><span>Draw a messy diagram again, left to right, in one click. Undo takes it back.</span></a>
    <a class="card" href="guide/scenarios.html"><strong>Scenarios</strong><span>Run the diagram's scenarios on a local engine and see every step.</span></a>
    <a class="card" href="guide/code-links.html"><strong>Link diagrams and code</strong><span>Jump from a task to its worker and back. Find tasks nothing implements.</span></a>
    <a class="card" href="guide/migration.html"><strong>Camunda 7 to 8</strong><span>See what does not carry over, convert, and write a report to hand on.</span></a>
    <a class="card" href="guide/share-html.html"><strong>Share and import</strong><span>One offline HTML file to send. Bring in draw.io, Visio, Signavio and Bizagi files.</span></a>
    <a class="card" href="cli/"><strong>A command line</strong><span>The same checks in a terminal, a pull request comment and an MCP server for AI assistants.</span></a>
  </div>
</section>

<section class="band" id="tools">
  <h2>Pick your tool</h2>
  ${toolsRow('')}
</section>

<section class="band" id="start">
  <h2>Start in five minutes</h2>
  <ol class="steps prose">
    <li><strong>Get Penstock.</strong> In a JetBrains IDE, install the plugin from the Marketplace (<a href="jetbrains/installing.html">Installing</a>). On the command line, run <code>npx @penstock/cli</code> (<a href="cli/">Command line</a>).</li>
    <li><strong>Open a <code>.bpmn</code> file.</strong> It opens in the diagram editor, and the XML is one tab away.</li>
    <li><strong>Or try the example.</strong> Write it into an empty folder. See <a href="guide/example-project.html">The example project</a>.</li>
    <li><strong>Press Check.</strong> It lists what is wrong and how to fix it.</li>
    <li><strong>Press Deploy.</strong> Give it your engine address once.</li>
  </ol>
</section>

<section class="band" id="plans">
  <h2>Free, Pro and Team</h2>
  <div class="prose">
    <p>Everything a modeller needs is free: the editors, the properties panels, templates, token simulation, the check, lint, deploy, Monitor, export, share and import. <strong>Pro</strong> adds what only Penstock does: auto layout, flow analysis, code links, running test cases, the visual diagram diff and more. One rule decides which plan a feature needs: Pro on your machine, Team in a pipeline. Every machine starts with 30 days of Pro.</p>
    <p><a href="guide/plans.html">See exactly what each plan includes</a>. <a href="guide/security.html">See exactly what leaves your machine</a>: nothing but a deployment to your engine, and no telemetry.</p>
  </div>
</section>

<section class="band" id="requirements">
  <h2>Requirements and support</h2>
  <div class="table-wrap"><table class="facts">
    <tbody>
    <tr><td>JetBrains IDEs</td><td>Any JetBrains IDE from 2025.2 with JCEF, which the standard downloads bundle: IntelliJ IDEA, WebStorm, PyCharm, GoLand, Rider and the rest.</td></tr>
    <tr><td>Engines</td><td>Camunda 7, Camunda 8, Operaton, CIB seven, and plain BPMN 2.0.</td></tr>
    <tr><td>Command line</td><td>Node.js 20.19 or later.</td></tr>
    <tr><td>Licence</td><td>Free on the JetBrains Marketplace. Read the <a href="license/">end user licence</a> and the <a href="notices/">third-party notices</a>.</td></tr>
    <tr><td>Bugs and requests</td><td><a href="${REPO}/issues">GitHub issues</a>. A <code>.bpmn</code> file that shows the problem saves the most time.</td></tr>
    <tr><td>Vulnerabilities</td><td>Reported privately. See <a href="${REPO}/blob/main/SECURITY.md">SECURITY.md</a>. Please do not open a public issue.</td></tr>
    <tr><td>Changelog</td><td><a href="${REPO}/blob/main/CHANGELOG.md">CHANGELOG.md</a></td></tr>
    </tbody>
  </table></div>
</section>

</div>
</main>`;

const html = shell({
  depth: 0,
  title: 'Penstock - BPMN editor for Camunda in JetBrains IDEs',
  description: 'Penstock edits BPMN, DMN and forms for Camunda 7, Camunda 8, Operaton and CIB seven inside JetBrains IDEs, with checks, deployment, tests, auto layout and a command line.',
  canonical: '',
  body,
  wrap: 'bare',
  section: 'home',
});

fs.writeFileSync(path.join(root, 'docs', 'index.html'), html);
console.log('wrote docs/index.html');

const missing = shell({
  depth: 0,
  title: 'Page not found - Penstock',
  description: 'This page does not exist.',
  canonical: '404.html',
  wrap: 'bare',
  section: 'home',
  body: `<main id="content">
<div class="wide">
<section class="hero">
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
