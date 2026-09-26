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

## Pages with no picture

Pages that already have at least one picture are not listed.

### Start here
- `installing`: the Marketplace page of the plugin, and the first-run tour.
- `example-project`: the tool window with "Start from an example", and the *Start from an example* dialog.
- `glossary`: none needed.

### Editors
- `scripts`: the script field with the *Edit in new tab* button, and the IDE tab that opens.
- `element-templates`: the *Connector Templates* dialog, a card, its details, and the *Template not downloaded* badge.
- `diagram-diff`: the two-diagram comparison of a `.bpmn` file in the IDE's diff window.
- `dmn-editor`: a decision table, the requirements diagram, and the *Decision check* card.
- `form-editor`: the form editor with its palette, and the *Form check* card.

### Project setup
- `engine-profiles`: the engine question above an empty canvas, and the *Wrong engine namespace* finding with its Fix button.
- `settings`: `penstock.yaml` open in the IDE with completion from the schema.
- `profiles`: the arrow next to Deploy with a menu of profiles.
- `files`: none needed.

### Checking
- `flow-analysis`: the *How it runs* section of the check card with a path outlined on the canvas.
- `validation`: a marker on an element, and the *Rules* section of the check card.
- `rules` pages: none needed.

### Running
- `deployment`: the *Connection* dialog and the menu next to Deploy.
- `live`: the *Live* card with badges on the shapes.
- `check-workers`: the tool window Workers node after a check.
- `process-tests`: the *Coverage* panel with the diagram coloured.
- `code-links`: the hover card of an element, Code Vision above a worker, and the gutter icon.

### Moving and sharing
- `migration`: the *Convert* preview in the visual diagram diff, and the tool window *Migrate to Camunda 8* root.
- `share-html`, `import`: have pictures.

### Command line and licence
- `cli`, `cli-reference`, `ci`, `mcp`: a terminal is described in text. A picture of the bot's pull request comment for `ci` would help.
- `plans`, `sign-in`: the *Penstock Licence* dialog, the status bar widget, and the message that explains a paid feature.
- `security`, `troubleshooting`, `faq`: none needed.
