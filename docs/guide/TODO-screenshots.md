# Images still to make

The pictures on the site are crops of the product's own Marketplace frames, so nothing is invented
and nothing shows an editor that no longer exists.

The pictures that were on the site before 26.10 all showed the editor as it was before 26.10: the
icon-only toolbar, the properties panel as a column of its own, and the actions still called Live
and Runs. They were removed rather than shipped, including the crops that had been taken for the
migration, the share and the test-case features, because their editor chrome is the old one.

The replacements are cropped out of the full-IDE frames in `docs/screenshots/marketplace/` of the
plugin repository, branch `marketplace-shots-26-10`. Crop with `sips`, downscale to 1600px wide,
and keep the Marketplace heading out of the crop. Frames available, in light and dark
(`-light` / `-dark`):

| Frame | What it shows | Cropped to |
|---|---|---|
| `01-overview-*` | A Camunda 8 diagram open, Properties tab selected, context pad on a service task, the problems pill reading "No Issues" | `editor-overview.png` |
| `02-code-link-*` | A Camunda 7 diagram with the Code tab and the worker that runs a step | `code-tab.png` |
| `03-auto-layout-*.gif` | The same diagram before and after auto layout | not used, a still is better |
| `04-check-card-*` | A Camunda 7 diagram with the check card over the canvas, badges on the shapes and the Code tab's empty state | `check-card.png` |
| `05-dmn-*` | The decision editor with a decision table and the Properties tab | `dmn-editor.png` |
| `06-forms-*` | The form editor with the Preview tab open | `form-editor.png` |
| `07-live-*` | The Monitor tab with no engine connected | `monitor-tab.png` |
| `08-runs-*` | The Scenarios tab, a scenario and its start variables | `scenarios.png` |
| `09-migration-*` | The Migrate to Camunda 8 group in the Problems tab | `migration.png` |
| `10-terminal-mcp-*` | A terminal running the check, with the rule links | `terminal-mcp.png` |

Ship the light crops. A dark frame is a fallback, not a second picture.

## Needed

Each one is a close-up, so crop to the surface itself and leave a little of the canvas around it for
context. The figure goes where the comment `<!-- image: <name> --> <!-- what to show -->` stands.

### Whole editor

- `tour.png`, for `guide/getting-started.html`. The first-run tour card over the canvas, showing
  the palette step.
- `editor-dmn.png` and `editor-form.png`, for `guide/editing.html`. A `.dmn` file and a `.form`
  file open, each with the Properties tab and the DMN or Form tabs.

### Surfaces

- `command-palette.png`, for `guide/toolbar.html`. The palette open over the canvas, with the
  search field, a few matched rows with the matched letters marked, the section headings and the pin
  on each row. It has to be a BPMN diagram so the action names are the real ones.
- `problems-tab.png`, for `guide/diagram-check.html`. The Problems tab with the full list, a finding
  selected and its Why and Fix lines showing under it.
- `monitor-tab.png`, for `guide/monitor.html`. The Monitor tab with incidents and the instances
  waiting at each step, badges on the canvas. `07-live-light.png` is the empty state; this one is
  the filled one.
- `code-tab.png`, for `guide/code-links.html`. The Code tab with the workers, classes, beans, tests
  and usages behind a selected step, and Go to code, Find usages, Run tests and Debug tests. The
  crop on the site is a close-up of the head of the tab.
- `scenarios-review.png`, for `guide/sidebar.html`. Generate in the Scenarios tab with the review
  open over the diagram: a scenario's path drawn with step numbers, its steps listed in plain words,
  and the Create scenarios action.
- `deploy-popover.png`, for `guide/deployment.html`. The Deploy popover under the Deploy button,
  with the profile, the engine address, the list of files and the Deploy action, and Edit
  connection in it.
- `connection-dialog.png`, for `guide/deployment.html`. The Connection dialog, mid size, with
  Engine address and Sign in, and Save beside Save and Deploy.
- `export-dialog.png`, for `guide/export.html`. The Export dialog: the preview on the left centred
  in its pane, the settings on the right, and Cancel, Copy and Save in one row at the bottom right.
- `import-report.png`, for `guide/import.html`. The Import report dialog after a draw.io import,
  with the count heading and the list of what could not be mapped in the warning colour.
- `migration-preview.png`, for `guide/migration.html`. The conversion preview: the diagram before on
  the left, the converted diagram on the right, the title, and the target folder with
  Replace the files in <folder>.
- `migration-report.png`, for `guide/migration.html`. The migration report page in dark: scope, what
  the move costs, files and code.
- `share-html.png`, for `guide/share-html.html`. The shared HTML file open in a browser. The site has
  a light and a dark crop of the viewer already, so this one is optional.
- `transaction-boundaries.png`, for `guide/editing.html`. A Camunda 7 diagram with the transaction
  boundary bars drawn, in the accent colour, each with its tooltip showing.
- `auto-layout-before.png` and `auto-layout-after.png`, for `guide/auto-layout.html`. The same
  collaboration before and after, canvas only, no IDE chrome.
- `classic-io.png`, for `guide/properties-panel.html`. A Classic BPMN task selected with the Inputs
  and Outputs groups open in the sidebar.
- `create-element.png`, for `guide/elements.html`. The Create element catalogue open over the
  diagram.
- `collapse-event-subprocess.png`, for `guide/elements.html`. An event sub-process collapsed, with
  the wrench menu open on the collapsed shape.
- `scripts.png`, for `guide/scripts.html`. The script field with the Edit in new tab button, and the
  code editor that opens.
- `token-simulation.png`, for `guide/token-simulation.html`. A token simulation running on a
  collaboration.
- `diagram-check-problems.png`, for `guide/validation.html`. An engine compatibility finding
  ("Charge card has no job type") in the Problems tab and marked on the canvas.
- `test-case-gutter.png`, `test-runner-one-test-case.png` and `test-runner-a-failure.png`, for
  `jetbrains/test-runner.html`. A test case file open in the IDE with a run icon in the gutter next
  to each test case, the test runner showing one passed case and its log, and the test runner showing
  one failed test and two passed.
- `tool-window.png`, for `jetbrains/tool-window.html`. The tool window on the left stripe, with the
  project as a model and its toolbar.
- `tool-window-example.png`, for `guide/example-project.html`. The tool window saying
  "No diagrams in this project" with Start from an example.

## Rules for any picture

- Light and dark: the site follows the reader's colour scheme, but the pictures are one or the
  other. Ship the light crops.
- No picture may show a hostname, a user name or a home path. The frames use the sample project
  `penstock-demo-project`; check the breadcrumb at the bottom of the frame before cropping.
- Alt text and the caption go with the figure in the page.
