# Images still to make

Every image in `docs/img/` was a picture of the editor before 26.10, so all of them were
removed rather than shipped. The replacements are cropped out of the full-IDE frames in
`docs/screenshots/marketplace/` of the plugin repository, branch `marketplace-shots-26-10`,
once those frames are committed. Crop with `sips`, downscale to 1600px wide, and keep the
marketplace heading out of the crop.

Frames available, in light and dark (`-light` / `-dark`):

| Frame | What it shows |
|---|---|
| `01-overview-*` | A Camunda 8 diagram open, Properties tab selected, context pad on a service task, the problems pill reading "No issues" |
| `02-code-link-*` | A Camunda 7 diagram with the Code tab and the code that runs a step |
| `03-auto-layout-*.gif` | The same diagram before and after auto layout |
| `04-check-card-*` | A Camunda 7 diagram with the check card over the canvas, badges on the shapes, the Problems pill reading 4, and the Code tab's empty state |
| `05-dmn-*` | The decision editor with a decision table and the Properties tab |
| `06-forms-*` | The form editor with the Properties tab |
| `07-live-*` | The Monitor tab with instances and incidents |
| `08-runs-*` | The Scenarios tab, a run and its result |
| `09-migration-*` | The check card's Migrate to Camunda 8 group, and the conversion preview |
| `10-terminal-mcp-*` | A terminal running the CLI and the MCP server |

Frames that do not exist yet and have to be shot in the sandbox IDE. Each one is a close-up,
so crop to the surface itself and leave a little of the canvas around it for context.

## Needed

### Whole editor

- `editor-overview.png`, for `getting-started.html`. A full IDE frame, light. A Camunda 8
  diagram open with the Properties tab showing, so the toolbar, the sidebar, the palette and
  the editor tabs are all in one picture. Use `01-overview-light.png` without the marketplace
  heading, cropped to the IDE window.
- `editor-dmn.png`, for `editing.html`. A `.dmn` file open: the requirements diagram or a
  decision table, the Properties tab, and the DMN tabs.
- `editor-form.png`, for `editing.html`. A `.form` file open with the Properties tab.
- `tour.png`, for `getting-started.html`. The first-run tour card over the canvas, showing
  the palette step.

### Surfaces

- `command-palette.png`, for `editing.html`. The command palette open over the canvas, with
  the search field, a few matched rows with the matched letters marked, the section headings
  and the pin on each row. It has to be a BPMN diagram so the action names are the real ones.
- `deploy-popover.png`, for `deployment.html`. The Deploy popover open under the Deploy
  button, with the profile, the engine address, the list of files and the Deploy action, and
  Edit connection in it.
- `export-dialog.png`, for `editing.html`. The Export dialog: the preview on the left
  centred in its pane, the settings on the right, and Cancel, Copy and Save in one row at the
  bottom right.
- `connection-dialog.png`, for `deployment.html`. The Connection dialog, mid size, with
  Engine address and Sign in, and Save beside Save and Deploy.
- `scenarios-review.png`, for `sidebar.html`. Generate in the Scenarios panel with the review
  open over the diagram: a scenario's path drawn with step numbers, its steps listed in plain
  words, and the Create scenarios action.
- `problems-tab.png`, for `diagram-check.html`. The Problems tab with the full list, a finding
  selected and its Why and Fix lines showing under it.
- `code-tab.png`, for `sidebar.html`. The Code tab with the workers, classes, beans, tests
  and usages behind a selected step, and Go to code, Find usages, Run tests and Debug tests.
  `02-code-link-light.png` is close; crop the sidebar and the gutter of the canvas.
- `monitor-tab.png`, for `sidebar.html`. The Monitor tab with incidents and the instances
  waiting at each step, badges on the canvas. `07-live-light.png` is close; crop the sidebar
  and the badges.
- `import-report.png`, for `exchange.html`. The Import report dialog after a draw.io import,
  with the count heading and the list of what could not be mapped in the warning colour.
- `migration-preview.png`, for `migration.html`. The conversion preview: the diagram before on
  the left, the converted diagram on the right, the title, and the target folder with
  Replace the files in <folder>.
- `share-html.png`, for `exchange.html`. The shared HTML file open in a browser: the
  read-only viewer with the diagram, the name at the top, and the Made with Penstock footer.
- `transaction-boundaries.png`, for `editing.html`. A Camunda 7 diagram with the transaction
  boundary bars drawn, in the accent colour, each with its tooltip showing.
- `auto-layout-before.png` and `auto-layout-after.png`, for `auto-layout.html`. The same
  collaboration before and after, canvas only, no IDE chrome.
- `classic-io.png`, for `engine-profiles.html`. A Classic BPMN task selected with the Inputs
  and Outputs groups open in the sidebar.
- `collapse-event-subprocess.png`, for `elements.html`. An event sub-process collapsed, with
  the wrench menu open on the collapsed shape.

## Notes

- Light and dark: the site follows the reader's colour scheme, but the pictures are one or the
  other. Ship the light crops; a dark frame is a fallback, not a second picture.
- No picture may show a hostname, a user name or a home path. The frames use the sample
  project `penstock-demo-project`; check the breadcrumb at the bottom of the frame before
  cropping.
- Alt text and the caption go with the figure in the page. The figure is added where the
  comment `<!-- image: <name> -->` stands.
