# Penstock

**Penstock** is a BPMN 2.0 editor for Camunda 7 and Camunda 8 that runs inside JetBrains IDEs.
Files with the `.bpmn` and `.bpmn20.xml` extensions open in a visual modeler next to the raw XML,
so process models live in the project and are reviewed the same way as code.

Install it from the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/25710-camunda-bpmn-editor).

Penstock was published as **Camunda BPMN Editor** until 2026. Same plugin, same vendor, new name —
it updates in place and nothing needs to be reinstalled.

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
The font, JetBrains Mono, is in `docs/fonts` with its SIL Open Font License.

The look follows the product: its own colours for light and dark, JetBrains Mono, a 4px grid and no
frames. `docs/style.css` is the only stylesheet.

The HTML is generated and committed, so the site can be served as it is. The guide pages are written
as fragments in `tools/pages/`, one file per page. `tools/nav.json` is the one list of pages: it
makes the sidebar, the previous and next links and the contents page. After changing a fragment, the
list or the shell in `tools/site.mjs`, regenerate:

```bash
node tools/build-guide.mjs        # docs/guide/*.html from tools/pages
node tools/build-home.mjs         # docs/index.html
node tools/build-legal-pages.mjs  # docs/license and docs/notices, from LICENSE and THIRD-PARTY-NOTICES.md
node tools/build-rules.mjs <path to the product's docs/rules>   # docs/rules
node tools/check-site.mjs         # every internal link and image resolves, no external loads, no em dashes
node tools/check-site.mjs --release   # the same, and it fails while prices or checkout are not ready to publish
```

The rule pages are generated from the product's `docs/rules`, which the product generates from its
rule catalogue. The product links to `https://kern0x1b.github.io/penstock-release/rules/<rule>`, so
those addresses must keep working.

`docs/guide/TODO-screenshots.md` lists the pages that still need a picture, and the pictures to retake.

### Prices and the Buy buttons

The Plans page shows the real prices and a Buy button for each plan. Nothing on the site talks to
Polar's API, and the browser never sees the access token: the prices are read when the site is
generated and written to `tools/prices.json`, which holds no secret and is committed.

```bash
# read the prices from Polar, write tools/prices.json, and generate the pages
POLAR_ACCESS_TOKEN=polar_oat_... node tools/build-guide.mjs
# or only read the prices
POLAR_ACCESS_TOKEN=polar_oat_... node tools/fetch-prices.mjs
```

- `POLAR_ACCESS_TOKEN`: an organisation access token that may read products and checkout links.
  Keep it in your shell or your secret store. It is never written to a file.
- `POLAR_API_URL`: optional. By default the `api` of the product's `licensing.json`.
- `PENSTOCK_LICENSING`: optional path to that file. By default
  `../jetbrains-bpmn-editor/webview/cli/licensing.json`, next to this repository. It gives the
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

Open an [issue](../../issues/new/choose). Include the IDE and plugin version, the engine you are
targeting, and a `.bpmn` file that reproduces the behaviour — that last one saves the most time.

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
