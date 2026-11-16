# Penstock

<img src="https://getpenstock.com/icon.svg" alt="Penstock" width="64" height="64">

**Penstock** is a BPMN 2.0, DMN and form editor for Camunda 7 and Camunda 8 that runs inside JetBrains IDEs
and in VS Code, and in a plain browser (`penstock web`). A `penstock` command line and an MCP server work on the same engine and the same licence.
Files with the `.bpmn`, `.bpmn.xml` and `.bpmn20.xml` extensions open in a visual modeler next to the raw XML, and
`.dmn` and `.form` files open in the decision and form editors, so process models live in the project and are
reviewed the same way as code. An AI agent of your choice can be asked about a diagram or given a task from an input
in every editor, on your own account, with every change shown before it happens.

Install it from the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/25710-penstock), the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=penstock.penstock) or [npm](https://www.npmjs.com/package/@kern0x1b/penstock-cli) (`npm install -g @kern0x1b/penstock-cli`).

Penstock was published as **Camunda BPMN Editor** until 2026. Same plugin, same vendor, new name.
It updates in place and nothing needs to be reinstalled.

## What this repository is

Penstock is a closed-source commercial product; its source code is not published here. This
repository exists so that the things users need are public and permanent:

| | |
|---|---|
| [getpenstock.com](https://getpenstock.com/) | What Penstock does and how to set it up |
| [Issues](../../issues) | Bug reports and feature requests |
| [LICENSE](LICENSE) | The end-user license agreement |
| [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) | Licenses of the bundled open-source components |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [SECURITY.md](SECURITY.md) | How to report a vulnerability |

## Schemas and pictures

The site lives at <https://getpenstock.com/>. This repository still serves two things from `docs/` on GitHub Pages and raw GitHub URLs, because released versions of Penstock point at them: the JSON schemas in `docs/schema` (written into `penstock.yaml` and test files), and the pictures in `docs/img` that the marketplace listings load. Every other address under `kern0x1b.github.io/penstock-release/` redirects to the same page on getpenstock.com.

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
