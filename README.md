# Penstock

<img src="docs/icon.svg" alt="Penstock" width="64" height="64">

**Penstock** is a BPMN 2.0, DMN and form editor for Camunda 7 and Camunda 8 that runs inside JetBrains IDEs
and in VS Code, in a plain browser (`penstock web`) and, as a build that is not part of a release yet,
as a desktop app. A `penstock` command line and an MCP server work on the same engine and the same licence.
Files with the `.bpmn`, `.bpmn.xml` and `.bpmn20.xml` extensions open in a visual modeler next to the raw XML, and
`.dmn` and `.form` files open in the decision and form editors, so process models live in the project and are
reviewed the same way as code. An AI agent of your choice can be asked about a diagram or given a task from an input
in every editor, on your own account, with every change shown before it happens.

Install it from the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor), the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=penstock.penstock) or [npm](https://www.npmjs.com/package/@kern0x1b/penstock-cli) (`npm install -g @kern0x1b/penstock-cli`).

Penstock was published as **Camunda BPMN Editor** until 2026. Same plugin, same vendor, new name.
It updates in place and nothing needs to be reinstalled.

## What this repository is

Penstock is a closed-source commercial product; its source code is not published here. This
repository exists so that the things users need are public and permanent:

| | |
|---|---|
| [penstock site](https://kern0x1b.github.io/penstock-release/) | What the plugin does and how to set it up |
| [Issues](../../issues) | Bug reports and feature requests |
| [LICENSE](LICENSE) | The end-user license agreement |
| [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) | Licenses of the bundled open-source components |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [SECURITY.md](SECURITY.md) | How to report a vulnerability |

## The site

The pages under `docs/` are served by GitHub Pages at
<https://kern0x1b.github.io/penstock-release/>. Plain HTML and one stylesheet. There is no build
step on the server: no scripts, no fonts or code from other sites, nothing that tracks visitors.
The fonts are in `docs/fonts` with their SIL Open Font Licences: Inter for text and headings,
JetBrains Mono for code and the keys and menus the guide names.

The colours follow the product, in light and dark by the visitor's system. Text is set for reading:
Inter at 17px with a 62 character measure, a 4px grid and no frames. `docs/style.css` is the only
stylesheet.

### How the documentation is organised

The site is organised by what a thing is, not by where it runs.

| Address | What it holds | Source |
|---|---|---|
| `/guide/` | The **core guide**: every feature that behaves the same in every tool. Written once, in host-neutral words ("the editor", "the More menu"), with no IDE menu paths or shortcuts in the body. | `tools/pages/guide/` |
| `/jetbrains/` | The JetBrains host: install from the Marketplace, where things are in the IDE, the tool window, settings and the AI agents page, code links, tests, shortcuts, licence. | `tools/pages/jetbrains/` |
| `/cli/` | The command line host: install, every command, pipelines, the MCP server. | `tools/pages/cli/` |
| `/vscode/` | The VS Code host: install, where things are, shortcuts, code links, licence. | `tools/pages/vscode/` |
| `/desktop/` | A slot that is ready but empty. It is not in any navigation until it is switched on. | `tools/pages/desktop/` |
| `/rules/` | One page for every rule, generated from the product. The product links to these addresses. | `tools/build-rules.mjs` |

`tools/nav.json` is the one list. It has one entry per section (`guide`, `jetbrains`, `cli`, `vscode`,
`desktop`) with its groups and pages. It makes the sidebar, the previous and next links, the contents
pages and the "Pick your tool" row. A page is a fragment, one file, in `tools/pages/<section>/<slug>.html`.
Its first lines are a comment with `title`, `lede` and optional `tags`, `needs` and `related`. In a page:

- `@guide/x.html`, `@jetbrains/x.html`, `@cli/x.html`, `@rules/x` and `@img/x.png` are links that work from any section.
- `{{contents}}` lists the section's pages as cards, and `{{tools}}` is the "Pick your tool" row.

**Per-tool blocks.** Where a core page has a step that depends on the tool, it holds a slot:
`{{host:scenarios-open|Open the Scenarios panel}}`. The generator draws it as one short block with a
labelled card for every tool that is switched on. The text of a card is not in the core page. It is in
`tools/blocks/<tool>/<slot>.html`. A card for a feature that does not exist in a tool is a file that only says
why:

```html
<!--
unavailable: The command line has no editor. Use penstock show instead.
-->
```

If a tool that is switched on has no file for a slot, the build stops and lists every missing file. So a
new tool never leaves a hole, and it never needs a change in a core page.

### Add a tool (a desktop app)

1. Write its pages in `tools/pages/desktop/` (at least `index.html`), the way `tools/pages/jetbrains/` and `tools/pages/vscode/` do.
2. In `tools/nav.json`, in the section `desktop`: put the page list under `groups`, and set `"enabled": true`.
   That one entry is the whole navigation change. The top bar, the footer, the sidebar, the contents pages and the
   "Pick your tool" row pick it up, and the "coming" card turns into a link.
3. Run `node tools/list-blocks.mjs desktop`. It prints every slot the core guide has and the file each one still needs.
4. Write those files in `tools/blocks/desktop/`. Use `unavailable:` where the tool lacks the feature.
5. `node tools/build-pages.mjs`, then `node tools/check-site.mjs`.

`check-site.mjs` also fails when a core guide page contains tool-specific words (IDE, tool window, gutter,
Cmd, Ctrl, Settings paths, JetBrains) outside a block. That keeps the core host-neutral.

### Generating

The HTML is generated and committed, so the site can be served as it is. After changing a fragment,
`tools/nav.json` or the shell in `tools/site.mjs`, regenerate:

```bash
node tools/build-pages.mjs        # every section: docs/guide, docs/jetbrains, docs/vscode, docs/cli (and later docs/desktop)
node tools/build-home.mjs         # docs/index.html and docs/404.html
node tools/build-legal-pages.mjs  # docs/license and docs/notices, from LICENSE and THIRD-PARTY-NOTICES.md
node tools/build-rules.mjs [path to the product repository]   # docs/rules: every rule page and the index
node tools/list-blocks.mjs [tool] # which per-tool blocks exist, and which a tool still needs
node tools/check-site.mjs         # every internal link and image resolves, no external loads, no em dashes
node tools/check-site.mjs --release   # the same, and it fails while prices or checkout are not ready to publish
```

`docs/guide/cli.html` is a redirect stub (a plain `meta refresh`, no script) to `/cli/`. Redirects are listed in
`tools/nav.json` under `redirects`.

To rebuild every page of the site with one command (the product repository is read, never changed):

```bash
env -u POLAR_ACCESS_TOKEN node tools/build-all.mjs /path/to/jetbrains-bpmn-editor
```

The path can also be set as `PENSTOCK_PRODUCT`; by default it is `../jetbrains-bpmn-editor`.

The rule pages are generated from the product's rule catalogue. `tools/build-rules.mjs` runs the product's
`libs/core/scripts/generate-rule-docs.ts` into a temporary folder, wraps each page in the site shell
and builds the index, then removes the folder. The product keeps no pages. The product links to `https://kern0x1b.github.io/penstock-release/rules/<rule>`, so
those addresses must keep working.

`tools/screenshot-plan.md` lists every picture the guide still needs, with the fixture and the UI state for each.

### Prices and the Buy buttons

The Plans page shows the real prices and a Buy button for each plan. Nothing on the site talks to
Polar's API, and the browser never sees the access token: the prices are read when the site is
generated and written to `tools/prices.json`, which holds no secret and is committed.

```bash
# read the prices from Polar, write tools/prices.json, and generate the pages
POLAR_ACCESS_TOKEN=polar_oat_... node tools/build-pages.mjs
# or only read the prices
POLAR_ACCESS_TOKEN=polar_oat_... node tools/fetch-prices.mjs
```

- `POLAR_ACCESS_TOKEN`: an organisation access token that may read products and checkout links.
  Keep it in your shell or your secret store. It is never written to a file.
- `POLAR_API_URL`: optional. By default the `api` of the product's `licensing.json`.
- `PENSTOCK_LICENSING`: optional path to that file. By default
  `../jetbrains-bpmn-editor/libs/core/src/node/licensing.json`, next to this repository. It gives the
  organisation id and the two checkout links (`pro`, `team`).
- Without the token the pages are generated from the `tools/prices.json` that is committed. The page
  shows currency, billing interval, plan and the date the prices were read.
- For each plan the prices are the fixed prices of the products behind its checkout link. If a link
  cannot be read, the organisation's products are matched by name (Pro, Team).
- `node --test tools/test-prices.mjs` tests this against a local stand-in for the API.

A Buy button is a plain link to the plan's Polar checkout link, so it works without JavaScript.
`tools/checkout.json` can switch on Polar's embedded checkout, which opens the checkout in a frame
over the page. The script (`@polar-sh/checkout`, Apache-2.0) is vendored in `docs/vendor/polar-checkout`
and is served from this site. Update it with `node tools/vendor-polar-embed.mjs [version]`. The embed
follows `prefers-color-scheme` with two buttons, one per theme, and no extra script.

> **Before publishing.** The product's licensing settings still point at Polar's sandbox, so
> `tools/prices.json` and the Buy links do too, and the page says so ("Test mode"). Publishing needs
> the production API URL, organisation id and checkout links in the product's `licensing.json`, and a
> production access token to read the prices. Polar also refuses to embed a checkout on an origin
> that is not on the organisation's allowed list (`EmbedHostNotAllowed`), so the embed stays off
> (`"embed": false`) until `https://kern0x1b.github.io` is allowed in Polar. `node tools/check-site.mjs`
> prints a warning for each of these, and `node tools/check-site.mjs --release` fails while any remain.

## Reporting a problem

Open an [issue](../../issues/new/choose). Include the tool (the IDE, VS Code or the command line) and its version,
the Penstock version, the engine you are targeting, and a `.bpmn` file that reproduces the behaviour. That last one saves the most time.

For anything security-related, do not open an issue; see [SECURITY.md](SECURITY.md).

## Third-party components

Penstock bundles open-source components that remain under their own licenses, reproduced in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) together with a written source offer for the
LGPL-licensed ones. The same file ships inside the plugin and is viewable from
**Settings | Tools | Penstock | About | Open source licenses**.

## Trademarks

Penstock is an independent product. It is not affiliated with, endorsed by, or sponsored by
Camunda Services GmbH. "Camunda" and "BPMN" are used only to describe the process engines and the
notation the plugin works with. Camunda is a trademark of Camunda Services GmbH; BPMN is a
trademark of the Object Management Group.
