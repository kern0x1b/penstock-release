# Screenshot plan for the guide

The shot list for the next job. One line per picture: page, the feature or step it shows, the fixture, the exact state to set up.

## Rules for every shot

- Window 1280x800 at 2x, with an isolated `PENSTOCK_HOME` and `tourSeen` set, as `docs/marketplace/capture.mjs` in the product repository does. Context pad hidden unless the line says otherwise.
- Fixtures are in the product repository under `docs/marketplace/fixtures/retail-fulfilment/` and are called **RF** below. RF holds `penstock.yaml` (engine camunda-8, deployment `http://localhost:8090/v2`), `.bpmnlintrc`, `diagrams/order-to-cash.bpmn` (**O2C**, Camunda 8, clean), `diagrams/credit-hold.bpmn` (**CH**, four findings), `diagrams/shipping-decision.dmn` (**SD**, hit policy FIRST, inputs Order weight, Destination zone, Customer tier), `diagrams/invoice-approval.form` (**IA**, keys orderNumber, invoiceTotal, customer, decision), `src/main/java/shop/retail/OrderWorkers.java` (**OW**, six `@JobWorker`s) and `test-cases/order-to-cash.json` (**TC**, three scenarios).
- **EX8** and **EX7** are the files `penstock init --example camunda-8` and `--example camunda-7` write: `order-process.bpmn`, `shipping-method.dmn`, `approve-order.form`, `test-cases/order-process.json`.
- The shot name is the file in `docs/img/`. A name marked **(in page)** already has an image comment on the page. A name marked **RETAKE** exists but shows the old UI (pill "No Issues", capitalised "Auto Layout", no Comments tab).
- A fixture marked **NEW** does not exist yet and has to be added to RF first. They are listed at the end.
- Light theme unless the line says dark. Crop to the named region when it says "crop".

## getting-started

| Shot | Step | Fixture | State |
|---|---|---|---|
| gs-install.png | 1 Get Penstock | none | The Plugins page of the IDE with "Penstock" typed in the search and the plugin card showing. Crop to the card. |
| gs-example-folder.png | 2 Try the example | EX8 | Terminal after `penstock init --example camunda-8`: the command and the files it lists. Crop to the terminal. |
| gs-open-diagram.png | 3 Open order-process.bpmn | EX8 | Project tree with `src/main/resources/order-process.bpmn` selected, the diagram open in the editor, sidebar on Properties, nothing selected. |
| gs-check-clean.png | 3 Press Check | EX8 | Check pressed on the untouched example: the pill says "No problems found." and the toolbar shows Check pressed. No card list. |
| gs-deploy-popover.png | 3 Press Deploy, first time | EX8 | Deploy popover open with no profile saved: the address field empty and focused, Save and deploy off. |
| gs-engine-question.png | Your own diagram, engine line | none | An empty `process.bpmn` with no engine in the file: the line "Which engine runs this diagram?" above the canvas with its choices. |
| gs-draw.png | Your own diagram, Draw | none | Empty diagram, the palette on the left, one start event dropped and its context pad showing (pad **visible** in this one). |
| gs-properties.png | Your own diagram, properties | RF O2C | A service task selected, Properties tab open with the Task definition group expanded. |
| gs-check-card.png | Your own diagram, Check | RF CH | Check pressed: the card with three findings and "Show all". Same state as `check-card.png`. |
| gs-tour.png | First-run tour | RF O2C | `tourSeen` NOT set: the first tour card over the editor, with its step count and Next. |

## sign-in

| Shot | Step | Fixture | State |
|---|---|---|---|
| signin-trial-status.png | The trial | none | The licence status of the tool on a fresh home: "Pro trial" and the days left. |
| signin-buy-dialog.png | Buy Pro or Team 1 | none | The paid-feature dialog over the editor with Buy Pro, I Already Have a Licence and Cancel. |
| signin-code.png | Buy Pro or Team 4 | none | The sign-in dialog waiting for the code that was sent by e-mail: the code field focused and the address shown. |
| signin-active.png | What you see | none | The notification "Penstock Pro is active on this machine." |
| signin-other-machine.png | Sign in on another machine 2 | none | The sign-in dialog on its first screen: the field that takes the address or a key. |
| signin-status.png | Check your licence | none | The licence status after signing in: the tier, the machine, and the days left. |
| signin-pipeline-key.png | In a pipeline | none | A CI job log that sets the pipeline key as an environment variable and runs `penstock check`. Crop to the job step. |

## plans

| Shot | Step | Fixture | State |
|---|---|---|---|
| plans-paid-dialog.png | What you see when you reach a paid feature, editor | RF O2C | Auto layout run on Free: the dialog "Auto layout is part of Penstock Pro." with its buttons. |
| plans-paid-terminal.png | What you see, terminal | RF | `penstock scenarios run` on Free: the printed text with the two licence commands. Crop to the terminal. |

## bpmn-editor

| Shot | Step | Fixture | State |
|---|---|---|---|
| editor-overview.png | The editor | RF O2C | Exists. Check it still matches: no pill other than "No problems found.", Comments tab present, "Auto layout" written the way the toolbar writes it. |
| bpmn-pill-states.png | The pill | RF CH | Three crops of the pill in one picture: "No problems found." (green, O2C), "1 warning" (amber) and "3 errors, 1 warning, 2 readability" (red). Use CH with findings fixed one by one. |
| bpmn-first-tour.png | First-run tour | RF O2C | Second card of the tour, pointing at the sidebar. |
| bpmn-theme-dark.png | Theme | RF O2C | The editor in the dark theme, same state as `editor-overview.png`. |
| bpmn-text-tab.png | Text tab | RF O2C | The Text tab open, showing the XML with the line of `exporter="Penstock"` visible. |

## toolbar

| Shot | Step | Fixture | State |
|---|---|---|---|
| toolbar-bar.png | The bar | RF O2C | Crop to the toolbar only, nothing pressed, with Check, Auto layout and Deploy pinned. |
| toolbar-more-menu.png | The More menu | RF O2C | More open, the groups visible, pointer on no row. |
| toolbar-pin.png **(in page)** | Pin | RF O2C | More open, pointer on the Minimap row so its pin shows, Check and Auto layout already pinned. |
| toolbar-palette.png | Command palette | RF O2C | The palette open with "tr" typed, "Trace paths" first, and the five Recent entries visible on a second shot with an empty query. Two files: `toolbar-palette-search.png` and `toolbar-palette-recent.png`. |
| toolbar-palette-pin.png | Pin from the palette | RF O2C | Palette open, a result highlighted with the hint for Shift+Enter visible. |
| keyboard-shortcuts.png **(in page)** | Keyboard shortcuts | RF O2C | The sheet open over a diagram, groups Canvas, Edit, Modeling and Penstock, the field "Search actions and keys" empty. |
| toolbar-dmn.png | DMN bar | RF SD | Crop to the toolbar of the decision editor. |
| toolbar-form.png | Form bar | RF IA | Crop to the toolbar of the form editor. |

## sidebar

| Shot | Step | Fixture | State |
|---|---|---|---|
| editor-overview.png | The tabs | RF O2C | Exists. Used by this page and `bpmn-editor`. Tab row shows the open tab by name and the five others as icons. |
| sidebar-tabs-bpmn.png | The tabs, diagram | RF CH | Crop to the tab row with Problems and Comments badges both showing a count (needs one comment on CH, see NEW fixtures). |
| sidebar-tabs-dmn.png | The tabs, decision | RF SD | Crop to the tab row: Properties, Problems, Try. |
| sidebar-tabs-form.png | The tabs, form | RF IA | Crop to the tab row: Properties, Preview, Problems. |
| sidebar-toggle.png | Open and close | RF O2C | Crop to the right end of the toolbar, toggle pressed. Second file `sidebar-toggle-off.png`, toggle off, sidebar hidden. |
| sidebar-width.png | How wide | RF O2C | The dividing line mid-drag at about 440 pixels, cursor resize. |
| sidebar-drawer.png | Drawer | RF O2C | The editor at 900 px wide: the sidebar as a drawer over the canvas, close button at the end of the tab row. |
| sidebar-drawer-collapsed.png | Drawer | RF O2C | Same width, drawer closed: the slim bar with the tab name and the button that opens it. Scenarios tab, a scenario open, so the bar names the step. |
| sidebar-back-row.png | Going deeper | RF O2C + TC | Scenarios tab with a scenario open: the row with the back arrow and the scenario name under the tab row. |

## properties-panel

| Shot | Step | Fixture | State |
|---|---|---|---|
| props-groups.png | The groups | RF O2C | Service task "Validate order" selected, Properties tab with Task definition, Inputs and Outputs expanded. |
| props-search.png | Search the groups | RF O2C | A term typed in the properties filter, showing only matching groups. Use only if the field exists in the page text. |
| props-expression-try.png | Try an expression on a running instance | RF O2C | Needs an engine at `localhost:8090` with an instance of O2C waiting at "Decide shipping method". A condition on a gateway selected, the field showing the result under it. |
| example-data.png **(in page)** | Example data of a worker step | RF O2C + OW | "Check customer credit" selected, Example data group open with the names and "Write example output". |
| classic-io.png **(in page)** | Classic input and output | NEW classic-task.bpmn | A Classic BPMN task selected, Inputs and Outputs groups open. |
| props-call-activity.png | Call activity | NEW call-activity.bpmn | A call activity selected with the called process field and the "go to" link. |
| props-drawer-narrow.png | 960 px | RF O2C | Properties tab inside the drawer at 900 px. Optional if the sidebar shot above is enough. |

## editing

| Shot | Step | Fixture | State |
|---|---|---|---|
| edit-create-pad.png | Draw with the pad | RF O2C | A task selected, its context pad visible (pad visible), the append arrow hovered. |
| edit-replace.png | Change the type | RF O2C | Wrench menu open on a service task with the replace list. |
| edit-trace.png | Follow a path | NEW two-pool.bpmn | Same as `trace-paths-card.png`, cropped to the card and the dimmed canvas. May reuse that file. |
| edit-comment-badge.png | Leave a note | NEW CH + comments | Canvas with badges "1" and "2" on two shapes. |
| transaction-boundaries.png **(in page)** | Transaction boundaries | NEW c7-async.bpmn | Camunda 7 diagram with the bars drawn and a tooltip on one. |
| edit-shortcuts.png | Shortcuts | RF O2C | Same as `keyboard-shortcuts.png`. Reuse. |

## elements

| Shot | Step | Fixture | State |
|---|---|---|---|
| create-element.png **(in page)** | Create element | RF O2C | The Create element catalogue open over the diagram, with a search term typed. |
| elements-replace.png | Replace | RF O2C | A task with the replace menu showing the types Camunda 8 allows. |
| collapse-event-subprocess.png **(in page)** | Collapse an event sub-process | NEW event-subprocess.bpmn | Event sub-process collapsed, wrench menu open on the collapsed shape. |
| elements-boundary.png | Boundary events | RF CH | The "Escalation timer" boundary event selected on its task, properties showing the timer. |

## diagram-check

| Shot | Step | Fixture | State |
|---|---|---|---|
| check-card.png **RETAKE** | Run it, 1-3 | RF CH | Check pressed. Card "Diagram check" at the bottom right with the header "4 errors, 0 warnings" style count, the first three findings, "Show all (1 more)". Pill in the toolbar with the new wording. The old frame shows "No Issues". |
| check-click-finding.png | Run it, 3 | RF CH | A finding clicked: the canvas scrolled to the element, outline red. |
| problems-tab.png | Run it, 4 | RF CH | Exists, from the store frames. Verify it shows the groups in the page's order. |
| problems-finding-open.png | Run it, 4 | RF CH | A finding selected in the Problems tab, Why and Fix lines and the rule id link visible. |
| check-recheck.png | Run it, 5 | RF CH | Crop to the card header with Recheck, after a fix. |
| check-two-places.png | Two places to read it | RF CH | Side by side: the card with Show all, and the Problems tab with the card hidden. One composite. |
| problems-groups.png | The groups | NEW all-groups.bpmn | A Problems tab with Drawing, Engine, Code, Rules, Migrate and a collapsed Readability group, each with a count. |
| problems-engine-fix.png | Engine group | NEW wrong-namespace.bpmn | The Engine group with the wrong-namespace finding and its Fix button. |
| check-project.png | Check the whole project | RF | `penstock check` in the terminal over RF: the file lines and the total. Crop to the terminal. |
| check-fix-all.png | Fix a whole diagram at once | RF CH | The fix-all action offered and its result preview. Only if the page names an action. |

## flow-analysis

| Shot | Step | Fixture | State |
|---|---|---|---|
| flow-how-it-runs.png | In the editor 2 | NEW flow-analysis.bpmn | Problems tab open on the "How it runs" group with two findings (Pro licence active). |
| flow-path-outline.png | In the editor 3 | NEW flow-analysis.bpmn | A finding selected: the path to the problem outlined on the canvas, the line below it in words. |
| flow-without-pro.png | What you see without Pro | NEW flow-analysis.bpmn | Free licence: the group showing the note that it is Pro. |

## diagram-diff

| Shot | Step | Fixture | State |
|---|---|---|---|
| diff-compare.png | Steps 2-3 | RF CH, with the committed copy edited | The IDE's diff window for `credit-hold.bpmn` showing two diagrams side by side with the changed element marked. |
| diff-context-menu.png | Step 2 | RF CH | The version control menu with the compare action. |

## code-links

| Shot | Step | Fixture | State |
|---|---|---|---|
| code-tab.png **RETAKE** | The Code tab | RF O2C + OW | "Check customer credit" selected, Code tab open: the worker `checkCustomerCredit` in OW with its line, a test and a usage. The old frame has the old toolbar. |
| code-link-string.png | What is linked | RF OW | OW open in the IDE with the cursor on `"validate-order"`, the link underline and the tooltip. |
| code-hover-element.png | What is linked, hover | RF O2C | Hover on "Validate order": the tooltip that says what runs it. |
| code-check-findings.png | Check against the code | RF O2C + OW | The Problems tab, Code group, with `code/worker-fetch` or `code/writer-unread` findings (needs a NEW OW variant). |
| code-rename.png | Rename | RF O2C + OW | The rename dialog on `"validate-order"` with the preview of the places that change. |
| element-template-from-worker.png **(in page)** | Templates from worker code | RF OW | The Create Element Template action on `OrderWorkers.java` and the file it wrote under `element-templates/`. |
| code-other-repos.png | Other repositories | NEW second-repo | The setting that points at a second repository, in `penstock.yaml`. Crop to the file. |

## check-workers

| Shot | Step | Fixture | State |
|---|---|---|---|
| workers-check-terminal.png | Steps | RF | `penstock check --workers` over RF: the line for `load-customer-account` which has no task, and the ones that match. Crop to the terminal. |
| workers-project-model.png | What it says | RF | The project model section "Workers" with "no implementation" on one entry. |

## scenarios

| Shot | Step | Fixture | State |
|---|---|---|---|
| scenarios.png | Read the Scenarios tab | RF O2C + TC | Exists. Check that the tab shows the three scenarios with their last result and the buttons Run all, Run with input, Generate. |
| scenarios-review.png **(in page)** | Generating scenarios | RF O2C | Generate pressed: the review open over the diagram with the proposed scenarios and Accept. |
| scenario-steps.png **(in page)** | Open a scenario | RF O2C + TC | "An order abroad ships by air freight" open on the Steps view, numbers on the canvas, the links under a step. |
| scenario-text.png | Open a scenario 4 | RF O2C + TC | Same scenario, Text view. |
| scenario-run-result.png | Run, After a run | RF O2C + TC + engine | After Run: green path, the plan-versus-actual line, the table with Step, State, In, Out, Changed. |
| scenario-failed.png | After a run | RF O2C + TC + engine | A run that failed at "Set credit limit": the red step and the line that says what the scenario expected. Edit TC for the failure. |
| scenario-step-bar.png | Open a scenario | RF O2C + TC | The bar with previous and next step. May share a shot with `scenario-steps.png`. |
| scenario-edit-save.png | Change a scenario | RF O2C + TC | A step edited in the Steps view, the Save changes button live. Pro licence. |
| scenario-needs-pro.png | Change a scenario | RF O2C + TC | The same view on Free: the editing controls off, the note that Pro is needed. |
| run-with-input.png **(in page)** | Run with input | RF O2C | The dialog with Start variables filled in and a behaviour chosen for each service task. |
| run-with-input-waiting.png | Run with input 5 | RF O2C + engine | The panel "Waiting at Charge card for the job ..." with the variables. Use "Check customer credit". |
| scenarios-run-all-terminal.png | Run many scenarios | RF | `penstock scenarios run` in the terminal: the line per scenario and the total "2 passed, 0 failed, 0 skipped". |
| scenario-mocked-badge.png | What you see | RF O2C + TC | A step with the Mocked badge in the table. |

## monitor

| Shot | Step | Fixture | State |
|---|---|---|---|
| monitor-tab.png **RETAKE** | Read it | RF O2C + engine | Engine at `localhost:8090` with three instances of O2C: two waiting at "Approve order", one with an incident at "Check customer credit". Badges on shapes. The old frame has the old toolbar. |
| monitor-no-engine.png | Read it 2 | RF O2C | Monitor tab with no `deployment.url`: the "Set up connection…" button in its empty state. |
| monitor-use-instance.png | Try an expression, 1 | RF O2C + engine | Instance picked with Use; the variables shown under it. |
| monitor-read-variables.png | Try, Read the variables | RF O2C + engine | The "Read the variables" action's result on a selected task. |
| monitor-compare-names.png | Variable names the model and the engine disagree on | RF O2C + engine | "Compare with what the engine has seen" pressed: the list of names that differ. Needs an instance with a variable spelled differently from the one the model reads. |

## deployment

| Shot | Step | Fixture | State |
|---|---|---|---|
| deploy-popover.png **(in page)** | Deploy from the editor 2 | RF O2C | Popover under Deploy: the profile, the engine address, the files that will be sent, Edit connection and Deploy. |
| deploy-profile-pick.png | Deploy from the editor 3 | RF + profiles | The profile switcher in the popover with `test` and `prod` available (see profiles). |
| deploy-notification.png | Deploy from the editor 4 | RF O2C + engine | The notification "Deployed order-to-cash.bpmn as order-to-cash v3 on ...". |
| deploy-connection-dialog.png | The Connection dialog | RF | The dialog with the address, sign-in type, user and the secret field saying "Saved - type to replace". |
| deploy-oauth.png | OAuth | RF | The dialog with sign-in type OAuth, showing client id, token address and audience. |
| deploy-engine-view.png | What you see | RF O2C + engine | The engine's web application showing a new process version. Operate for Camunda 8. |
| deploy-multi.png | Deploy more than one file | RF | Popover listing the diagram, the decision and the form together. |

## profiles

| Shot | Step | Fixture | State |
|---|---|---|---|
| profiles-yaml.png | Define a profile | RF + profiles | `penstock.yaml` with a `profiles:` block for `test` and `prod`. Crop to the file. |
| profiles-deploy-arrow.png | Deploy to another profile 1-2 | RF + profiles | The arrow beside Deploy open with "Deploy to default", "Deploy to test", "Deploy to prod". |
| profiles-show.png | See the profiles | RF + profiles | The terminal output of the command that lists them. |

## engine-profiles

| Shot | Step | Fixture | State |
|---|---|---|---|
| engine-question.png | Choose the engine | NEW no-engine.bpmn | The line "Which engine runs this diagram?" with the five choices. Same state as `gs-engine-question.png`. Reuse. |
| engine-toolbars.png | What each engine builds | EX7, EX8 | Two crops of the toolbar: Camunda 7 with Migrate to Camunda 8 pinned and Camunda 8 without. |
| engine-properties-groups.png | What else depends on the engine | EX7, EX8 | The same service task in the two engines, Properties tab, side by side. |

## settings

| Shot | Step | Fixture | State |
|---|---|---|---|
| settings-yaml-completion.png | Completion and validation | RF | `penstock.yaml` open in the IDE with the completion list open under `engine:`. |
| settings-init-terminal.png | Create it | none | `penstock init` in an empty folder: the files it wrote. Crop to the terminal. |

## validation

| Shot | Step | Fixture | State |
|---|---|---|---|
| validation-marker.png | See it working 2 | NEW blank-task.bpmn | A task with no name and the marker on it as the drawing is made. |
| validation-rules-group.png | See it working 3 | NEW blank-task.bpmn | The Problems tab, Rules group, the line with `bpmnlint/label-required`. |
| validation-compat.png | Engine compatibility checks | NEW c8-compat.bpmn | A finding `compat/implementation` in the Rules group. |
| validation-project-report.png | Whole-project checks | RF | The terminal report with `note bpmnlint/label-required: ...` under the file. |

## migration

| Shot | Step | Fixture | State |
|---|---|---|---|
| migration.png **RETAKE** | See what does not carry over 2-4 | EX7 or NEW c7-migration.bpmn | Camunda 7 diagram, Migrate to Camunda 8 pressed. Problems tab on the Migrate group with "7 to do, 3 to review, 8 convert unchanged" or the real counts, and the pill "No problems found." The old frame still has "No Issues" in the pill. |
| migration-toolbar.png | See what does not carry over 2 | EX7 | Toolbar crop with Migrate to Camunda 8 pinned. |
| migration-line.png | See what does not carry over 5 | EX7 | One finding expanded: what is wrong, why, what to do. |
| migration-convert-preview.png | Convert 2 | EX7 | The diff opened twice side by side, before and after, with the Convert button. |
| migration-replace.png | Convert 4 | EX7 | The preview offering "Replace the converted files" over a folder that already has them. |
| migration-report.png **(in page)** | The report | EX7 | The migration report page in dark: scope, cost, files and code. |

## process-tests

| Shot | Step | Fixture | State |
|---|---|---|---|
| tests-scenarios-list.png | The scenarios list | RF TC | `test-cases/order-to-cash.json` open in the IDE with the three scenarios. Crop to the file. |
| tests-junit.png | junit | RF | The terminal after `penstock scenarios run --report junit` and the file it names. |

## token-simulation

| Shot | Step | Fixture | State |
|---|---|---|---|
| token-simulation.png **(in page)** | What it is | NEW two-pool.bpmn | A run on a collaboration. Canvas framed in green, play button on each start event, speed control, tokens on two steps. |
| token-sim-start.png | Steps | NEW two-pool.bpmn | The toolbar with Token simulation just pressed, before the play. |
| token-sim-gateway.png | Steps, a choice | NEW two-pool.bpmn | A token waiting at an exclusive gateway with the choice toggles shown. |

## trace-paths

| Shot | Step | Fixture | State |
|---|---|---|---|
| trace-paths-card.png **(in page)** | Trace a step | NEW two-pool.bpmn | "Approve order" selected, trace on, the rest dimmed, the card "Tracing Approve order - 3 before, 5 after". |
| trace-pad.png | Trace a step 2 | RF O2C | The context pad (pad **visible**) on a task with the trace icon hovered. |
| trace-boundary.png | Boundary events | RF CH | Tracing "Review credit hold", the path through the "Escalation timer" boundary event in full colour. |
| trace-messages.png | Follow message flows | NEW two-pool.bpmn | The card with "Follow message flows" ticked and the other pool in full colour. |
| trace-dmn.png | In a decision | NEW drd.dmn | The DRD with a decision traced, its inputs and dependants in full colour, the others dimmed. |

## comments

| Shot | Step | Fixture | State |
|---|---|---|---|
| comments-add.png | Add a comment 2-4 | RF CH | "Review credit hold" selected, Comments tab with text in "Add a comment" and the line "Signed" and the name. |
| comments-thread.png **(in page)** | Work with a comment | NEW CH + comments | The thread of one element: an open comment from the user, one from someone else, one resolved. Buttons Edit, Resolve, Delete. |
| comments-edit.png | Work with a comment, Edit | NEW CH + comments | A comment in edit state with Save and Cancel. |
| comments-list.png | The list of the whole diagram | NEW CH + comments | Nothing selected: the list with "2 open comments" and "Show resolved". |
| comments-empty.png | The list, last bullet | RF O2C | "No comments yet." and the second line. |
| comments-badges.png | The badges on the canvas | NEW CH + comments | Canvas with badges on two shapes, tab badge showing the total. |
| comments-badges-off.png | The badges | NEW CH + comments | The More menu with "Show comment badges" unticked. |
| comments-xml.png | Where they are kept | NEW CH + comments | The Text tab on the `penstock:Comments` element. Crop to the lines. |

## dmn-editor

| Shot | Step | Fixture | State |
|---|---|---|---|
| dmn-editor.png | Open | RF SD | Exists. Check that the sidebar shows the Try tab and the pill reads "No problems found.". |
| dmn-sidebar-tabs.png | The sidebar of a decision | RF SD | Properties tab with a decision selected in the DRD. Crop. |
| dmn-try-match.png | Try | RF SD | Try tab: weight 12, zone "home", tier "gold": the row that matched highlighted and the output below. |
| dmn-try-no-match.png **(in page)** | Try | RF SD | Values that match no rule, and the sentence that says so. |
| dmn-try-cannot-evaluate.png | Try | NEW dmn-unsupported.dmn | A cell Penstock cannot evaluate: "Penstock cannot evaluate this cell here". |
| dmn-hit-policy.png | Hit policy table | NEW dmn-collect.dmn | A COLLECT table with sum in Try and the aggregated output. |
| dmn-upstream.png | Try, upstream decisions | NEW drd.dmn | A decision with an upstream decision, Try showing the upstream result first. |
| dmn-check-pro.png | The check | RF SD | Check pressed on a table with an overlap: the card and the finding that marks both rules. Pro. |
| dmn-spreadsheet-menu.png | Spreadsheets | RF SD | More open with Export workbook, Export CSV, Import table and "Add rules from spreadsheet…". |
| dmn-import-preview.png **(in page)** | Spreadsheets | RF SD + NEW rules.xlsx | The Import decision table preview with "2 added, 1 removed, 3 changed". |

## form-editor

| Shot | Step | Fixture | State |
|---|---|---|---|
| form-editor.png | Preview | RF IA | Exists. Check the sidebar shows the Preview tab with Input data and Output data. |
| form-palette.png | Open and edit 2 | RF IA | The Components palette as a floating island beside the canvas, nothing selected. |
| form-field-properties.png | Open and edit 3 | RF IA | The "customer" field selected, Properties tab with label and key. |
| form-preview-errors.png | Preview | NEW invoice-approval-broken.form | Preview tab with "2 fields need attention" next to Output data. |
| form-preview-invalid-json.png | Preview | RF IA | Input data edited to invalid JSON: the sentence that says what is wrong. |
| form-problems-empty.png | The sidebar of a form | RF IA | Problems tab before Check: "Check the form to see problems here." |
| form-check-card.png | The form check 1 | NEW invoice-approval-broken.form | The card "Form check" with findings and "Show all". |
| form-check-clean.png | The form check, all well | RF IA | The card with "Every field writes its own variable, and every option means something different." |
| form-toolbar.png | The toolbar | RF IA | Crop to the toolbar: Preview, Check, Deploy, More. |

## export

| Shot | Step | Fixture | State |
|---|---|---|---|
| export-dialog.png **(in page)** | Steps 1-3 | RF O2C | The "Export diagram" dialog: preview centred left, settings right, Cancel, Copy and Save in one row. Light, on white. |
| export-sketchy.png | The options | RF O2C | Font set to the sketchy one (Architects Daughter) in the preview. |
| export-background.png | The options | RF O2C | "Use background" on, dark theme in the preview. |
| export-formats.png | About the formats | RF O2C | The Format list open. |

## import

| Shot | Step | Fixture | State |
|---|---|---|---|
| import-menu.png | Steps in the editor 1 | RF O2C | More menu with "Import diagram…". |
| import-chooser.png | Steps in the editor 2 | NEW drawio-sample.drawio | The file chooser with the draw.io file selected. OS dialog, crop. |
| import-save-dialog.png | Steps in the editor 3 | NEW drawio-sample.drawio | The "Save the imported diagram" dialog with the suggested name. |
| import-report.png **(in page)** | Read the report | NEW drawio-sample.drawio | The report: the count heading and the warning lines. |
| import-terminal.png | In a terminal | NEW drawio-sample.drawio | `penstock import` with the same lines. |

## share-html

| Shot | Step | Fixture | State |
|---|---|---|---|
| share-menu.png | Steps 2 | RF O2C | More open on "Share as HTML…". |
| share-save-dialog.png | Steps 3 | RF O2C | The "Share as HTML" save dialog with the suggested name. |
| share-saved.png | Steps 4 | RF O2C | The notification "Saved ...". |
| share-html-light.png / share-html-dark.png | What the reader sees | RF O2C | Exist. Check the foot line "Made with Penstock" and the bpmn.io logo. |

## element-templates

| Shot | Step | Fixture | State |
|---|---|---|---|
| templates-list.png | Using a template | NEW element-templates/ folder | The Properties tab of a service task with the template chosen and its fields. |
| templates-chooser.png | Using a template | NEW element-templates/ folder | The "Select template" chooser listing two templates. |
| element-template-from-worker.png **(in page)** | Templates from your worker code | RF OW | The Create Element Template action on `OrderWorkers.java` and the template it wrote. |
| templates-check.png | `templates generate --check` | RF | The terminal with the check output. |

## auto-layout

| Shot | Step | Fixture | State |
|---|---|---|---|
| auto-layout-before.png **(in page)** | What it does | NEW two-pool.bpmn | The collaboration before Auto layout. Canvas only, no frame. |
| auto-layout-after.png **(in page)** | What it does | NEW two-pool.bpmn | The same canvas after. Same crop. |
| auto-layout-toolbar.png | Run it | RF O2C | Crop to the toolbar with the button named "Auto layout" and the tooltip. |
| auto-layout-undo.png | Run it, Undo | RF O2C | Edit menu or the undo notice after the run. Use only if the page names one. |

## project-model

| Shot | Step | Fixture | State |
|---|---|---|---|
| model-diagram.png | The model | RF | Output of the project model command or the page it writes: the list of diagrams, decisions, forms and workers. Crop. |
| model-links.png | Links | RF | A form with the tasks that use it, from the generated page. |

## example-project

| Shot | Step | Fixture | State |
|---|---|---|---|
| example-init.png | Create it | none | `penstock init --example camunda-8` in the terminal and the file tree it made. |
| example-run.png | Run | EX8 | The folder open in the IDE with the four files visible in the project tree. |

## scripts

| Shot | Step | Fixture | State |
|---|---|---|---|
| scripts-field.png | In the editor | RF O2C | A script task selected with the script field, the language, and the result variable. |
| scripts-try.png | Try on instance | RF O2C + engine | The same field with the result shown under it, after Use on an instance. |

## security

| Shot | Step | Fixture | State |
|---|---|---|---|
| security-trust.png | Trusted projects | NEW untrusted-project | The notice that a project is not trusted before its commands run. |

## troubleshooting, faq, glossary, files, index

| Shot | Step | Fixture | State |
|---|---|---|---|
| none | These pages need no picture. | | |

## Retakes of frames that exist but are out of date

| Shot | Why | Fixture | State |
|---|---|---|---|
| check-card.png | Pill reads "No Issues" | RF CH | See `diagram-check`. |
| monitor-tab.png | Old toolbar, no Comments tab | RF O2C + engine | See `monitor`. |
| code-tab.png | Old toolbar, no Comments tab | RF O2C + OW | See `code-links`. |
| migration.png | Pill reads "No Issues" | EX7 | See `migration`. |

## NEW fixtures to add to RF

| File | Needed by | What it must contain |
|---|---|---|
| diagrams/two-pool.bpmn | trace-paths, token-simulation, auto-layout | Two pools with a message flow each way, a start event in each, an exclusive gateway, "Approve order" with three steps before and five after, deliberately untidy for the before shot. |
| diagrams/credit-hold.comments.bpmn (CH with comments) | comments, sidebar, editing | CH with three comments on "Review credit hold" (one open of the git user, one open of another name, one resolved) and one on "Check guarantee". Git user name set to the same one as the capture. |
| diagrams/c7-async.bpmn | editing (transaction boundaries) | Camunda 7 diagram with `asyncBefore` on two tasks and `asyncAfter` on one. |
| diagrams/classic-task.bpmn | properties-panel | A Classic BPMN diagram with a task that has input and output parameters. |
| diagrams/call-activity.bpmn | properties-panel | A call activity pointing at `order-to-cash`. |
| diagrams/event-subprocess.bpmn | elements | An expanded event sub-process with a timer start. |
| diagrams/all-groups.bpmn | diagram-check | One finding in each Problems group: How it runs, Drawing, Engine, Code, Rules, Migrate, Readability. |
| diagrams/wrong-namespace.bpmn | diagram-check | A Camunda 8 diagram with `camunda:` attributes on a service task. |
| diagrams/flow-analysis.bpmn | flow-analysis | A gateway whose condition can never be true, and a loop with no exit. |
| diagrams/blank-task.bpmn, c8-compat.bpmn | validation | A task with no name; a Camunda 8 service task with no job type. |
| diagrams/drd.dmn, dmn-collect.dmn, dmn-unsupported.dmn | dmn-editor, trace-paths | A DRD with two decisions chained; a COLLECT sum table; a table with a cell in FEEL Penstock cannot evaluate. |
| diagrams/rules.xlsx | dmn-editor | A workbook of SD's table with two new rules, one removed and three changed. |
| diagrams/invoice-approval-broken.form | form-editor | Two fields with the same key and one input with no label. |
| import/drawio-sample.drawio | import | A draw.io file with a lane, a shape that has no BPMN meaning and a custom icon, so the report lists what is not mapped. |
| src/main/java/shop/retail/RiskWorkers.java | code-links | Workers that produce `code/worker-fetch`, `code/writer-unread` and `code/lost-update` against O2C. |
| element-templates/ | element-templates | Two templates, one written by `penstock templates generate`. |
| penstock.yaml variant with `profiles:` | profiles, deployment | Profiles `test` and `prod` with different URLs. |
| An engine at `localhost:8090` with O2C deployed and three instances | monitor, scenarios, properties-panel, scripts | Two instances waiting at "Approve order", one with an incident at "Check customer credit", and one variable named differently from the model's. |

## Not decided

- Whether the draw.io import report, the migration report and the OS file chooser are shot on macOS or Windows. Take them all on the same OS.
- Shots marked "Use only if the page names ..." depend on page text; drop the line if the page does not show that step.
