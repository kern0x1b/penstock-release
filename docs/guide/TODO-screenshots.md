# Screenshots still missing

The site reuses the product's own screenshots (`docs/screenshots/**` in the product repository) and the
images that were already on the site. No image is invented. This list says which pages still have no
picture of their own, and which pictures should be retaken.

Screenshots should be taken in the IDE with the New UI, on the dark and the light theme where a page
shows a colour that matters. Keep the file names in `docs/img/`.

## Pictures to retake

| File | Problem | Used on |
|---|---|---|
| `img/test-case-runs/05-ide-test-runner.png` | An "IDE error occurred" notification is in the corner. Not used on the site. | none |
| `img/migration/01-camunda-8-in-the-more-menu.png` | Shows the action as "Camunda 8". It is now "Migrate to Camunda 8" and pinned to the toolbar. Not used on the site. | none |
| `img/migration/02-check-card-camunda-8-section.png` | The section is headed "Camunda 8". It is now "Migrate to Camunda 8". Used, with a caption that says so. | migration |
| `img/settings-penstock.png` | The old Settings | Tools | Penstock page, which no longer exists. Not used. Kept so an old link keeps working. | none |
| `img/editor-overview.png`, `properties-panel.png`, `classic-io.png`, `goto-class.png`, `create-element.png`, `token-simulation.png`, `export-dialog.png`, `diagram-check-problems.png`, `diagram-check-selected.png`, `diagram-check-clean.png`, `auto-layout-before.png`, `auto-layout-after.png` | Taken before the toolbar was redrawn: they show the earlier icon-only bar (no words, no Deploy button on the right). The card, dialog and canvas content is still right. Retake in the current IDE. The site still uses them, except `editor-overview.png` and `diagram-check-clean.png`. | properties-panel, editing, elements, token-simulation, export, diagram-check, auto-layout |

## Pictures that show the old names

The toolbar buttons were renamed: Live is now Monitor, and Runs is now Scenarios. These pictures still show
the old names and should be retaken. The captions on the site say so where it matters.

| File | Shows | Used on |
|---|---|---|
| `img/test-case-runs/01-runs-panel-passed.png`, `02-run-with-input-dialog.png`, `03-waiting-for-an-answer.png` | "Live" and "Runs" on the toolbar, and a panel titled "Runs" | scenarios |
| `img/share-and-import/more-menu.png` | "Live" and "Runs" in the More menu | toolbar, share-html |
| `img/migration/02-check-card-camunda-8-section.png` | "Live" and "Runs" on the toolbar | bpmn-editor, getting-started, migration, home page |

## Pages with no picture

Pages that already have at least one picture are not listed. Paths are `<section>/<page>`: `guide` is the core guide,
`jetbrains` and `cli` are the tool sections.

### Guide
- `getting-started`, `example-project`: the tool window with "Start from an example" (JetBrains), a terminal after `penstock init --example` (CLI).
- `scripts`: the script field with the *Edit in new tab* button, and the code editor that opens.
- `element-templates`: the *Connector Templates* dialog, a card, its details, and the *Template not downloaded* badge.
- `diagram-diff`: the two-diagram comparison of a `.bpmn` file in a diff window.
- `dmn-editor`: a decision table, the requirements diagram with its properties panel, the DMN 1.1 notice, and the *Decision check* card.
- `form-editor`: the form editor and the *Preview* beside it, and the *Form check* card.
- `engine-profiles`: the engine question above an empty canvas, and the *Wrong engine namespace* finding with its Fix button.
- `settings`: `penstock.yaml` open in an editor with completion from the schema.
- `profiles`, `deployment`: the arrow next to Deploy with a menu of profiles, and the *Connection* dialog.
- `project-model`: the model in each tool (JetBrains: the tool window is on `jetbrains/tool-window`).
- `validation`, `diagram-check`: the engine compatibility findings ("Charge card has no job type") in the check card and on the canvas.
- `toolbar`: the *Transaction boundaries* bars and *Copy as image*.
- `flow-analysis`: the *How it runs* section of the check card with a path outlined on the canvas.
- `monitor`: the *Monitor* card with badges on the shapes.
- `check-workers`: the workers node after a check.
- `process-tests`: the *Coverage* panel with the diagram coloured.
- `code-links`, `migration`: the *Convert* preview in the visual diagram diff; the hover card of an element.
- `plans`, `sign-in`: the licence dialog, and the message that explains a paid feature.

### JetBrains
- `installing`: the Marketplace page of the plugin, and the first-run tour.
- `editor`: the two tabs at the foot of the editor, and the *File Changed on Disk* dialog.
- `where-things-are`: one annotated screenshot of the IDE with the places numbered.
- `code-links`: the gutter icons, Code Vision and *Find Usages in Code*.
- `shortcuts`, `licence`: the status bar widget and the licence dialog.

### Command line
- `cli/index`, `cli/commands`, `cli/ci`, `cli/mcp`: a terminal is described in text. A picture of the bot's pull request comment for `cli/ci` would help.
