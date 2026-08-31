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
<https://kern0x1b.github.io/penstock-release/>. Plain HTML and one stylesheet, no build step.

`docs/license/` and `docs/notices/` are generated from `LICENSE` and `THIRD-PARTY-NOTICES.md`.
Regenerate them after changing either source file, so the site cannot drift from the shipped text:

```bash
node tools/build-legal-pages.mjs
```

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
